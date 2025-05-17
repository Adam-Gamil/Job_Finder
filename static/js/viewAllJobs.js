
                   

    



function toggleDetails(jobId) {
        const details = document.getElementById(`details-${jobId}`);
        const arrow = document.getElementById(`arrow-${jobId}`);
        details.classList.toggle('active');
        arrow.textContent = details.classList.contains('active') ? '▲' : '▼';
    }
function applyForJob() {
    Swal.fire({
        icon: "success",
        title: "Success",
        text: "You have successfully applied for the job.",
    });
}