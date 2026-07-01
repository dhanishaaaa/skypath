import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error, r2_score
import joblib

df = pd.read_csv('pilot_dataset.csv')

features = ['age', 'pcm_percent', 'budget_lakhs', 'color_blind', 'vision_issues', 'bp_issues', 'quiz_accuracy', 'route']
target = 'readiness_score'

X = df[features]
y = df[target]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

model = GradientBoostingRegressor(
    n_estimators=200,
    learning_rate=0.1,
    max_depth=4,
    random_state=42
)

model.fit(X_train_scaled, y_train)

y_pred = model.predict(X_test_scaled)

mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f'Mean Absolute Error: {mae:.2f} points')
print(f'R2 Score: {r2:.4f}')
print(f'Model trained on {len(X_train)} samples, tested on {len(X_test)} samples')

importances = model.feature_importances_
print('\nFeature importances:')
for feat, imp in sorted(zip(features, importances), key=lambda x: -x[1]):
    print(f'  {feat}: {imp:.4f}')

joblib.dump(model, 'model.pkl')
joblib.dump(scaler, 'scaler.pkl')
print('\nModel and scaler saved as model.pkl and scaler.pkl')

sample = pd.DataFrame([{
    'age': 17,
    'pcm_percent': 72,
    'budget_lakhs': 30,
    'color_blind': 0,
    'vision_issues': 0,
    'bp_issues': 0,
    'quiz_accuracy': 65,
    'route': 1,
}])
sample_scaled = scaler.transform(sample)
prediction = model.predict(sample_scaled)[0]
print(f'\nSample prediction (17yr old, 72% PCM, Rs.30L budget, NDA route, 65% quiz): {prediction:.1f}/100')