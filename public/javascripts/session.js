const socket = io('/session');
const submitButton = document.getElementById('submit-button');
let listOfSession;

function renderSession() {
  let HTMLString = '';
  listOfSession.forEach((session) => {
    HTMLString += `<li><a href="/sessions/${session.SessionId}">${session.SessionName}</a></li>`;
  });

  document.getElementById("sessionList").innerHTML = HTMLString;
}
// enable Notification on browser
function initNotification() {
  if (window.Notification) {
    Notification.requestPermission((permission) => {
      if(permission==="granted") {
        notificationEnable = true;
      } else {
        // alert("Not supported");
      }
    })
  }
}

function showNotification(title, body) {
  if(notificationEnable) {
    let notification = new Notification(title, { body });

    setTimeout(()=> {notification.close()}, 3000);
  } else {
    alert(title, body);
  }
}

submitButton.addEventListener('click', () => {
  const sessionName = document.getElementById('nameSession').value;
  let sessionType;
  const checkbox = document.getElementsByName('sessionType');
  for (let i = 0; i < checkbox.length; i++) {
    if (checkbox[i].checked) sessionType = checkbox[i].value;
  }
  const title = 'Simple Title';
  const options = {
    body: 'Simple piece of body text.\nSecond line of body text :)'
  };

  socket.emit('create_session', {
    sessionName,
    sessionType,
    token: localStorage.getItem('token'),
  });
});

socket.on('connect', () => {
  initNotification();
  const data = {
    token: localStorage.getItem('token'),
  };
  socket.emit('get_session_list', data, (list) => {
    listOfSession = list;
    renderSession();
  });
});

socket.on('receive_token', (token) => {
  localStorage.setItem('token', token);
});

socket.on('new_session_created', (session) => {
  showNotification("New session is created.", session.sessionName);
  const data = {
    token: localStorage.getItem('token'),
  };
  socket.emit('get_session_list', data, (list) => {
    listOfSession = list;
    renderSession();
  });
});

socket.on('exception', (err) => {
  alert("Error: "+ err.code);
});
