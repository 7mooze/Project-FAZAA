// Please don't play with my code.
// Instead of modifying finished pages, why not work on other required and unfinished pages.
let db = firebase.firestore();
let auth = firebase.auth();
let usrID = "";
let arr = [];
let collectionSize = 0;
let urlID = new URLSearchParams(window.location.search);

function modifyTable(doc2) // Document ID passed here is event document ID in the history collection.
{
    console.log("Document ID " + doc2);
    var numOfRows = table1.rows.length;
    var row = table1.insertRow();
    for (var i = 0; i < 5; i++)
    {
        var c = row.insertCell();
    }
    db.collection("Events").doc(doc2).get().then(function(doc) {
        row.cells[0].innerHTML = doc.data().sDate;
        getS(doc.id, row);
        row.cells[2].innerHTML = doc.data().title;
        row.cells[3].innerHTML = doc.data().location;
        row.cells[4].innerHTML = doc.data().awardHrs;
        updateHours(urlID.get("id"),doc);
    });
}

function getS(docid, r)
{
  db.collection("Events").doc(docid).collection("Supervisors").limit(1).get().then((collection) =>
  {
    collection.forEach((doc) =>
    {
      db.collection("Supervisors").doc(doc.id).get().then((sv) =>
      {
        r.cells[1].innerHTML = sv.data().fName + " " + sv.data().lName;
      });
    });
  });
}

function renderST(doc1) {
    ppNAME.textContent = doc1.data().username;
    ppNAME.append("'s History List");
    console.log("doc1 " + doc1.id);
    doc1.ref.collection("history").get().then(function (collection)
    {
        collectionSize=collection.size;
        console.log("Collection Size: " + collection.size);
        if(collectionSize == 0)
        {
          updateHoursZ();
        }
        for (var i of collection.docs)
        {
            modifyTable(i.id);
        }
    });
}

/**updating number of hours variable (modified) --> it will sum the hours in the history
 * table and set the sum as the number of hours in the database. so that old events that
 * exist before signing up for events from the home page// or if the history documents 
 * are modified or deelted manually, the noHrs variable will be updated.
*/
function updateHours(usrID,doc){

    arr.push(parseInt(doc.data().awardHrs))
    var sum=0;
    if (arr.length==collectionSize) {
        
        arr.forEach(element => {
          sum+=element;
        });
        console.log("sum "+sum);
    }

      console.log("award hours "+doc.data().awardHrs);
      var addHrs=parseInt(sum);
  
      db.collection("Students").doc(usrID).update({
      
          noHrs: addHrs
          
        }).then(function() {
          console.log("hours updated");
        });
  }

function updateHoursZ()
{
  db.collection("Students").doc(urlID.get("id")).update({noHrs: 0}).then(() => {console.log("Updated with 0.")})
}


db.collection("Students").doc(urlID.get("id")).get().then((doc) =>
{
  renderST(doc);
});