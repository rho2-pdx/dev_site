package edu.pdx.cs.joy.rho2;

import edu.pdx.cs.joy.ParserException;
import org.junit.jupiter.api.Test;

import java.io.*;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.junit.jupiter.api.Assertions.*;


class XmlParserTest {


  @Test
  void readerCannotBeNull() {
    Reader reader = null;
    XmlParser parser = new XmlParser(reader);
    assertThrows(ParserException.class, parser::parse);
  }

  @Test
  void canParseValidXmlFile() throws ParserException {
    InputStream resource = getClass().getResourceAsStream("valid-airline.xml");
    assertThat(resource, notNullValue());

    Reader reader = new InputStreamReader(resource);


    XmlParser parser = new XmlParser(reader);
    Airline airline = parser.parse();

    assertThat("Valid Airlines", equalTo(airline.getName()));

  }

  @Test
  void canParseThenDumpThenParseAndNotAddDuplicates() throws Exception {
    InputStream resource = getClass().getResourceAsStream("valid-airline.xml");
    assertNotNull(resource, "Resource valid-airline.xml not found");

    byte[] originalBytes = resource.readAllBytes();

    Reader reader1 = new InputStreamReader(new ByteArrayInputStream(originalBytes));
    XmlParser parser1 = new XmlParser(reader1);
    Airline airline1 = parser1.parse();

    StringWriter sw = new StringWriter();
    XmlDumper dumper = new XmlDumper(sw);
    dumper.dump(airline1);
    String dumpedXml = sw.toString();

    Reader reader2 = new InputStreamReader(new ByteArrayInputStream(dumpedXml.getBytes()));
    XmlParser parser2 = new XmlParser(reader2);
    Airline airline2 = parser2.parse();

    assertEquals(airline1.getFlights().size(), airline2.getFlights().size(), "Lengths mismatch");
  }
}
