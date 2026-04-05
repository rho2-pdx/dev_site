package edu.pdx.cs.joy.rho2;

import edu.pdx.cs.joy.AirlineParser;
import edu.pdx.cs.joy.ParserException;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.IOException;
import java.io.Reader;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * reads in XML files and stores into airline object
 */
public class XmlParser implements AirlineParser<Airline> {
  /**
   * reader handles file parsing
   * airline_name ensures a match with expected value
   */

  private final Reader reader;


  final private DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("M/d/yyyy h:mm a");

  /**
   * @param reader       contains data read in from file
   *
   */
  public XmlParser(Reader reader) {
    this.reader = reader;
  }

  /**
   * @return an Airline full of flights
   * @throws ParserException if parsing goes wrong
   */
  @Override
  public Airline parse() throws ParserException {
    if (reader == null) throw new ParserException("Error: cannot have null XML reader");

    try {
      DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance(); // creates doc builders
      factory.setValidating(true);
      DocumentBuilder builder = factory.newDocumentBuilder(); // creates Document (representation of XML)
      AirlineXmlHelper helper = new AirlineXmlHelper();

      builder.setEntityResolver(helper);
      builder.setErrorHandler(helper);


      Document doc = builder.parse(new InputSource(reader));

      Element root = doc.getDocumentElement();
      if (!root.getTagName().equals("airline")) {
        throw new ParserException("Error: XML does not contain an <airline> root");
      }

      Airline airline = new Airline(getElementText(root, "name"));

      NodeList flightNodes = root.getElementsByTagName("flight");
      for (int i = 0; i < flightNodes.getLength(); i++) {
        Node flightNode = flightNodes.item(i);
        if (flightNode.getNodeType() != Node.ELEMENT_NODE) continue;
        Element flightElement = (Element) flightNode;

        int number = Integer.parseInt(getElementText(flightElement, "number"));
        String src = getElementText(flightElement, "src");
        String dest = getElementText(flightElement, "dest");

        LocalDateTime depart = parseXmlDateTime(getDirectChild(flightElement, "depart"));
        LocalDateTime arrival = parseXmlDateTime(getDirectChild(flightElement, "arrive"));

        String departString = depart.format(DATE_FORMAT);
        String arrivalString = arrival.format(DATE_FORMAT);

        Flight flight = new Flight(airline.getName(), number, src, dest, departString, arrivalString);
        airline.addFlight(flight);
      }
      return airline;

    } catch (ParserConfigurationException | SAXException | IOException | NumberFormatException e) {
      throw new ParserException("Error: Could not parse XML", e);
    }
  }

  /**
   * @param parent  Where to find text
   * @param tagName Make sure it's the right Element
   * @return The text content of the nodes
   * @throws ParserException if fails
   */
  private String getElementText(Element parent, String tagName) throws ParserException {
    NodeList nodeList = parent.getElementsByTagName(tagName);
    if (nodeList.getLength() == 0) {
      throw new ParserException("Missing element: " + tagName);
    }
    return nodeList.item(0).getTextContent().trim();
  }

  /**
   * @param parent  used in identifying sub-elements
   * @param tagName identify if the nodes match expectations
   * @return the child node(s)
   * @throws ParserException if fails
   */
  private Element getDirectChild(Element parent, String tagName) throws ParserException {
    NodeList children = parent.getChildNodes();
    for (int i = 0; i < children.getLength(); i++) {
      Node node = children.item(i);
      if (node.getNodeType() == Node.ELEMENT_NODE && ((Element) node).getTagName().equals(tagName)) {
        return (Element) node;
      }

    }
    throw new ParserException("Missing direct child element: " + tagName);
  }

  /**
   * @param parent The depart/arrive element that contains sub-elements
   * @return LocalDateTime of combined date/time values read
   * @throws ParserException if any issues gathering this data
   */
  private LocalDateTime parseXmlDateTime(Element parent) throws ParserException {
    Element dateElement = getDirectChild(parent, "date");
    Element timeElement = getDirectChild(parent, "time");
    try {
      int day = Integer.parseInt(dateElement.getAttribute("day"));
      int month = Integer.parseInt(dateElement.getAttribute("month"));
      int year = Integer.parseInt(dateElement.getAttribute("year"));
      int hour = Integer.parseInt(timeElement.getAttribute("hour"));
      int minute = Integer.parseInt(timeElement.getAttribute("minute"));
      return LocalDateTime.of(year, month, day, hour, minute);
    } catch (NumberFormatException e) {
      throw new ParserException("Error: invalid Date/Time", e);
    }
  }


}


