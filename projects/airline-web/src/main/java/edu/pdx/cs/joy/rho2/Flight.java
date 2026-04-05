package edu.pdx.cs.joy.rho2;

import edu.pdx.cs.joy.AbstractFlight;
import edu.pdx.cs.joy.AirportNames;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

/**
 * Flight stores data for a single flight from source to destination
 */
public class Flight extends AbstractFlight {

  // flight number
  final private int number; // the three letter source of the flight
  final private String source;
  // the three letter destination of the flight
  final private String destination;
  // the date/time of when the flight departs
  final private String departureString;
  // the date/time of when the flight arrives (converted to LocalDateTime in constructor)
  final private String arrivalString;
  // the date/time for arrival time (converted to LocalDateTime in constructor)
  final private LocalDateTime departure;
  final private LocalDateTime arrival;

  final private String airline;

  final private DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("M/d/yyyy h:mm a");

  // this is for the date/time regex formatting check
  // put separately because it's monstrous
  //final static private String DATE_TIME_REGEX =
  //        "^(0?[1-9]|1[0-2])/(0?[1-9]|[12][0-9]|3[01])/\\d{4} (0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$";


  /**
   * This flight function is the constructor, where (almost) all the
   * error checking takes place
   * it throws exceptions which are caught in main
   *
   * @param airline         is name of the airline
   * @param arrivalString   time when arrival (not checked with java.time)
   * @param departureString time when departure (not checked with java.time)
   * @param destination     three letter destination airport
   * @param number          number of the flight
   * @param source          three letter departure airport
   */
  public Flight(String airline, int number, String source, String destination,
                String departureString, String arrivalString) {

    if (airline == null || airline.trim().isEmpty()) {
      throw new IllegalArgumentException("Airline name cannot be empty");
    }
    this.airline = airline;

    // validate correct flight number
    if (number < 0) {
      throw new IllegalArgumentException("Number must be above 0");
    }
    this.number = number;

    /*
    // validate correct source syntax
    if (!source.trim().toUpperCase().matches("[A-Z]{3}")) {
      throw new IllegalArgumentException("Airport codes must be three letters.");
    }
    */
    if (AirportNames.getName(source.toUpperCase()) == null) {
      throw new IllegalArgumentException("Error:" + source + " is not a real source");
    }
    this.source = source.toUpperCase();

    // validate correct destination syntax
    /*
    if (!destination.trim().toUpperCase().matches("[A-Z]{3}")) {
      throw new IllegalArgumentException("Airport codes must be three letters.");
    }*/
    if (AirportNames.getName(destination.toUpperCase()) == null) {
      throw new IllegalArgumentException("Error:" + destination + " is not a real destination");
    }
    this.destination = destination.toUpperCase();

    // validate correct departure syntax
    try {
      this.departure = LocalDateTime.parse(departureString, DATE_FORMAT);
    } catch (DateTimeParseException e) {
      throw new IllegalArgumentException("Departure must be in valid 12H value in MM/DD/YYYY HH:MM AM/PM format.");
    }

    // validate correct arrival syntax
    try {
      this.arrival = LocalDateTime.parse(arrivalString, DATE_FORMAT);
    } catch (DateTimeParseException e) {
      throw new IllegalArgumentException("Arrival must be in valid 12H value in MM/DD/YYYY HH:MM AM/PM format.");
    }

    if (this.arrival.isBefore(this.departure) || this.arrival.isEqual(this.departure)) {
      throw new IllegalArgumentException("Arrival time cannot be before departure time.");
    }

    this.departureString = departureString;
    this.arrivalString = arrivalString;
  }

  /**
   * This is used to get the flight number of the flight
   *
   * @return the flight number
   */
  @Override
  public int getNumber() {
    return this.number;
  }

  /**
   * This is used to get the source of the flight
   *
   * @return the flight's source airport
   */
  @Override
  public String getSource() {
    return this.source;
  }

  /**
   * This is used to get the destination of the flight
   *
   * @return the flight's destination airport
   */
  @Override
  public String getDestination() {
    return this.destination;
  }

  /**
   * This is used to get the departure time of the flight
   *
   * @return the flight's departure time as string
   */
  @Override
  public String getDepartureString() {
    return this.departureString;
  }

  /**
   * This is used to get the arrival time of the flight
   *
   * @return flight's arrival time as string
   */
  @Override
  public String getArrivalString() {
    return this.arrivalString;
  }

  /**
   * This is used to get the departure time of the flight
   *
   * @return flight's departure time
   */
  @Override
  public LocalDateTime getDeparture() {
    return this.departure;
  }

  /**
   * This is used to get the arrival time of the flight
   *
   * @return flight's arrival time
   */
  @Override
  public LocalDateTime getArrival() {
    return this.arrival;
  }
}
