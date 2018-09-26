function getSession() {
  fetch('/api/sessions')
  .then(response => response.json())
  .then(response => {
    var HTMLString = '';
    response.forEach(session => {
      HTMLString += `<li><a href="/sessions/${session.SessionId}">${session.SessionName}</a></li>`
    });
    document.getElementById("sessionList").innerHTML = HTMLString;
  })
  .catch((err) => {console.log(err)})
}

getSession();