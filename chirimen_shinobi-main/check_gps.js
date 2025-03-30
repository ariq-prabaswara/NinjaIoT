import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import GPSpackage from 'gps';
const GPS = GPSpackage.GPS;

var channel;
const sleep = msec => new Promise(resolve => setTimeout(resolve, msec)); // sleep 関数を定義

const serverUrl = "http://demo.traccar.org:5055";

async function main() {

  //GPSの初期設定
  const port = new SerialPort({ path: '/dev/ttyS0', baudRate: 9600 })
  const parser = port.pipe(new ReadlineParser())
  const gps = new GPS();
  parser.on('data', function (txtData) {
    gps.update(txtData);
  });

  // ディバッグ用：
  console.log(
    [
      `/////////////////// 初期化TEST //////////////////////`,
      `temp_rx: ${temp_rx}, temp_ry: ${temp_ry}, temp_rz: ${temp_rz}`,
      `err_rx: ${err_rx}, err_ry: ${err_ry}, err_rz: ${err_rz}`,
      `////////////////////// TEST ////////////////////////`
    ].join("\n")
  );

  while (true) {
    await sleep(1000); // 1秒待つ
    gps.on('data', function (data) {
      if (data.type == "RMC") { // "RMC"タイプデータを読むと速度(ノット)が得られる
        //console.log(data);
        data.role = "sinobi";
        channel.send(data); // Send
        console.log(JSON.stringify(data))
        sinobi_lat = data.lat;
        sinobi_lng = data.lon;


      }
    });

  }

}

main();