export class Job {
    constructor(id, title, description, postedBy, companyName) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.postedBy = postedBy;
        this.companyName = companyName;
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
export let currUser = null; // Current user 

export function saveJobsToLocalStorage() {
    localStorage.setItem("AllJobs", JSON.stringify(AllJobs));
}

export function loadJobsFromLocalStorage() {
    const jobs = localStorage.getItem("AllJobs");
    if (jobs) {
        AllJobs = JSON.parse(jobs).map(
            (job) => new Job(job.id, job.title, job.description, job.postedBy, job.companyName)
        );
        currId = AllJobs.length > 0 ? AllJobs[AllJobs.length - 1].id + 1 : 0;
    }
}

export function saveUsersToLocalStorage() {
    localStorage.setItem("Users", JSON.stringify(Users));
}

export function LoadUsersFromLocalStorage() {
    const userData = localStorage.getItem("Users");
    if (userData) {
        Users = JSON.parse(userData).map(
            (user) => new User(user.name, user.email, user.password)
        );
    }
}

// Load users and jobs from localStorage on page load
LoadUsersFromLocalStorage();
loadJobsFromLocalStorage();