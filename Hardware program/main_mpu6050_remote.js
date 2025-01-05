import {requestI2CAccess} from "./node_modules/node-web-i2c/index.js";
import MPU6050 from "@chirimen/mpu6050";
import nodeWebSocketLib from "websocket"; // https://www.npmjs.com/package/websocket
import {RelayServer} from "./RelayServer.js";

const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

var channel;

async function main() {
  var i2cAccess = await requestI2CAccess();
  var port = i2cAccess.ports.get(1);
  var mpu6050 = new MPU6050(port, 0x68);
  await mpu6050.init();

  var i = 0; 
  var count = 0; // 術発動用の時間カウンター
  var temp_rx = 0;
  var temp_ry = 0;
  var temp_rz = 0;
  
  // webSocketリレーの初期化
  var relay = RelayServer("chirimentest", "chirimenSocket" , nodeWebSocketLib, "https://chirimen.org");
  channel = await relay.subscribe("chirimenSW");
  console.log("web socketリレーサービスに接続しました");
　
  // センサーの初期化
  while (i < 100){
	const data = await mpu6050.readAll();
	temp_rx = temp_rx + data.rx;
	temp_ry = temp_ry + data.ry;
	temp_rz = temp_rz + data.rz;
	i = i + 1;
  }
  const err_rx = temp_rx/i; //3.783; // Error Rx
  const err_ry = temp_ry/i; //0.487; // Error Ry
  const err_rz = temp_rz/i; //-0.01; // Error Rz
  
  // ディバッグ用：
  console.log(
	[
	 `temp_rx: ${temp_rx}, temp_ry: ${temp_ry}, temp_rz: ${temp_rz}`,
	 `err_rx: ${err_rx}, err_ry: ${err_ry}, err_rz: ${err_rz}`,
	 `////////////////////// TEST ////////////////////////`
	].join("\n")
  );

  while (true) {
	const data = await mpu6050.readAll();
	const temperature = data.temperature.toFixed(2);

	const g = [data.gx, data.gy, data.gz];
	const r = [data.rx - err_rx, data.ry - err_ry, data.rz - err_rz];
	
	//　加速度を計算
	const acc = Math.sqrt(r[0]**2+r[1]**2+r[2]**2).toFixed(1);

	// ディバッグ用：
	console.log(
	  [
		//`Temperature: ${temperature} degree`,
		//`Gx: ${g[0].toFixed(2)}, Gy: ${g[1].toFixed(2)}, Gz: ${g[2].toFixed(2)}`,
		`Gx: ${g[0].toFixed(2)}`,
        `count: ${count}`,
		//`Rx: ${r[0].toFixed(1)}, Ry: ${r[1].toFixed(1)}, Rz: ${r[2].toFixed(1)}`,
		`Total Movement: ${Math.sqrt(r[0]**2+r[1]**2+r[2]**2).toFixed(1)} `
	  ].join("\n")
	);

	// サーバにメッセージを送信する
	if (g[0] > 0.8 && acc < 90) {
		channel.send(`SAFE`);
	} else if (g[0] > -0.20 && g[0] < 0.20 && acc < 50) {
		count = count + 1;
		
		// 保持時間＝count*loop await sleep 時間
		if (count > 6){
			channel.send(`影分身の術`);
			count = 0;
		}
	} else {
		channel.send(`DANGER`);
		count = 0;
	}
	await sleep(500);
  }
}

main();