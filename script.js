const jobs = [];


// create a variable to get the value of the input from the index.html file
const button = document.getElementById('add-button'); 

const company = document.getElementById('company');

const jobTitle = document.getElementById('job-title');

const jobLink = document.getElementById('job-link');

const studyTasks = document.getElementById('study-tasks');



//Using the button variable, add an event listener function with params of 'on click' and with another function
button.addEventListener('click', function() {

//Uses the .value to take the actual string value of the variables and assign them to these new variables
    companyName = company.value; 
    job = jobTitle.value;
    jobUrl = jobLink.value;
    studytasks = studyTasks.value;


//Creates an object, the key values for the object are set to equal to the variables made above.
    const newJob = {
    company: companyName,
    jobTitle: job,
    url: jobUrl,
    tasks: studytasks
};

//Finally we use the .push method on the jobs array and add the newJob object to the array
jobs.push(newJob);


//Calling the jobUpdater function with the 'newJob' object as the parameter
jobUpdater(newJob)


})

//Create a new function to display array items on webpage
function jobUpdater () {

/*Create a div in html
Then clears it by setting it to an empty string 
(Did this because it was duplicating each job every time a new job was made)*/
const listDiv = document.getElementById("list-div");

listDiv.innerHTML = ""


//Create unordered list in html
const ul = document.createElement("ul");



console.log(jobs);
//Call the jobs array and the forEach array method on the jobs array, 'job' representing each individual array element.
jobs.forEach(function(job) {

//Create a list item element in html and naming it li in JS
const li = document.createElement("li");

/*Use the .textContent property on the li element to give the li element strings to put on the page

The value / string assigned to li.textContent is a string literal, calling each key from the jobs array.*/
li.textContent = `${job.company} - ${job.jobTitle} - ${job.url} - ${job.tasks}`;

//Appending the li element to the ul element
ul.appendChild(li);

})

//Appending the ul element to the div.
listDiv.appendChild(ul);


const stringifiedJobs = JSON.stringify(jobs);

localStorage.setItem('array', stringifiedJobs);

const jobsParsed = JSON.parse(stringifiedJobs);

li = jobsParsed;

}





