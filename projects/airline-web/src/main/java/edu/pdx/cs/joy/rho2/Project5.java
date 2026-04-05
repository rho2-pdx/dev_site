package edu.pdx.cs.joy.rho2;

import com.sun.tools.javac.Main;
import edu.pdx.cs.joy.AirportNames;
import edu.pdx.cs.joy.ParserException;
import edu.pdx.cs.joy.web.HttpRequestHelper;

import java.io.*;
import java.time.format.DateTimeParseException;
import java.util.*;

/**
 * The main class that parses the command line and communicates with the
 * Airline server using REST.
 */
public class Project5 {

  /**
   * printUsage is how we print our usage statement
   * gets called by having no arguments
   */
  private static void printUsage() {
    System.out.println("usage: java -jar target/airline-client.jar [options] <args>");
    System.out.println("  args are (in this order):");
    System.out.println("    airline          The name of the airline");
    System.out.println("    flightNumber     The flight number");
    System.out.println("    src              Three-letter code of departure airport");
    System.out.println("    depart           Departure date and time (AM/PM)");
    System.out.println("    dest             Three-letter code of arrival airport");
    System.out.println("    arrive           Arrival date and time (AM/PM)");
    System.out.println();
    System.out.println("  options are (options may appear in any order):");
    System.out.println("    -host hostname             Host computer on which the server runs");
    System.out.println("    -port port                 Port on which the server is listening");
    System.out.println("    -search \"Airline Name\"         Search for flights");
    System.out.println("    -print                     Prints a description of the new flight");
    System.out.println("    -README                    Prints a README for this project and exits");
    System.out.println();
    System.out.println("Date and time should be in the format: mm/dd/yyyy hh:mm AM/PM");
  }

  public static final String MISSING_ARGS = "Missing command line arguments";

  public static void main(String[] args) {


    // store the name of the airline that's entered later
    String airlineName;
    // used to check for the -print flag
    boolean printCheck = false;
    String hostName = "localhost";
    int portNumber = 8080;
    String searchSource = null;
    String searchDest = null;
    String searchName = null;
    boolean searchFlag = false;
    int needBothOrNeither = 0; // if it's 0 or 2 that's fine but if it's 1 then error out
    // string array that has had options stripped off
    List<String> cleaned_args = new ArrayList<>();

    // if ran without any flags, display the usage page
    if (args.length < 1) {
      System.err.println("Missing command line arguments");
      printUsage();
      return;
    }

    // used to move the start forward if it finds the non-Usage options
    // if -readme is found, it just returns and doesn't run anything
    int startIndex = 0;

    for (int i = 0; i < args.length; i++) {
      String arg = args[i];

      switch (arg.toLowerCase()) {
        case "-readme":
          try (InputStream inputStream = Main.class.getClassLoader()
              .getResourceAsStream("edu/pdx/cs/joy/rho2/README.txt")) {

            if (inputStream == null) {
              System.err.println("README.txt not found!");
              return;
            }

            try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream))) {
              String line;
              while ((line = reader.readLine()) != null) {
                System.out.println(line);
              }
            }
          } catch (IOException e) {
            System.err.println("Error reading README.txt: " + e.getMessage());
          }
          // display the README once it is ready
          return;

        case "-print":
          printCheck = true;
          break;

        case "-host":
          if (i + 1 < args.length) {
            hostName = args[i + 1];
          }
          ++i;
          ++needBothOrNeither;
          break;

        case "-port":
          if (i + 1 < args.length) {
            try {
              Integer.parseInt(args[i + 1]);
            } catch (IllegalArgumentException e) {
              System.err.println("Error: Port Number needs to be a number");
              return;
            }

            portNumber = Integer.parseInt(args[i + 1]);
          }
          ++i;
          ++needBothOrNeither;
          break;


        case "-search":
          searchFlag = true;
          break;

