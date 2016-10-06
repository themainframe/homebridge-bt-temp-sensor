var http = require('http');
var SerialPort = require('serialport');
var Accessory, Service, Characteristic, UUIDGen;

// Register our accessory with Homebridge
module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-bt-temp-sensor", "BluetoothTempSensor", BluetoothTempSensor, true);
}

function BluetoothTempSensor(log, config) {
  var acc = this;
  this.log = log;
  this.name = config["name"];
  this.device = config["device"];

  // The temperature value cached locally until getState needs it
  this.temperature = null;

  // Configure the service
  this.service = new Service.TemperatureSensor(this.name);
  this.service
    .getCharacteristic(Characteristic.CurrentTemperature)
    .setProps({ minValue: -55, maxValue: 125 })
    .on('get', this.getState.bind(this));

  // Set up the serial port using the one specified in ~/.homebridge/config.json
  this.port = new SerialPort(config["port"], {
    parser: SerialPort.parsers.readline('\n')
  });

  // If the port is ever closed, try to reopen it
  setInterval((function () {
	  if (!this.port.readable) {
	    acc.log('serial port is closed, reopening...');
	    this.port.open();
	  }
  }).bind(this), 1000);

  // When the port receives data, parse the JSON if we can extract the temperature
  this.port.on('data', function (data) {
    try {
      var json = JSON.parse(data);
      if (json.hasOwnProperty('temp')) {
        acc.log('updated temperature to ', json.temp);
        acc.temperature = json.temp;
      }
    } catch (e) {
      acc.log('Received invalid JSON from temperature probe: ', json);
    }
  });
}

// Implement getState for when the characteristic is requested
BluetoothTempSensor.prototype.getState = function(callback) {
  callback(null, this.temperature);
}

// Provide the available services this accessory implements
BluetoothTempSensor.prototype.getServices = function() {
  return [this.service];
}

