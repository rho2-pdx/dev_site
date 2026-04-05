package edu.pdx.cs.joy.rho2;

import edu.pdx.cs.joy.InvokeMainTestCase;
import edu.pdx.cs.joy.ParserException;
import edu.pdx.cs.joy.UncaughtExceptionInMain;
import edu.pdx.cs.joy.web.HttpRequestHelper.RestException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import java.io.*;
import java.net.HttpURLConnection;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.fail;
import static org.junit.jupiter.api.MethodOrderer.MethodName;

/**
 * An integration test for {@link Project5} that invokes its main method with
 * various arguments
 */
@TestMethodOrder(MethodName.class)
class Project5IT extends InvokeMainTestCase {
  private static final String HOSTNAME = "localhost";
  private static final String PORT = System.getProperty("http.port", "8080");

  @Test
  void test0RemoveAllAirlines() throws IOException {
    AirlineRestClient client = new AirlineRestClient(HOSTNAME, Integer.parseInt(PORT));
    client.removeAllAirlines();
  }

  @Test
  void test1NoCommandLineArguments() {
    MainMethodResult result = invokeMain(Project5.class);
    assertThat(result.getTextWrittenToStandardError(), containsString(Project5.MISSING_ARGS));
  }

  @Test
  void testAddFlight() {
      MainMethodResult result = invokeMain(Project5.class,"-print", "-host", HOSTNAME, "-port", PORT,
          "Airline Name", "123", "PDX", "1/27/2025", "10:00", "AM", "LAX", "1/27/2025", "12:00", "PM");
      assertThat(result.getTextWrittenToStandardError(), equalTo(""));


      String output = result.getTextWrittenToStandardOut();


      assertThat(
          output,
          containsString("Flight Number: 123")
      );
  }

  @Test
  void testAddMultipleAirlines() {
    Airline airline1;
    Airline airline2;
    AirlineServlet servlet = new AirlineServlet();
    PrettyPrinter printer = new PrettyPrinter(new OutputStreamWriter(System.out));

    InputStream resource1 = getClass().getResourceAsStream("valid-airline.xml");
    assertThat(resource1, notNullValue());
    Reader reader1 = new InputStreamReader(resource1);
    XmlParser parser1 = new XmlParser(reader1);
    try {
      airline1 = parser1.parse();
      servlet.addAirline(airline1);
      printer.dump(airline1);
      System.out.println();
    } catch (ParserException | IOException e) {
      System.out.println("Error: " + e);
    }


    InputStream resource2 = getClass().getResourceAsStream("another_valid_airline.xml");
    assertThat(resource2, notNullValue());
    Reader reader2 = new InputStreamReader(resource2);
    XmlParser parser2 = new XmlParser(reader2);
    try {
      airline2 = parser2.parse();
      servlet.addAirline(airline2);
      printer.dump(airline2);
    } catch (ParserException | IOException e) {
      System.out.println("Error: " + e);
    }
  }

  @Test
  void testSearchWithInvalidSourceDest() {
    MainMethodResult searchResult = invokeMain(Project5.class, "-print", "-host", HOSTNAME, "-port", PORT,
        "-search", "TestAirline", "XYZ", "SEA");

    assertThat(searchResult.getTextWrittenToStandardError(), containsString("Error: search parameters have invalid Source/Destination codes"));
  }

  @Test
  void testSearchForUnknownAirline() {
    MainMethodResult searchResult = invokeMain(Project5.class, "-print", "-host", HOSTNAME, "-port", PORT,
        "-search", "not a real airline", "PDX", "SEA");

    assertThat(searchResult.getTextWrittenToStandardError(), containsString("Airline not found"));
  }

}