import React, { useRef, useState, useEffect } from 'react';
import Hls from 'hls.js';
import axios from 'axios'; // Assurez-vous que axios est installé

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [comment, setComment] = useState('');
  const [views, setViews] = useState(0); // État pour le nombre de vues

  useEffect(() => {
    const video = videoRef.current;
    let hls;

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource('http://localhost:5000/hls/output.m3u8');
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
        setIsPlaying(true);
      });

      // Gestion de la boucle
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
      });

      // Gestion de la boucle
      video.addEventListener('ended', () => {
        video.play(); // Rejoue la vidéo lorsque la lecture se termine
      });
    }

    // Fonction pour obtenir le nombre de vues
    const fetchViews = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/views'); // Remplacez par votre API pour obtenir le nombre de vues
        setViews(response.data.views);
      } catch (error) {
        console.error('Error fetching views:', error);
      }
    };

    fetchViews(); // Appel initial pour obtenir les vues

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

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/comments', { comment }); // Remplacez par votre API pour poster des commentaires
      setComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
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
      <div style={{ marginTop: '20px' }}>
        <h3>Commentaires</h3>
        <form onSubmit={handleCommentSubmit}>
          <textarea
            value={comment}
            onChange={handleCommentChange}
            placeholder="Écrire un commentaire"
            rows="4"
            cols="50"
          ></textarea>
          <button type="submit">Envoyer</button>
        </form>
      </div>
      <div style={{ marginTop: '20px' }}>
        <h3>Nombre de vues : {views}</h3>
        <a href="http://localhost:5000/hls/output.m3u8" download="video.m3u8">
          Télécharger la vidéo
        </a>
      </div>
    </div>
  );
};

export default VideoPlayer;
