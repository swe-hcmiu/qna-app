function getUserInfo() {
  const url="/api/users/info";
  axios(url)
  .then(res => {
    document.getElementById("staticUsername").value = res.data.DisplayName;
    document.getElementById("staticUserId").value = res.data.UserId;
  })
}

getUserInfo();
