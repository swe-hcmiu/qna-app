const urlSegments = window.location.pathname.split('/');
const sessionId = urlSegments[urlSegments.length - 2];
const submitBtn = document.getElementById("submitBtn");

submitBtn.addEventListener("click", function (e) {
  e.preventDefault();
  addEditor();
})

function addEditor() {
  const userId = document.getElementById("editorInput").value;
  const url = "/api/sessions/" + sessionId + "/editors/permissions";
  axios.post(url, { userId })
    .then((res) => getEditor());
}

function removeEditor(e) {
  const url = "/api/sessions/" + sessionId + "/editors/permissions";
  axios.delete(url, { userID: Number(e.id)})
    .then(res => getEditor())
    .catch(err => console.log(err));
}

function getEditor() {
  const url = "/api/sessions/" + sessionId + "/editors";
  console.log(url);
  axios.get(url)
    .then((res) => {
      console.log(res);
      let htmlString = '';
      editorList = res.data.forEach(e => {
        htmlString += '<li id='+e.UserId+' onClick="removeEditor(this)">EditorId: ' + e.UserId + '</li>'
      });
      document.getElementById("editorList").innerHTML = htmlString;
    });
}

function init() {
  const url = "/api/sessions/" + sessionId;
  axios.get(url)
    .then((response) => {
      sessionData = response.data.session;
      document.getElementById("session-name").innerHTML = sessionData.SessionName;
    });
}

init();
getEditor();
