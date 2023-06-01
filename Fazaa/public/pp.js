//firestore reference  
const db = firebase.firestore();
var usrID = "";

function renderST(doc) {
  let li = document.createElement('li');
  let Fname = document.createElement('span');
  let Lname = document.createElement('span');

  li.setAttribute('data-id', doc.id);
  Fname_field.textContent = doc.data().fName;
  Lname_field.textContent = doc.data().lName;
  ID.textContent = doc.data().id;
  School.textContent = doc.data().school;
  Grade.textContent = doc.data().grade;
  Cluster.textContent = doc.data().cluster;
  Email.textContent = doc.data().email;
  ppNAME.textContent = doc.data().username + "'s Profile";
  hrs.textContent = doc.data().noHrs;
}

// getting Students from DB
window.onload = function () {
  db.collection('Students').get().then(snapshot => {
    snapshot.docs.forEach(doc => {
      var userID = firebase.auth().currentUser.uid;
      if (doc.data().usrID === userID) {
        renderST(doc);
      }
    });
  });
}