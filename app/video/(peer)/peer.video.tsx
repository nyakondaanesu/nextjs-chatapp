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
      console.log("ICE Connection State:", peerConnection.iceConnectionState);
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
        console.log("✅ Setting local video stream");
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
        console.log("Adding track:", track);
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
      console.log("📤 Sending offer:", offer);
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
        console.log("Sending ICE candidate:", event.candidate);
        socket?.emit("sendIceCandidate", event.candidate);
      }
    };

    socket.on("iceCandidate", async (candidate) => {
      if (peerConnection.remoteDescription) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      } else {
        console.log("Storing ICE candidate until remote description is set");
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
        console.log("📤 Sending answers:", answer);
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
        <div className="flex gap-4 w-full max-w-6xl">
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
            className="w-1/4 bg-black rounded-lg min-h-[150px] object-cover fixed top-5 right  z-[100]"
          />
          <div className="flex fixed z-[100] bottom-5">
            <button className="bg-red-700 rounded-full">
              <svg
                fill="none"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white fill-current"
              >
                <path
                  d="m21.949 12.993-.198 1.037c-.184.971-1.092 1.623-2.12 1.524l-2.047-.198c-.891-.086-1.651-.72-1.878-1.566l-.631-2.355c-.935-.383-1.965-.558-3.09-.526a8.102 8.102 0 0 0-3.14.708l-.392 2.205c-.148.836-.837 1.459-1.71 1.547l-2.035.204c-1.016.102-1.989-.544-2.277-1.51l-.31-1.038c-.308-1.031-.033-2.117.721-2.85 1.781-1.73 4.75-2.598 8.907-2.604 4.164-.005 7.225.857 9.185 2.588.825.728 1.21 1.806 1.015 2.834Z"
                  fill="#ffffff"
                  className="fill-212121"
                ></path>
              </svg>
            </button>
            <button>
              <svg
                data-name="Layer 1"
                id="Layer_1"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white fill-current"
              >
                <title />
                <path d="M24,33a8,8,0,0,0,8-8V18.83l8.41-8.41a2,2,0,0,0-2.83-2.83L32,13.17V9A8,8,0,0,0,16,9V25a7.94,7.94,0,0,0,.77,3.4l-1.49,1.49A9.93,9.93,0,0,1,14,25a2,2,0,0,0-4,0,13.92,13.92,0,0,0,2.38,7.79L7.59,37.59a2,2,0,1,0,2.83,2.83l4.65-4.65A13.94,13.94,0,0,0,22,38.84V43H21a2,2,0,0,0,0,4h6a2,2,0,0,0,0-4H26V38.84A14,14,0,0,0,38,25a2,2,0,0,0-4,0,10,10,0,0,1-16.09,7.92l1.43-1.43A8,8,0,0,0,24,33Zm4-8a4,4,0,0,1-4,4,4,4,0,0,1-1.75-.42L28,22.83Zm-8,0V9a4,4,0,0,1,8,0v8.17l-8,8C20,25.1,20,25.05,20,25Z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Video;
