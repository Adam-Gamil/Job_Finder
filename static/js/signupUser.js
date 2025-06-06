import { Users,session, User, saveUsersToLocalStorage, saveSessionToLocalStorage } from "./main.js";

function validateSignup() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();
    const email = document.getElementById("email").value.trim();

    if (username === "" || password === "" || confirmPassword === "" || email === "") {
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
    const newUser = new User(username, email, password);
    Users.push(newUser);
    session.currUser = newUser;
    saveUsersToLocalStorage();
    saveSessionToLocalStorage(); 
    window.location.href = "userDashboard.html"; 
    return true;
}
const signupButton = document.getElementById("signup-btn");
console.log(signupButton);
signupButton.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent form submission
    validateSignup();
});