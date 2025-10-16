import React, { useRef, useState, useEffect } from "react";
import Hls from "hls.js";

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const sendTrackingData = (event) => {
    fetch("http://localhost:5000/track-view", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: "unique_user_id", // Remplacez par un identifiant d'utilisateur réel
        video_id: "video_id", // Remplacez par un identifiant de vidéo réel
        event: event,
      }),
    });
  };

  useEffect(() => {
    const video = videoRef.current;
    let hls;

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource("http://localhost:5000/hls/output.m3u8");
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
        setIsPlaying(true);
        sendTrackingData("start");
      });

      // Gestion de la boucle
      video.addEventListener("ended", () => {
        video.play(); // Rejoue la vidéo lorsque la lecture se termine
        sendTrackingData("end");
      });

      return () => {
        if (hls) {
          hls.destroy();
        }
      };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = "http://localhost:5000/hls/output.m3u8";
      video.addEventListener("canplay", () => {
        video.play();
        setIsPlaying(true);
        sendTrackingData("start");
      });

      // Gestion de la boucle
      video.addEventListener("ended", () => {
        video.play(); // Rejoue la vidéo lorsque la lecture se termine
        sendTrackingData("end");
      });
    }
  }, []);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
      sendTrackingData("start");
    } else {
      video.pause();
      setIsPlaying(false);
      sendTrackingData("end");
    }
  };

  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      <video
        ref={videoRef}
        controls
        width="600"
        style={{ border: "1px solid #ccc", borderRadius: "8px" }}
      ></video>
      <div style={{ marginTop: "10px" }}>
        <button
          onClick={togglePlayPause}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            border: "none",
            borderRadius: "5px",
            backgroundColor: isPlaying ? "#f00" : "#0f0",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;
