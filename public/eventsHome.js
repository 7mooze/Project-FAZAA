const db = firebase.firestore();
let mainList = document.getElementById("events_div");
let auth = firebase.auth();
let collSize = 0;

// getting Students from DB
db.collection('Students').get().then(function (snapshot) {
  snapshot.forEach(function (doc) {
    if (doc.data().usrID === auth.currentUser.uid) {
      usrID = doc.id;
      check();
    }
  });
});

function check()
{
  db.collection("Events").get().then(function(collection)
  {
    collection.forEach((event) =>
    {
      event.ref.collection("Volunteers").get().then((collection) =>
      {
        collSize = collection.size;
      }).then(() =>
      {
        event.ref.collection("Volunteers").doc(auth.currentUser.uid).get().then((doc) =>
        {
          if(doc.exists)
          {
            compareDates(event);
          }
        });
      });
    });
  });
}

function compareDates(ii)
{
  if(Date.parse(ii.data().eDate) >= Date.parse(Date()))
  {
    var enr = document.getElementById("enrolledE");
    var div = document.createElement('div');
    div.innerHTML = ` <div class="card">
      <h3>` + ii.data().title + `</h3>
      <p>Volunteers registered/required : ` + collSize + `/` + ii.data().volReq + ` </p>
      <p>Award : ` + ii.data().awardHrs + ` Fazaa Hours</p>
      <button class="button" type="button" onclick="redirect1(this)">Details</button>
      </div>`;
    div.setAttribute('id', "column");
    div.setAttribute('class', ii.id);
    enr.prepend(div);
  }
}

//get data
db.collection("Events").onSnapshot(function (snapshot) {
  snapshot.docChanges().forEach(function (change) {
    if (change.type === "added") {
      let eventID = change.doc.id;
      let eventData = change.doc.data();
      eventid = eventID;
      if(Date.parse(eventData.eDate) > Date.parse(Date()))
      {
        var div = document.createElement('div');
        div.innerHTML = ` <div class="card">
            <h3>` + eventData.title + `</h3>
            <p>Volunteers required : ` + eventData.volReq + ` </p>
            <p>Award : ` + eventData.awardHrs + ` Fazaa Hours</p>
            <button class="button" type="button" onclick="redirect1(this);">Volunteer</button>
          </div>`;
        div.setAttribute('id', "column");
        div.setAttribute('class', eventID);
        document.getElementById("events_div").prepend(div);
      }
    } else if (change.type === "removed") {
      //
    }
  });
});

function redirect1(e)
{
  var lnk = "/events.html?id=" + e.parentElement.parentElement.getAttribute("class");
  window.location.href = lnk;
}
/*
function signup(okay) {
  var eventidd = okay.parentElement.parentElement.getAttribute('class');
  console.log("my name is" + okay.parentElement.parentElement.getAttribute('class'));

  db.collection("Students").doc(usrID).collection("history").doc(eventidd).set({

  });


  console.log("user id is " + usrID + " added event id is " + eventidd);

}
*/