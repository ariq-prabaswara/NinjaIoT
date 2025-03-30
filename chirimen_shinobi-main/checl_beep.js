
import { requestGPIOAccess } from "./node_modules/node-web-gpio/dist/index.js"; // WebGPIO を使えるようにするためのライブラリをインポート

const gpioAccess = await requestGPIOAccess();

const sleep = msec => new Promise(resolve => setTimeout(resolve, msec)); // sleep 関数を定義


const port1 = gpioAccess.ports.get(21);
await port1.export("out");

port1.write(1);
await sleep(1000);
port1.write(0);