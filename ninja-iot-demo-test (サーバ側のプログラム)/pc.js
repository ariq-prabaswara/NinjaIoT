// Remote Example4 - controller
import { RelayServer } from "https://chirimen.org/remote-connection/js/beta/RelayServer.js";

var channel;
onload = async function () {
  // webSocketリレーの初期化
  var relay = RelayServer("chirimentest", "chirimenSocket");
  channel = await relay.subscribe("chirimenSW");
  messageDiv.innerText = "web socketリレーサービスに接続しました";
  channel.onmessage = getMessage;
};

let isProcessing = false; // To track if a delay is in progress

function getMessage(msg) {
  // Function triggered when a message is received
  if (isProcessing) return; // Ignore new messages while processing a delay

  messageDiv.innerText = "状況　：" + msg.data;

  if (msg.data === "影分身の術") {
    isProcessing = true; // Indicate that a delay is in progress
    setTimeout(() => {
      console.log("3000ms delay after 影分身の術 message.");
      isProcessing = false; // Allow processing of new messages
    }, 3000);
  }
}
