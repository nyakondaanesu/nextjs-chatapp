"use client";
import useSocket from "@/app/(customHooks)/customHook";
import Button from "@/components/matchButton";
import Loader from "@/components/ui/loader";
import Image from "next/image";
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
        { urls: ["stun:jb-turn1.xirsys.com"] },
        { urls: "stun:stun1.l.google.com:19302" }, // Google STUN
        { urls: "stun:stun2.l.google.com:19302" },
        {
          username:
            "4RwB0r0tzMQiG_2CaNWUF_CZ9UUWRJI-tmFCPKTy6E7U9DA_bZcKbnq-i0x0LBk2AAAAAGer-RNhbmVzdW55YWtvbmRh",
          credential: "914853f4-e8e0-11ef-b240-0242ac120004",
          urls: [
            "turn:jb-turn1.xirsys.com:80?transport=udp",
            "turn:jb-turn1.xirsys.com:3478?transport=udp",
            "turn:jb-turn1.xirsys.com:80?transport=tcp",
            "turn:jb-turn1.xirsys.com:3478?transport=tcp",
            "turns:jb-turn1.xirsys.com:443?transport=tcp",
            "turns:jb-turn1.xirsys.com:5349?transport=tcp",
          ],
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
      //  console.log("ICE Connection State:", peerConnection.iceConnectionState);
      if (peerConnection.iceConnectionState === "failed") {
        peerConnection.restartIce();
      }
    };

    return peerConnection;
  }, [socket]);

  const startVideo = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });

      if (sendingVideo.current) {
        // console.log("✅ Setting local video stream");
        sendingVideo.current.srcObject = stream;
        sendingVideo.current.onloadedmetadata = () => {
          sendingVideo.current
            ?.play()
            .catch((e) => console.log("Local video play error:", e));
        };
      } else {
        console.error("❌ sendingVideo.current is NULL");
      }

      if (!peerConnectionRef.current) {
        peerConnectionRef.current = setupPeerConnection();
      }

      stream.getTracks().forEach((track) => {
        //console.log("Adding track:", track);
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
      // console.log("📤 Sending offer:", offer);
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
      startVideo();
    });

    peerConnection.oniceconnectionstatechange = () => {
      console.log(
        "ICE Connection State Changed:",
        peerConnection.iceConnectionState
      );
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        //console.log("Sending ICE candidate:", event.candidate);
        socket?.emit("sendIceCandidate", event.candidate);
      }
    };

    socket.on("iceCandidate", async (candidate) => {
      if (peerConnection.remoteDescription) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      } else {
        //console.log("Storing ICE candidate until remote description is set");
        pendingCandidates.current.push(candidate);
      }
    });

    // Apply buffered ICE candidates once the answer is set
    socket.on("answer", async (answer) => {
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(answer)
      );

      // Process all stored ICE candidates
      while (pendingCandidates.current.length) {
        const candidate = pendingCandidates.current.shift();
        if (candidate) {
          await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }
      }
    });

    socket.on("offer", async (offer) => {
      console.log("Received offer");
      await startVideo();

      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(offer);

        // Process any pending candidates now
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
        //console.log("📤 Sending answers:", answer);
      }
    });

    socket.on("leaveVideoChatRoom", (googleUserId) => {
      console.log(`${googleUserId} left the video chat room`);
      window.location.reload();
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

  const onCallEnd = () => {
    window.location.reload();
    socket?.emit("leaveVideoChatRoom", googleUserId);
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center">
      {!matchedUser ? (
        <div className="flex text-center flex-col items-center space-y-2">
          <h1
            className={
              isLoading ? "hidden" : "text-white text-3xl font-semibold mx-3"
            }
          >
            Meet, Connect and{" "}
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 text-transparent bg-clip-text">
              video
            </span>{" "}
            call
            <br className="hidden md:block" /> Random Strangers
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
        <div className="flex flex-col h-dvh w-full items-center justify-center">
          <video
            ref={receivingVideo}
            autoPlay
            playsInline
            className="w-full bg-black rounded-lg h-dvh object-cover"
          />
          <video
            ref={sendingVideo}
            autoPlay
            playsInline
            muted
            className="w-1/4 bg-black rounded-lg min-h-[150px] object-cover fixed top-5 right-5 z-[100] border-2 border-green-500"
          />
          <div className="fixed bottom-5 left-1/2 -translate-x-1/2 flex gap-4 z-[100] bg-zinc-700 rounded-lg p-4">
            <button className="bg-red-700 rounded-full p-2" onClick={onCallEnd}>
              <Image src="/callEnd.png" width={30} height={30} alt="call-end" />
            </button>
            <button className="bg-zinc-300 p-2 rounded-full">
              <Image src="/mute.png" width={30} height={30} alt="mute" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Video;
