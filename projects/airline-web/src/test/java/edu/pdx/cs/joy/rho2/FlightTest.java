package edu.pdx.cs.joy.rho2;

import org.junit.jupiter.api.Test;

import java.time.format.DateTimeFormatter;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

/**
 * Unit tests for the {@link Flight} class.
 * <p>
 * You'll need to update these unit tests as you build out you program.
 * it's ok for departure time and arrival time to be null for now
 */
public class FlightTest {

  private static String goodAirline = "Joy Air Express";
  private static int goodFlightNumber = 42;
  private static String goodSource = "PDX";
  private static String goodDestination = "LAX";
  private static String goodDepartureString = "3/15/2025 10:39 AM";
  private static String goodArrivalString = "3/15/2025 1:39 PM";

  final private DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("M/d/yyyy h:mm a");

  Flight goodFlight = new Flight(goodAirline, goodFlightNumber, goodSource,
      goodDestination, goodDepartureString, goodArrivalString);


  /**
   * Make sure we're getting the right flight number
   * for now it's just 42
   */
  @Test
  void getFlightNumberTest() {
    assertThat(goodFlight.getNumber(), equalTo(42));
  }

  /**
   * Make sure we're getting the right source
   * for now it's just PDX
   */
  @Test
  void getSource() {
    assertThat(goodFlight.getSource(), equalTo("PDX"));
  }

  /**
   * Make sure we're getting the right destination
   * for now it's just LAX
   */
  @Test
  void getDestination() {
    assertThat(goodFlight.getDestination(), equalTo("LAX"));
  }

  /**
   * This is for the departure TIME
   * dealing with later
   */
  @Test
  void getDepartureReturns() {
    assertThat(goodFlight.getDeparture().format(DATE_FORMAT), is(goodDepartureString));
  }

  /**
   * This is for the departure TIME as a STRING
   */
  @Test
  void getDepartureStringReturns() {
    assertThat(goodFlight.getDepartureString(), is("3/15/2025 10:39 AM"));
  }

  /**
   * This is for the arrival TIME
   * dealing with later
   */
  @Test
  void getArrivalReturns() {
    assertThat(goodFlight.getArrival().format(DATE_FORMAT), is(goodArrivalString));
  }

  /**
   * This is for the arrival TIME as a STRING
   */
  @Test
  void getArrivalStringReturns() {
    assertThat(goodFlight.getArrivalString(), is("3/15/2025 1:39 PM"));
  }

  /**
   * testing to see if invalid flight numbers are handled correctly
   */
  @Test
  void testBadFlightNumber() {
    assertThrows(IllegalArgumentException.class, () -> {
      new Flight(goodAirline, -4, goodSource,
          goodDestination, goodDepartureString, goodArrivalString);
    });

  }

  /**
   * testing to see if empty airline is handled correctly
   */
  @Test
  void testEmptyAirlineName() {
    assertThrows(IllegalArgumentException.class, () -> {
      new Flight("   ", goodFlightNumber, goodSource,
          goodDestination, goodDepartureString, goodArrivalString);
    });
  }

  /**
   * testing to see if bad source is handled correctly
   */
  @Test
  void testBadSource() {
    assertThrows(IllegalArgumentException.class, () -> {
      new Flight(goodAirline, goodFlightNumber, "NorthKorea",
          goodDestination, goodDepartureString, goodArrivalString);
    });
  }

  /**
   * testing to see if bad destination is handled correctly
   */
  @Test
  void testBadDestination() {
    assertThrows(IllegalArgumentException.class, () -> {
      new Flight(goodAirline, goodFlightNumber, goodSource,
          "NorthKorea", goodDepartureString, goodArrivalString);
    });
  }

  /**
   * testing to see if bad departure is handled correctly
   */
  @Test
  void testBadDepartureString() {
    assertThrows(IllegalArgumentException.class, () -> {
      new Flight(goodAirline, goodFlightNumber, goodSource,
          goodDestination, "111/20/3309 25:25", goodArrivalString);

    });

  }

  /**
   * testing to see if bad arrival is handled correctly
   */
  @Test
  void testBadArrivalString() {
    assertThrows(IllegalArgumentException.class, () -> {
      new Flight(goodAirline, goodFlightNumber, goodSource,
          goodDestination, goodDepartureString, "111/20/3309 25:25");
    });
  }

  @Test
  void testTimeAbove12WithAMorPM() {
    assertThrows(IllegalArgumentException.class, () -> {
      new Flight(goodAirline, goodFlightNumber, goodSource,
          goodDestination, goodDepartureString, "11/20/2040 20:20 PM");
    });
  }

  @Test
  void testArrivalTimeBeforeDepartureTime() {
    assertThrows(IllegalArgumentException.class, () -> {
      new Flight(goodAirline, goodFlightNumber, goodSource,
          goodDestination, "9/11/2001 8:46 AM", "4/20/1969 2:00 PM");
    });
  }


}
