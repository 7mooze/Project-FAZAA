// This file is for events.html. All code related to home.html has been moved to eventsHome.js.
const db = firebase.firestore();
var auth = firebase.auth();
var usrID = "";
var evID = new URLSearchParams(window.location.search); // Get the event ID using evID.get("id")

function loadData()
{
  let sd;
  db.collection("Events").doc(evID.get("id")).get().then(function(doc)
  {
    eTitle.textContent = doc.data().title;
    descData.textContent = doc.data().description;
    dateData.textContent = doc.data().sDate + " - " + doc.data().eDate;
    timeData.textContent = doc.data().sTime + " - " + doc.data().eTime;
    locData.textContent = doc.data().location;
    awardData.textContent = doc.data().awardHrs + " Hours";
    sd = doc.data().sDate;
  });
  db.collection("Events").doc(evID.get("id")).collection("Volunteers").doc(auth.currentUser.uid).get().then(doc =>
  {
    if(doc.exists && (Date.parse(sd) <= Date.parse(Date())))
    {
      multiBtn.outerHTML = `<button class="button" id="multiBtn" type="button" onclick="retrieveN()">Generate Code</button>`;
    } else if(doc.exists && Date.parse(sd) >= Date.parse(Date()))
    {
      multiBtn.setAttribute("onclick", "alert(\"You have already registered at this event. Check this page again when the event starts.\")");
    }
  });
}

function signup() {
  let cd = getRINT().toString(10);
  db.collection("Students").doc(usrID).collection("history").doc(evID.get("id")).get().then(function(doc)
  {
    if(doc.exists)
    {
      alert("You have already volunteered at this event");
    } else
    {
      db.collection("Events").doc(evID.get("id")).collection("Volunteers").doc(usrID).set({
        vNum: cd,
        tOrF: false
      });
      alert("You registered successfully! Make sure to attend the event to get the hours.");
    }
  })
}

// getting Students from DB
db.collection('Students').get().then(function (snapshot) {
  snapshot.forEach(function (doc) {
    if (doc.data().usrID === auth.currentUser.uid)
    {
      usrID = doc.id;
    }
  });
});

function getRINT()
{
  return Math.floor(Math.random() * 1000000);
}

function retrieveN()
{
  db.collection("Events").doc(evID.get("id")).collection("Volunteers").doc(usrID).get().then(doc =>
  {
    alert("You code is " + doc.data().vNum);
  });
}

auth.onAuthStateChanged(() =>
{
  loadData();
});