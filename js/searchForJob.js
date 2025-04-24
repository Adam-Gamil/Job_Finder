//document.getElementById("searchBox").addEventListener("keyup", getSuggestions);
import { AllJobs, session, loadSessionFromLocalStorage } from "./main.js";
//import* as main from "./main.js";

// function getSuggestions() {
//   console.log("getSuggestions called");
//   const query = document.getElementById("searchBox").value;
//   const suggestionsContainer = document.getElementById("suggestions");

//   if (query.length === 0) {
//     suggestionsContainer.innerHTML = "";
//     return;
//   }

//   const xhr = new XMLHttpRequest();
//   xhr.open("GET", "../data/words.txt", true);
//   xhr.onload = function () {
//     if (xhr.status === 200) {
//       const words = xhr.responseText.split('\n');
//       const matches = words.filter(word => word.toLowerCase().startsWith(query.toLowerCase()));

//       suggestionsContainer.innerHTML = "";

//       matches.forEach(word => {
//         const div = document.createElement("div");
//         div.classList.add("suggestion-item");
//         div.textContent = word;

//         div.onclick = function () {
//           document.getElementById("searchBox").value = word;
//           suggestionsContainer.innerHTML = "";
//         };

//         suggestionsContainer.appendChild(div);
//       });

//       if (matches.length === 0) {
//         suggestionsContainer.innerHTML = "<div class='suggestion-item'>No match</div>";
//       }
//     }
//   };
//   xhr.send();
// }





document.getElementById("searchBtn").addEventListener("click", function () {

  const company = document.getElementById("searchBox").value.trim();
  const jobTitle = document.getElementById("job-title").value;
  const experience = document.getElementById("experience").value;
  console.log("Company Name:", company);
  console.log("Job Title:", jobTitle);
  console.log("Experience:", experience);

  // You can now call a function like displayJobs() with these values
  displayJobs(company, jobTitle, experience);
});



function displayJobs(filterCompany = "", filterTitle = "", filterExperience = "") {

    console.log(AllJobs);
    for (let i = 0; i < AllJobs.length; i++) {
      const job = AllJobs[i];
      console.log("job before filter:", job);
      // Check if user is logged in and has applied to this job
      const isApplied = session.currUser?.appliedJobs?.some(appliedJob => appliedJob.id === job.id);
      
      if (isApplied) {
          continue; // Skip this job if already applied
      }
      if(filterCompany && filterCompany !== job.companyName){ 
        continue; // Skip if company name doesn't match{
      }
      if(filterTitle && filterTitle !== job.title){
        continue; // Skip if job title doesn't match
      }
      if(filterExperience && filterExperience !== job.yearsOfExperience){
        continue; // Skip if years of experience doesn't match
      }
      console.log("Job Allowed:", job);
      const jobContainer = document.getElementById("jobs-container");
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
      console.log("Job Allowed:", job);
  }
  const applyButtons = document.querySelectorAll(".apply-btn");
      applyButtons.forEach((button) => {
          button.addEventListener("click", (event) => {
              const jobId = event.target.getAttribute("data-job-id");
              const job = AllJobs.find((j) => j.id == jobId);
              console.log(session.currUser);
              if(!job.status) {
                  console.log("Job is no longer available.");
                  Swal.fire({
                      icon: "error",
                      title: "Oops...",
                      text: "This job is no longer available.",
                  });
                  return;
              }
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
// Optional: hide suggestions when clicking outside
document.addEventListener("click", function (event) {
  const box = document.getElementById("searchBox");
  const suggestions = document.getElementById("suggestions");

  if (!box.contains(event.target) && !suggestions.contains(event.target)) {
    suggestions.innerHTML = "";
  }
});


window.addEventListener("DOMContentLoaded", () => {
  loadSessionFromLocalStorage(); // Load session first
  
  displayJobs(); // Show all jobs initially

  // ✅ Add this inside the DOMContentLoaded so the element is available
  document.getElementById("searchBtn").addEventListener("click", function () {
      const company = document.getElementById("searchBox").value.trim();
      const jobTitle = document.getElementById("job-title").value.trim();
      const experience = document.getElementById("experience").value.trim();

      console.log("Search by:", company, jobTitle, experience);
      displayJobs(company, jobTitle, experience);
  });
});