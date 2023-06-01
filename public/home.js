    var firebase = firebase;
    var uid = null;
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          uid = user.uid;
        }else{
            //redirect to login 
            uid = null;
            window.location.replace("index.html");
        }
      });

      function logOut(){
        firebase.auth().signOut();
      }
      