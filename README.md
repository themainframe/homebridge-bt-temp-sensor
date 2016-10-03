# homebridge-bt-temp-sensor

This is the Homebridge accessory for my little Arduino based Bluetooth temperature sensors that I wrote about in my blog post ([https://damow.net/diy-homekit](https://damow.net/diy-homekit)).

The Arduino sketch for the temperature sensors is included in the `arduino` directory within this repository.

## Installation

You'll need to use a Bluetooth frontend (like `bluetoothctl`) to pair your HC-06-_like_ devices, then use `rfcomm` to bind the devices to Bluetooth serial ports:

	rfcomm bind rfcomm0 00:11:22:33:44:55

Then configure Homebridge for each Bluetooth temperature sensor you've set up in `~/.homebridge/config.json`:

	...
    "accessories": [
    ...
	    {
	        "accessory": "BluetoothTempSensor",
	        "name": "Temperature 1",
	        "port": "/dev/rfcomm0"
	    },
    ...
    ]
    ...

You should then be able to start Homebridge and the accessory should listen for temperature updates from the remote devices.
