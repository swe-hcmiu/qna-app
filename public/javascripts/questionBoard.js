const closeBtn = document.getElementsByClassName("fa-times")[0];
const askBtn = document.getElementById("askBtn");
const questionForm = document.getElementsByClassName("questionForm")[0];
const urlSegments = window.location.pathname.split('/');
const sessionId = urlSegments[urlSegments.length - 1];
const submitBtn = document.getElementById("submitBtn");
const newestTab = document.getElementById("newest-tab")
let likeList = [];
let listOfNewestQuestions=[];
let listOfTopFavoriteQuestions=[];
let listOfAnsweredQuestions=[];
let listOfPendingQuestions=[];
let listOfWaitingQuestions=[];
let sessionData = null;
let roleData = null;

// socket io part
const socket = io('/session');

socket.on('connect', () => {
  const data = {
    token: localStorage.getItem('token'),
    sessionId,
  };
  socket.emit('join_room', data);
  socket.emit('get_room_data', data, (roomData) => {
    console.log(roomData);
  });
});

socket.on('receive_token', (token) => {
  console.log(token);
  localStorage.setItem('token', token);
});

socket.on('new_user_entered', (user) => {
  console.log(user);
  console.log(`${user} have entered`);
});

socket.on('user_leave_room', (user) => {
  console.log(user);
  console.log(`${user} have left`);
});

submitBtn.addEventListener('click', () => {
  const data = {
    question: {
      title: 'Test socket io question',
      content: 'Test socket io question',
    },
    token: localStorage.getItem('token'),
  };
  socket.emit('create_question', data);
});

socket.on('new_question_created', (question) => {
  console.log(question);
});

function votePost() {
  const data = {
    questionId: 2,
    token: localStorage.getItem('token'),
  };
  socket.emit('create_vote', data);
}

function unvotePost() {
  const data = {
    questionId: 2,
    token: localStorage.getItem('token'),
  };
  socket.emit('cancle_vote', data);
}

socket.on('new_vote_created', async (data) => {
  console.log(data);
});

socket.on('new_vote_deleted', (data) => {
  console.log(data);
});

function handlePost() {
  const data = {
    questionId: 2,
    status: 'answered',
    token: localStorage.getItem('token'),
  };
  socket.emit('change_question_status', data);
}

socket.on('question_status_changed', (data) => {
  console.log(data);
})

socket.on('question_top10_changed', (data) => {
  console.log(data);
});

socket.on('exception', (err) => {
  console.log(err);
});