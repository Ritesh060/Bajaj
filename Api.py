from flask import Flask, request, jsonify
from flask_cors import CORS
import base64

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes to allow requests from the frontend

# Utility function to validate and process file data from base64
def validate_file(file_b64):
    if not file_b64:
        return False, None, 0
    try:
        file_data = base64.b64decode(file_b64)
        file_size_kb = len(file_data) / 1024
        # Dummy MIME type detection for demonstration; adjust as needed
        file_mime_type = "application/octet-stream"
        return True, file_mime_type, file_size_kb
    except Exception as e:
        print(f"File validation error: {e}")
        return False, None, 0

# POST method endpoint to process incoming JSON data
@app.route('/bfhl', methods=['POST'])
def handle_post():
    try:
        # Parse the incoming JSON data
        data = request.json.get("data", [])
        file_b64 = request.json.get("file_b64", "")
        
        # Sample user data; modify this according to your actual input
        user_id = "john_doe_17091999"
        email = "john@xyz.com"
        roll_number = "ABCD123"

        # Extract numbers and alphabets from the input data array
        numbers = [item for item in data if item.isdigit()]
        alphabets = [item for item in data if item.isalpha()]
        highest_lowercase = [max([char for char in alphabets if char.islower()], default="")]

        # Validate the file if present
        file_valid, file_mime_type, file_size_kb = validate_file(file_b64)

        # Create the response object
        response = {
            "is_success": True,
            "user_id": user_id,
            "email": email,
            "roll_number": roll_number,
            "numbers": numbers,
            "alphabets": alphabets,
            "highest_lowercase_alphabet": highest_lowercase,
            "file_valid": file_valid,
            "file_mime_type": file_mime_type,
            "file_size_kb": file_size_kb
        }

        return jsonify(response), 200

    except Exception as e:
        # Log the error and return a failure response
        print(f"Error processing request: {e}")
        return jsonify({"is_success": False, "error": str(e)}), 400

# GET method endpoint to return operation code
@app.route('/bfhl', methods=['GET'])
def handle_get():
    # Return a hardcoded response with the operation code as per requirements
    return jsonify({"operation_code": 1}), 200

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
