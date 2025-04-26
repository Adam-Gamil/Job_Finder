import { AllJobs, session, loadSessionFromLocalStorage, saveJobsToLocalStorage } from "./main.js";

document.addEventListener("DOMContentLoaded", () => {
    loadSessionFromLocalStorage();

    const jobsContainer = document.querySelector(".jobs-container");

    function displayAdminJobs() {
        jobsContainer.innerHTML = '<h2>Your Created Jobs</h2>';

        const adminJobs = session.currUser?.AdminJobs || [];

        if (adminJobs.length === 0) {
            jobsContainer.innerHTML += "<p>You haven't created any jobs yet.</p>";
            return;
        }

        adminJobs.forEach(job => {
            const jobCard = document.createElement("div");
            jobCard.className = "job-card";
            jobCard.innerHTML = `
                <div class="job-basic-info">
                    <h3 class="company-name">${job.companyName}</h3>
                    <p class="job-title">${job.title}</p>
                    <p class="job-experience">${job.yearsOfExperience}</p>
                </div>
                <input type="checkbox" id="details-${job.id}" class="details-checkbox">
                <label for="details-${job.id}" class="view-details-btn">
                    View Details <span class="arrow">▼</span>
                </label>
                <div class="job-details">
                    <div class="details-content">
                        <p><strong>Salary:</strong> ${job.salary}</p>
                        <p><strong>Requirements:</strong> ${job.requirements}</p>
                        <p><strong>Location:</strong> ${job.location}</p>
                        <p><strong>Description:</strong> ${job.description}</p>
                    </div>
                </div>
            `;
            jobsContainer.appendChild(jobCard);
        });
    }


    setTimeout(() => {
        console.log("Admin Jobs:", session.currUser?.AdminJobs); 
        displayAdminJobs();
    }, 50);
});
