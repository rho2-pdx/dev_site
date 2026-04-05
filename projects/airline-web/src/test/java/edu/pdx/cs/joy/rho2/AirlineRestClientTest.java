package edu.pdx.cs.joy.rho2;

import edu.pdx.cs.joy.ParserException;
import edu.pdx.cs.joy.web.HttpRequestHelper;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.io.StringWriter;
import java.util.Map;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * A unit test for the REST client that demonstrates using mocks and
 * dependency injection
 */
public class AirlineRestClientTest {

  private final String airlineName = "Airline";
  private final int flightNumber = 123;
  private final String source = "PDX";
  private final String destination = "LAX";
  private final String departure = "3/15/2025 10:39 AM";
  private final String arrival = "3/15/2025 1:39 PM";

  private final Flight flight = new Flight(airlineName, flightNumber, source, destination, departure, arrival);

  @Test
  void getAirlineReturnsExpectedFlight() throws ParserException, IOException {
    Airline airline = new Airline(airlineName);
    airline.addFlight(flight);

    // Create a mock HttpRequestHelper that returns the XML representation of the airline.
    HttpRequestHelper http = mock(HttpRequestHelper.class);
    // airlineAsText(airline) should return a Response that contains the XML text for this airline.
    when(http.get(eq(Map.of(AirlineServlet.AIRLINE_PARAMETER, airlineName))))
        .thenReturn(airlineAsText(airline));

    AirlineRestClient client = new AirlineRestClient(http);

    Airline airlineFromClient = client.getAirline(airlineName);
    assertThat(airlineFromClient.getName(), equalTo(airlineName));
    assertThat(airlineFromClient.getFlights().size(), equalTo(1));
    assertThat(airlineFromClient.getFlights().iterator().next().getNumber(), equalTo(flightNumber));
  }


  private HttpRequestHelper.Response airlineAsText(Airline airline) {
    StringWriter writer = new StringWriter();
    try {
      new XmlDumper(writer).dump(airline);
    } catch (IOException e ) {
      System.err.println("Error: issue generating XML " + e);
    }

    return new HttpRequestHelper.Response(writer.toString());
  }
}
