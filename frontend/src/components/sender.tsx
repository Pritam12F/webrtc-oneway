import { useEffect, useState } from "react";

export const Sender = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [pc, setPC] = useState<RTCPeerConnection | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    setSocket(socket);
    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "sender" }));
    };
  }, []);

  const initiateConnection = async () => {
    if (!socket) {
      alert("Socket not found!");
      return;
    }

    const pc = new RTCPeerConnection();
    setPC(pc);
  };

  return <button onClick={initiateConnection}>Click me</button>;
};
