class Job {
    constructor(id, title, description, postedBy,companyName) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.postedBy = postedBy;
        this.companyName = companyName;
    }
}

class User {
    constructor(name, email,password) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.appliedJobs = []; 
    }

    applyJob(job) {
         
        // if (this.appliedJobs.includes(job)) { // Check if the user has already applied for the job, make it in it's own JS file
        //     console.log("You have already applied for this job.");
        //     return;
        // }
        this.appliedJobs.push(job);
        console.log(`You have successfully applied for the job: ${job.title}`);
    }
}

class Admin extends User {
    constructor(name, email,password,companyName) {
        super(name, email,password);
        this.companyName = companyName;
        this.AdminJobs = [];
    }
    // AllJobs -> represents all jobs in the system
    addJob(AllJobs, job) {
        jobs.push(AllJobs);
        this.AdminJobs.push(job);
        return job;
    }
}
let AllJobs = [];
let Users = [];
let currId = 0; // Current ID for the next job to be added
// AllJobs.push(new Job(currId, "Software Engineer", "Develop software applications", "John Doe","Tech Corp")); 
// currId++;
function saveJobsToLocalStorage() {
    localStorage.setItem("AllJobs", JSON.stringify(AllJobs));
}
function loadJobsFromLocalStorage() {
    const jobs = localStorage.getItem("AllJobs");
    if (jobs) {
        AllJobs = JSON.parse(jobs).map(job => new Job(job.id, job.title, job.description, job.postedBy,job.companyName));
        currId = AllJobs.length > 0 ? AllJobs[AllJobs.length - 1].id + 1 : 0;
    }
}
function saveUsersToLocalStorage() {
    localStorage.setItem("Users", JSON.stringify(Users));
}
function LoadUsersFromLocalStorage(){
    const userData = localStorage.getItem("Users");
    if (userData){
        Users = JSON.parse(userData).map(user=> new User(user.name, user.email,user.password));
    }
}
 
LoadUsersFromLocalStorage();
loadJobsFromLocalStorage();
