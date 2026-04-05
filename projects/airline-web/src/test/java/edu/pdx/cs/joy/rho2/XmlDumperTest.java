package edu.pdx.cs.joy.rho2;

import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.io.StringWriter;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class XmlDumperTest {
  private final Airline airline = new Airline("Test Airline");

  private final Flight flight = new Flight("Test Airline",
      100, "PDX", "LAX",
      "2/10/2025 12:00 PM", "2/10/2025 2:00 PM"
  );

  @Test
  void dumperContainsKeyFieldsWithProperFlight() throws IOException {
    airline.addFlight(flight);

    StringWriter sw = new StringWriter();
    XmlDumper dumper = new XmlDumper(sw);
    dumper.dump(airline);

    String xmlOutput = sw.toString();

    assertTrue(xmlOutput.contains("<airline>"));
    assertTrue(xmlOutput.contains("<name>Test Airline</name>"));
    assertTrue(xmlOutput.contains("<flight>"));
    assertTrue(xmlOutput.contains("<number>" + flight.getNumber() + "</number>"));
    assertTrue(xmlOutput.contains("<src>" + flight.getSource() + "</src>"));
    assertTrue(xmlOutput.contains("<dest>" + flight.getDestination() + "</dest>"));
  }

  @Test
  void dumperThrowsIOExceptionWithBadFlight() {

    StringWriter sw = new StringWriter();
    XmlDumper dumper = new XmlDumper(sw);

    assertThrows(NullPointerException.class, () -> {
      dumper.dump(null);
    });
  }
}