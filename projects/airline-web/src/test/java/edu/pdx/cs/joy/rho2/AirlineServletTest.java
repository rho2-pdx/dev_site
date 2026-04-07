package edu.pdx.cs.joy.rho2;

import edu.pdx.cs.joy.ParserException;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringReader;
import java.io.StringWriter;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.equalTo;
import static org.mockito.Mockito.*;

/**
 * A unit test for the {@link AirlineServlet}.  It uses mockito to
 * provide mock http requests and responses.
 */

class AirlineServletTest {

  // Test data
  private final String airlineName = "Airline";
  private final String flightNumber = "123";
  private final String source = "PDX";
  private final String destination = "LAX";
  private final String departure = "3/15/2025 10:39 AM";
  private final String arrival = "3/15/2025 1:39 PM";
  private final AirlineServlet servlet = new AirlineServlet();

  @Test
  void addAirlineWithOneFlight() throws IOException, ParserException {
    // Create the servlet instance


    // Set up the mocked request with all required parameters
    HttpServletRequest request = mock(HttpServletRequest.class);
    when(request.getParameter(AirlineServlet.AIRLINE_PARAMETER)).thenReturn(airlineName);
    when(request.getParameter(AirlineServlet.FLIGHT_NUMBER_PARAMETER)).thenReturn(flightNumber);
    when(request.getParameter(AirlineServlet.SOURCE_PARAMETER)).thenReturn(source);
    when(request.getParameter(AirlineServlet.DESTINATION_PARAMETER)).thenReturn(destination);
    when(request.getParameter(AirlineServlet.DEPARTURE_PARAMETER)).thenReturn(departure);
    when(request.getParameter(AirlineServlet.ARRIVAL_PARAMETER)).thenReturn(arrival);

    // Set up the mocked response with a StringWriter to capture output
    HttpServletResponse response = mock(HttpServletResponse.class);
    StringWriter stringWriter = new StringWriter();
    PrintWriter pw = new PrintWriter(stringWriter, true);
    when(response.getWriter()).thenReturn(pw);

    // Call the servlet's doPost to add the flight
    servlet.doPost(request, response);

    // Verify that the response status was set to HTTP_OK (200)
    ArgumentCaptor<Integer> statusCode = ArgumentCaptor.forClass(Integer.class);
    verify(response).setStatus(statusCode.capture());
    assertThat(statusCode.getValue(), equalTo(HttpServletResponse.SC_OK));

    // Retrieve the airline from the servlet and check the flight details
    Airline airline = servlet.getAirline(airlineName);
    assertThat(airline.getName(), equalTo(airlineName));
    assertThat(airline.getFlights().size(), equalTo(1));
    Flight flight = airline.getFlights().iterator().next();
    assertThat(flight.getNumber(), equalTo(Integer.parseInt(flightNumber)));
  }

  @Test
  void getAirlineWithOneFlight() throws IOException, ParserException {
    // Create an airline and add one flight with full details
    Airline airline = new Airline(airlineName);
    Flight flight = new Flight(airlineName, Integer.parseInt(flightNumber), source, destination, departure, arrival);
    airline.addFlight(flight);

    // Add the airline to the servlet's internal storage
    servlet.addAirline(airline);

    // Set up a mock HTTP request with the airline parameter
    HttpServletRequest request = mock(HttpServletRequest.class);
    when(request.getParameter(AirlineServlet.AIRLINE_PARAMETER)).thenReturn(airlineName);

    // Set up a mock HTTP response with a StringWriter to capture output
    HttpServletResponse response = mock(HttpServletResponse.class);
    StringWriter stringWriter = new StringWriter();
    PrintWriter pw = new PrintWriter(stringWriter, true);
    when(response.getWriter()).thenReturn(pw);

    // Invoke the servlet's doGet method to retrieve the airline information
    servlet.doGet(request, response);

    // Parse the XML output from the servlet
    String airlineText = stringWriter.toString();
    XmlParser parser = new XmlParser(new StringReader(airlineText));
    Airline parsedAirline = parser.parse();

    // Assertions to verify the airline and flight were returned correctly
    assertThat(parsedAirline.getName(), equalTo(airlineName));
    assertThat(parsedAirline.getFlights().size(), equalTo(1));
    Flight parsedFlight = parsedAirline.getFlights().iterator().next();
    assertThat(parsedFlight.getNumber(), equalTo(Integer.parseInt(flightNumber)));
  }

  @Test
  void airlineNameParameterIsRequired() throws IOException {
    HttpServletRequest request = mock(HttpServletRequest.class);

    HttpServletResponse response = mock(HttpServletResponse.class);
    when(response.getWriter()).thenReturn(mock(PrintWriter.class));

    AirlineServlet servlet = new AirlineServlet();
    servlet.doGet(request, response);

    verify(response).sendError(eq(HttpServletResponse.SC_PRECONDITION_FAILED), anyString());
  }

