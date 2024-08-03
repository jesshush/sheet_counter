# app.py
from flask import Flask, request, jsonify
import tensorflow as tf
import cv2
import numpy as np
from predict import predict_sheets, process_video

app = Flask(__name__)

# Load the trained model
model = tf.keras.models.load_model('sheet_counter_model.h5')

@app.route('/predict_image', methods=['POST'])
def predict_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})
    
    if file:
        # Read and preprocess the image
        in_memory_file = file.read()
        nparr = np.frombuffer(in_memory_file, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        img = cv2.resize(img, (224, 224))
        img = img / 255.0
        img = np.expand_dims(img, axis=0)
        
        # Make prediction
        prediction = model.predict(img)
        sheet_count = int(round(prediction[0][0]))
        
        return jsonify({'sheet_count': sheet_count})

@app.route('/process_video', methods=['POST'])
def process_video_route():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})
    
    if file:
        # Save the video file temporarily
        temp_path = 'temp_video.mp4'
        file.save(temp_path)
        
        # Process the video
        total_sheets = process_video(model, temp_path)
        
        # Remove the temporary file
        import os
        os.remove(temp_path)
        
        return jsonify({'total_sheets': total_sheets})

if __name__ == '__main__':
    app.run(debug=True)