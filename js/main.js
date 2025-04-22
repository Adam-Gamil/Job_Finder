export class Job {
    constructor(id, companyName, title, yearsOfExperience, salary, requirements, location, description, status = "open") {
        this.id = id;
        this.title = title;
        this.description = description;
        this.companyName = companyName;
        this.yearsOfExperience = yearsOfExperience;
        this.salary = salary;
        this.requirements = requirements;
        this.location = location;
        this.status = status;
    }
}

export class User {
    constructor(name, email, password, isadmin = false) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.appliedJobs = [];
        this.isadmin = isadmin; // Default value is false
    }

    checkIfAdmin() {
        return this.isadmin;
    }

    applyJob(job) {
        // Check if already applied
        if (this.appliedJobs.some(j => j.id === job.id)) {
            return false;
        }
        
        // Add to applied jobs
        this.appliedJobs.push(job);
        console.log(`Applied for job: ${job.title}`);
        
        // Save to localStorage immediately
        saveUsersToLocalStorage();
        return true;
    }

    withdrawJob(jobId) {
        jobId = Number(jobId); // Convert to number
        console.log(`Withdrawing job ${jobId} (type: ${typeof jobId})`);
        
        let newAppliedJobs = [];
        for (let i = 0; i < this.appliedJobs.length; i++) {
            const job = this.appliedJobs[i];
            if (Number(job.id) !== jobId) {
                newAppliedJobs.push(job);
            }
        }
        this.appliedJobs = newAppliedJobs;
        return true;
    }
}

export class Admin extends User {
    constructor(name, email, password, companyName) {
        super(name, email, password, true); // Call the parent constructor with isadmin set to true
        this.companyName = companyName;
        this.AdminJobs = [];
    }

    addJob(AllJobs, job) {
        AllJobs.push(job); // Fix the incorrect 'jobs' variable reference
        this.AdminJobs.push(job);
        return job;
    }
}


export let AllJobs = [];

export let Users = [];
export let currId = 0; // Current ID for the next job to be added
export const session = {
    currUser: null,
}; 

export function saveJobsToLocalStorage() {
    localStorage.setItem("AllJobs", JSON.stringify(AllJobs));
}

export function loadJobsFromLocalStorage() {
    const jobs = localStorage.getItem("AllJobs");
    if (jobs) {
        AllJobs = JSON.parse(jobs).map(
            (job) => new Job(
                job.id,
                job.companyName,
                job.title,
                job.yearsOfExperience,
                job.salary,
                job.requirements,
                job.location,
                job.description,
                job.status
            )
        );
        currId = AllJobs.length > 0 ? AllJobs[AllJobs.length - 1].id + 1 : 0;
    }
}

export function saveUsersToLocalStorage() {
    localStorage.setItem("Users", JSON.stringify(Users));
}



// Load users and jobs from localStorage on page load
console.log(Users);
console.log(session.currUser);

export function saveSessionToLocalStorage() {
    if (session.currUser) {
        localStorage.setItem("currentSession", JSON.stringify({
            userEmail: session.currUser.email,
            timestamp: new Date().getTime()
        }));
    }
}

export function loadSessionFromLocalStorage() {
    const sessionData = localStorage.getItem("currentSession");
    if (sessionData) {
        const { userEmail } = JSON.parse(sessionData);
        const user = Users.find(u => u.email === userEmail);
        if (user) {
            session.currUser = user;
        }
    }
}

// Update your existing LoadUsersFromLocalStorage to also load session
export function LoadUsersFromLocalStorage() {
    const userData = localStorage.getItem("Users");
    if (userData) {
        Users = JSON.parse(userData).map(user => {
            // Recreate user object
            const userObj = user.isadmin 
                ? new Admin(user.name, user.email, user.password, user.companyName)
                : new User(user.name, user.email, user.password);
            
            // Properly reconstruct appliedJobs
            if (user.appliedJobs) {
                userObj.appliedJobs = user.appliedJobs.map(jobData => {
                    return new Job(
                        jobData.id,
                        jobData.companyName,
                        jobData.title,
                        jobData.yearsOfExperience,
                        jobData.salary,
                        jobData.requirements,
                        jobData.location,
                        jobData.description,
                        jobData.status
                    );
                });
            }
            return userObj;
        });
    }
    loadSessionFromLocalStorage();
}
LoadUsersFromLocalStorage();
loadJobsFromLocalStorage();

if (AllJobs.length === 0) {
    let job = new Job(
        5,                      // id
        "Google",               // companyName
        "Software Engineer",    // title
        "3-7 years experience", // yearsOfExperience
        "$60000 - $70000",     // salary
        "JavaScript, React, c++, SQL",    // requirements
        "London",             // location
        "Full-time",             // description
        "open"                // status
    );
    AllJobs.push(job);
    saveJobsToLocalStorage();
}



if (AllJobs.length === 1) {
    let job = new Job(
        1,                      // id
        "Facebook",               // companyName
        "Data scientist",    // title
        "3-7 years experience", // yearsOfExperience
        "$90000 - $110000",     // salary
        "Sql, python, pandas, html, css, javascript",    // requirements
        "New-York",             // location
        "Part-time",             // description
        "open"                // status
    );
    AllJobs.push(job);
    saveJobsToLocalStorage();
}

