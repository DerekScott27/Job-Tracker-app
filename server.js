/*require('dotenv').config(); //Uses the require library to load variables from the .env file to the process.env object

const express = require('express'); //Creates the express variable and assigns the value of it to be 'express' so Node JS can find the express package
const cors = require('cors'); 
const { Pool } = require('pg'); 
*/

import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';

const app = express();
const PORT = process.env.PORT || 3001;

console.log('DATABASE_URL =', process.env.DATABASE_URL, 'type:', typeof process.env.DATABASE_URL);

// Middleware
app.use(cors());
app.use(express.json()); //Parses JSON bodies


//Database Pool

const pool = new Pool({connectionString: process.env.DATABASE_URL,}); //Create a var called pool and its value is a new instance of the Pool class from the pg library


app.get('/', (req, res) => {
    res.json({ message: 'Job Tracker API is running'});
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});


function validateJob(body){
    const errors = [];

    const company = (body.company ?? '').toString().trim();  //If body.company, body.jobTitle, or body.jobLink are null or undefined, they become '' (an empty string).
    const jobTitle = (body.jobTitle ?? '').toString().trim();
    const jobLink = (body.jobLink ?? '').toString().trim();

    if(company.length === 0){
        errors.push('Company is required');
    }

    if(jobTitle.length === 0){
        errors.push('Job Title is required');
    }

    if(jobLink.length === 0){
        errors.push('Job link is required');
    }


    if(jobLink && !jobLink.startsWith('http://') && !jobLink.startsWith('https://')) {
        errors.push('Job link must start with http:// or https://');
    }

    return errors;
}



//Add a POST:

app.post('/jobs', async  (req, res) => {
  console.log('Incoming body:', req.body);
    const {company, jobTitle, jobLink, studyTasks} = req.body;

    const errors = validateJob({company, jobTitle, jobLink});
    if(errors.length > 0){
        return res.status(400).json({errors});
    }


try {
    const result = await pool.query(
        `INSERT INTO jobs (company, job_title, job_link, study_tasks)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [company, jobTitle, jobLink, studyTasks || null]
    );

    const job = result.rows[0];
    res.status(201).json(job);
    
}

catch (err){
    console.error('Error inserting job:', err);
    res.status(500).json({ error: 'Internal server error'});
}

})
app.get('/jobs', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, company, job_title AS "jobTitle", job_link AS "jobLink", study_tasks AS "studyTasks", created_at AS "createdAt"
      FROM jobs
      ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching jobs:', err);
    res.status(500).json({error: 'Internal server error'});
  }
});