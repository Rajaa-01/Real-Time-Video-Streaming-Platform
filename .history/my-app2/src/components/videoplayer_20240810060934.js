// src/components/VideoPlayer.js
import React, { useRef, useState, useEffect } from 'react';
import Hls from 'hls.js';
import axios from 'axios';

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [views, setViews] = useState(0);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [downloadLink, setDownloadLink] = useState('');

  useEffect(() => {
    const video = videoRef.current;
    let hls;

    const notifyServer = () => {
      axios.post('http://localhost:5000/view', { video: 'output.m3u8' })
        .then(response => console.log(response.data))
        .catch(error => console.error('Error:', error));
    };

    const fetchViews = () => {
      axios.get('http://localhost:5000/stats')
        .then(response => setViews(response.data.total_views))
        .catch(error => console.error('Error fetching views:', error));
    };

    const fetchComments = () => {
      axios.get('http://localhost:5000/comments')
        .then(response => setComments(response.data.comments))
        .catch(error => console.error('Error fetching comments:', error));
    };

    const handleCommentSubmit = () => {
      axios.post('http://localhost:5000/comments', { comment })
        .then(response => {
          setComments(response.data.comments);
          setComment('');
        })
        .catch(error => console.error('Error adding comment:', error));
    };

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource('http://localhost:5000/hls/output.m3u8');
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
        setIsPlaying(true);
        notifyServer();
        fetchViews();
        fetchComments();
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
        notifyServer();
        fetchViews();
        fetchComments();
      });

      video.addEventListener('ended', () => {
        video.play(); // Rejoue la vidéo lorsque la lecture se termine
      });
    }

    // Fetch download link for video
    setDownloadLink('http://localhost:5000/download');

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <div style={{ marginTop: '10px' }}>
        <h3>Total Views: {views}</h3>
      </div>
      <div style={{ marginTop: '20px' }}>
        <h3>Comments:</h3>
        <ul>
          {comments.map((c, index) => (
            <li key={index}>{c}</li>
          ))}
        </ul>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Leave a comment"
          rows="4"
          cols="50"
          style={{ marginTop: '10px' }}
        />
        <button
          // eslint-disable-next-line no-undef
          onClick={handleCommentSubmit}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            border: 'none',
            borderRadius: '5px',
            backgroundColor: '#00f',
            color: '#fff',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Submit Comment
        </button>
      </div>
      <div style={{ marginTop: '20px' }}>
        <a
          href={downloadLink}
          download
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            border: 'none',
            borderRadius: '5px',
            backgroundColor: '#f90',
            color: '#fff',
            cursor: 'pointer',
            textDecoration: 'none'
          }}
        >
          Download Video
        </a>
      </div>
    </div>
  );
};

export default VideoPlayer;
