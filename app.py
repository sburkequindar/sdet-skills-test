from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/submit-name', methods=['POST'])
def submit_name():
    # Get the JSON data from the request
    data = request.get_json()
    
    # Check if 'name' is provided in the payload
    if not data or 'name' not in data:
        return jsonify({"error": "Name is required"}), 400
    
    if data["name"] == "Waldo":
        return jsonify({"error": "You aren't Waldo - a real Waldo wouldn't reveal their identity!"}), 403


    name = data['name']
    
    # Simple response message
    return jsonify({"message": f"Name submitted successfully: {name}"}), 200

if __name__ == '__main__':
    # Run the Flask app locally on port 5000
    app.run(debug=True, host='127.0.0.1', port=5000)
