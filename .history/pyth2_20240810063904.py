from flask import Flask, send_from_directory, request, jsonify
from flask_cors import CORS
import threading
import subprocess

app = Flask(__name__)
CORS(app)  # Permet de gérer les requêtes CORS

@app.route('/hls/<path:path>')
def hls(path):
    return send_from_directory('hls', path)

@app.route('/track-view', methods=['POST'])
def track_view():
    data = request.json
    user_id = data.get('user_id')
    video_id = data.get('video_id')
    event_type = data.get('event')  # 'start' ou 'end'
    
    # Enregistrez les données dans une base de données ou un fichier
    print(f"User: {user_id}, Video: {video_id}, Event: {event_type}")
    
    return jsonify({"status": "success"}), 200

def start_streaming():
    command = [
        'ffmpeg',
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
    streaming_thread = threading.Thread(target=start_streaming)
    streaming_thread.start()
    app.run(host='0.0.0.0', port=5000)
