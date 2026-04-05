package edu.pdx.cs.joy.rho2;

import com.google.common.annotations.VisibleForTesting;

import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;


public class AirlineServlet extends HttpServlet {
  static final String AIRLINE_PARAMETER = "airline"; // name
  static final String FLIGHT_NUMBER_PARAMETER = "flightNumber"; // num
  static final String SOURCE_PARAMETER = "src"; // source
  static final String DESTINATION_PARAMETER = "dest"; // destination
  static final String DEPARTURE_PARAMETER = "depart"; // departure time
  static final String ARRIVAL_PARAMETER = "arrive"; // arrival time


  private final Map<String, Airline> airlines = new HashMap<>(); //map flights to airlines

  /**
   *    * Handles an HTTP GET request from a client by writing the definition of the
   *    * airlineName specified in the "airlineName" HTTP parameter to the HTTP response.  If the
   *    * "airlineName" parameter is not specified, all the entries in the dictionary
   *    * are written to the HTTP response.
   * @param request sends
   * @param response receives
   * @throws IOException if issue
   */
  @Override
  protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("text/plain");

    String airlineName = getParameter(AIRLINE_PARAMETER, request);
    if (airlineName != null) {
      log("GET " + airlineName);
      writeAirline(airlineName, response);

    } else {
      missingRequiredParameter(response, AIRLINE_PARAMETER);
    }
  }

  /**
   *    * Handles an HTTP POST request by storing the dictionary entry for the
   *    * "airlineName" and "definition" request parameters.  It writes the dictionary
   *    * entry to the HTTP response.
   * @param request sends
   * @param response gets
   * @throws IOException if issue
   */
  @Override
  protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("text/plain");

    // Check for required parameters.
    String airlineName = getParameter(AIRLINE_PARAMETER, request);
    if (airlineName == null) {
      missingRequiredParameter(response, AIRLINE_PARAMETER);
      return;
    }

    String flightNumberStr = getParameter(FLIGHT_NUMBER_PARAMETER, request);
    if (flightNumberStr == null) {
      missingRequiredParameter(response, FLIGHT_NUMBER_PARAMETER);
      return;
    }

    String source = getParameter(SOURCE_PARAMETER, request);
    if (source == null) {
      missingRequiredParameter(response, SOURCE_PARAMETER);
      return;
    }

    String destination = getParameter(DESTINATION_PARAMETER, request);
    if (destination == null) {
      missingRequiredParameter(response, DESTINATION_PARAMETER);
      return;
    }

    String departure = getParameter(DEPARTURE_PARAMETER, request);
    if (departure == null) {
      missingRequiredParameter(response, DEPARTURE_PARAMETER);
      return;
    }

    String arrival = getParameter(ARRIVAL_PARAMETER, request);
    if (arrival == null) {
      missingRequiredParameter(response, ARRIVAL_PARAMETER);
      return;
    }
    log("POST " + airlineName + " Flight: " + flightNumberStr + " from " + source + " to " + destination);

    int flightNumber = Integer.parseInt(flightNumberStr);

    // Get or create the airline.
    Airline airline = this.airlines.get(airlineName);
    if (airline == null) {
      airline = new Airline(airlineName);
      this.airlines.put(airlineName, airline);
    }

    // Create a new flight and add it to the airline.
    Flight flight = new Flight(airlineName, flightNumber, source, destination, departure, arrival);
    airline.addFlight(flight);

    // Write a response back to the client.
    PrintWriter pw = response.getWriter();
    pw.println("Flight added: " + flight.toString());
    pw.flush();

    response.setStatus(HttpServletResponse.SC_OK);
  }

  /**
   *
   * @param request what's being sent
   * @param response what it's getting back
   * @throws IOException if there's an issue
   */
  @Override
  protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("text/plain");

    log("DELETE all dictionary entries");

    this.airlines.clear();

    PrintWriter pw = response.getWriter();
    pw.println(Messages.allDictionaryEntriesDeleted());
    pw.flush();

    response.setStatus(HttpServletResponse.SC_OK);

  }

  /**
   *
   * @param response what it gets back
   * @param parameterName used to specify parameter
   * @throws IOException if issue
   */
  private void missingRequiredParameter(HttpServletResponse response, String parameterName)
      throws IOException {
    String message = Messages.missingRequiredParameter(parameterName);
    response.sendError(HttpServletResponse.SC_PRECONDITION_FAILED, message);
  }

  /**
   *
   * @param airlineName name of airline
   * @param response confirmation of writing
   * @throws IOException if can't write
   */
  private void writeAirline(String airlineName, HttpServletResponse response) throws IOException {
    Airline airline = this.airlines.get(airlineName);

    if (airline == null) {
      response.setStatus(HttpServletResponse.SC_NOT_FOUND);

    } else {
      PrintWriter pw = response.getWriter();

      XmlDumper dumper = new XmlDumper(pw);
      dumper.dump(airline);

      response.setStatus(HttpServletResponse.SC_OK);
    }
  }

  /**
   *
   * @param name name of parameter
   * @param request containing parameter
   * @return gets the parameter
   */
  private String getParameter(String name, HttpServletRequest request) {
    String value = request.getParameter(name);
    if (value == null || "".equals(value)) {
      return null;

    } else {
      return value;
    }
  }

  /**
   *
   * @param airlineName airline name
   * @return get airline name
   */
  @VisibleForTesting
  Airline getAirline(String airlineName) {
    return this.airlines.get(airlineName);
  }

  /**
   *
   * @param msg gets the message for logging
   */
  @Override
  public void log(String msg) {
    System.out.println(msg);
  }

  /**
   *
   * @param airline how to add airlines
   */
  @VisibleForTesting
  void addAirline(Airline airline) {
    this.airlines.put(airline.getName(), airline);
  }
}