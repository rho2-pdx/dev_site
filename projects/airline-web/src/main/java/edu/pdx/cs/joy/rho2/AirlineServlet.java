package edu.pdx.cs.joy.rho2;

import com.google.common.annotations.VisibleForTesting;

import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;


public class AirlineServlet extends HttpServlet {
  static final String AIRLINE_PARAMETER = "airline"; // name
  static final String FLIGHT_NUMBER_PARAMETER = "flightNumber"; // num
  static final String SOURCE_PARAMETER = "src"; // source
  static final String DESTINATION_PARAMETER = "dest"; // destination
  static final String DEPARTURE_PARAMETER = "depart"; // departure time
  static final String ARRIVAL_PARAMETER = "arrive"; // arrival time

  private static final String SEC_FETCH_MODE = "Sec-Fetch-Mode";

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
    String airlineName = getParameter(AIRLINE_PARAMETER, request);
    if (airlineName == null) {
      if (isBrowserDocumentNavigation(request)) {
        response.sendRedirect("../");
      } else {
        missingRequiredParameter(response, AIRLINE_PARAMETER);
      }
      return;
    }

    log("GET " + airlineName);
    Airline airline = this.airlines.get(airlineName);

    if (airline == null) {
      if (isBrowserDocumentNavigation(request)) {
        writeAirlineNotFoundHtmlPage(airlineName, response);
      } else {
        response.resetBuffer();
        response.setContentType("text/plain;charset=UTF-8");
        response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        PrintWriter pw = response.getWriter();
        pw.print("Airline not found: ");
        pw.print(airlineName);
        pw.flush();
      }
      return;
    }

