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
    } else if (message.type === "receiever") {
      if (!receiverSocket) {
        receiverSocket = ws;
      }
    } else if (message.type === "createOffer") {
      if (ws !== senderSocket) {
        return;
      }

      receiverSocket?.send(
        JSON.stringify({ type: "createOffer", sdp: message.sdp })
      );
    } else if (message.type === "createAnswer") {
      if (ws !== receiverSocket) {
        return;
      }

      senderSocket?.send(
        JSON.stringify({ type: "createAnswer", sdp: message.sdp })
      );
    } else if (message.type === "iceCanditates") {
      if (ws === senderSocket) {
        receiverSocket?.send(
          JSON.stringify({
            type: "iceCanditates",
            iceType: "senderIce",
            iceCandidates: message.iceCandidates,
          })
        );
      } else if (ws === receiverSocket) {
        senderSocket?.send(
          JSON.stringify({
            type: "iceCanditates",
            iceType: "receiverIce",
            iceCandidates: message.iceCandidates,
          })
        );
      }
    }
  });

  ws.send("Connected!");
});
