import pandas as pd
import numpy as np
import random

random.seed(42)
np.random.seed(42)

def generate_candidate():
    age = round(random.uniform(15, 28), 1)
    pcm_percent = round(random.uniform(40, 100), 1)
    budget_lakhs = round(random.uniform(0, 50), 1)
    color_blind = random.choices([0, 1], weights=[0.92, 0.08])[0]
    vision_issues = random.choices([0, 1], weights=[0.85, 0.15])[0]
    bp_issues = random.choices([0, 1], weights=[0.88, 0.12])[0]
    quiz_accuracy = round(random.uniform(0, 100), 1)
    route = random.choice(['NDA', 'CIVILIAN'])

    score = 0

    if route == 'NDA':
        if 16.5 <= age <= 19.5:
            score += 25
        elif age < 16.5:
            score += 10
        else:
            score += 0

        if pcm_percent >= 75:
            score += 20
        elif pcm_percent >= 60:
            score += 14
        elif pcm_percent >= 50:
            score += 8
        else:
            score += 0

        if color_blind == 1:
            score -= 20
        if vision_issues == 1:
            score -= 10
        if bp_issues == 1:
            score -= 10

        score += 0

    else:
        if pcm_percent >= 60:
            score += 20
        elif pcm_percent >= 50:
            score += 12
        else:
            score += 4

        if budget_lakhs >= 35:
            score += 25
        elif budget_lakhs >= 25:
            score += 18
        elif budget_lakhs >= 15:
            score += 10
        else:
            score += 3

        if color_blind == 1:
            score -= 10
        if vision_issues == 1:
            score -= 8
        if bp_issues == 1:
            score -= 5

        if age <= 25:
            score += 10
        elif age <= 28:
            score += 5

    if quiz_accuracy >= 75:
        score += 20
    elif quiz_accuracy >= 50:
        score += 12
    elif quiz_accuracy >= 30:
        score += 6
    else:
        score += 0

    noise = random.gauss(0, 5)
    score = max(0, min(100, score + noise))
    score = round(score, 1)

    return {
        'age': age,
        'pcm_percent': pcm_percent,
        'budget_lakhs': budget_lakhs,
        'color_blind': color_blind,
        'vision_issues': vision_issues,
        'bp_issues': bp_issues,
        'quiz_accuracy': quiz_accuracy,
        'route': 1 if route == 'NDA' else 0,
        'readiness_score': score,
    }

records = [generate_candidate() for _ in range(5000)]
df = pd.DataFrame(records)
df.to_csv('pilot_dataset.csv', index=False)
print(f'Dataset generated: {len(df)} rows')
print(df.describe())
print('\nScore distribution:')
print(pd.cut(df['readiness_score'], bins=[0,33,66,100], labels=['Low','Medium','High']).value_counts())