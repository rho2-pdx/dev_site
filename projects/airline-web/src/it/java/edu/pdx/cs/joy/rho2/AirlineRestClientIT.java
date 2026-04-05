package edu.pdx.cs.joy.rho2;

import edu.pdx.cs.joy.ParserException;
import edu.pdx.cs.joy.web.HttpRequestHelper;
import org.junit.jupiter.api.MethodOrderer.MethodName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.util.Map;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.equalTo;
import static org.junit.jupiter.api.Assertions.assertThrows;

/**
 * Integration test that tests the REST calls made by {@link AirlineRestClient}
 */
@TestMethodOrder(MethodName.class)
class AirlineRestClientIT {
  private static final String HOSTNAME = "localhost";
  private static final String PORT = System.getProperty("http.port", "8080");

  private AirlineRestClient newAirlineRestClient() {
    int port = Integer.parseInt(PORT);
    return new AirlineRestClient(HOSTNAME, port);
  }

  @Test
  void test0RemoveAllAirlines() throws IOException {
    AirlineRestClient client = newAirlineRestClient();
    client.removeAllAirlines();
  }

  @Test
  void test2AddFlight() throws IOException, ParserException {

    AirlineRestClient client = newAirlineRestClient();
    String airlineName = "TEST Airline";
    Flight flight = new Flight(airlineName, 123, "PDX", "SEA",
        "12/1/2024 10:00 AM", "12/1/2024 11:00 AM");
    client.addFlight(airlineName, flight);

    Airline airline = client.getAirline(airlineName);
    assertThat(airline.getName(), equalTo(airlineName));
    assertThat(airline.getFlights().size(), equalTo(1));
    assertThat(airline.getFlights().iterator().next().toString(), equalTo(flight.toString()));
  }

  @Test
  void test4EmptyWordThrowsException() {

    AirlineRestClient client = newAirlineRestClient();
    String emptyString = "";
    Flight flight = new Flight("TEST Airline", 0, "PDX", "SEA",
        "12/01/2024 10:00 AM", "12/01/2024 11:00 AM");

    HttpRequestHelper.RestException ex =
        assertThrows(HttpRequestHelper.RestException.class, () -> client.addFlight(emptyString, flight));
    assertThat(ex.getHttpStatusCode(), equalTo(HttpURLConnection.HTTP_PRECON_FAILED));
    assertThat(ex.getMessage(), containsString(Messages.missingRequiredParameter(AirlineServlet.AIRLINE_PARAMETER)));


  }
}
