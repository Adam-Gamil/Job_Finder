import {
    AllJobs,
    session,
    Admin,
    saveJobsToLocalStorage,
    saveSessionToLocalStorage,
    loadSessionFromLocalStorage,
    Job,
    Ids,
    saveUsersToLocalStorage,
} from "./main.js";

loadSessionFromLocalStorage();


document.getElementById("addJobBtn").addEventListener("click", function () {

    if(session.currUser && session.currUser instanceof Admin){
    const company = session.currUser.companyName;
    const jobTitle = document.getElementById("job-title").value;
    const jobSalary = document.getElementById("job-salary").value;
    const experience = document.getElementById("years_exp").value;
    const statusInput = document.querySelector('input[name="status"]:checked');
    const status = statusInput ? statusInput.value : null;
    const requirements = document.getElementById("requirements").value;
    const description = document.getElementById("description").value;
    const location = document.getElementById("location").value;
    if (!company || !jobTitle || !jobSalary || !experience || !status || !requirements || !description || !location) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "please fill in all fields.",
          });
        return false;
    }
    
    const addedjob = new Job(Ids.currId, company, jobTitle, experience, jobSalary, requirements, location, description, status);
    session.currUser.addJob(AllJobs, addedjob);
    console.log("Added Job:", addedjob);
    console.log(AllJobs);
    saveJobsToLocalStorage();
    saveSessionToLocalStorage();
    saveUsersToLocalStorage();
    console.log("Session saved to localStorage:", session);
    
    
    window.location.href = "viewCreatedJobs.html";
    }
});