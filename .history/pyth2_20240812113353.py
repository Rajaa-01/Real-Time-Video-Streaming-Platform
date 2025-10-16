import subprocess
from threading import Thread
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def start_streaming():
    command = [
        'ffmpeg',
        '-re',  # Lire en temps réel
        '-i', 'C:/Users/mrabe/OneDrive/Bureau/Appreact/video.mp4',  # Chemin de votre vidéo
        '-c:v', 'libx264',
        '-c:a', 'aac',
        '-f', 'flv',  # Format pour RTMP
        'rtmp://<votre_ip_nginx>/live/stream'  # Remplacez <votre_ip_nginx> par l'IP de votre serveur NGINX
    ]
    subprocess.call(command)

if __name__ == '__main__':
    streaming_thread = Thread(target=start_streaming)
    streaming_thread.start()

    app.run(host='0.0.0.0', port=5000)
