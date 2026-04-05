package edu.pdx.cs.joy.rho2;

import edu.pdx.cs.joy.AirlineDumper;
import edu.pdx.cs.joy.AirportNames;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.Writer;
import java.time.Duration;
import java.time.format.DateTimeFormatter;
import java.util.SortedSet;

/**
 * Used to print in a nicer format
 */
public class PrettyPrinter implements AirlineDumper<Airline> {
  /**
   * writer hanldes dumping file
   * datetimeformatter is for formatting datetime correctly
   */
  private final Writer writer;
  final private DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("M/d/yyyy h:mm a");

  /**
   * PrettyPrinter is used to output airline/flight data into a text file
   *
   * @param writer the file that's written to with PrintWriter
   */
  public PrettyPrinter(Writer writer) {
    this.writer = writer;
  }

  @Override
  public void dump(Airline airline) throws IOException {
    writer.write("\n\nAirline: " + airline.getName() + "\n");
    writer.write("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");

    SortedSet<Flight> flights = airline.getFlights();
    for (Flight flight : flights) {
      String source_long = AirportNames.getName(flight.getSource());
      String destination_long = AirportNames.getName(flight.getDestination());

      long duration = Duration.between(flight.getDeparture(), flight.getArrival()).toMinutes();
      writer.write("Flight Number: " + flight.getNumber() + "\n");
      writer.write(source_long + " to " + destination_long + "\n");
      writer.write("Departure: " + flight.getDeparture().format(DATE_FORMAT) + "\n");
      writer.write("Arrival: " + flight.getArrival().format(DATE_FORMAT) + "\n");
      writer.write("Duration: " + duration + " minutes\n");
      writer.write("--------------------------------------------------------\n");
    }
    writer.flush();
  }


}
