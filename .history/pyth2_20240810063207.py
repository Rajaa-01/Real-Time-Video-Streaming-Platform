from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Stockage en mémoire pour les vues et les commentaires
views_count = 0
comments = []

# Route pour obtenir le nombre de vues
@app.route('/api/views', methods=['GET'])
def get_views():
    return jsonify({'views': views_count})

# Route pour poster un commentaire
@app.route('/api/comments', methods=['POST'])
def post_comment():
    global comments
    data = request.json
    comments.append(data['comment'])
    return jsonify({'status': 'success', 'comments': comments})

# Route pour servir les fichiers HLS
@app.route('/hls/<path:path>')
def hls(path):
    return send_from_directory('hls', path)

# Route pour simuler une vue (à appeler chaque fois qu'une vue est enregistrée)
@app.route('/api/increment_views', methods=['POST'])
def increment_views():
    global views_count
    views_count += 1
    return jsonify({'status': 'success', 'views': views_count})

if __name__ == '__main__':
    # Assurez-vous que le répertoire 'hls' existe
    if not os.path.exists('hls'):
        os.makedirs('hls')
    app.run(host='0.0.0.0', port=5000)
