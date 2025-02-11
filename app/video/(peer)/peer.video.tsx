"use client";
import useSocket from "@/app/(customHooks)/customHook";

import { useEffect, useRef } from "react";

// use ref when you want a value to be updated but not re-render the component

const Video = () => {
  const { socket } = useSocket();
  const sendingVideo = useRef<HTMLVideoElement>(null);
  const receivingVideo = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const pendingCandidates = useRef<RTCIceCandidate[]>([]);

  function handlePeerConnection() {
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        {
          urls: "turn:relay1.expressturn.com:3478",
          username: "efifournier",
          credential: "webrtc",
        },
      ],
    });
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log(`sending ice candindaate ${event.candidate}`);
        socket?.emit("sendIceCandidate", event.candidate);
      }
    };

    peerConnection.ontrack = (event) => {
      if (receivingVideo.current) {
        if (!receivingVideo.current.srcObject) {
          receivingVideo.current.srcObject = new MediaStream();
          console.log(`Created a new media stream`);
        }

        const mediaStream = receivingVideo.current.srcObject as MediaStream;
        mediaStream.addTrack(event.track);
        console.log(`Added track to media stream`);
      } else {
        console.log(`No video element found`);
      }
    };
    return peerConnection;
  }

  const handleCall = async (peerConnection: RTCPeerConnection) => {
    startVideo();
    if (!peerConnectionRef.current) {
      console.error("❌ PeerConnection is NULL!");
      return;
    }
    try {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      socket?.emit("offer", offer);
    } catch (error) {
      console.log(`Error creating offer: ${error}`);
    }
  };

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (sendingVideo.current) {
        sendingVideo.current.srcObject = stream;
      }
      if (!peerConnectionRef.current) {
        peerConnectionRef.current = handlePeerConnection();
      }
      stream.getTracks().forEach((track) => {
        peerConnectionRef.current?.addTrack(track, stream);
      });
    } catch (error) {
      console.log(`Error starting video: ${error}`);
    }
  };

  useEffect(() => {
    if (!socket) return;
    const peerConnection = handlePeerConnection();
    peerConnectionRef.current = peerConnection;

    //listen and handle for incoming ice candidatees
    socket.on("iceCandidate", async (candidate) => {
      if (peerConnectionRef.current?.remoteDescription) {
        await peerConnectionRef.current.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
        console.log(`Received ice candidate ${candidate}`);
      } else {
        console.log(`No remote description found`);
        pendingCandidates.current.push(candidate);
      }
    });

    //listen and handle for incoming offer
    socket.on("offer", async (offer) => {
      await startVideo();
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(offer);

        while (pendingCandidates.current.length) {
          const candidate = pendingCandidates.current.shift();
          await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
          console.log("✅ Processed stored ICE candidate.");
        }
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        socket.emit("answer", answer);
      }
    });
    //listen and handle for incoming answer

    socket.on("answer", async (answer) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
      }
    });

    return () => {
      socket.off("ice-candidate");
      socket.off("offer");
      socket.off("answer");

      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
    };
  }, [socket, handlePeerConnection, startVideo]);
  return (
    <>
      <div className="flex flex-col h-screen items-center justify-center">
        <div className="flex">
          <video
            ref={sendingVideo}
            autoPlay
            playsInline
            className="border-4 border-green-500 rounded-lg"
          />
          <video
            ref={receivingVideo}
            autoPlay
            playsInline
            className="border-4 border-red-500 rounded-lg"
          />
        </div>
        <button
          onClick={() =>
            handleCall(peerConnectionRef.current as RTCPeerConnection)
          }
          className="bg-green-900 mt-5 p-2 rounded-lg text-white"
        >
          Call
        </button>
      </div>
    </>
  );
};

export default Video;
