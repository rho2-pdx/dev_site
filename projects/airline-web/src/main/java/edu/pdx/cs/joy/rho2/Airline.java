package edu.pdx.cs.joy.rho2;

import edu.pdx.cs.joy.AbstractAirline;

import java.util.Comparator;
import java.util.SortedSet;
import java.util.TreeSet;

/**
 * Airline class stores flights, used between many classes
 */
public class Airline extends AbstractAirline<Flight> {
  private final String name; // airline name
  private final SortedSet<Flight> flights; // storing CLI flights
  // compares flights
  /**
   * comparator for sorting flights by source, then departure time
   */
  public static final Comparator<Flight> flightComparator = Comparator
      .comparing(Flight::getSource)
      .thenComparing(Flight::getDeparture); // ensure flight time makes sense

  /**
   * name gets passed into the constructor, makes a TreeSet for flights
   *
   * @param name is the name of the airline
   */
  public Airline(String name) {
    this.name = name;
    this.flights = new TreeSet<>(flightComparator);
  }

  /**
   * This is used to get the name of the airline
   *
   * @return the airline name
   */
  @Override
  public String getName() {
    return this.name;
  }

  /**
   * This is used to add a flight to the airline
   *
   * @param flight to add
   * @throws IllegalArgumentException if flight == null
   */
  @Override
  public void addFlight(Flight flight) {
    if (flight == null) {
      throw new IllegalArgumentException("Error: flight is null, cannot be added.");
    }
    this.flights.add(flight);
  }

  /**
   * returns the flights in the collection
   *
   * @return the flights in the airline
   */
  @Override
  public SortedSet<Flight> getFlights() {
    return this.flights;
  }
}
