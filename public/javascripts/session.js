function getSession() {
  // fetch('/api/sessions')
  // .then(response => {
  //   console.log(response);
  //   var HTMLString = '';
  //   response.forEach(session => {
  //     HTMLString += `<li><a href="/session/${session.id}">Session ${session.name}</a></li>`
  //   })
  //   document.getElementById("questionList").innerHTML = HTMLString;
  // })
  // .catch((err) => {console.log(err)})
  axios.get('/api/sessions')
    .then((response) => {
      let HTMLString = '';
      console.log(response);
      response.data.forEach((session) => {
        HTMLString += `<li><a href="/sessions/${session.SessionId}">Session ${session.SessionName}</a></li>`;
      });
      document.getElementById("questionList").innerHTML = HTMLString;
    });
}

getSession();
