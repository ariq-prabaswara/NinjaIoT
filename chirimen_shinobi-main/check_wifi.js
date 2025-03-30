import { exec } from "node:child_process";

exec("iwgetid -r", (error, stdout, stderr) => {
  if (error || stderr) {
    console.log("Wi-Fiに接続していません");
  } else {
    console.log(`Wi-Fiに接続中: ${stdout.trim()}`);
  }
});
