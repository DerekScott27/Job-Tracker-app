CREATE TABLE IF NOT EXISTS jobs(
    id SERIAL PRIMARY KEY,
    company TEXT NOT NULL,
    job_title TEXT NOT NULL,
    job_link TEXT NOT NULL,
    study_tasks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);