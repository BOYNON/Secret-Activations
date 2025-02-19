import json
import os
from flask import Flask, request, jsonify, send_from_directory, abort
from flask_cors import CORS  # Import CORS

app = Flask(__name__)

CORS(app, origins="http://127.0.0.1:5500")  # Allow only this specific frontend URL

# Define file paths
CODES_FILE = "codes.json"
DOWNLOAD_DIR = "downloads"  # Make sure this folder exists and contains your files

def load_codes():
    if not os.path.exists(CODES_FILE):
        return {}
    with open(CODES_FILE, "r") as f:
        return json.load(f)

def save_codes(codes):
    with open(CODES_FILE, "w") as f:
        json.dump(codes, f, indent=4)

@app.route("/validate", methods=["POST"])
def validate_code():
    data = request.get_json()
    code = data.get("code", "").strip()
    app_type = data.get("app", "").strip()

    codes = load_codes()
    if code in codes:
        entry = codes[code]
        if entry.get("used", False):
            return jsonify({"success": False, "message": "Code already used."})
        if entry.get("app") != app_type:
            return jsonify({"success": False, "message": "Code does not match the selected app."})
        
        # Flag the code as used
        codes[code]["used"] = True
        save_codes(codes)
        
        download_link = f"/download/{entry.get('download_link')}"
        return jsonify({"success": True, "download_link": download_link})
    else:
        return jsonify({"success": False, "message": "Invalid activation code."})

@app.route("/download/<filename>")
def download_file(filename):
    try:
        return send_from_directory(DOWNLOAD_DIR, filename, as_attachment=True)
    except Exception:
        abort(404)

if __name__ == '__main__':
  app.run(host="0.0.0.0", port=5000)
