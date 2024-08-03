# data_preparation.py
import cv2
import numpy as np
import os
from sklearn.model_selection import train_test_split

def load_and_preprocess_image(image_path, target_size=(224, 224)):
    img = cv2.imread(image_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, target_size)
    img = img / 255.0
    return img

def create_dataset(data_dir, target_size=(224, 224)):
    images = []
    labels = []
    for filename in os.listdir(data_dir):
        if filename.endswith((".jpg", ".png", ".jpeg")):
            img_path = os.path.join(data_dir, filename)
            img = load_and_preprocess_image(img_path, target_size)
            images.append(img)
            # Assume the label (number of sheets) is in the filename
            label = int(filename.split('_')[0])
            labels.append(label)
    return np.array(images), np.array(labels)

def prepare_data(data_dir, test_size=0.2):
    X, y = create_dataset(data_dir)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size, random_state=42)
    return X_train, X_test, y_train, y_test