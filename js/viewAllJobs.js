import { AllJobs, session, loadSessionFromLocalStorage } from "./main.js";



function displayJobs() {
    const jobContainer = document.getElementById("jobs-container");
    
    // Preserve the header by only clearing job cards
    const header = jobContainer.querySelector('h2');
    jobContainer.innerHTML = ''; // First clear everything
    if (header) {
        jobContainer.appendChild(header); // Put header back
    } else {
        // Recreate header if it doesn't exist
        const newHeader = document.createElement('h2');
        newHeader.textContent = 'View All Jobs';
        jobContainer.appendChild(newHeader);
    }

    // Add jobs if they exist
    // if job id is already in applied jobs, don't show the job

    console.log(AllJobs);
    for (let i = 0; i < AllJobs.length; i++) {
        const job = AllJobs[i];
         // Check if user is logged in and has applied to this job
        const isApplied = session.currUser?.appliedJobs?.some(appliedJob => appliedJob.id === job.id);
        
        if (isApplied) {
            continue; // Skip this job if already applied
        }
        const jobCard = document.createElement("div");
        jobCard.className = "job-card";
        jobCard.innerHTML = `
                <div class="job-basic-info">
                    <h3 class="company-name">${job.companyName}</h3>
                    <p class="job-title">${job.title}</p>
                    <p class="job-experience">${job.yearsOfExperience}</p>
                </div>
                <input type="checkbox" id="${job.id}" class="details-checkbox">
                <label for="${job.id}" class="view-details-btn">
                View Details <span class="arrow">▼</span>
                </label>
                <div class="job-details">
                    <div class="details-content">
                        <p><strong>Salary:</strong> ${job.salary}</p>
                        <p><strong>Requirements:</strong> ${job.requirements}</p>
                        <p><strong>Location:</strong>${job.location} </p>
                        <p><strong>Description:</strong> ${job.description}</p>
                    </div>
                    <button class="apply-btn" data-job-id="${job.id}">Apply for Job</button>
                </div>
        `;
        jobContainer.appendChild(jobCard);
    }
    const applyButtons = document.querySelectorAll(".apply-btn");
        applyButtons.forEach((button) => {
            button.addEventListener("click", (event) => {
                const jobId = event.target.getAttribute("data-job-id");
                const job = AllJobs.find((j) => j.id == jobId);
                console.log(session.currUser);
                if (session.currUser) {
                    session.currUser.applyJob(job);
                    
                    const jobCard = event.target.closest('.job-card');
                    jobCard.style.transition = 'opacity 0.3s ease';
                    jobCard.style.opacity = '0';
                    
                    // Wait for animation to complete before removing
                    setTimeout(() => {
                        jobCard.remove();
                        
                        // Optional: Show message if no jobs left
                        if (document.querySelectorAll('.job-card').length === 0) {
                            const noJobsMsg = document.createElement('p');
                            noJobsMsg.textContent = 'No available jobs';
                            document.getElementById("jobs-container").appendChild(noJobsMsg);
                        }
                    }, 300);
                    Swal.fire({
                        icon: "success",
                        title: "Success",
                        text: "You have successfully applied for the job.",
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Please log in to apply for jobs.",
                    });
                }
            });
        });
    } 
    
console.log("AllJobs length:", AllJobs.length);
console.log("AllJobs content:", AllJobs);
window.addEventListener("DOMContentLoaded", () => {
    loadSessionFromLocalStorage(); // Load session first
    console.log("Current user:", session.currUser); // Debug log
    displayJobs();
});