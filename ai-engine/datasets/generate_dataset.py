"""
CampusMind X - Synthetic Academic Dataset Generator
Generates a realistic student cohort dataset (1,200 records) based on higher education
academic trajectory patterns (attendance, assignment completion, internal test scores, 
previous GPA, recent trend, core subject scores, study hours, and missed labs).
"""

import numpy as np
import pandas as pd
import os
import sys

# Ensure UTF-8 output encoding on Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

np.random.seed(42)

def generate_academic_dataset(num_records=1200):
    # 1. Attendance (Percentage: 35% to 98%)
    attendance_cluster_1 = np.random.normal(82, 8, int(num_records * 0.70))
    attendance_cluster_2 = np.random.normal(55, 10, int(num_records * 0.30))
    attendance = np.clip(np.concatenate([attendance_cluster_1, attendance_cluster_2]), 35, 99)
    np.random.shuffle(attendance)

    # 2. Assignment Completion Rate
    assignment_completion = np.clip(
        attendance * 0.85 + np.random.normal(5, 10, num_records), 20, 100
    )

    # 3. Internal Marks (Out of 30)
    internal_marks = np.clip(
        (attendance * 0.18) + (assignment_completion * 0.08) + np.random.normal(2, 2.5, num_records),
        5, 30
    )

    # 4. Previous Cumulative GPA (Scale 4.0 to 9.8)
    previous_gpa = np.clip(
        (internal_marks / 30) * 5.5 + np.random.normal(3.8, 0.7, num_records),
        4.0, 9.8
    )

    # 5. Recent Performance Trend (-2.2 to +2.2 semester GPA delta)
    recent_trend = np.clip(np.random.normal(0.05, 0.6, num_records), -2.2, 2.2)

    # 6. Core Subject (DSA / Algorithms) Score (Out of 100)
    core_subject_score = np.clip(
        internal_marks * 2.8 + (previous_gpa * 2) + np.random.normal(0, 7, num_records),
        25, 98
    )

    # 7. Weekly Coding & Study Hours (2 to 35 hours)
    study_hours_weekly = np.clip(
        (attendance * 0.18) + (previous_gpa * 1.2) + np.random.normal(0, 3, num_records),
        2, 35
    )

    # 8. Missed Practical Labs (0 to 15 sessions)
    missed_labs = np.clip(
        np.round((100 - attendance) / 6 + np.random.normal(0, 1.2, num_records)),
        0, 15
    ).astype(int)

    # Composite Academic Index (0 - 100)
    composite_index = (
        (attendance * 0.28) +
        (assignment_completion * 0.18) +
        ((internal_marks / 30 * 100) * 0.24) +
        (core_subject_score * 0.18) +
        ((previous_gpa / 10 * 100) * 0.12)
    )

    risk_levels = []
    future_gpas = []

    for i in range(num_records):
        score = composite_index[i]
        att = attendance[i]
        int_m = internal_marks[i]
        prev_gpa = previous_gpa[i]
        trend = recent_trend[i]

        # Explicit heuristic boundaries for training ground truth
        if att < 60.0 or int_m < 14.0 or score < 56.0:
            risk = "High"
        elif att < 74.0 or score < 72.0 or (trend < -0.8 and score < 76.0):
            risk = "Medium"
        else:
            risk = "Low"
        risk_levels.append(risk)

        # Future GPA estimation ground truth (Regression target)
        target_gpa = (
            (prev_gpa * 0.50) +
            ((int_m / 30) * 10 * 0.35) +
            (trend * 0.15) +
            np.random.normal(0, 0.28)
        )
        future_gpas.append(round(float(np.clip(target_gpa, 4.0, 9.8)), 2))

    df = pd.DataFrame({
        "attendance": np.round(attendance, 1),
        "assignment_completion": np.round(assignment_completion, 1),
        "internal_marks": np.round(internal_marks, 1),
        "previous_gpa": np.round(previous_gpa, 2),
        "recent_trend": np.round(recent_trend, 2),
        "core_subject_score": np.round(core_subject_score, 1),
        "study_hours_weekly": np.round(study_hours_weekly, 1),
        "missed_labs": missed_labs,
        "risk_level": risk_levels,
        "future_gpa": future_gpas
    })

    return df

if __name__ == "__main__":
    os.makedirs("datasets", exist_ok=True)
    dataset = generate_academic_dataset(1200)
    output_path = os.path.join("datasets", "student_academic_records.csv")
    dataset.to_csv(output_path, index=False)
    print(f"[OK] Generated {len(dataset)} records at {output_path}")
    print("Class Distribution:")
    print(dataset["risk_level"].value_counts())
    print("\nFuture GPA Summary:")
    print(dataset["future_gpa"].describe())
