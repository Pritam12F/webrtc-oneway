import { WebSocketServer } from "ws";

let senderSocket: null | WebSocket;
let receiverSocket: null | WebSocket;

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function (ws) {
  ws.on("error", function (error) {
    console.error(error.message);
  });

  ws.on("message", function (data: any) {
    const message = JSON.parse(data);
  });

  ws.send("Connected!");
});
