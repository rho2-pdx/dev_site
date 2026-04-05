package edu.pdx.cs.joy.rho2;

import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.io.StringWriter;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.containsString;

class PrettyPrinterTest {

  @Test
  void airlineNameIsPrettyDumpedInTextFormat() throws IOException {
    String airlineName = "Test Airline";
    Airline airline = new Airline(airlineName);

    StringWriter sw = new StringWriter();
    PrettyPrinter pretty_print = new PrettyPrinter(sw);
    pretty_print.dump(airline);

    String text = sw.toString();
    assertThat(text, containsString(airlineName));
  }

  @Test
  void outputIsHandledCorrectlyForFlightPrinting() throws Exception {
    Airline airline = new Airline("Test Airline");

    Flight flight = new Flight("Test Airline",
        100, "PDX", "LAX",
        "2/10/2025 12:00 PM", "2/10/2025 2:00 PM"
    );
    airline.addFlight(flight);

    StringWriter sw = new StringWriter();
    PrettyPrinter pretty_print = new PrettyPrinter(sw);
    pretty_print.dump(airline);

    String output_check = sw.toString();
    assertThat(output_check, containsString("Portland"));
    assertThat(output_check, containsString("Los Angeles"));
    assertThat(output_check, containsString("120 minutes"));
    assertThat(output_check, containsString("2/10/2025"));
    assertThat(output_check, containsString("Flight Number: 100"));


  }

}