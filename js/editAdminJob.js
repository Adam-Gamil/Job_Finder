import {
    AllJobs,
    session,
    saveJobsToLocalStorage,
    saveUsersToLocalStorage,
    loadSessionFromLocalStorage,
  } from "./main.js";
  
  document.addEventListener("DOMContentLoaded", () => {
    loadSessionFromLocalStorage();
  
    const params = new URLSearchParams(window.location.search);
    const jobId = Number(params.get("id"));
  
    const job = session.currUser?.AdminJobs.find(j => Number(j.id) === jobId);
  
    if (!job) {
      Swal.fire({
        icon: "error",
        title: "Job not found",
        text: "The job you are trying to edit does not exist.",
      }).then(() => {
        window.location.href = "viewCreatedJobs.html";
      });
      return;
    }
  
    
    document.getElementById("job-title").value = job.title;
    document.getElementById("job-salary").value = job.salary;
    document.getElementById("years_exp").value = job.yearsOfExperience;
    document.getElementById("requirements").value = job.requirements;
    document.getElementById("description").value = job.description;
    document.getElementById("location").value = job.location;
  
    const statusInputs = document.getElementsByName("status");
    for (let input of statusInputs) {
      if (input.value === (job.status ? "Open" : "Closed")) {
        input.checked = true;
      }
    }
  
    const editJobBtn = document.getElementById("addJobBtn");
    editJobBtn.addEventListener("click", (e) => {
      e.preventDefault();
  
      // Update job data with new values
      job.title = document.getElementById("job-title").value;
      job.salary = document.getElementById("job-salary").value;
      job.yearsOfExperience = document.getElementById("years_exp").value;
      job.requirements = document.getElementById("requirements").value;
      job.description = document.getElementById("description").value;
      job.location = document.getElementById("location").value;
  
      const selectedStatus = Array.from(statusInputs).find(input => input.checked);
      job.status = selectedStatus?.value === "Open";
  
    
      saveJobsToLocalStorage();
      saveUsersToLocalStorage();
  
      
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Job updated successfully!",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        
        window.location.href = "viewCreatedJobs.html";
      });
    });
  });
  