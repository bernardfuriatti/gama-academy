$( document ).ready(function() {
  // Get the modal
  var modal = document.getElementById('myModal');
  // Get the button that opens the modal
  var btn = document.getElementById("MainButtonMore");
  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];
  // When the user clicks on the button, open the modal
  btn.onclick = function() {
      modal.style.display = "block";
  }
  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
      modal.style.display = "none";
  }
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
      if (event.target == modal) {
          modal.style.display = "none";
      }
  }

  // Firebase
  var config = {
      apiKey: "AIzaSyA4TGH6AFTRaXQBkKyUsQ2HOt5XR-uX05Q",
      authDomain: "gamaproject01-f4526.firebaseapp.com",
      databaseURL: "https://gamaproject01-f4526.firebaseio.com",
      projectId: "gamaproject01-f4526",
      storageBucket: "gamaproject01-f4526.appspot.com",
      messagingSenderId: "29475394622"
    };
  firebase.initializeApp(config);
  // Get a reference to the database service
  var database = firebase.database();

  $('#GoogleLogin').click(googleAuth);
  $('#FacebookLogin').click(facebookAuth);

  var closeButton = $('#CloseButton');

  function facebookAuth() {
    var providerFb = new firebase.auth.FacebookAuthProvider();

    firebase.auth().signInWithPopup(providerFb).then(function(result) {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      axios.get('https://api.ipify.org?format=json').then(function (response) {
          // The signed-in user info.
          var user = result.user;

          var userIp = response ? response.data.ip : "NOIP";

          firebase.database().ref('leads/').push({
            nome: user.providerData[0].displayName,
            email: user.providerData[0].email,
            foto: user.providerData[0].photoURL,
            provedor: user.providerData[0].providerId,
            data: Date(),
            ip: userIp
          });

          window.location="video.html";
        })
        .catch(function (error) {
          console.log(error);
          $('#ErrorMessage').text("Erro ao obter IP");
        });
    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      $('#ErrorMessage').text(errorMessage);
    });
  }

  function googleAuth() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;

      axios.get('https://api.ipify.org?format=json')
        .then(function (response) {
          console.log(response);
          var userIp = response ? response.data.ip : "NOIP";
          firebase.database().ref('leads/').push({
            nome: user.providerData[0].displayName,
            email: user.providerData[0].email,
            foto: user.providerData[0].photoURL,
            provedor: user.providerData[0].providerId,
            data: Date(),
            ip: userIp
          });

          window.location="video.html";
        })
        .catch(function (error) {
          $('#ErrorMessage').text("Erro ao obter IP");
        });
    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      $('#ErrorMessage').text(errorMessage);
    });
  }
});
