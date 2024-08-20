import { WebSocket, WebSocketServer } from "ws";

let senderSocket: null | WebSocket;
let receiverSocket: null | WebSocket;

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function (ws) {
  ws.on("error", function (error) {
    console.error(error.message);
  });

  ws.on("message", function (data: any) {
    const message = JSON.parse(data);

    if (message.type === "sender") {
      if (!senderSocket) {
        senderSocket = ws;
      }
      console.log("Sender set");
    } else if (message.type === "receiver") {
      if (!receiverSocket) {
        receiverSocket = ws;
      }
      console.log("Receiver set");
    } else if (message.type === "createOffer") {
      if (ws !== senderSocket) {
        return;
      }
      console.log("Create offer");
      receiverSocket?.send(
        JSON.stringify({ type: "createOffer", sdp: message.sdp })
      );
    } else if (message.type === "createAnswer") {
      if (ws !== receiverSocket) {
        return;
      }
      console.log("Create answer!");
      senderSocket?.send(
        JSON.stringify({ type: "createAnswer", sdp: message.sdp })
      );
    } else if (message.type === "iceCandidate") {
      if (ws === senderSocket) {
        receiverSocket?.send(
          JSON.stringify({
            type: "iceCandidate",
            iceType: "senderIce",
            iceCandidate: message.iceCandidates,
          })
        );
      } else if (ws === receiverSocket) {
        senderSocket?.send(
          JSON.stringify({
            type: "iceCandidate",
            iceType: "receiverIce",
            iceCandidate: message.iceCandidates,
          })
        );
      }
    }
  });

  ws.send(
    JSON.stringify({
      message: "Connected",
    })
  );
});
