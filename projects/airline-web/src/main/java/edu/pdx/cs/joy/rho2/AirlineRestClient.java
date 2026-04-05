package edu.pdx.cs.joy.rho2;

import com.google.common.annotations.VisibleForTesting;
import edu.pdx.cs.joy.ParserException;
import edu.pdx.cs.joy.web.HttpRequestHelper;
import edu.pdx.cs.joy.web.HttpRequestHelper.Response;

import java.io.IOException;
import java.io.StringReader;
import java.util.Map;

import static edu.pdx.cs.joy.web.HttpRequestHelper.*;
import static java.net.HttpURLConnection.HTTP_OK;

/**
 * A helper class for accessing the rest client.  Note that this class provides
 * an example of how to make gets and posts to a URL.  You'll need to change it
 * to do something other than just send dictionary entries.
 */

public class AirlineRestClient {

  private static final String WEB_APP = "airline"; // airlines
  private static final String SERVLET = "flights"; // flights

  private final HttpRequestHelper http;


  /**
   * Creates a client to the airline REST service running on the given host and port
   *
   * @param hostName The name of the host
   * @param port     The port
   */
  public AirlineRestClient(String hostName, int port) {
    this(new HttpRequestHelper(String.format("http://%s:%d/%s/%s", hostName, port, WEB_APP, SERVLET)));
  }

  /**
   *
   * @param http the request helper
   */
  @VisibleForTesting
  AirlineRestClient(HttpRequestHelper http) {
    this.http = http;
  }

  /**
   *
   * @param airlineName takes name of airline
   * @return pass back results from parsing xml
   * @throws IOException if any issues with creating flights
   * @throws ParserException if any issues reading xml
   */
  public Airline getAirline(String airlineName) throws IOException, ParserException {
    Response response = http.get(Map.of(AirlineServlet.AIRLINE_PARAMETER, airlineName));
    throwExceptionIfNotOkayHttpStatus(response);
    String content = response.getContent();

    XmlParser parser = new XmlParser(new StringReader(content));
    return parser.parse();
  }

  /**
   *
   * @param airline the name of the airline
   * @param flight the flight object
   * @throws IOException if any issues arise in servlet
   *
   */
  public void addFlight(String airline, Flight flight) throws IOException {
    Response response = http.post(Map.of(
        AirlineServlet.AIRLINE_PARAMETER, airline,
        AirlineServlet.FLIGHT_NUMBER_PARAMETER, String.valueOf(flight.getNumber()),
        AirlineServlet.SOURCE_PARAMETER, flight.getSource(),
        AirlineServlet.DESTINATION_PARAMETER, flight.getDestination(),
        AirlineServlet.DEPARTURE_PARAMETER, flight.getDepartureString(),
        AirlineServlet.ARRIVAL_PARAMETER, flight.getArrivalString()
    ));
    throwExceptionIfNotOkayHttpStatus(response);
  }

  /**
   *
   * @throws IOException if deletion does not work
   */
  public void removeAllAirlines() throws IOException {
    Response response = http.delete(Map.of());
    throwExceptionIfNotOkayHttpStatus(response);
  }

  /**
   *
   * @param response has the code that indicates how HTTP request went
   */
  private void throwExceptionIfNotOkayHttpStatus(Response response) {
    int code = response.getHttpStatusCode();
    if (code != HTTP_OK) {
      String message = response.getContent();
      throw new RestException(code, message);
    }
  }

}

