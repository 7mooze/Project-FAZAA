const db = firebase.firestore();
let auth = firebase.auth();
let collSize = 0;

function check()
{
  db.collection("Supervisors").doc(auth.currentUser.uid).collection("history").get().then(function(collection)
  {
    if(collection.size !== 0)
    {
      collection.forEach(function(i)
      {
        db.collection("Events").doc(i.id).get().then(function(ii)
        {
          let reff = ii.ref;
          reff.collection("Volunteers").get().then((col) =>
          {
            collSize = col.size;
            console.log(col.size);
          }).then(() =>
          {
            if(Date.parse(ii.data().eDate) >= Date.parse(Date()))
            {
              var enr = document.getElementById("enrolledE");
              var div = document.createElement('div');
              div.innerHTML = `<div class="card">
                <h3>` + ii.data().title + `</h3>
                <p>Volunteers registered/required : ` + collSize + `/` + ii.data().volReq + `</p>
                <p>Date : ` + ii.data().sDate + `</p>
                <button class="button" type="button" onclick="redirect1(this)">Details</button>
                </div>`;
              div.setAttribute('id', "column");
              div.setAttribute('class', ii.id);
              enr.prepend(div);
            }
          });
        });
      });
    } else if(collection.size === 0)
    {
      none.style.display = "inherit";
    }
  });
}

function redirect1(e)
{
  var lnk = "/supervisorEvents.html?id=" + e.parentElement.parentElement.getAttribute("class");
  window.location.href = lnk;
}

auth.onAuthStateChanged(() =>
{
  check();
});