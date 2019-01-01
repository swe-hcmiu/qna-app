const socket = io('/session');
const submitButton = document.getElementById('submit-button');
let listOfSession;

let sessionName = 'Test Socket IO';
let sessionType = 'needs_verification';

submitButton.addEventListener('click', () => {
  socket.emit('create_session', {
    session: {
      sessionName,
      sessionType,
    },
    token: localStorage.getItem('token'),
  });
});

socket.on('connect', () => {
  const data = {
    token: localStorage.getItem('token'),
  };
  socket.emit('get_session_list', data, (list) => {
    listOfSession = list;
    console.log(listOfSession);
  });
});

socket.on('receive_token', (token) => {
  console.log(token);
  localStorage.setItem('token', token);
});

socket.on('new_session_created', (session) => {
  const data = {
    token: localStorage.getItem('token'),
  };
  console.log(session);
});

socket.on('exception', (err) => {
  console.log(err);
});