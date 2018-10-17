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

// socket io part

const socket = io('/session');

const submitButton = document.getElementById('submit-button');
submitButton.addEventListener('click', () => {
  const sessionName = document.getElementById('nameSession').value;
  let sessionType;
  const checkbox = document.getElementsByName('sessionType');
  for (let i = 0; i < checkbox.length; i++) {
    if (checkbox[i].checked) sessionType = checkbox[i].value;
  }
  socket.emit('create_session', {
    sessionName,
    sessionType,
    token: localStorage.getItem('token'),
  });
});

socket.on('receive_token', (token) => {
  localStorage.setItem('token', token);
});

socket.on('new_session_created', (session) => {
  console.log(session);
  alert(`session ${session.sessionName} has been created`);
});

socket.on('error', (err) => {
  alert(err);
});
