from flask import Flask, request, jsonify, render_template
import cv2
import numpy as np
from scipy.signal import find_peaks, savgol_filter
import io
from PIL import Image

app = Flask(__name__)

def count_cardboard_sheets(image):
    # Convert to grayscale and resize for faster processing
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = cv2.resize(gray, (800, int(800 * gray.shape[0] / gray.shape[1])))
    
    # Apply adaptive thresholding to handle varying lighting conditions
    thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
    
    # Apply morphological operations to enhance edges
    kernel = np.ones((3,3), np.uint8)
    morph = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
    
    # Edge detection
    edges = cv2.Canny(morph, 50, 150)
    
    # Crop the region of interest
    height, width = edges.shape
    roi = edges[int(height*0.1):int(height*0.9), int(width*0.3):int(width*0.7)]
    
    # Calculate vertical intensity profile
    intensity_profile = np.sum(roi, axis=1)
    
    # Apply Savitzky-Golay filter for smoothing
    smoothed_profile = savgol_filter(intensity_profile, 15, 3)
    
    # Normalize the profile
    normalized_profile = (smoothed_profile - np.min(smoothed_profile)) / (np.max(smoothed_profile) - np.min(smoothed_profile))
    
    # Find peaks with optimized parameters
    peaks, _ = find_peaks(normalized_profile, height=0.2, distance=10, prominence=0.1)
    
    return len(peaks)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict-sheets', methods=['POST'])
def predict_sheets():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})
    if file:
        # Read the image file using PIL for faster processing
        image = Image.open(io.BytesIO(file.read()))
        image = np.array(image)
        
        # Count sheets
        sheet_count = count_cardboard_sheets(image)
        
        return jsonify({'prediction': sheet_count})

@app.route('/process-video', methods=['POST'])
def process_video():
    # Placeholder for video processing
    return jsonify({'result': 'Video processing not implemented yet'})

if __name__ == '__main__':
    app.run(debug=True, threaded=True)