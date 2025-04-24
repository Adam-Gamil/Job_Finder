import {
    AllJobs,
    session,
    saveJobsToLocalStorage,
    saveUsersToLocalStorage,
    loadSessionFromLocalStorage,
} from "./main.js";

document.addEventListener("DOMContentLoaded", () => {
    loadSessionFromLocalStorage();

    const jobsContainer = document.querySelector(".jobs-container");

    function renderAdminJobs() {
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
                    <button class="delete-btn" data-job-id="${job.id}">Delete</button>
                </div>
            `;
            jobsContainer.appendChild(jobCard);
        });

        attachDeleteListeners(); // 👈 attach after rendering
    }

    function attachDeleteListeners() {
        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", async (e) => {
                const jobId = Number(e.target.getAttribute("data-job-id"));

                const confirm = await Swal.fire({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Yes, delete it!",
                    cancelButtonText: "Cancel",
                });

                if (!confirm.isConfirmed) return;

                const successFromAll = session.currUser.deleteAllJobs(AllJobs, jobId);
                const successFromAdmin = session.currUser.deleteAdminJobs(jobId);

                if (successFromAll || successFromAdmin) {
                    saveJobsToLocalStorage();
                    saveUsersToLocalStorage();

                    const jobCard = e.target.closest('.job-card');
                    jobCard.style.transition = 'opacity 0.3s';
                    jobCard.style.opacity = '0';

                    setTimeout(() => {
                        jobCard.remove();
                    }, 300);

                    await Swal.fire({
                        icon: "success",
                        title: "Deleted!",
                        text: "The job has been deleted.",
                    });
                } else {
                    await Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Failed to delete the job. It may not exist.",
                    });
                }
            });
        });
    }

    setTimeout(() => {
        console.log("Admin Jobs for deletion:", session.currUser?.AdminJobs);
        renderAdminJobs();
    }, 50);
});
