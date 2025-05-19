document.addEventListener("DOMContentLoaded", () => {
  // Handle delete with SweetAlert confirmation
  function attachDeleteListeners() {
    const deleteForms = document.querySelectorAll(".inline-form"); // updated from .delete-form

    deleteForms.forEach(form => {
      const deleteButton = form.querySelector(".btn-delete");

      if (deleteButton) {
        deleteButton.addEventListener("click", async (e) => {
          e.preventDefault(); // Stop form from auto-submitting

          const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "This job will be permanently deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
          });

          if (confirm.isConfirmed) {
            form.submit(); // Only submit if user confirms
          }
        });
      }
    });
  }

  // Optional: Add animation to Edit button
  function attachEditListeners() {
    const editButtons = document.querySelectorAll(".btn-edit");

    editButtons.forEach(button => {
      button.addEventListener("click", () => {
        button.classList.add("clicked");
        setTimeout(() => {
          button.classList.remove("clicked");
        }, 200);
      });
    });
  }

  attachDeleteListeners();
  attachEditListeners();
});