        default:
          if (arg.startsWith("-")) {
            System.err.println("Unknown option: " + arg);
            return;
          } else {
            // this moves all the non-option input forward to be entered as flight data
            cleaned_args.add(arg);
          }
          break;

      }
    }
    if (needBothOrNeither % 2 != 0) {
      System.err.println("If specifying host and port, both are required.");
    }

    if(searchFlag) {

      if (!cleaned_args.isEmpty()) {
        if (cleaned_args.size() >= 3) {
          searchName = cleaned_args.get(0);
          searchSource = cleaned_args.get(1);
          searchDest = cleaned_args.get(2);

          cleaned_args = cleaned_args.subList(3, cleaned_args.size());
          if ((AirportNames.getName(searchSource.toUpperCase()) == null)
              || (AirportNames.getName(searchDest.toUpperCase()) == null)) {
            System.err.println("Error: search parameters have invalid Source/Destination codes");
            return;
          }

        } else if (cleaned_args.size() >= 1) {
          searchName = cleaned_args.get(0);
          cleaned_args = cleaned_args.subList(1, cleaned_args.size());
        } else {
          System.err.println("Missing Airline Name for -search option.");
          return;
        }
      }
    }


    AirlineRestClient client = new AirlineRestClient(hostName, portNumber);

    if (searchFlag) {
      try {
        Airline searchAirline = client.getAirline(searchName);
        SortedSet<Flight> matchingFlights = new TreeSet<>(searchAirline.getFlights().comparator());
        if (searchSource != null && searchDest != null) {
          for (Flight flight : searchAirline.getFlights()) {
            if (flight.getSource().equalsIgnoreCase(searchSource)
                && flight.getDestination().equalsIgnoreCase(searchDest)) {
              matchingFlights.add(flight);
            }
          }
        } else {
          matchingFlights.addAll(searchAirline.getFlights());
        }
        if (matchingFlights.isEmpty()) {
          System.err.println("No matching flights found for airline " + searchName);
        } else {
          printFlights(matchingFlights);
        }
      } catch (HttpRequestHelper.RestException | IOException | ParserException e) {
        System.err.println("Airline not found: " + searchName);
      }
      return;
    }


    // ensure we're working with 10 args per flight added
    if (cleaned_args.size() % 10 != 0 || cleaned_args.isEmpty()) {
      System.err.println("\nInvalid number of arguments. Each flight requires 10 arguments.");
      printUsage();
      return;
    }


    Map<String, Airline> airlines = new HashMap<>();
    Flight inputFlight;
    Set<String> airlineNames = new HashSet<>();

    try {
      for (int i = 0; i < cleaned_args.size(); i += 10) {
        if (cleaned_args.get(i + 9) == null) {
          System.err.println("Not enough command line arguments to create flight");
          printUsage();
          return;
        }
        try {
          Integer.parseInt(cleaned_args.get(i + 1));
        } catch (IllegalArgumentException e) {
          System.err.println("Flight Number needs to be a number! ");
        }

        airlineName = cleaned_args.get(i).replace("\"", "");

        inputFlight = new Flight(
            airlineName,
            Integer.parseInt(cleaned_args.get(i + 1)),
            cleaned_args.get(i + 2),
            cleaned_args.get(i + 6),
            cleaned_args.get(i + 3) + " " + cleaned_args.get(i + 4) + " " + cleaned_args.get(i + 5),
            cleaned_args.get(i + 7) + " " + cleaned_args.get(i + 8) + " " + cleaned_args.get(i + 9)
        );
        client.addFlight(airlineName, inputFlight);

        airlineNames.add(airlineName);
      }

      if (printCheck) {

        for (String name : airlineNames) {
          try {
            Airline inputtedAirline = client.getAirline(name);
            PrettyPrinter printer = new PrettyPrinter(new OutputStreamWriter(System.out));
            printer.dump(inputtedAirline);
            System.out.println();
          } catch (IOException | ParserException e) {
            System.err.println("Error: " + e);
          }
        }
      }
    } catch (IllegalArgumentException | ArrayIndexOutOfBoundsException | DateTimeParseException | IOException e) {
      System.err.println("Error: " + e.getMessage());
    }

  }

  /**
   *
   * @param flights this prints out all the flights in an airline that was searched
   */
  private static void printFlights(SortedSet<Flight> flights) {
    Airline tempAirline = new Airline("Search Results");
    for (Flight flight : flights) {
      tempAirline.addFlight(flight);
    }
    PrettyPrinter printer = new PrettyPrinter(new OutputStreamWriter(System.out));
    try {
      printer.dump(tempAirline);
    } catch (IOException e) {
      System.err.println("Error printing search results: " + e.getMessage());
    }
  }
}
