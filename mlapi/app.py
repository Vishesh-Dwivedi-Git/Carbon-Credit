from flask import Flask, request, jsonify
import joblib
import numpy as np
import os

app = Flask(__name__)

# Load the model
model = joblib.load('model-2.joblib')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get JSON data
        data = request.get_json(force=True)

        # Expecting JSON with keys "month" (string) and "year" (int)
        month = data['month']
        year = data['year']

        # # Convert month to a numeric representation if needed (example mapping)
        month_mapping = {
            'January': 1, 'February': 2, 'March': 3, 'April': 4,
            'May': 5, 'June': 6, 'July': 7, 'August': 8,
            'September': 9, 'October': 10, 'November': 11, 'December': 12
        }
        month_num = month_mapping.get(month.capitalize())
        if month_num is None:
            return jsonify({'error': 'Invalid month name'})

        # Prepare features array
        features = np.array([[year,month_num]])

        # Make prediction
        prediction = model.predict(features)

        # Return the prediction as JSON
        return jsonify({'prediction': prediction.tolist()})

    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 8080))  # Set default port to 8080 or use environment variable
    host = os.environ.get("HOST", "127.0.0.1")  # Set specific host or default to 127.0.0.1
    app.run(debug=True, host=host, port=port)