package edu.pdx.cs.joy.rho2;

import edu.pdx.cs.joy.AirlineDumper;
import org.w3c.dom.*;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.IOException;
import java.io.Writer;
import java.time.LocalDateTime;

/**
 * XmlDumper is used to write all airplane data to an XML file
 */
public class XmlDumper implements AirlineDumper<Airline> {
  private final Writer writer;
  private static final String PUBLIC_ID =
      "-//Joy of Coding at PSU//DTD Airline//EN";
  private static final String dtdFileName =
      "airline.dtd";


  /**
   * XmlDumper is used to output airline/flight data into an XML file
   *
   * @param writer is just used to pipeline the XML data into the file
   */
  public XmlDumper(Writer writer) {
    this.writer = writer;
  }

  /**
   * @param airline the Airline which is dumped from
   * @throws IOException if entering flight data goes wrong (it typically doesn't)
   */
  @Override
  public void dump(Airline airline) throws IOException {
    Document doc = null;
    try {
      DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance(); // creates doc builders
      DocumentBuilder builder = factory.newDocumentBuilder(); // creates Document (representation of XML)
      DOMImplementation domImplementation = builder.getDOMImplementation(); // link Docs with DTD rules

      // apply DTD guidelines for usage in documents
      DocumentType documentType = domImplementation.createDocumentType("airline", PUBLIC_ID, dtdFileName);

      // creates XML document, root is the airline
      doc = domImplementation.createDocument(null, "airline", documentType);
    } catch (ParserConfigurationException | DOMException e) {
      throw new IOException("Error: Failed to create XML", e);
    }

    Element root = doc.getDocumentElement();

    Element nameElement = doc.createElement("name"); // create <name> tag
    nameElement.appendChild(doc.createTextNode(airline.getName())); // get airline name, place inside node
    root.appendChild(nameElement); // add node into the airline root

    for (Flight flight : airline.getFlights()) {
      Element flightElement = doc.createElement("flight");

      Element numberElement = doc.createElement("number");
      numberElement.appendChild(doc.createTextNode(String.valueOf(flight.getNumber())));
      flightElement.appendChild(numberElement);

      Element srcElement = doc.createElement("src");
      srcElement.appendChild(doc.createTextNode(flight.getSource()));
      flightElement.appendChild(srcElement);

      Element departElement = doc.createElement("depart");
      convertDateTime(departElement, flight.getDeparture(), doc);
      flightElement.appendChild(departElement);

      Element destElement = doc.createElement("dest");
      destElement.appendChild(doc.createTextNode(flight.getDestination()));
      flightElement.appendChild(destElement);

      Element arriveElement = doc.createElement("arrive");
      convertDateTime(arriveElement, flight.getArrival(), doc);
      flightElement.appendChild(arriveElement);

      root.appendChild(flightElement);
    }

    try {
      // Captures DOM document and outputs as XML
      TransformerFactory transformerFactory = TransformerFactory.newInstance();
      Transformer transformer = transformerFactory.newTransformer();

      transformer.setOutputProperty(OutputKeys.INDENT, "yes");
      transformer.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "2");
      transformer.setOutputProperty(OutputKeys.DOCTYPE_SYSTEM, dtdFileName);
      transformer.setOutputProperty(OutputKeys.DOCTYPE_PUBLIC, PUBLIC_ID);
      transformer.setOutputProperty(OutputKeys.ENCODING, "us-ascii");


      DOMSource source = new DOMSource(doc);
      StreamResult target = new StreamResult(writer);

      transformer.transform(source, target);
    } catch (TransformerException e2) {
      throw new IOException("Error: Failed to write to XML" + e2);
    }
  }

  private void convertDateTime(Element element, LocalDateTime dateTime, Document doc) {
    Element dateElement = doc.createElement("date");
    dateElement.setAttribute("day", String.valueOf(dateTime.getDayOfMonth()));
    dateElement.setAttribute("month", String.valueOf(dateTime.getMonthValue()));
    dateElement.setAttribute("year", String.valueOf(dateTime.getYear()));

    Element timeElement = doc.createElement("time");
    timeElement.setAttribute("hour", String.valueOf(dateTime.getHour()));
    timeElement.setAttribute("minute", String.valueOf(dateTime.getMinute()));

    element.appendChild(dateElement);
    element.appendChild(timeElement);

  }
}

