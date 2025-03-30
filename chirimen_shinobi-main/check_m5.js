import { SerialPort } from 'serialport'

const port = new SerialPort({ path: '/dev/ttyS0', baudRate: 9600 })

const random = Math.floor(Math.random() * 40);
console.log("数値を送信します:", random);
port.write(random.toString(), (err) => {
    if (err) {
        return console.error("送信エラー:", err.message);
    }
    console.log("数値が送信されました");
});


