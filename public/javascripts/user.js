function getUserInfo() {
  const url="/api/users/info";
  axios(url)
  .then(res => {
    document.getElementById("staticUserName").value = res.data.DisplayName;
    document.getElementById("staticUserId").value = res.data.UserId;
  })
}

getUserInfo();
