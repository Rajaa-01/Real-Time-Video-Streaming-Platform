import React, { useRef, useState, useEffect } from "react";
import Hls from "hls.js";
import axios from "axios";
import 'C:/Users/mrabe/OneDrive/Bureau/Appreact2\my-app2\src\App.css'; // Assurez-vous que le fichier CSS est à cet emplacement

const App = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [views, setViews] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

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
        // Envoyer une requête pour incrémenter les vues
        axios.post("http://localhost:5000/api/increment_views");
      });

      video.addEventListener("ended", () => {
        video.play(); // Rejoue la vidéo lorsque la lecture se termine
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
        // Envoyer une requête pour incrémenter les vues
        axios.post("http://localhost:5000/api/increment_views");
      });

      video.addEventListener("ended", () => {
        video.play(); // Rejoue la vidéo lorsque la lecture se termine
      });
    }
  }, []);

  useEffect(() => {
    // Obtenir le nombre de vues
    axios.get("http://localhost:5000/api/views").then(response => {
      setViews(response.data.views);
    });

    // Obtenir les commentaires
    axios.get("http://localhost:5000/api/comments").then(response => {
      setComments(response.data.comments);
    });
  }, [comments]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
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
      axios.post("http://localhost:5000/api/comments", { comment: newComment }).then(response => {
        setComments(response.data.comments);
        setNewComment("");
      });
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
            borderRadius: "50%",
            backgroundColor: isPlaying ? "#f00" : "#0f0",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>
      <div style={{ marginTop: "20px" }}>
        <h2>Commentaires</h2>
        <input
          type="text"
          value={newComment}
          onChange={handleCommentChange}
          placeholder="Ajouter un commentaire"
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
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
            <div key={index} style={{ marginBottom: "10px", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
              {comment}
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: "20px" }}>
        <h2>Nombre de vues: {views}</h2>
      </div>
    </div>
  );
};

export default App;
