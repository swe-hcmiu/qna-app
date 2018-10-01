const closeBtn = document.getElementsByClassName("fa-times")[0];
const askBtn = document.getElementById("askBtn");
const questionForm = document.getElementsByClassName("questionForm")[0];
const urlSegments = window.location.pathname.split('/');
const sessionId = urlSegments[urlSegments.length - 1];
const submitBtn = document.getElementById("submitBtn");
let likeList = [];
let questionList = {
  newest: [],
  top10: [],
  answered: [],
};
let sessionData = null;
let roleData = null;

async function fetchData() {
  const questionsUrl = '/api/sessions/' + sessionId + '/questions';
  const likesUrl = '/api/sessions/' + sessionId + '/users/vote';
  const listOfQuestions = await axios(questionsUrl);
  likeList = await axios(likesUrl);
  localStorage.setItem('newest', listOfQuestions.filter(q => q.Status !== "ANSWERED"));
  localStorage.setItem('answered', listOfQuestions.filter(q => q.Status === "ANSWERED"));
  localStorage.setItem('likeList', likeList.data.listOfVotedQuestions.map(like => like.QuestionId));
  // questionList.newest = listOfQuestions.filter(q=> q.Status !== "ANSWERED");
  // questionList.answered = listOfQuestions.filter(q=> q.Status === "ANSWERED");
  // likeList = likeList.data.listOfVotedQuestions.map(like => like.QuestionId);
}

closeBtn.addEventListener("click", () => {
  questionForm.classList.add("undisplay");
  askBtn.classList.remove("undisplay");
})

askBtn.addEventListener("click", () => {
  questionForm.classList.remove("undisplay");
  askBtn.classList.add("undisplay");
})

// Event listener
submitBtn.addEventListener("click", function () {
  const url = "/api/sessions/" + sessionId + "/questions";
  console.log(document.getElementById("title-ask").value);
  console.log(document.getElementById("content-ask").value);

  axios.post(url, {
    title: document.getElementById("title-ask").value,
    content: document.getElementById("content-ask").value
  })
    .then(response => {
      console.log(response);
      render();
      document.getElementById("title-ask").value = '';
      document.getElementById("content-ask").value = '';
    })
    .catch(function (error) {
      console.log(error);
    });
})

// function
function init() { // Get session data
  const url = "/api/sessions/" + sessionId;
  axios.get(url)
    .then((response) => {
      sessionData = response.data.session;
      console.log(sessionData);
      // questionList.newest = response.data.listOfQuestions.filter(q=> q.Status !== "ANSWERED");
      // questionList.answered = response.data.listOfQuestions.filter(q=> q.Status === "ANSWERED");
      questionList.newest = response.data.listOfNewestQuestions;
      questionList.top10 = response.data.listOfTopFavoriteQuestions;
      questionList.answered = response.data.listOfAnsweredQuestions;
      roleData = response.data.role;
      document.getElementById("session-name").innerHTML = sessionData.SessionName;
      render();
    })
}

async function render() {
  const likesUrl = '/api/sessions/' + sessionId + '/users/vote';
  const likeList = await axios(likesUrl);
  
  renderHTML(questionList.newest, likeList.data.listOfVotedQuestions, 'newest');
  renderHTML(questionList.top10, likeList.data.listOfVotedQuestions, 'top10');
  renderHTML(questionList.answered, likeList.data.listOfVotedQuestions, 'answered');
}

function renderHTML(questionData, likeData, position) {
  likeData = likeData.map(like => like.QuestionId);
  let htmlString = '';
  questionData.forEach(question => {
    htmlString += createHtmlForPost(question, likeData.includes(question.QuestionId))
  })
  document.getElementById(position).innerHTML = htmlString;
}

function createHtmlForPost(post, isLiked) {
  let postString = `
		<div class="question d-flex py-2 w-100" id=${post.QuestionId}>
      <div class="question-info pl-2 flex-grow-1">
        <div class="question-main-info pb-1">
           <div class="d-flex">
            <p class="question-title mb-0 text-justify">${post.Title}</p>
            ${post.VoteByEditor ? '<p class="editor mb-0 ml-auto p-1 text-center">Editor Choice</p>' : ''}
          </div>
          <p class="question-content mb-0 text-justify" >
            ${post.Content}
          </p>
        </div>
        <div class="question-personal-info mt-1 d-flex">
          <p class="question-likeCount mb-1 px-2"><span class="number">${post.VoteByUser}</span> votes</p>
          <p class="question-author mb-1 pl-2">written by <span class="author">Username ${post.UserId}</span></p>
		      ${roleData === "USER" ?
      '' :
      `<div class="ml-auto mb-1">
		      	<button onclick="handlePost(this)" class="btn btn-sm btn-success approveBtn">${sessionData.SessionType === "DEFAULT" || post.Status === "UNANSWERED" ? "Answer" : "Approve"}</button>
		      	<button onclick="handlePost(this)" class="btn btn-sm btn-danger removeBtn">Remove</button>
		      </div>`}
        </div>
      </div>
	      ${
    !isLiked ?
      '<div class="question-icon p-2 m-auto"><i onclick="handleVote(this)" class="far fa-heart"></i></div>'
      : '<div class="question-icon p-2 m-auto"><i onclick="handleVote(this)" class="fas fa-heart"></i></div>'
    }
    </div>`
  return postString;
}

async function handleVote(e) {
  if (e.classList.contains("fas")) {
    unvotePost(e);
  } else {
    votePost(e);
  }
}

function votePost(e) {
  const questionId = e.parentElement.parentElement.id;
  var url = "/api/sessions/" + sessionId + "/questions/" + questionId + "/vote";
  axios.put(url)
    .then(response => {
      if (response.status == 200) {
        render();
      }
    })
    .catch(error => console.log(error));
}

function unvotePost(e) {
  const questionId = e.parentElement.parentElement.id;
  const url = "/api/sessions/" + sessionId + "/questions/" + questionId + "/vote";
  axios.delete(url)
    .then(response => {
      if (response.status == 200) {
        render();
      }
    })
    .catch(error => console.log(error));
}

function handlePost(e) {
  const questionId = e.parentElement.parentElement.parentElement.parentElement.id;
  let status;
  if (e.innerHTML === "Remove" || e.innerHTML === "Answer") {
    status = "ANSWERED";
  } else {
    status = "UNANSWERED";
  }
  // console.log(status);
  const url = "/api/sessions/" + sessionId + "/questions/" + questionId + "/status";
  axios.put(url, {
    Status: status
  }).then((response) => {
    console.log(response);
  })
  render();
}

init();

// setInterval(render, 2000);
