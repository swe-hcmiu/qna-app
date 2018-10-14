const signUpTab = document.getElementsByClassName("signUpTab")[0];
const logInTab = document.getElementsByClassName("logInTab")[0];
const signUpForm = document.getElementsByClassName("signUpForm")[0];
const logInForm = document.getElementsByClassName("logInForm")[0];
const signUpBtn = document.getElementById("signUpBtn");
const logInBtn = document.getElementById("logInBtn");

signUpTab.addEventListener("click", () => {
  signUpTab.classList.add("active");
  logInTab.classList.remove("active");
  signUpForm.classList.remove("undisplay");
  logInForm.classList.add("undisplay");
})

logInTab.addEventListener("click", () => {
  logInTab.classList.add("active");
  signUpTab.classList.remove("active");
  logInForm.classList.remove("undisplay");
  signUpForm.classList.add("undisplay");
})

signUpBtn.addEventListener("click", () => {
  const url = "/users/register";
  const data = {
    FirstName: document.getElementById("FirstName").value,
    LastName: document.getElementById("LastName").value,
    UserName: document.getElementById("UserName").value,
    UserPass: document.getElementById("UserPass").value,
  };
  axios.post(url, { FirstName, LastName, UserName, UserPass } = data)
    .then((response) => {
      if (response.status === 200) {
        // window.location = "/users/login";
        alert("Register succesfully. You can log in.");
      } else {
        alert("Input must be between 2 and 30 characters");
      }
    });
})

logInBtn.addEventListener("click", () => {
  const url = "/users/login";
  const data = {
    username: document.getElementById("username").value,
    password: document.getElementById("password").value
  };
  // fetch(url, {
  //   method: 'POST',
  //   headers: {
  //     "Content-Type": "application/json; charset=utf-8",
  //   },
  //   body: JSON.stringify(data)
  // }).then((response) => {
  //   console.log(response);
  //   if (response.status == 200) {
  //     localStorage.setItem('token', response.data.token);
  //     window.location = "/sessions";
  //   } else {
  //     alert("User doesn't exist or wrong password");
  //   }
  // })
  axios.post(url, data)
    .then((response) => {
      console.log(response);
      if (response.status == 200) {
        localStorage.setItem('token', response.data.token);
        window.location = "/sessions";
      } else {
        alert("User doesn't exist or wrong password");
      }
    })
})
