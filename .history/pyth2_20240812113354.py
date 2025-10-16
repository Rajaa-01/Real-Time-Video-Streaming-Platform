from flask import Flask, send_from_directory
from flask_cors import CORS
import subprocess
import os
from threading import Thread

app = Flask(__name__)
CORS(app)  # Permet de gérer les requêtes CORS

@app.route('/hls/<path:path>')
def hls(path):
    return send_from_directory('hls', path)

def start_streaming():
    command = [
        'ffmpeg',
        '-i', 'C:/Users/mrabe/OneDrive/Bureau/Appreact/video.mp4',  # Remplacez par le chemin de votre vidéo source
        '-c:v', 'libx264',
        '-c:a', 'aac',
        '-strict', 'experimental',
        '-f', 'hls',
        '-hls_time', '10',
        '-hls_list_size', '0',
        '-hls_segment_filename', 'hls/output%03d.ts',
        'hls/output.m3u8'
    ]
    subprocess.call(command)

if __name__ == '__main__':
    if not os.path.exists('hls'):
        os.makedirs('hls')
    
    streaming_thread = Thread(target=start_streaming)
    streaming_thread.start()
    
    app.run(host='0.0.0.0', port=5000)
