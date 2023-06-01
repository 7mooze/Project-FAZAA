const db = firebase.firestore();
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      var user = firebase.auth().currentUser;
      db.collection("Students").doc(user.uid).get().then(function(usr){
        if(usr.exists)
        {
          window.location.href = "home.html";
        } else
        {
          db.collection("Supervisors").doc(user.uid).get().then(doc =>
          {
            if(doc.exists)
            {
              window.location.href = "supervisorHome.html";
            } else
            {
              db.collection("Admins").doc(user.uid).get().then(doc =>
              {
                if(doc.exists)
                {
                  window.location.href = "AdminHome.html";
                } else
                {
                  alert("Account not found!");
                }
              });
            }
          });
        }
      });
    }
  });
  
  function login(){
  
    var userEmail = document.getElementById("email_field").value;
    var userPass = document.getElementById("password_field").value;
  
    firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
  
      window.alert("Error : " + errorMessage);
  
      // ...
    });
  
  }
  

