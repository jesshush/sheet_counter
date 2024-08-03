# predict.py
import tensorflow as tf
import cv2
import numpy as np

def load_model(model_path):
    return tf.keras.models.load_model(model_path)

def preprocess_image(image_path, target_size=(224, 224)):
    img = cv2.imread(image_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, target_size)
    img = img / 255.0
    return np.expand_dims(img, axis=0)

def predict_sheets(model, image_path):
    preprocessed_image = preprocess_image(image_path)
    prediction = model.predict(preprocessed_image)
    return int(round(prediction[0][0]))

def process_video(model, video_path):
    cap = cv2.VideoCapture(video_path)
    frame_count = 0
    total_sheets = 0
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        
        frame_count += 1
        if frame_count % 30 == 0:  # Process every 30th frame
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            frame_resized = cv2.resize(frame_rgb, (224, 224))
            frame_normalized = frame_resized / 255.0
            frame_expanded = np.expand_dims(frame_normalized, axis=0)
            
            prediction = model.predict(frame_expanded)
            sheets_in_frame = int(round(prediction[0][0]))
            total_sheets += sheets_in_frame
            
            print(f"Frame {frame_count}: {sheets_in_frame} sheets")
    
    cap.release()
    return total_sheets

if __name__ == "__main__":
    model = load_model('sheet_counter_model.h5')
    
    # Predict sheets in an image
    image_path = 'path/to/test/image.jpg'
    sheet_count = predict_sheets(model, image_path)
    print(f"Estimated number of sheets in image: {sheet_count}")
    
    # Process video
    video_path = 'path/to/test/video.mp4'
    total_sheets = process_video(model, video_path)
    print(f"Total sheets counted in video: {total_sheets}")