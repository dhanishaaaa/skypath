from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

model = joblib.load('model.pkl')
scaler = joblib.load('scaler.pkl')

features = ['age', 'pcm_percent', 'budget_lakhs', 'color_blind',
            'vision_issues', 'bp_issues', 'quiz_accuracy', 'route']

def score_to_label(score):
    if score >= 66:
        return 'High', 'You appear well-prepared for this path based on your profile.'
    elif score >= 33:
        return 'Medium', 'You have a reasonable foundation but there are areas to strengthen.'
    else:
        return 'Low', 'Your current profile suggests significant gaps — focus on the weak areas before committing to training costs.'

def get_insights(data, score):
    insights = []
    if data['route'] == 1:
        if not (16.5 <= data['age'] <= 19.5):
            insights.append('Your age is outside the NDA eligibility window (16.5–19.5 years).')
        if data['color_blind']:
            insights.append('Color blindness is generally disqualifying for Air Force duties.')
        if data['pcm_percent'] < 50:
            insights.append('PCM percentage below 50% does not meet NDA eligibility criteria.')
    else:
        if data['budget_lakhs'] < 25:
            insights.append('Your budget may be insufficient for civilian CPL training (typically Rs.25–40L).')
        if data['pcm_percent'] < 50:
            insights.append('PCM below 50% — consider NIOS to clear Physics and Math.')

    if data['quiz_accuracy'] < 40:
        insights.append('Quiz accuracy below 40% — focus on aviation general knowledge preparation.')
    elif data['quiz_accuracy'] < 60:
        insights.append('Quiz accuracy is moderate — keep practicing to improve your knowledge base.')

    if data['vision_issues']:
        insights.append('Vision issues noted — get a DGCA Class 1 or Class 2 medical assessment done early.')
    if data['bp_issues']:
        insights.append('Blood pressure issues noted — consult a DGCA-approved medical examiner early.')

    if not insights:
        insights.append('No major red flags detected — focus on maintaining your preparation level.')

    return insights

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        required = ['age', 'pcm_percent', 'budget_lakhs', 'color_blind',
                    'vision_issues', 'bp_issues', 'quiz_accuracy', 'route']
        for field in required:
            if field not in data:
                return jsonify({'error': f'Missing field: {field}'}), 400

        input_df = pd.DataFrame([{f: data[f] for f in features}])
        input_scaled = scaler.transform(input_df)
        score = float(model.predict(input_scaled)[0])
        score = round(max(0, min(100, score)), 1)

        label, summary = score_to_label(score)
        insights = get_insights(data, score)

        return jsonify({
            'readiness_score': score,
            'label': label,
            'summary': summary,
            'insights': insights,
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'message': 'SkyPath ML service running'})

if __name__ == '__main__':
    app.run(port=5001, debug=True)