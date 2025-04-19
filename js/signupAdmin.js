import { Users,session, Admin } from "./main.js";

function validateSignup() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();
    const email = document.getElementById("email").value.trim();
    const companyName = document.getElementById("companyName").value.trim();

    if (username === "" || password === "" || confirmPassword === "" || email === "" || companyName === "") {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "please fill in all fields.",
          });
        return false;
    }
    const user = Users.find((user) => (user.name === username || user.email === email));
    if (user) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "There is user with the same username or email.",
          });
        return false;
    }
    if (password !== confirmPassword) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "passwords do not match.",
          });
        return false;
    }
    const newAdmin = new Admin(username, email, password, companyName);
    Users.push(newAdmin);
    session.currUser = newAdmin;
    saveJobsToLocalStorage();
    saveUsersToLocalStorage();
    window.location.href = "adminDashboard.html";
    return true;
}
const signupButton = document.getElementById("signup-btn");
console.log(signupButton);
signupButton.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent form submission
    validateSignup();
});