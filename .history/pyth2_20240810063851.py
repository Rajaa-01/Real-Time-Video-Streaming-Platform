# app.py
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import threading
import subprocess

app = Flask(__name__)
CORS(app)

views_count = 0
comments = []

@app.route('/hls/<path:path>')
def hls(path):
    return send_from_directory('hls', path)

@app.route('/view', methods=['POST'])
def view():
    global views_count
    data = request.json
    if data and 'video' in data:
        views_count += 1
        return jsonify({'message': 'View counted', 'total_views': views_count}), 200
    return jsonify({'message': 'Invalid request'}), 400

@app.route('/stats', methods=['GET'])
def stats():
    return jsonify({'total_views': views_count})

@app.route('/comments', methods=['GET'])
def get_comments():
    return jsonify({'comments': comments})

@app.route('/comments', methods=['POST'])
def add_comment():
    data = request.json
    if data and 'comment' in data:
        comments.append(data['comment'])
        return jsonify({'message': 'Comment added', 'comments': comments}), 200
    return jsonify({'message': 'Invalid request'}), 400

@app.route('/download', methods=['GET'])
def download():
    return send_from_directory('hls', 'output.m3u8', as_attachment=True)

def start_streaming():
    command = [
        'ffmpeg',
        '-i', 'C:Users\mrabe\OneDrive\Bureau\Appreact2\video.mp4',
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
