# 🎥 Real-Time Video Streaming Platform

A comprehensive, secure, and high-performance real-time video streaming solution developed during an internship at **Maghreb Arabe Presse (MAP)**. This project integrates video capture, compression, segmentation, encryption, and adaptive streaming with network monitoring capabilities.

---

## 🚀 Features

- **Real-Time Video Streaming**: Low-latency live streaming using RTMP and adaptive HTTP-based protocols (HLS).
- **Video Compression**: Advanced compression using H.264/H.265 codecs for optimal quality and bandwidth usage.
- **Segmentation**: Dynamic video segmentation for smooth adaptive streaming (HLS/DASH).
- **Encryption**: AES-256 encryption for secure video transmission.
- **Network Monitoring**: Real-time traffic analysis using Wireshark for performance optimization.
- **Dual Interface**:
  - **Python Backend**: Built with PyQt5 for video processing, compression, segmentation, and encryption.
  - **React Frontend**: Interactive web interface for video playback, comments, and view tracking.
- **Multi-Protocol Support**: RTMP for low-latency streaming, HLS for broad compatibility.

---

## 🛠️ Tech Stack

### Backend
- **Python** (Flask, PyQt5, OpenCV, MoviePy, PyCrypto)
- **FFmpeg** (video processing, compression, streaming)
- **Nginx + RTMP Module** (stream server)
- **VLC** (stream validation and playback)

### Frontend
- **React** (Hooks, Hls.js, Axios)
- **HLS.js** (HTTP Live Streaming in the browser)

### Tools & Protocols
- **OBS Studio** (video capture and encoding)
- **Wireshark** (network analysis)
- **RTMP**, **HLS**, **AES Encryption**

---






---

## 🧩 Modules Overview

1. **Capture & Encoding** – OBS Studio for live capture and encoding.
2. **Compression** – FFmpeg with H.264/H.265.
3. **Segmentation** – MoviePy for segmenting videos into chunks.
4. **Encryption** – AES-256 via PyCrypto.
5. **Streaming** – Nginx + RTMP for ingestion, HLS for delivery.
6. **Monitoring** – Wireshark for network and performance analysis.
7. **Frontend** – React-based player with real-time interaction.

---

## 🧪 Performance Comparison

| Metric          | VLC Player         | React Frontend     |
|------------------|--------------------|--------------------|
| Load Time        | ⭐⭐⭐⭐⭐         | ⭐⭐⭐⭐           |
| Playback Smoothness| ⭐⭐⭐⭐⭐         | ⭐⭐⭐             |
| Video Quality    | ⭐⭐⭐⭐⭐         | ⭐⭐⭐⭐           |
| Latency          | ⭐⭐⭐⭐⭐         | ⭐⭐⭐             |
| Resource Usage   | ⭐⭐⭐⭐⭐         | ⭐⭐⭐             |

> VLC offers superior performance for pure streaming, while React provides better integration for web applications.

---


## 📊 Performance Monitoring

- **Network Metrics**: Bandwidth, latency, packet size  
- **Stream Quality**: Frame rate, resolution, buffering events  
- **Traffic Analysis**: Detection of anomalies, optimization strategies  

## 📦 Installation & Setup

### Backend (Python)

```bash
git clone https://github.com/your-username/streaming-platform.git
cd streaming-platform/backend

pip install -r requirements.txt

# Start Flask server
python app.py
```
### Frontend (React)
```bash
cd ../frontend
npm install
npm start
```

### Nginx + RTMP Setup
Refer to the (nginx.conf) and (rtmp.conf) files in the (config/) directory.


### 🎬 Usage
1. Start OBS and set stream output to rtmp://your-server/live

2. Run the Python backend to process and serve HLS streams.

3. Access the React frontend to view the live stream and interact with comments and views.

4. Use VLC to validate streams via rtmp:// or http:// URLs.
 ### 📊 Network Monitoring
* Use the included Wireshark configuration to monitor:

* Bandwidth usage

* Packet loss

* Latency and jitter

* RTMP/HLS protocol performance

### 🔐 Security
-> Video segments are encrypted with AES-256.

-> Secure key exchange for decryption.

-> RTMP streams can be secured with SSL/TLS.

### 📜 License
This project is for educational and professional demonstration purposes.