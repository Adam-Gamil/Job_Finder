document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('searchBtn');
    const jobsContainer = document.getElementById('jobs-container');
    const searchForm = document.querySelector('.search-form-container');
    
    // Function to load jobs (used by both initial load and search)
    function loadJobs(params = '') {
        fetch(`/searchJob/?${params}`)
            .then(response => response.text())
            .then(html => {
                // Extract just the job cards from the response
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;
                const jobCards = tempDiv.querySelector('#jobs-container').innerHTML;
                
                // Only update the jobs container, not the whole page
                jobsContainer.innerHTML = jobCards;
                
                // Reattach event listeners to new elements
                attachToggleListeners();
            })
            .catch(error => {
                console.error('Error:', error);
                jobsContainer.innerHTML = '<p>Error loading jobs. Please try again.</p>';
            });
    }

    // Attach toggle listeners to job details buttons
    function attachToggleListeners() {
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const jobId = this.getAttribute('data-job-id');
                toggleDetails(jobId);
            });
        });
    }

    // Search button handler
    searchBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        const companySearch = document.getElementById('searchBox').value;
        const jobTitle = document.getElementById('job-title').value;
        const minExp = document.getElementById('min-experience').value;
        const maxExp = document.getElementById('max-experience').value;
        const minSalary = document.getElementById('min-salary').value;
        const maxSalary = document.getElementById('max-salary').value;
        
        // Build query string
        const params = new URLSearchParams();
        if (companySearch) params.append('company', companySearch);
        if (jobTitle) params.append('title', jobTitle);
        params.append('min_exp', minExp);
        params.append('max_exp', maxExp);
        params.append('min_salary', minSalary);
        params.append('max_salary', maxSalary);
        
        loadJobs(params.toString());
    });
    
    // Initial load
    loadJobs();
});

// Toggle function remains the same
function toggleDetails(jobId) {
    const details = document.getElementById(`details-${jobId}`);
    const arrow = document.getElementById(`arrow-${jobId}`);
    details.classList.toggle('active');
    arrow.textContent = details.classList.contains('active') ? '▲' : '▼';
}