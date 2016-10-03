#include <SoftwareSerial.h>
#include <OneWire.h>
#include <DallasTemperature.h>

// Define the pinout used on the Arduino
#define ONE_WIRE_BUS 9
#define BT_SERIAL_RX 10
#define BT_SERIAL_TX 11
#define LED_PIN 13

// The time between temperature updates
#define WAIT_PERIOD 10000

// Set up the software UART to talk to the Bluetooth module
SoftwareSerial btSerial(BT_SERIAL_RX, BT_SERIAL_TX);

// Set up the 1-Wire bus
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

void setup() {
    pinMode(LED_PIN, OUTPUT);
    btSerial.begin(9600);
}

void loop() {
    // Wait before transmitting again
    delay(WAIT_PERIOD);

    // Flash LED during transmit
    digitalWrite(LED_PIN, HIGH);

    // Get the temperature
    sensors.requestTemperatures();
    float temp = sensors.getTempCByIndex(0);

    // Ignore silly readings from DS18b20 devices
    if (temp <= 0 || temp > 80) {
        return;
    }

    // Build a JSON string and transmit it
    String jsonString = String("{\"temp\":");
    jsonString += String(temp);
    jsonString += String("}");
    btSerial.println(jsonString);

    // LED off until next transmit
    digitalWrite(LED_PIN, LOW);
}
