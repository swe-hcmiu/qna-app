const urlSegments = window.location.pathname.split('/');
const sessionId = urlSegments[urlSegments.length - 2];
const submitBtn = document.getElementById("submitBtn");

submitBtn.addEventListener("click", function (e) {
  e.preventDefault();
  addEditor();
})

function addEditor() {
  // const data = { UserId: Number(document.getElementById("editorInput").value) };
  // const url = "/api/sessions/" + sessionId + "/editors/permissions";
  // fetch(url, {
  //   method: 'PUT',
  //   body: JSON.stringify(data),
  //   headers: {
  //     'Content-Type': 'application/json'
  //   }
  // }).then(response => getEditor())
  //   .catch(error => console.error('Error:', error));
  const userId = document.getElementById("editorInput").value;
  const url = "/api/sessions/" + sessionId + "/editors/permissions";
  axios.post(url, { userId })
    .then((res) => getEditor());
}

function getEditor() {
  const url = "/api/sessions/" + sessionId + "/editors";
  console.log(url);
  axios.get(url)
    .then((res) => {
      console.log(res);
      let htmlString = '';
      editorList = res.data.forEach(e => {
        htmlString += '<li>EditorId: ' + e.UserId + '</li>'
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
