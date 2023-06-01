// Please don't play with my code, It's finally working.
const db = firebase.firestore();
const auth = firebase.auth();

/*
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
*/

document.getElementById("type").addEventListener("click", changeForm);

function changeForm()
{
  if(document.forms[0].elements[0].value === "Supervisors")
  {
    console.log("Executed");
    grade.disabled = true;
    cluster.disabled = true;
    section.disabled = true;
    gcsLabel.style.display = "none";
  } else
  {
    console.log("Executed 2");
    grade.disabled = false;
    cluster.disabled = false;
    section.disabled = false;
    gcsLabel.style.display = "inherit";
  }
}

function createAcc()
{
	c = 0;
	previousID = auth.currentUser.uid;
    ty = frm.elements[0].value;
	fn = frm.elements[3].value;
	ln = frm.elements[4].value;
	iid = frm.elements[5].value;
	em = frm.elements[1].value;
	ps = frm.elements[2].value;
	un = frm.elements[5].value;
	cl = frm.elements[8].value;
	gr = frm.elements[7].value;
	sch = frm.elements[6].value;
    sc = frm.elements[9].value;
	auth.createUserWithEmailAndPassword(em, ps); // This function creates an account and signs you in as that account. This could be a problem and there are no ways to fix it.
	auth.onAuthStateChanged(function(user)
	{
		tempID = auth.currentUser.uid;
		if(auth.currentUser != null && tempID != previousID && c === 0)
		{
			c++;
            if(ty === "Supervisors")
            {
              db.collection(ty).doc(tempID).set({
				fName: fn,
				lName: ln,
				id: iid,
				email: em,
				usrID: tempID,
				username: fn,
				school: sch,
				emailNotif: false
			 });
            } else if(ty === "Students")
            {
              db.collection(ty).doc(tempID).set({
				fName: fn,
				lName: ln,
				id: iid,
				email: em,
				usrID: tempID,
				username: fn,
				school: sch,
				emailNotif: false,
                cluster: cl,
                grade: gr,
                section: sc
			 });
            }
		}
	});
}

function logOut()
{
	auth.signOut();
}

window.onload = function(){
	frm = document.forms[0];
}