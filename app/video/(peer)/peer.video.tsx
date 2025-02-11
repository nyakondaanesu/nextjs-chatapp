"use client";
import useSocket from "@/app/(customHooks)/customHook";
import Button from "@/components/matchButton";
import Loader from "@/components/ui/loader";
import { useEffect, useRef, useState, useCallback } from "react";

// Video Component
const Video = () => {
  const { socket, googleUserId } = useSocket();
  const sendingVideo = useRef<HTMLVideoElement>(null);
  const receivingVideo = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const pendingCandidates = useRef<RTCIceCandidate[]>([]);
  const [matchedUser, setMatchedUser] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  // Setup Peer Connection
  const setupPeerConnection = useCallback(() => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
          ],
        },
        {
          urls: "turn:relay1.expressturn.com:3478",
          username: "efifournier",
          credential: "webrtc",
        },
      ],
      iceTransportPolicy: "all",
      iceCandidatePoolSize: 10,
    });

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("Sending ICE candidate");
        socket?.emit("sendIceCandidate", event.candidate);
      }
    };

    peerConnection.ontrack = (event) => {
      if (receivingVideo.current) {
        receivingVideo.current.srcObject = event.streams[0];
        receivingVideo.current.onloadedmetadata = () => {
          receivingVideo.current
            ?.play()
            .catch((e) => console.log("Remote video play error:", e));
        };
      }
    };

    peerConnection.oniceconnectionstatechange = () => {
      console.log("ICE Connection State:", peerConnection.iceConnectionState);
      if (peerConnection.iceConnectionState === "failed") {
        peerConnection.restartIce();
      }
    };

    return peerConnection;
  }, [socket]);

  // Start local video
  const startVideo = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });

      if (sendingVideo.current) {
        sendingVideo.current.srcObject = stream;
        sendingVideo.current.onloadedmetadata = () => {
          sendingVideo.current
            ?.play()
            .catch((e) => console.log("Local video play error:", e));
        };
      }

      if (!peerConnectionRef.current) {
        peerConnectionRef.current = setupPeerConnection();
      }

      stream.getTracks().forEach((track) => {
        peerConnectionRef.current?.addTrack(track, stream);
      });
    } catch (error) {
      console.error("Failed to start video:", error);
    }
  }, [setupPeerConnection]);

  // Handle call and peer connection logic
  const handleCall = async () => {
    try {
      setIsLoading(true);
      await startVideo(); // Wait for video to start
      socket?.emit("joinVideoChatRoom", googleUserId);

      const peerConnection = peerConnectionRef.current;
      if (!peerConnection) {
        console.error("❌ PeerConnection is NULL!");
        return;
      }

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      socket?.emit("offer", offer);
    } catch (error) {
      console.error("Error in handleCall:", error);
    }
  };

  useEffect(() => {
    if (!socket) return;

    // Initialize peer connection and handle socket events
    const peerConnection = setupPeerConnection();
    peerConnectionRef.current = peerConnection;

    socket.on("videoMatchFound", () => {
      setMatchedUser(true);
      setIsLoading(false);
    });

    peerConnection.oniceconnectionstatechange = () => {
      console.log(
        "ICE Connection State Changed:",
        peerConnection.iceConnectionState
      );
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("Sending ICE candidate:", event.candidate);
        socket?.emit("sendIceCandidate", event.candidate);
      }
    };

    socket.on("iceCandidate", async (candidate) => {
      console.log("Received ICE candidate:", candidate);
      if (peerConnectionRef.current?.remoteDescription) {
        await peerConnectionRef.current.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
      } else {
        pendingCandidates.current.push(candidate);
      }
    });

    socket.on("offer", async (offer) => {
      await startVideo();
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(offer);

        while (pendingCandidates.current.length) {
          const candidate = pendingCandidates.current.shift();
          if (candidate) {
            await peerConnectionRef.current.addIceCandidate(
              new RTCIceCandidate(candidate)
            );
          }
        }

        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        socket.emit("answer", answer);
      }
    });

    socket.on("answer", async (answer) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
      }
    });

    return () => {
      socket.off("icecandidate");
      socket.off("offer");
      socket.off("answer");

      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
    };
  }, [socket, setupPeerConnection, startVideo]);

  return (
    <div className="flex flex-col h-screen items-center justify-center">
      {!matchedUser ? (
        <div className="flex text-center flex-col items-center space-y-2">
          <h1
            className={
              isLoading ? "hidden" : "text-white text-3xl font-semibold mx-3"
            }
          >
            Meet, Connect and Chat with <br className="hidden md:block" />{" "}
            Random Strangers
          </h1>
          <h6
            className={
              isLoading ? "hidden" : "text-white text-xs font-thin mx-3"
            }
          >
            Experience Spontaneous Conversations with Strangers
          </h6>
          <Button onClick={handleCall} isLoading={isLoading} />
          {isLoading && <Loader />}
        </div>
      ) : (
        <div className="flex gap-4 w-full max-w-4xl">
          <video
            ref={receivingVideo}
            autoPlay
            playsInline
            className="w-1/2 bg-black rounded-lg min-h-[300px] object-cover"
          />
          <video
            ref={sendingVideo}
            autoPlay
            playsInline
            muted
            className="w-1/2 bg-black rounded-lg min-h-[300px] object-cover"
          />
        </div>
      )}
    </div>
  );
};

export default Video;