    if (isBrowserDocumentNavigation(request)) {
      writeAirlineHtmlPage(airline, response);
    } else {
      response.setContentType("text/plain;charset=UTF-8");
      writeAirlineXml(airline, response);
      response.setStatus(HttpServletResponse.SC_OK);
    }
  }

  /**
   * Full page loads from the HTML form send Sec-Fetch-Mode: navigate. API / fetch clients do not.
   */
  @VisibleForTesting
  static boolean isBrowserDocumentNavigation(HttpServletRequest request) {
    return "navigate".equalsIgnoreCase(request.getHeader(SEC_FETCH_MODE));
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

    if (isBrowserDocumentNavigation(request)) {
      response.sendRedirect("../?added=1&airline=" + URLEncoder.encode(airlineName, StandardCharsets.UTF_8));
      return;
    }

    response.setContentType("text/plain;charset=UTF-8");
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

  private void writeAirlineXml(Airline airline, HttpServletResponse response) throws IOException {
    PrintWriter pw = response.getWriter();
    XmlDumper dumper = new XmlDumper(pw);
    dumper.dump(airline);
    pw.flush();
  }

  private void writeAirlineNotFoundHtmlPage(String airlineName, HttpServletResponse response) throws IOException {
    response.setContentType("text/html;charset=UTF-8");
    response.setStatus(HttpServletResponse.SC_OK);
    PrintWriter out = response.getWriter();
    String safe = escapeHtml(airlineName);

    out.println("<!DOCTYPE html>");
    out.println("<html lang=\"en\">");
    out.println("<head>");
    out.println("<meta charset=\"UTF-8\">");
    out.println("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">");
    out.println("<title>No airline found</title>");
    out.println("<link rel=\"stylesheet\" href=\"/shared/styles.css\">");
    out.println("<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">");
    out.println("<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>");
    out.println("<link href=\"https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=Lato:wght@400;700&display=swap\" rel=\"stylesheet\">");
    out.println("<style>");
    out.println(".al-main { max-width: 900px; margin: 0 auto; padding: 3rem 1.5rem; }");
    out.println(".al-warn { padding: 1rem 1.25rem; background: var(--color-accent-light); border: 1px solid var(--color-border); border-radius: var(--radius-md); margin: 1rem 0; }");
    out.println(".al-back { margin-top: 1.5rem; font-size: 0.9rem; }");
    out.println("</style>");
    out.println("</head><body>");
    out.println("<nav class=\"shared-site-nav\"><div class=\"shared-site-nav-inner\">");
    out.println("<a href=\"/\" class=\"shared-site-nav-home\">ryan houlberg</a>");
    out.println("<a href=\"/projects\" class=\"shared-site-nav-back\">← projects</a>");
    out.println("</div></nav>");
    out.println("<main class=\"al-main\">");
    out.println("<h1>Airline not found</h1>");
    out.println("<div class=\"al-warn\" role=\"status\">");
    out.println("<p>There is no airline named <strong>\"" + safe + "\"</strong> in the system yet.</p>");
    out.println("<p style=\"margin-top:0.75rem;font-size:0.9rem;color:var(--color-text-muted);\">Add a flight under that name first, or try a different search.</p>");
    out.println("</div>");
    out.println("<p class=\"al-back\"><a href=\"../\">← Back to Airline REST API</a></p>");
    out.println("</main></body></html>");
    out.flush();
  }

  private void writeAirlineHtmlPage(Airline airline, HttpServletResponse response) throws IOException {
    response.setContentType("text/html;charset=UTF-8");
    response.setStatus(HttpServletResponse.SC_OK);
    PrintWriter out = response.getWriter();
    String safeName = escapeHtml(airline.getName());

    out.println("<!DOCTYPE html>");
    out.println("<html lang=\"en\">");
    out.println("<head>");
    out.println("<meta charset=\"UTF-8\">");
    out.println("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">");
    out.println("<title>Flights — " + safeName + "</title>");
    out.println("<link rel=\"stylesheet\" href=\"/shared/styles.css\">");
    out.println("<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">");
    out.println("<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>");
    out.println("<link href=\"https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=Lato:wght@400;700&display=swap\" rel=\"stylesheet\">");
    out.println("<style>");
    out.println(".al-main { max-width: 900px; margin: 0 auto; padding: 3rem 1.5rem; }");
    out.println("table.al-flights { width: 100%; border-collapse: collapse; font-size: 0.9rem; margin-top: 1rem; }");
    out.println("table.al-flights th, table.al-flights td { border: 1px solid var(--color-border); padding: 0.5rem; text-align: left; }");
    out.println("table.al-flights th { background: var(--color-bg-secondary); color: var(--color-text-muted); }");
    out.println(".al-back { margin-top: 1.5rem; font-size: 0.9rem; }");
    out.println("</style>");
    out.println("</head><body>");
    out.println("<nav class=\"shared-site-nav\"><div class=\"shared-site-nav-inner\">");
    out.println("<a href=\"/\" class=\"shared-site-nav-home\">ryan houlberg</a>");
    out.println("<a href=\"/projects\" class=\"shared-site-nav-back\">← projects</a>");
    out.println("</div></nav>");
    out.println("<main class=\"al-main\">");
    out.println("<h1>Flights for " + safeName + "</h1>");
    if (airline.getFlights().isEmpty()) {
      out.println("<p>This airline has no flights yet.</p>");
    } else {
      out.println("<table class=\"al-flights\"><thead><tr>");
      out.println("<th>Flight</th><th>From</th><th>To</th><th>Departure</th><th>Arrival</th>");
      out.println("</tr></thead><tbody>");
      for (Flight f : airline.getFlights()) {
        out.println("<tr>");
        out.println("<td>" + f.getNumber() + "</td>");
        out.println("<td>" + escapeHtml(f.getSource()) + "</td>");
        out.println("<td>" + escapeHtml(f.getDestination()) + "</td>");
        out.println("<td>" + escapeHtml(f.getDepartureString()) + "</td>");
        out.println("<td>" + escapeHtml(f.getArrivalString()) + "</td>");
        out.println("</tr>");
      }
      out.println("</tbody></table>");
    }
    out.println("<p class=\"al-back\"><a href=\"../\">← Back to Airline REST API</a></p>");
    out.println("</main></body></html>");
    out.flush();
  }

  private static String escapeHtml(String s) {
    if (s == null) {
      return "";
    }
    return s.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace("\"", "&quot;");
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
