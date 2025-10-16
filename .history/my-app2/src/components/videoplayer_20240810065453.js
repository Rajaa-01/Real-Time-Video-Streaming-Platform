import React, { useRef, useState, useEffect } from "react";
import Hls from "hls.js";
import axios from "axios";
import 'C:\Users\mrabe\OneDrive\Bureau\Appreact2\my-app2\src\App.js'; // Assurez-vous que le fichier CSS est à cet emplacement

const App = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [views, setViews] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    let hls;

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource("http://localhost:5000/hls/output.m3u8");
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsVideoLoaded(true); // Indiquer que la vidéo est chargée
      });

      video.addEventListener("ended", () => {
        video.play();
      });

      return () => {
        if (hls) {
          hls.destroy();
        }
      };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = "http://localhost:5000/hls/output.m3u8";
      video.addEventListener("canplay", () => {
        setIsVideoLoaded(true); // Indiquer que la vidéo est chargée
      });

      video.addEventListener("ended", () => {
        video.play();
      });
    }
  }, []);

  useEffect(() => {
    axios.get("http://localhost:5000/api/views")
      .then(response => setViews(response.data.views))
      .catch(error => console.error('Error fetching views:', error));

    axios.get("http://localhost:5000/api/comments")
      .then(response => setComments(response.data.comments))
      .catch(error => console.error('Error fetching comments:', error));
  }, [comments]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play().catch(error => {
        console.error('Error playing video:', error);
      });
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      axios.post("http://localhost:5000/api/comments", { comment: newComment })
        .then(response => {
          setComments(response.data.comments);
          setNewComment("");
        })
        .catch(error => console.error('Error posting comment:', error));
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", margin: "20px" }}>
      <div style={{ position: "relative", width: "600px" }}>
        <video
          ref={videoRef}
          controls
          width="100%"
          style={{ border: "1px solid #ccc", borderRadius: "8px" }}
        ></video>
        {!isPlaying && isVideoLoaded && (
          <button
            onClick={togglePlayPause}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              padding: "10px 20px",
              fontSize: "16px",
              border: "none",
              borderRadius: "50%",
              backgroundColor: isPlaying ? "#f00" : "#0f0",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
        )}
      </div>
      <div style={{ width: "100%", marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
        <div style={{ width: "60%", textAlign: "left" }}>
          <h2>Commentaires</h2>
          <input
            type="text"
            value={newComment}
            onChange={handleCommentChange}
            placeholder="Ajouter un commentaire"
            style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", width: "calc(100% - 120px)" }}
          />
          <button
            onClick={handleCommentSubmit}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              border: "none",
              borderRadius: "5px",
              backgroundColor: "#007bff",
              color: "#fff",
              cursor: "pointer",
              marginLeft: "10px",
            }}
          >
            Ajouter
          </button>
          <div style={{ marginTop: "10px" }}>
            {comments.map((comment, index) => (
              <div key={index} style={{ marginBottom: "10px", padding: "10px", border: "1px solid #ccc", borderRadius: "5px", maxWidth: "100%", wordWrap: "break-word" }}>
                {comment}
              </div>
            ))}
          </div>
        </div>
        <div style={{ width: "30%", textAlign: "right" }}>
          <h2>Nombre de vues</h2>
          <div style={{ fontSize: "24px", fontWeight: "bold" }}>{views}</div>
        </div>
      </div>
    </div>
  );
};

export default App;
