import { AllJobs, session, loadSessionFromLocalStorage, saveUsersToLocalStorage } from "./main.js";

function displayAppliedJobs() {
    const jobContainer = document.getElementById("jobs-container");
    
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


    // Display applied jobs
    if (session.currUser.appliedJobs?.length > 0) {
        session.currUser.appliedJobs.forEach((job) => {
            const jobCard = document.createElement("div");
            jobCard.className = "job-card";
            jobCard.innerHTML = `
                <div class="job-basic-info">
                    <h3 class="company-name">${job.companyName}</h3>
                    <p class="job-title">${job.title}</p>
                    <p class="job-experience">${job.yearsOfExperience}</p>
                </div>
                <input type="checkbox" id="applied-${job.id}" class="details-checkbox">
                <label for="applied-${job.id}" class="view-details-btn">
                    View Details <span class="arrow">▼</span>
                </label>
                <div class="job-details">
                    <div class="details-content">
                        <p><strong>Salary:</strong> ${job.salary}</p>
                        <p><strong>Requirements:</strong> ${job.requirements}</p>
                        <p><strong>Location:</strong> ${job.location}</p>
                        <p><strong>Description:</strong> ${job.description}</p>
                    </div>
                    <div class="application-actions">
                        <button class="applied-btn" disabled>Applied</button>
                        <button class="withdraw-btn" data-job-id="${job.id}">Withdraw Application</button>
                    </div>
                </div>
            `;
            jobContainer.appendChild(jobCard);
        });

        // Handle withdraw buttons
        const withdrawButtons = document.querySelectorAll(".withdraw-btn");
        withdrawButtons.forEach((button) => {
            button.addEventListener("click", async (event) => {
                const jobId = event.target.getAttribute("data-job-id");
                
                // Confirm withdrawal
                const result = await Swal.fire({
                    title: 'Confirm Withdrawal',
                    text: "Are you sure you want to withdraw this application?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Yes, withdraw'
                });

                if (!result.isConfirmed) return;

                // Perform withdrawal
                const success = session.currUser.withdrawJob(jobId);
                
                if (success) {
                    // Visual feedback
                    const jobCard = event.target.closest('.job-card');
                    jobCard.style.transition = 'opacity 0.3s';
                    jobCard.style.opacity = '0';
                    
                    await Swal.fire({
                        icon: "success",
                        title: "Withdrawn",
                        text: "Application withdrawn successfully",
                    });
                    
                    // Remove after animation
                    setTimeout(() => {
                        jobCard.remove();
                        
                        // If no more applied jobs, show message
                        if (session.currUser.appliedJobs.length === 0) {
                            const noJobsMsg = document.createElement('p');
                            noJobsMsg.textContent = 'You have no applied jobs';
                            jobContainer.appendChild(noJobsMsg);
                        }
                    }, 300);
                    
                    // Save changes
                    saveUsersToLocalStorage();
                } else {
                    await Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Failed to withdraw application",
                    });
                }
            });
        });
    } else {
        const noJobsMsg = document.createElement('p');
        noJobsMsg.textContent = 'You have no applied jobs';
        jobContainer.appendChild(noJobsMsg);
    }
}

// Initialize the page
window.addEventListener("DOMContentLoaded", () => {
    loadSessionFromLocalStorage();
    console.log("Current user:", session.currUser);
    displayAppliedJobs(); // Fixed: Changed from displayJobs() to displayAppliedJobs()
});