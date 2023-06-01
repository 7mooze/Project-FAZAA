const db = firebase.firestore();
const form = document.querySelector('#add-event-form');
let evID = new URLSearchParams(window.location.search);

firebase.auth().onAuthStateChanged(function()
{
  db.collection("Admins").doc(firebase.auth().currentUser.uid).get().then(doc => {
    if(!(doc.exists))
    {
      firebase.auth().signOut();
      location.replace("index.html");
    }
  });
});
/*
// datepicker safari support fix
var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) {
  return p.toString() === "[object SafariRemoteNotification]";
})(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
//console.log(isSafari);
if (isSafari) { //if browser doesn't support input type="date", load files for jQuery UI Date Picker
  document.write('<link href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/base/jquery-ui.css" rel="stylesheet" type="text/css" />\n')
  document.write('<script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"><\/script>\n')
}
while (isSafari) {
  alert("Please view this site on another browser for better use!\nChrome is recommended");
  //if browser doesn't support input type="date", initialize date picker widget:
  $(document).ready(function () {
    $('#datepicker').datepicker();
    $('#datepicker1').datepicker();
  });
}
*/
if(evID.has("id"))
{
  db.collection("Events").doc(evID.get("id")).get().then(function(doc){
    titleEvent.value = doc.data().title;
    volReq.value = doc.data().volReq;
    datepicker.value = doc.data().sDate;
    datepicker1.value = doc.data().eDate;
    Stime.value = doc.data().sTime;
    Etime.value = doc.data().eTime;
    location.value = doc.data().location;
    HoursGive.value = doc.data().awardHrs;
    subject.value = doc.data().description;
    doc.ref.collection("Supervisors").get().then(collection =>
    {
      let count = 0;
      collection.forEach(doc =>
      {
        if(count == 0)
        {
          console.log("Here 1");
          seID.value = doc.id;
          count = count + 1;
        } else
        {
          let cTemp = count;
          AddSupervisor().then(() => {sDiv.children[cTemp].value = doc.id;})
          count = count + 1;
        }
      });
    });
  });
  fSubmit.value = "Update";
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('Events').doc(evID.get("id")).update({
      title: form.title.value,
      volReq: form.volReq.value,
      sDate: form.sDate.value,
      eDate: form.eDate.value,
      sTime: form.sTime.value,
      eTime: form.eTime.value,
      location: form.location.value,
      awardHrs: form.awardHrs.value,
      description: form.description.value
    });
    for(let i = 0; i < sDiv.childElementCount; i++)
    {
      let temp = sDiv.children[i].value;
      db.collection("Events").doc(evID.get("id")).collection("Supervisors").doc(temp).set({});
      db.collection("Supervisors").doc(temp).collection("history").doc(evID.get("id")).set({});
    }
    form.title.value = '';
    form.volReq.value = '';
    form.sDate.value = '';
    form.eDate.value = '';
    form.sTime.value = '';
    form.eTime.value = '';
    form.location.value = '';
    form.awardHrs.value = '';
    form.description.value = '';
    alert("The event has been updated successfully!");
  });
} else
{ 
  // saving data from form // submitting
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('Events').add({
      title: form.title.value,
      volReq: form.volReq.value,
      sDate: form.sDate.value,
      eDate: form.eDate.value,
      sTime: form.sTime.value,
      eTime: form.eTime.value,
      location: form.location.value,
      awardHrs: form.awardHrs.value,
      description: form.description.value
    }).then(doc => {
      for(let i = 0; i < sDiv.childElementCount; i++)
      {
        let temp = sDiv.children[i].value;
        db.collection("Events").doc(doc.id).collection("Supervisors").doc(temp).set({});
        db.collection("Supervisors").doc(temp).collection("history").doc(doc.id).set({});
      }
    });
    form.title.value = '';
    form.volReq.value = '';
    form.sDate.value = '';
    form.eDate.value = '';
    form.sTime.value = '';
    form.eTime.value = '';
    form.location.value = '';
    form.awardHrs.value = '';
    form.description.value = '';
    alert("The event has been submitted successfully!");
  });
}

function getSupervisors(e)
{
  let gsPromise = new Promise((resolve, reject) =>
  {
    db.collection("Supervisors").get().then(collection =>
    {
      collection.forEach(doc =>
      {
        let newOption = document.createElement("option");
        e.appendChild(newOption);
        newOption.outerHTML = `<option value="` + doc.id + `">` + doc.data().fName + ` ` + doc.data().lName + ` - ` + doc.data().school + `</option>`;
      });
    }).then(() => {resolve("Success")});
  });
  return gsPromise;
}

function AddSupervisor()
{
  let newSelect = document.createElement("select");
  sDiv.appendChild(newSelect);
  let promise = new Promise((resolve, reject) =>
  {
    getSupervisors(newSelect).then(() => resolve("Success")).catch(() => {console.log("Error")});
  });
  return promise;
}
getSupervisors(seID);