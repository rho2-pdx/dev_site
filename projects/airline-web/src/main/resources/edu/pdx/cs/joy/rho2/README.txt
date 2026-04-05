This is a readme
Ryan Houlberg - rho2 - rho2@pdx.edu
[![Java CI with Maven](https://github.com/rho2-pdx/JoyOfCodingWinter2025/actions/workflows/maven.yml/badge.svg)](https://github.com/rho2-pdx/JoyOfCodingWinter2025/actions/workflows/maven.yml)

# Airline Program 5

This program is created with Maven, and is built by using this command:
`./mvnw -Pgrader clean verify`

**You do not need to install Maven on your local development machine. But it's handy if you do because ada is so slow**



# Contents
1. [What does Program 5 do?](#what-does-program-5-do)
    1. [How do I use it?](#usage)


## What does program 5 do:

Program 5 is a big change, setting up a REST client and a Servlet:


!!!!!!Example inputs!!!!!!!

--- Add a flight ---

java -jar target/airline-client.jar -host localhost -port 12345 \
"Air Dave" 123 PDX 03/19/2025 1:02 pm ORD 03/19/2025 6:22 pm

--- Search for a flight --- (PrettyPrint)

$ java -jar target/airline-client.jar -host localhost -port 8080 \
-search "Air Dave"

--- [optional "src" and "dest" options show message if no flights match] ---

$ java -jar target/airline-client.jar -host localhost -port 8080 \
-search "Air Dave" PDX LAS


This program takes the following arguments in order:

1. **airline** – The name of the airline
2. **flightNumber** – The flight number
3. **src** – Three-letter code of the departure airport
4. **depart** – Departure date and time (12-hour format)
5. **dest** – Three-letter code of the arrival airport
6. **arrive** – Arrival date and time (12-hour format)

Dates and times must be formatted as: mm/dd/yyyy hh:mm AM/PM

### Optional Arguments:

These options must be included before any data values:

- **`-print`** – Displays a description of the new flight
- **`-README`** – Prints a README for this project and exits
- **`-host hostname`** - sets target host
- **`-port port`** - sets target port
- **`-search "airline name" - search for flights

