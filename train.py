# train.py
import tensorflow as tf
from data_preparation import prepare_data
from model import create_model

# Configure GPU memory growth
gpus = tf.config.experimental.list_physical_devices('GPU')
if gpus:
    try:
        for gpu in gpus:
            tf.config.experimental.set_memory_growth(gpu, True)
    except RuntimeError as e:
        print(e)

# Hyperparameters
BATCH_SIZE = 32
EPOCHS = 50
LEARNING_RATE = 0.001

def train_model(data_dir):
    # Prepare data
    X_train, X_test, y_train, y_test = prepare_data(data_dir)

    # Create and compile the model
    model = create_model()
    model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=LEARNING_RATE),
                  loss='mse',
                  metrics=['mae'])

    # Train the model
    history = model.fit(X_train, y_train,
                        batch_size=BATCH_SIZE,
                        epochs=EPOCHS,
                        validation_data=(X_test, y_test))

    # Save the model
    model.save('sheet_counter_model.h5')

    return history

if __name__ == "__main__":
    train_model('path/to/your/training/data')