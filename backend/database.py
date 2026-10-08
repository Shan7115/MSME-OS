import sqlite3
import json
import os
from datetime import datetime
from typing import List, Dict, Any, Optional

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "msmeos2.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        filename TEXT NOT NULL,
        file_type TEXT NOT NULL,
        file_size INTEGER NOT NULL,
        uploaded_at TEXT NOT NULL,
        status TEXT NOT NULL,
        extracted_text TEXT,
        page_count INTEGER DEFAULT 1,
        source_reference TEXT
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS analyses (
        id TEXT PRIMARY KEY,
        document_id TEXT NOT NULL,
        created_at TEXT NOT NULL,
        business_name TEXT,
        business_sector TEXT,
        document_type TEXT,
        overall_score INTEGER NOT NULL,
        score_explanation TEXT,
        score_breakdown TEXT,
        summary TEXT NOT NULL,
        strengths TEXT,
        opportunities TEXT,
        next_steps TEXT,
        plan_30_60_90 TEXT,
        analysis_json TEXT NOT NULL,
        FOREIGN KEY (document_id) REFERENCES documents (id) ON DELETE CASCADE
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS findings (
        id TEXT PRIMARY KEY,
        analysis_id TEXT NOT NULL,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        severity TEXT NOT NULL,
        confidence TEXT NOT NULL,
        evidence TEXT NOT NULL,
        source_reference TEXT NOT NULL,
        why_it_matters TEXT NOT NULL,
        recommendation TEXT NOT NULL,
        expected_outcome TEXT NOT NULL,
        effort TEXT NOT NULL,
        time_horizon TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Open',
        FOREIGN KEY (analysis_id) REFERENCES analyses (id) ON DELETE CASCADE
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS validation_feedback (
        id TEXT PRIMARY KEY,
        participant_type TEXT NOT NULL,
        understanding TEXT,
        usefulness INTEGER NOT NULL,
        clarity INTEGER NOT NULL,
        trust INTEGER NOT NULL,
        intent_to_use TEXT NOT NULL,
        most_useful TEXT,
        biggest_concern TEXT,
        changes TEXT,
        additional_feedback TEXT,
        created_at TEXT NOT NULL
    );
    """)

    conn.commit()
    conn.close()

def reset_db_data(include_validation: bool = False):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM findings;")
    cursor.execute("DELETE FROM analyses;")
    cursor.execute("DELETE FROM documents;")
    if include_validation:
        cursor.execute("DELETE FROM validation_feedback;")
    conn.commit()
    conn.close()
