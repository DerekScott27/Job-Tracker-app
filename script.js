// Wrapped all of the existing code inside this event listener
window.addEventListener('DOMContentLoaded', (event) => {
    
    // 1. GLOBAL VARIABLES AND STATE
    const jobs = [];
    const form = document.getElementById('submit');
    const button = document.getElementById('add-button');
    const errorBox = document.getElementById('error-box');
    const checkbox = document.getElementById('applicationStatus');

    // 2. CORE FUNCTIONS
    // Create a new function to display array items on webpage
    function jobUpdater() {
        console.log('jobUpdater called. Current jobs:', jobs);
        const listDiv = document.getElementById("list-div");
        listDiv.innerHTML = ""; // Clears it to prevent duplication
        const ul = document.createElement("ul");
        
        console.log(jobs);
        jobs.forEach(function(job) {
            const li = document.createElement("li");
            li.textContent = `${job.company} - ${job.jobTitle} - ${job.jobLink} - ${job.studyTasks} -${job.applicationStatus}`;
            ul.appendChild(li);
        });

        listDiv.appendChild(ul);
        /*const stringifiedJobs = JSON.stringify(jobs);
        localStorage.setItem('array', stringifiedJobs);
        const jobsParsed = JSON.parse(stringifiedJobs);
       */
        
    }

    // Function to load the jobs from the database:
    async function loadJobs() {
        const listDiv = document.getElementById('list-div');
        // Check if listDiv exists before trying to clear its innerHTML
        if (listDiv) { 
            listDiv.innerHTML = ''; 
        }

        try {
            //From the config.js file the fetch request to the API_BASE variable which goes to the DB
            const response = await fetch(`${API_BASE}/jobs`);
            if (!response.ok) {
                throw new Error(`HTTP error while loading jobs. status: ${response.status}`);
            }
            const jobsData = await response.json();

            // Check if listDiv exists before appending children in the loop
            if (listDiv) {
                jobsData.forEach(job => {
                    const item = document.createElement('div');
                    item.className = 'job-item';
                    item.innerHTML = `
                        <h3>${job.company} – ${job.jobTitle}</h3>
                        <p><a href="${job.jobLink}" target="_blank">Job Link</a></p>
                        <p><strong>Study Tasks:</strong> ${job.studyTasks || 'None yet'}</p>
                        <p><strong>Status:</strong> ${job.applicationStatus || 'Applied'}</p>
                        <small>Created at: ${new Date(job.createdAt).toLocaleString()}</small>
                    `;
                    listDiv.appendChild(item);
                });
            }
            
        } catch(err){
            console.error('Error loading jobs:', err);
            // Check if errorBox exists before trying to set textContent
            if (errorBox) { 
                errorBox.textContent = 'Error loading jobs from server';
            }
        }
    }

    // 3. EVENT LISTENERS
   
 

    form?.addEventListener('submit', async (event) => {
        event.preventDefault(); // Stops normal form submit
    

        // Clear old errors
        if (errorBox) errorBox.textContent = '';
        const errors = []; 

        // Capture input values AT THE TIME of the click
        const company = document.getElementById('company').value.trim();
        const jobTitle = document.getElementById('job-title').value.trim();
        const jobLink = document.getElementById('job-link').value.trim();
        const studyTasks = document.getElementById('study-tasks').value.trim();
        const applicationStatus = document.getElementById('applicationStatus')?.value?.trim() || '';

        // Form validation
        if (!company) errors.push('Company is required');
        if (!jobTitle) errors.push('Job title is required');
        if (!jobLink) errors.push('Job link is required');
        if (!studyTasks) errors.push('Study tasks are required');
        if (!applicationStatus) errors.push('Application status is required');
        if (jobLink && !jobLink.startsWith('http://') && !jobLink.startsWith('https://')) {
            errors.push('Job link should start with http:// or https://');
        }

        if (errors.length > 0) {
            if (errorBox) errorBox.textContent = errors.join(' ');
            return; // Stop if there are errors
        }

        // Create the job object
        const newJob = {
            company: company,
            jobTitle: jobTitle,
            jobLink: jobLink,
            applicationStatus: applicationStatus,
            studyTasks: studyTasks
        };

        // Update local array and UI
        jobs.push(newJob);
        jobUpdater(newJob);

        // Perform network request
        (async () => {
            try {
                console.log('Making POST to:', `${API_BASE}/jobs`)
                const response = await fetch(`${API_BASE}/jobs`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newJob), // using the current newJob object
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const responseData = await response.json();
                console.log(responseData);

                await loadJobs(); //Refreshes from the server to show the latest data immediately 

            } catch (error) {
                console.error('Fetch error:', error);
            }
        })();
    });

    // Call loadJobs initially once the DOM is ready
    loadJobs();
});
