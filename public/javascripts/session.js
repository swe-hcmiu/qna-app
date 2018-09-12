function getSession() {
  fetch('/api/sessions')
  .then(response => {
    var HTMLString = '';
    response.forEach(session => {
      HTMLString += `<li><a href="/session/${session.id}">Session ${session.name}</a></li>`
    })
    document.getElementById("questionList").innerHTML = HTMLString;
  })
  .catch((err) => {console.log(err)})
}

getSession();
