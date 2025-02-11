"use client";
import useSocket from "@/app/(customHooks)/customHook";
import Button from "@/components/matchButton";
import Loader from "@/components/ui/loader";

import { useEffect, useRef, useState } from "react";

// use ref when you want a value to be updated but not re-render the component

const Video = () => {
  const { socket, googleUserId } = useSocket();
  const sendingVideo = useRef<HTMLVideoElement>(null);
  const receivingVideo = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const pendingCandidates = useRef<RTCIceCandidate[]>([]);
  const [matchedUser, setMatchedUser] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

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
      console.log("Track received:", event.track.kind);
      if (receivingVideo.current) {
        if (!receivingVideo.current.srcObject) {
          receivingVideo.current.srcObject = new MediaStream();
          console.log("Created new MediaStream for receiving video");
        }
        const mediaStream = receivingVideo.current.srcObject as MediaStream;
        mediaStream.addTrack(event.track);
        console.log("Track added to receiving MediaStream");
      }
    };
    return peerConnection;
  }

  const handleCall = async () => {
    startVideo();
    if (socket) {
      setIsLoading(true); // Set loading state to true when matchmaking starts
      socket.emit("joinVideoChatRoom", googleUserId);
      // Emit event to server
      const peerConnection = peerConnectionRef.current;
      if (!peerConnection) {
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
    }
  };

  const startVideo = async () => {
    try {
      console.log("Requesting media permissions...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      console.log(
        "Media permissions granted, tracks:",
        stream.getTracks().length
      );

      if (sendingVideo.current) {
        sendingVideo.current.srcObject = stream;
        console.log("Local stream attached to sending video element");
      }

      if (!peerConnectionRef.current) {
        peerConnectionRef.current = handlePeerConnection();
        console.log("Created new PeerConnection");
      }

      stream.getTracks().forEach((track) => {
        peerConnectionRef.current?.addTrack(track, stream);
        console.log(`Added ${track.kind} track to peer connection`);
      });
    } catch (error) {
      console.error("Media access error:", error);
      // Handle specific error types
      if (error instanceof DOMException) {
        if (error.name === "NotAllowedError") {
          console.error("Camera/mic permissions denied");
        } else if (error.name === "NotFoundError") {
          console.error("No camera/mic devices found");
        }
      }
    }
  };

  useEffect(() => {
    if (!socket) return;
    const peerConnection = handlePeerConnection();
    peerConnectionRef.current = peerConnection;

    //listen and handle for incoming ice candidatees

    socket.on("vidoeMatchFound", () => {
      setMatchedUser(true);
      console.log("video match found");
      setIsLoading(false);
    });

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
        {!matchedUser && (
          <div className="flex text-center flex-col items-center space-y-2">
            <h1
              className={
                isLoading ? `hidden` : `text-white text-3xl font-semibold mx-3`
              }
            >
              Meet, Connect and Chat with <br className="hidden md:block" />{" "}
              Random Strangers
            </h1>
            <h6
              className={
                isLoading ? `hidden` : `text-white text-xs font-thin mx-3`
              }
            >
              Experience Spontaneous Conversations with Strangers
            </h6>

            <Button
              onClick={handleCall}
              isLoading={isLoading}

              // Pass isLoading prop
            ></Button>
            {isLoading && (
              <div className="justify-center items-center">
                <Loader />
              </div>
            )}
          </div>
        )}
        {matchedUser && (
          <div className="flex">
            <video
              ref={receivingVideo}
              autoPlay
              playsInline
              className="w-1/2"
            ></video>
            <video
              ref={sendingVideo}
              autoPlay
              playsInline
              className="w-1/2"
            ></video>
          </div>
        )}
      </div>
    </>
  );
};

export default Video;
