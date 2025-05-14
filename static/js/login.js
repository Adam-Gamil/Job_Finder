import { Users,User,session, Admin, saveSessionToLocalStorage } from "./main.js";

function validateLogin() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (username === "" || password === "") {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "please fill in all fields.",
          });
        return false;
    }

    const user = Users.find((user) => (user.name === username || user.email === username) && user.password === password);
    // console.log(user);
    if (!user) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "invalid username or password.",
          });
        return false;
    }
    session.currUser = user;
    saveSessionToLocalStorage(); 
    if (user.isadmin) {
        window.location.href = "adminDashboard.html";
    } else {
        window.location.href = "userDashboard.html";
    }
    return true;
    //save the user to local storage in the future
    // localStorage.setItem("currUser", JSON.stringify(currUser));
}
const loginButton = document.getElementById("login-btn");
console.log(loginButton);
loginButton.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent form submission
    validateLogin();
});