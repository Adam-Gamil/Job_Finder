document.addEventListener("DOMContentLoaded", () => {
  // Handle edit form submission with SweetAlert
  function attachEditListeners() {
    const editForm = document.querySelector("form"); // or a more specific selector

    if (!editForm) return;

    editForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Validate salary
      const minSalary = parseInt(editForm.querySelector('[name="min_salary"]').value);
      const maxSalary = parseInt(editForm.querySelector('[name="max_salary"]').value);
      if (minSalary > maxSalary) {
        await Swal.fire({
          icon: "error",
          title: "Invalid Salary Range",
          text: "Minimum salary cannot be greater than maximum salary",
        });
        return;
      }

      // Validate experience
      const minExp = parseInt(editForm.querySelector('[name="min_experience"]').value);
      const maxExp = parseInt(editForm.querySelector('[name="max_experience"]').value);
      if (minExp > maxExp) {
        await Swal.fire({
          icon: "error",
          title: "Invalid Experience Range",
          text: "Minimum experience cannot be greater than maximum experience",
        });
        return;
      }

      // Show confirmation before submitting
      const confirm = await Swal.fire({
        title: "Update Job?",
        text: "Are you sure you want to update this job?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, update it!",
        cancelButtonText: "Cancel",
      });

      if (confirm.isConfirmed) {
        // Show success message
        await Swal.fire({
          icon: "success",
          title: "Updating Job...",
          showConfirmButton: false,
          timer: 2000,
        });

        // Submit form after confirmation and success message
        editForm.submit();
      }
    });
  }

  attachEditListeners();
});
