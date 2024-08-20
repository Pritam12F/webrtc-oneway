import { useEffect, useRef } from "react";

export const Receiver = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "receiver" }));
    };

    socket.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      const pc = new RTCPeerConnection();

      pc.ontrack = (event) => {
        console.log(event.track);

        if (videoRef.current) {
          videoRef.current.srcObject = new MediaStream([event.track]);
          videoRef.current.muted = true;
          videoRef.current.play();
        }
      };

      if (message.type === "createOffer") {
        await pc.setRemoteDescription(message.sdp);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.send(
          JSON.stringify({
            type: "createAnswer",
            sdp: pc.localDescription,
          })
        );
      } else if (message.type === "iceCandidate") {
        await pc.addIceCandidate(message.iceCandidate);
      }
    };
  }, []);

  return <video ref={videoRef}>Receiver message</video>;
};
