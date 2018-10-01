const urlSegments = window.location.pathname.split('/');
const sessionId = urlSegments[urlSegments.length-1];
const submitBtn = document.getElementById("submitBtn");

submitBtn.addEventListener("click", function(e) {
  e.preventDefault();
  addEditor();
})

function addEditor() {
  const data = {UserId: Number(document.getElementById("editorInput").value())};
  const url = "/api/sessions/"+sessionId+"/editors/permissions";
  fetch(url, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers:{
      'Content-Type': 'application/json'
    }
  }).then(response => getEditor())
  .catch(error => console.error('Error:', error));
}

function getEditor() {
  const url = "/api/sessions/"+sessionId+"/editors";
  fetch(url).then(res => {
    let htmlString = '';
    editorList = res.forEach(e => {
      htmlString+='<li>EditorId: '+e.id+'</li>'
    });
    document.getElementById("editorList").innerHTML = htmlString;
  });
}

getEditor();
