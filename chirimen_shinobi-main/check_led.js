
import { requestGPIOAccess } from "./node_modules/node-web-gpio/dist/index.js"; // WebGPIO を使えるようにするためのライブラリをインポート

const gpioAccess = await requestGPIOAccess();

const sleep = msec => new Promise(resolve => setTimeout(resolve, msec)); // sleep 関数を定義


const port_wifi_led = gpioAccess.ports.get(8);
const port_error_led = gpioAccess.ports.get(25);
const port_start_led = gpioAccess.ports.get(7);
await port_wifi_led.export("out");
await port_error_led.export("out");
await port_start_led.export("out");

port_error_led.write(1);
port_wifi_led.write(1);
port_start_led.write(1);

await sleep(10000);

port_error_led.write(0);
port_wifi_led.write(0);
port_start_led.write(0);