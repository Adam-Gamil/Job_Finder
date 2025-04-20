export class Job {
    constructor(id, companyName, title, yearsOfExperience, salary, requirements, location, description) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.companyName = companyName;
        this.yearsOfExperience = yearsOfExperience;
        this.salary = salary;
        this.requirements = requirements;
        this.location = location;
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
        this.appliedJobs.push(job);
        console.log(`You have successfully applied for the job: ${job.title}`);
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
                job.description
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
        Users = JSON.parse(userData).map(
            (user) => user.isadmin 
                ? new Admin(user.name, user.email, user.password, user.companyName)
                : new User(user.name, user.email, user.password)
        );
    }
    loadSessionFromLocalStorage(); // Add this line
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
        "Full-time"             // description
    );
    AllJobs.push(job);
    saveJobsToLocalStorage();
}

