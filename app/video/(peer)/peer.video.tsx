"use client";
import useSocket from "@/app/(customHooks)/customHook";
import Button from "@/components/matchButton";
import Loader from "@/components/ui/loader";

import { useEffect, useRef, useState, useCallback } from "react";

// use ref when you want a value to be updated but not re-render the component

const Video = () => {
  const { socket, googleUserId } = useSocket();
  const sendingVideo = useRef<HTMLVideoElement>(null);
  const receivingVideo = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const pendingCandidates = useRef<RTCIceCandidate[]>([]);
  const [matchedUser, setMatchedUser] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePeerConnection = useCallback(() => {
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

    peerConnection.oniceconnectionstatechange = () => {
      console.log("ICE Connection State:", peerConnection.iceConnectionState);
      if (peerConnection.iceConnectionState === "failed") {
        peerConnection.restartIce();
      }
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("Sending ICE candidate");
        socket?.emit("sendIceCandidate", event.candidate);
      }
    };

    peerConnection.ontrack = (event) => {
      console.log("Received remote track:", event.track.kind);
      if (receivingVideo.current) {
        receivingVideo.current.srcObject = event.streams[0];
        receivingVideo.current.onloadedmetadata = () => {
          receivingVideo.current
            ?.play()
            .then(() => console.log("Remote video playing"))
            .catch((e) => console.log("Remote video play error:", e));
        };
      }
    };

    peerConnection.oniceconnectionstatechange = () => {
      console.log("ICE Connection State:", peerConnection.iceConnectionState);
    };

    return peerConnection;
  }, [socket]);

  const handleCall = async () => {
    try {
      await startVideo(); // Wait for video to start
      console.log("Local video initialized before joining room");

      if (socket) {
        setIsLoading(true);
        socket.emit("joinVideoChatRoom", googleUserId);

        const peerConnection = peerConnectionRef.current;
        if (!peerConnection) {
          console.error("❌ PeerConnection is NULL!");
          return;
        }

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socket?.emit("offer", offer);
        console.log("Offer created and sent");
      }
    } catch (error) {
      console.log(`Error in handleCall: ${error}`);
    }
  };

  const startVideo = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: true,
      });

      // Check if stream is active and has tracks
      console.log("Stream active:", stream.active);
      console.log("Video tracks:", stream.getVideoTracks().length);
      console.log("Audio tracks:", stream.getAudioTracks().length);

      if (sendingVideo.current) {
        sendingVideo.current.srcObject = stream;
        sendingVideo.current.onloadedmetadata = () => {
          sendingVideo.current?.play().then(() => {
            console.log(
              "Local video dimensions:",
              sendingVideo.current?.videoWidth,
              sendingVideo.current?.videoHeight
            );
            console.log(
              "Local video playing state:",
              sendingVideo.current?.paused ? "paused" : "playing"
            );
          });
        };
      }

      if (!peerConnectionRef.current) {
        peerConnectionRef.current = handlePeerConnection();
      }

      // Log peer connection state
      peerConnectionRef.current.onconnectionstatechange = () => {
        console.log(
          "Peer Connection State:",
          peerConnectionRef.current?.connectionState
        );
      };

      stream.getTracks().forEach((track) => {
        peerConnectionRef.current?.addTrack(track, stream);
        console.log(`Track ${track.kind} enabled:`, track.enabled);
      });
    } catch (error) {
      console.error("Failed to start video:", error);
    }
  }, [handlePeerConnection]);

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
          <div className="flex gap-4 w-full max-w-4xl">
            <video
              ref={receivingVideo}
              autoPlay
              playsInline
              className="w-1/2 bg-black rounded-lg min-h-[300px] object-cover"
            ></video>
            <video
              ref={sendingVideo}
              autoPlay
              playsInline
              muted // Add muted for local video
              className="w-1/2 bg-black rounded-lg min-h-[300px] object-cover"
            ></video>
          </div>
        )}
      </div>
    </>
  );
};

export default Video;
