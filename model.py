# model.py
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
from tensorflow.keras.models import Model

def create_model(input_shape=(224, 224, 3)):
    base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=input_shape)
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(1024, activation='relu')(x)
    output = Dense(1)(x)  # regression output
    model = Model(inputs=base_model.input, outputs=output)
    
    # Freeze the base model layers
    for layer in base_model.layers:
        layer.trainable = False
    
    return model