const db = firebase.firestore();
let auth = firebase.auth();
let evID = new URLSearchParams(window.location.search);

function loadData()
{
  db.collection("Events").doc(evID.get("id")).get().then(function(doc)
  {
    eTitle.textContent = doc.data().title;
    descData.textContent = doc.data().description;
    dateData.textContent = doc.data().sDate + " - " + doc.data().eDate;
    timeData.textContent = doc.data().sTime + " - " + doc.data().eTime;
    locData.textContent = doc.data().location;
    awardData.textContent = doc.data().awardHrs + " Hours";
  });
  db.collection("Events").doc(evID.get("id")).collection("Volunteers").get().then((collection) =>
  {
    collection.forEach((doc) =>
    {
      let table1 = tableDiv.children[0];
      let row = table1.insertRow();
      for(let i = 0; i < 6; i++)
      {
        row.insertCell();
      }
      db.collection("Students").doc(doc.id).get().then((st) =>
      {
        row.cells[0].textContent = st.data().id;
        row.cells[1].textContent = st.data().fName + " " + st.data().lName;
        row.cells[2].textContent = st.data().email;
        row.cells[3].textContent = st.data().grade + "-" + st.data().section + " " + st.data().cluster;
        row.cells[4].textContent = st.data().school;
        row.cells[5].innerHTML = `<form><input type="text"><button type="button" id="conBtn" onclick="cAttendance()">Confirm</button></form>`;
        row.cells[5].children[0].id = st.id;
        row.cells[5].children[0].children[1].setAttribute("onclick", "cAttendance(\""+st.id+"\")");
      });
    });
  });
}

function hideShow(e)
{
  if(e.style.display == "none")
  {
    e.style.display = "block";
  } else
  {
    e.style.display = "none";
  }
}

//updating number of hours variable
function updateHours(usrID){
  db.collection("Events").doc(evID.get("id")).get().then(function(doc)
  {
   var addHrs=parseInt(doc.data().awardHrs);
    var increment = firebase.firestore.FieldValue.increment(addHrs)
    db.collection("Students").doc(usrID).update({
        noHrs: increment
      }).then(function() {
        console.log("hours updated");
      });
  });
}

function cAttendance(id)
{
  let code = document.getElementById(id).children[0].value;
  db.collection("Events").doc(evID.get("id")).collection("Volunteers").doc(id).get().then((doc) =>
  {
    if(code == doc.data().vNum)
    {
      db.collection("Events").doc(evID.get("id")).collection("Volunteers").doc(id).update({tOrF: true});
      db.collection("Students").doc(id).collection("history").doc(evID.get("id")).set({});
      updateHours(id);
      changeColor(id, true);
    } else
    {
      alert("Invalid code");
      changeColor(id, false);
    }
  });
}

function changeColor(e, c)
{
  let row = document.getElementById(e).parentElement.parentElement;
  if(c === true)
  {
    row.style.background = "rgba(0, 255, 0, 0.4)";
  } else if(c === false)
  {
    row.style.background = "rgba(255, 0, 0, 0.4)";
  } else
  {
    row.style.background = "rgba(0, 0, 255, 0.4)";
  }
}

auth.onAuthStateChanged(() =>
{
  loadData();
});