  @Test
  void getWithoutAirlineRedirectsBrowserToIndex() throws IOException {
    HttpServletRequest request = mock(HttpServletRequest.class);
    when(request.getParameter(AirlineServlet.AIRLINE_PARAMETER)).thenReturn(null);
    when(request.getHeader("Sec-Fetch-Mode")).thenReturn("navigate");

    HttpServletResponse response = mock(HttpServletResponse.class);

    servlet.doGet(request, response);

    verify(response).sendRedirect("../");
    verify(response, never()).sendError(anyInt(), anyString());
  }

  @Test
  void postFlightRedirectsBrowserToIndexWithFlashParams() throws IOException {
    HttpServletRequest request = mock(HttpServletRequest.class);
    when(request.getParameter(AirlineServlet.AIRLINE_PARAMETER)).thenReturn(airlineName);
    when(request.getParameter(AirlineServlet.FLIGHT_NUMBER_PARAMETER)).thenReturn(flightNumber);
    when(request.getParameter(AirlineServlet.SOURCE_PARAMETER)).thenReturn(source);
    when(request.getParameter(AirlineServlet.DESTINATION_PARAMETER)).thenReturn(destination);
    when(request.getParameter(AirlineServlet.DEPARTURE_PARAMETER)).thenReturn(departure);
    when(request.getParameter(AirlineServlet.ARRIVAL_PARAMETER)).thenReturn(arrival);
    when(request.getHeader("Sec-Fetch-Mode")).thenReturn("navigate");

    HttpServletResponse response = mock(HttpServletResponse.class);

    servlet.doPost(request, response);

    verify(response).sendRedirect("../?added=1&airline=Airline");
    verify(response, never()).setStatus(HttpServletResponse.SC_OK);
  }

  @Test
  void getMissingAirlineReturns404ForNonBrowserClients() throws IOException {
    HttpServletRequest request = mock(HttpServletRequest.class);
    when(request.getParameter(AirlineServlet.AIRLINE_PARAMETER)).thenReturn("Nobody");
    when(request.getHeader("Sec-Fetch-Mode")).thenReturn(null);

    HttpServletResponse response = mock(HttpServletResponse.class);
    StringWriter stringWriter = new StringWriter();
    PrintWriter pw = new PrintWriter(stringWriter, true);
    when(response.getWriter()).thenReturn(pw);

    servlet.doGet(request, response);

    verify(response).setStatus(HttpServletResponse.SC_NOT_FOUND);
    assertThat(stringWriter.toString(), containsString("Nobody"));
  }

  @Test
  void getMissingAirlineReturnsHtmlForFullPageNavigation() throws IOException {
    HttpServletRequest request = mock(HttpServletRequest.class);
    when(request.getParameter(AirlineServlet.AIRLINE_PARAMETER)).thenReturn("deez");
    when(request.getHeader("Sec-Fetch-Mode")).thenReturn("navigate");

    HttpServletResponse response = mock(HttpServletResponse.class);
    StringWriter stringWriter = new StringWriter();
    PrintWriter pw = new PrintWriter(stringWriter, true);
    when(response.getWriter()).thenReturn(pw);

    servlet.doGet(request, response);

    verify(response).setContentType("text/html;charset=UTF-8");
    String html = stringWriter.toString();
    assertThat(html, containsString("Airline not found"));
    assertThat(html, containsString("deez"));
    assertThat(html, containsString("Back to Airline REST API"));
  }

  @Test
  void getExistingAirlineReturnsHtmlForFullPageNavigation() throws IOException {
    Airline airline = new Airline(airlineName);
    Flight flight = new Flight(airlineName, Integer.parseInt(flightNumber), source, destination, departure, arrival);
    airline.addFlight(flight);
    servlet.addAirline(airline);

    HttpServletRequest request = mock(HttpServletRequest.class);
    when(request.getParameter(AirlineServlet.AIRLINE_PARAMETER)).thenReturn(airlineName);
    when(request.getHeader("Sec-Fetch-Mode")).thenReturn("navigate");

    HttpServletResponse response = mock(HttpServletResponse.class);
    StringWriter stringWriter = new StringWriter();
    PrintWriter pw = new PrintWriter(stringWriter, true);
    when(response.getWriter()).thenReturn(pw);

    servlet.doGet(request, response);

    verify(response).setContentType("text/html;charset=UTF-8");
    String html = stringWriter.toString();
    assertThat(html, containsString("<table class=\"al-flights\">"));
    assertThat(html, containsString(airlineName));
    assertThat(html, containsString(source));
  }

}
