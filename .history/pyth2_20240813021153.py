from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import subprocess
import os
from threading import Thread

app = Flask(__name__)
CORS(app)

# Variable globale pour les vues et les commentaires
views = 0
comments = []

@app.route('/hls/<path:path>')
def hls(path):
    return send_from_directory('hls', path)

@app.route('/api/increment_views', methods=['POST'])
def increment_views():
    global views
    views += 1
    return jsonify({'views': views})

@app.route('/api/views', methods=['GET'])
def get_views():
    return jsonify({'views': views})

@app.route('/api/comments', methods=['GET'])
def get_comments():
    return jsonify({'comments': comments})

@app.route('/api/comments', methods=['POST'])
def post_comment():
    global comments
    data = request.json
    comment = data.get('comment')
    if comment:
        comments.append(comment)
    return jsonify({'comments': comments})

def start_streaming():
    command = [
        'ffmpeg',
        '-i', 'C:/Users/mrabe/OneDrive/Bureau/Appreact/video.mp4',
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
