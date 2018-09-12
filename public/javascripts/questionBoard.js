const addQuestionBtn = document.getElementById("addQuestionBtn");
function getJSON() {
  const url='api/sessions/5';
  axios.get(url).then(res => render(res.data.listOfQuestions));
}

function createHtmlForPost(post) {
  let postString = `
  <div class="row userPost" id="1">
    <div class="col-md-3 user" id="post${post.QuestionId}">
      <img src="#" class="img-circle avatarUser">
      <div class="userName">User ${post.UserId}</div>
    </div>
    <div class="col-md-9  content">
      <div class="row" id="titlePost">${post.Title}</div>
      <div class="row" id="contentPost">${post.Content}</div>
    </div>
    <hr class="style14">
    <div class="row infoPost">
      <span class="timePost">1h ago</span>
      <span><i class="fas fa-heart" id="btn1"></i></span>
      <span class="voteAmount"><span class="bold" id="like1">${post.VoteByUser}</span> votes</span>
      <span class="rating bold"> #1</span>
    </div>
  </div> `
  return postString;
}

function render(data) {
  // const data = getData();
  let htmlString = '<div class="row top10" >QUESTIONS</div>';
  data.forEach((post) => {
    postString = createHtmlForPost(post);
    htmlString += postString;
  })
  // console.log(htmlString);
  document.getElementById("top10Table").innerHTML = htmlString;
}

function setButtons() {
  const likeButtons = document.getElementByClass("")
}

addQuestionBtn.addEventListener("click", function() {
  // action="http://dcd85867.ap.ngrok.io/sessions/5/questions" method="post"
  const url="http://dcd85867.ap.ngrok.io/sessions/5/questions";


  axios.post(url, {
    title: document.getElementById("title-ask").value,
    content: document.getElementById("content-ask").value
  })
  .then(function (response) {
    console.log(response);
    getJSON();
    document.getElementById("title-ask").value = '';
    document.getElementById("content-ask").value = '';
  })
  .catch(function (error) {
    console.log(error);
  });
})

getJSON();
