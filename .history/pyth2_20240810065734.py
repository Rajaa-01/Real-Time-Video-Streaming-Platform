from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Permet toutes les origines

views_count = 0
comments = []

@app.route('/api/views', methods=['GET'])
def get_views():
    return jsonify({'views': views_count})

@app.route('/api/comments', methods=['GET'])
def get_comments():
    return jsonify({'comments': comments})

@app.route('/api/comments', methods=['POST'])
def post_comment():
    global comments
    data = request.json
    comments.append(data['comment'])
    return jsonify({'status': 'success', 'comments': comments})

@app.route('/hls/<path:path>')
def hls(path):
    return send_from_directory('hls', path)

@app.route('/api/increment_views', methods=['POST'])
def increment_views():
    global views_count
    views_count += 1
    return jsonify({'status': 'success', 'views': views_count})

if __name__ == '__main__':
    if not os.path.exists('hls'):
        os.makedirs('hls')
    app.run(host='0.0.0.0', port=5000)
