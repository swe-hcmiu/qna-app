const socket = io('/session');

socket.on('connect', () => {
  const data = {
    token: localStorage.getItem('token'),
  };
  socket.emit('get_session_list', data, (listOfSession) => {
    let HTMLString = '';
    listOfSession.forEach((session) => {
      HTMLString += `<li><a href="/sessions/${session.SessionId}">${session.SessionName}</a></li>`;
    });
    document.getElementById("sessionList").innerHTML = HTMLString;
  });
});

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

socket.on('exception', (err) => {
  alert(err);
});
