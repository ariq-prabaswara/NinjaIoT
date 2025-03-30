import { requestGPIOAccess } from "./node_modules/node-web-gpio/dist/index.js";
const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));
import nodeWebSocketLib from "websocket"; // https://www.npmjs.com/package/websocket
import { RelayServer } from "./RelayServer.js";

import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import GPSpackage from 'gps';
const GPS = GPSpackage.GPS;

var channel;
var gpsData;

async function connect() {
    var relay = RelayServer("chirimentest", "chirimenSocket", nodeWebSocketLib, "https://chirimen.org");
    channel = await relay.subscribe("ninja-iot");
    while (true) {
        channel.send(gpsData);
        console.log("==============================================================");
        console.log(JSON.stringify(gpsData));
        await sleep(1000);
    }
}

const port = new SerialPort({ path: '/dev/ttyS0', baudRate: 9600 })
const parser = port.pipe(new ReadlineParser())
const gps = new GPS();

parser.on('data', function (txtData) {
    gps.update(txtData);
});

gps.on('data', function (data) {
    if (data.type == "RMC") {
        data.role = "oni";
        gpsData = data;
    }
});

connect();

