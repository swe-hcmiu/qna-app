function getSession() {
  fetch('/api/sessions')
  .then(response => {
    var HTMLString = '';
    response.forEach(session => {
      HTMLString += `<li><a href="/sessions/${session.id}">${session.name}</a></li>`
    })
    document.getElementById("sessionList").innerHTML = HTMLString;
  })
  .catch((err) => {console.log(err)})
}

getSession();
