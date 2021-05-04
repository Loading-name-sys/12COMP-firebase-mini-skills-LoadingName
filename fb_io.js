/**************************************************************/
// fb_io.js
// Written by Travis Cotter  2021
/**************************************************************/

/**************************************************************/
// fb_initialise()
// Called by setup
// Initialize firebase
// Input:  n/a
// Return: n/a
/**************************************************************/
function fb_initialise() {
  console.log('fb_initialise: ');
	var firebaseConfig = {
    apiKey: "AIzaSyDXkKiC6aL8h00svOlVxXeG9jJOW4_W_jA",
    authDomain: "comp-2021-travis-cotter.firebaseapp.com",
    databaseURL: "https://comp-2021-travis-cotter-default-rtdb.firebaseio.com",
    projectId: "comp-2021-travis-cotter",
    storageBucket: "comp-2021-travis-cotter.appspot.com",
    messagingSenderId: "893195506817",
    appId: "1:893195506817:web:9d3b49a9649f2ae258e980",
    measurementId: "G-ZWHCSPK15Y"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  console.log(firebase);	
		
  database = firebase.database();
}

/**************************************************************/
// fb_login(_dataRec)
// Login to Firebase
// Input:  to store user info in
// Return: n/a
/**************************************************************/
function fb_login(_dataRec) {
  console.log('fb_login: dataRec= ' + _dataRec);
  firebase.auth().onAuthStateChanged(newLogin);
  
  function newLogin(user) {
	if (user) {
	  // user is signed in
      _dataRec.uid      = user.uid;
      _dataRec.email    = user.email;
      _dataRec.name     = user.displayName;
      _dataRec.photoURL = user.photoURL;
      loginStatus = 'logged in';
	}
	else {
	  // user NOT logged in, so redirect to Google login
      _dataRec     = {};
      loginStatus  = 'logged out';
      console.log('fb_login: status = ' + loginStatus);
      
	  var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithRedirect(provider);
	}
  }
}

/**************************************************************/
// fb_logout()
// Logout of Firebase
// Input:  n/a
// Return: n/a
/**************************************************************/
function fb_logout() {
  console.log('fb_logout: ');
  firebase.auth().signOut();
}

/**************************************************************/
// fb_writeRec(_path, _key, _data)
// Write a specific record & key to the DB
// Input:  path to write to, the key, data to write
// Return: 
/**************************************************************/
function fb_writeRec(_path, _key, _data) { 
    console.log('fb_WriteRec: path= ' + _path + '  key= ' + _key +
                 '  data= ' + _data.name + '/' + _data.score);
		
		writeStatus = "waiting";
		fixtime();
		firebase.database().ref(_path + '/' + _key).set(_data);
		function fixtime(error) {
			if (error){
			writeStatus = "Faliure";
			console.log(error);
			}
			else {
			writeStatus = "Ok";
			}
		}
		console.log("fb_writeRec exit")
}

/**************************************************************/
// fb_readAll(_path, _data)
// Read all DB records for the path
// Input:  path to read from and where to save it
// Return:
/**************************************************************/
function fb_readAll(_path, _data) {
  console.log('fb_readAll: path= ' + _path);
	readStatus = "waiting";
	firebase.database().ref(_path).once("value", gotRecord, readErr);

	function gotRecord(snapshot){
		if(snapshot.val() == null){
			readStatus = "no record";
		}
		else {
			readStatus = "Ok";
			let dbData	= snapshot.val();
			console.log(dbData);
			let dbKeys = Object.keys(dbData);
			console.log(dbKeys);
			let key = dbKeys[0];
			console.log (dbData[key]);

			for (i=0; i < dbKeys.length; i++){
				let key = dbKeys[i];
				_data.push({
					name:  dbData[key].name,
					score: dbData[key].score
				});
			}
		}
	}

	function readErr(error){
		readStatus = "Fail";
		console.log (error);
	}
}

/**************************************************************/
// fb_readRec(_path, _key, _data)
// Read a specific DB record
// Input:  path & key of record to read and where to save it
// Return:  
/**************************************************************/
function fb_readRec(_path, _key, _data, _processData) {	
  console.log('fb_readRec: path= ' + _path + '  key= ' + _key);

	readStatus = "waiting";
	firebase.database().ref(_path + "/" + _key).once("value", gotRecord, readErr);

	function gotRecord(snapshot){
		if(snapshot.val() == null){
			readStatus = "no record";
		}
		else {
			readStatus = "Ok";
			console.log (snapshot.val() );
		}
	}

	function readErr(error){
		readStatus = "Fail";
		console.log (error);
	}
}

/**************************************************************/
//    END OF MODULE
/**************************************************************/