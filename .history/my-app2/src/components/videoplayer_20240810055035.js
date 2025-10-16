// src/VideoPlayer.js
import React, { useRef, useState, useEffect } from 'react';
import Hls from 'hls.js';
import axios from 'axios';  // Ajoutez axios pour les requêtes HTTP

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    let hls;

    const notifyServer = () => {
      axios.post('http://localhost:5000/view', { video: 'output.m3u8' })
        .then(response => console.log(response.data))
        .catch(error => console.error('Error:', error));
    };

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource('http://localhost:5000/hls/output.m3u8');
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
        setIsPlaying(true);
        notifyServer();  // Notifie le serveur lorsque la vidéo commence à jouer
      });

      video.addEventListener('ended', () => {
        video.play(); // Rejoue la vidéo lorsque la lecture se termine
      });

      return () => {
        if (hls) {
          hls.destroy();
        }
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = 'http://localhost:5000/hls/output.m3u8';
      video.addEventListener('canplay', () => {
        video.play();
        setIsPlaying(true);
        notifyServer();  // Notifie le serveur lorsque la vidéo commence à jouer
      });

      video.addEventListener('ended', () => {
        video.play(); // Rejoue la vidéo lorsque la lecture se termine
      });
    }
  }, []);

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

  return (
    <div style={{ textAlign: 'center', margin: '20px' }}>
      <video
        ref={videoRef}
        controls
        width="600"
        style={{ border: '1px solid #ccc', borderRadius: '8px' }}
      ></video>
      <div style={{ marginTop: '10px' }}>
        <button
          onClick={togglePlayPause}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            border: 'none',
            borderRadius: '5px',
            backgroundColor: isPlaying ? '#f00' : '#0f0',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;
