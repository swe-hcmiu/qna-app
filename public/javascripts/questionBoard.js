const closeBtn = document.getElementsByClassName("fa-times")[0];
const askBtn = document.getElementById("askBtn");
const questionForm = document.getElementsByClassName("questionForm")[0];
const urlSegments = window.location.pathname.split('/');
const sessionId = urlSegments[urlSegments.length-1];
const submitBtn = document.getElementById("submitBtn");
let likeList = [];
let questionList = [];
let sessionData = null;

closeBtn.addEventListener("click", () => {
	questionForm.classList.add("undisplay");
	askBtn.classList.remove("undisplay");
})

askBtn.addEventListener("click", () => {
	questionForm.classList.remove("undisplay");
	askBtn.classList.add("undisplay");
})

// Event listener
submitBtn.addEventListener("click", function() {
  const url="/api/sessions/"+sessionId+"/questions";

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
async function getQuestionData() {
  const url='api/sessions/'+sessionId+'/questions';
  axios.get(url).then(res => {
  	questionList = res.data.listOfQuestions;
  });
}

function init() { // Get session data
	const url = "/api/sessions/"+sessionId;
	axios.get(url)
	.then((response)=> {
		sessionData = response.data.session;
		document.getElementById("session-name").innerHTML= sessionData.SessionName;
		render();
	})
}
async function render() {
	const questionsUrl='/api/sessions/'+sessionId+'/questions';
	const likesUrl='/api/sessions/'+sessionId+'/users/vote';
	const questionsPromise = axios(questionsUrl);
  const likesPromise = axios(likesUrl);

  const [questionList, likeList] = await Promise.all([questionsPromise, likesPromise]);

	renderHTML(questionList.data.listOfQuestions, likeList.data.listOfVotedQuestions, 'top10');
}

function renderHTML(questionData, likeData, position) {
	likeData = likeData.map(like => like.QuestionId);
  let htmlString='';
	questionData.forEach(question => {
		htmlString+= createHtmlForPost(question, likeData.includes(question.QuestionId))
	})
	document.getElementById(position).innerHTML=htmlString;
}

function createHtmlForPost(post, isLiked) {
  console.log(post);
  console.log(isLiked);
  let postString = `
		<div class="question d-flex py-2" id=${post.QuestionId}>
      <div class="question-info pl-2 flex-grow-1">
        <div class="question-main-info pb-1">
           <div class="d-flex">
            <p class="question-title mb-0">${post.Title}</p>
            ${post.VoteByAdmin ? '<p class="editor mb-0 ml-auto p-1">Editor Choice</p>':''}
          </div>
          <p class="question-content mb-0">
            ${post.Content}
          </p>
        </div>
        <div class="question-personal-info mt-1 d-flex">
          <p class="question-likeCount mb-1 px-2"><span class="number">${post.VoteByUser}</span> votes</p>
          <p class="question-author mb-1 pl-2">written by <span class="author">Username ${post.UserId}</span></p>
		      ${sessionData.role === "USER" ?
		      '':
		      `<div class="ml-auto mb-1">
		      	<button onclick="handlePost" class="btn btn-sm btn-success approveBtn">${sessionData.SessionType==="DEFAULT" || post.Status==="UNANSWERED" ? "Answer":"Approve"}</button>
		      	<button onclick="handlePost" class="btn btn-sm btn-danger removeBtn">Remove</button>
		      </div>`}
        </div>
      </div>
      ${
      	isLiked ?
      	'<div class="question-icon p-2 m-auto"><i onclick="unvotePost(this)" class="far fa-heart"></i></div>'
      	: '<div class="question-icon p-2 m-auto"><i onclick="votePost(this)" class="fas fa-heart"></i></div>'
      }
    </div>`
  return postString;
}

function votePost(e) {
  const questionId = e.parentElement.parentElement.id;
  var url= "/api/sessions/"+sessionId+"/questions/"+questionId+"/vote";
  axios.put(url)
  .then(response => {
    if(response.status == 200) {
      e.classList.toggle("fas");
      e.classList.toggle("far");
    }})
  .catch(error => console.log(error));
}

function unvotePost(e) {
  const questionId = e.parentElement.parentElement.id;
  const url= "/api/sessions/"+sessionId+"/questions/"+questionId+"/vote";
  axios.delete(url)
  .then(response => {
    if(response.status == 200) {
      e.classList.toggle("fas");
      e.classList.toggle("far");
    }})
  .catch(error => console.log(error));
}

function handlePost(e) {
	let status;
	if(e.innerHTML === "Remove" || e.innerHTML === "Answer") {
    status = "ANSWERED";
  } else {
    status = "UNANSWERED";
  }
	const url = "/api/sessions/"+sessionId+"/questions/"+questionId+"/status";
	axios.post(url, {
		Status: status
	})
}


init();
