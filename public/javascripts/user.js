function getUserInfo() {
  const url="";
  fetch(url)((
  .then(res => {
    document.getElementById("staticUsername").innerHTML = res.Username;
    document.getElementById("staticUserId").innerHTML = res.UserId;
    document.getElementById("staticFirstName").innerHTML = res.FirstName;
    document.getElementById("staticLastName").innerHTML = res.LastName;
  })
}

getUserInfo();
