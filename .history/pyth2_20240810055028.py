# server.py
from flask import Flask, send_from_directory, request
from flask_cors import CORS
import threading
import subprocess
import os
import time

app = Flask(__name__)
CORS(app)

view_count = 0  # Compteur pour suivre les vues

@app.route('/hls/<path:path>')
def hls(path):
    global view_count
    view_count += 1
    print(f"Video viewed. Total views: {view_count}")
    return send_from_directory('hls', path)

def start_streaming():
    if not os.path.exists('hls'):
        os.makedirs('hls')
    
    command = [
        'ffmpeg',
        '-i', 'C:/Users/mrabe/OneDrive/Bureau/Appreact2/video.mp4',  # Remplacez par le chemin de votre vidéo source
        '-c:v', 'libx264',
        '-c:a', 'aac',
        '-strict', 'experimental',
        '-f', 'hls',
        '-hls_time', '10',
        '-hls_list_size', '0',
        '-hls_segment_filename', 'hls/output%03d.ts',
        'hls/output.m3u8'
    ]
    
    while True:
        subprocess.call(command)
        time.sleep(5)  # Redémarre le streaming toutes les 5 secondes pour tester

if __name__ == '__main__':
    streaming_thread = threading.Thread(target=start_streaming)
    streaming_thread.start()
    app.run(host='0.0.0.0', port=5000)
