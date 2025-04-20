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
    if (AllJobs.length > 0) {
        AllJobs.forEach((job) => {
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
        });

        // Rest of your apply button code...
        const applyButtons = document.querySelectorAll(".apply-btn");
        applyButtons.forEach((button) => {
            button.addEventListener("click", (event) => {
                const jobId = event.target.getAttribute("data-job-id");
                const job = AllJobs.find((j) => j.id == jobId);
                console.log(session.currUser);
                if (session.currUser) {
                    session.currUser.applyJob(job);
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
    } else {
        // Show message when no jobs available
        const noJobsMsg = document.createElement('p');
        noJobsMsg.textContent = 'No jobs available';
        jobContainer.appendChild(noJobsMsg);
    }
}
console.log("AllJobs length:", AllJobs.length);
console.log("AllJobs content:", AllJobs);
window.addEventListener("DOMContentLoaded", () => {
    loadSessionFromLocalStorage(); // Load session first
    console.log("Current user:", session.currUser); // Debug log
    displayJobs();
});