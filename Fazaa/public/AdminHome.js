const db = firebase.firestore();
var mainList = document.getElementById("events_div");
var auth = firebase.auth();

auth.onAuthStateChanged(function()
{
  db.collection("Admins").doc(auth.currentUser.uid).get().then(function(doc)
  {
    if(!(doc.exists))
    {
      auth.signOut();
      location.replace("/index.html");
    }
  });
});


function check()
{
  db.collection("Events").get().then(function(collection){
    collection.forEach(function(doc){
      var enr = document.getElementById("events_div");
      var div = document.createElement('div');
      div.innerHTML = ` <div class="card">
        <h3>` + doc.data().title + `</h3>
        <p>Volunteers required : ` + doc.data().volReq + ` </p>
        <p>Award : ` + doc.data().awardHrs + ` Fazaa Hours</p>
        <button class="button" type="button" onclick="redirect1(this)">Modify</button>
        </div>`;
      div.setAttribute('id', "column");
      div.setAttribute('class', doc.id);
      enr.prepend(div);
    });
  });
}
check();

function redirect1(e) {
  var lnk = "/AdminEvent.html?id=" + e.parentElement.parentElement.getAttribute("class");
  window.location.href = lnk;
}

function hideShow(e, i)
{
  if(e.style.display == "none")
  {
    if(e.id === "database" && table1.rows.length === 1)
    {
      db.collection("Students").get().then(function(collection){
        collection.forEach(function(st){
          let row = table1.insertRow()
          for(var i = 0; i < 7; i++)
          {
            row.insertCell();
          }
          row.cells[0].textContent = st.data().id;
          row.cells[1].textContent = st.data().fName + " " + st.data().lName;
          row.cells[2].textContent = st.data().email;
          row.cells[3].textContent = st.data().school;
          row.cells[4].textContent = st.data().grade + "-" + st.data().section + " " + st.data().cluster;
          row.cells[5].textContent = st.data().noHrs;
          row.cells[6].innerHTML = `<button class="hBtn" type="button" id="`+ st.id +`" onclick="redirect(this)">History</button>`;
        });
      });
    }
    e.style.display = "block";
    i.textContent = "Hide";
    
  } else
  {
    e.style.display = "none";
    i.textContent = "Show";
  }
}

function redirect(e)
{
  let lnk = "/adminHistory.html?id=" + e.id
  window.location.href = lnk;
}