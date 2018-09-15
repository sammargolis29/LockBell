// // TODO: Add the access token and device ID
// var myParticleAccessToken = "31a4eb7f9635dd8fea3a6ff5ad63caaa5bead504"
// var myDeviceId =            "3a0043001051363036373538"
// var topic =                 "cse222Doorbell/thisDoorbell/lockBell"

// var Particle = require('particle-api-js');
var particle = new Particle();
var token;
//Initial set up of particle
particle.login({username: 'sorayamoss@wustl.edu', password: '8ysgkh83SKRSJ7'}).then(
  function(data) {
    token = data.body.access_token;
  },
  function (err) {
    console.log('Could not log in.', err);
  }
);

//unused variables used them originally
let locked = true;
let enabled = false;
//sets screens originally
document.getElementById('status-screen').hidden = true;
document.getElementById('login-screen').hidden = false;
document.getElementById('account-creation').hidden = true;
document.getElementById('advanced-settings-screen').hidden = true;
document.getElementById("activity").hidden = true;

//if we want to load settings
function load_settings() {
  document.getElementById('status-screen').hidden = false;
  document.getElementById('login-screen').hidden = true;
  document.getElementById('account-creation').hidden = true;
  document.getElementById('advanced-settings-screen').hidden = true;
}
//load account creation hide others
function load_ac() {
  document.getElementById('status-screen').hidden = true;
  document.getElementById('login-screen').hidden = true;
  document.getElementById('account-creation').hidden = false;
  document.getElementById('advanced-settings-screen').hidden = true;
}
//load login screen hide others
function load_login() {
  document.getElementById('status-screen').hidden = true;
  document.getElementById('login-screen').hidden = false;
  document.getElementById('account-creation').hidden = true;
  document.getElementById('advanced-settings-screen').hidden = true;
}
//load advaned setttings hide other stuff
function load_advanced() {
  document.getElementById('status-screen').hidden = true;
  document.getElementById('login-screen').hidden = true;
  document.getElementById('account-creation').hidden = true;
  document.getElementById('advanced-settings-screen').hidden = false;
}


//on load of the dom what to show and how to initialize
document.addEventListener("DOMContentLoaded", function(event){
  //on load
  console.log("Document Loaded");
  document.getElementById('status-screen').hidden = true;
  document.getElementById('login-screen').hidden = false;
  document.getElementById('account-creation').hidden = true;
  document.getElementById('advanced-settings-screen').hidden = true;
  doorbell.streamState();
  autolockSlider = document.getElementById("autolockSlider");
  document.getElementById("autolockSlider").addEventListener("change", autolockSlidebarChange)
})

var autoLockSlider
//track slidebar
function autolockSlidebarChange(event) {
  autolockTime.innerText = document.getElementById('autolockSlider').value + " s"
  doorbell.setAutoLockTime(document.getElementById('autolockSlider').value);
}

// function toglock(){
//   if(locked=true){
//     locked=false;
//     document.getElementById("door-status").innerText="DOOR UNLOCKED";
//     document.getElementById("toglock").innerText="Lock Door";
//   }
//   else{
//     console.log(locked);
//     locked=true;
//     document.getElementById("door-status").innerText="DOOR LOCKED";
//     document.getElementById("toglock").innerText="Unlock Door";
//   }
// }


function logStateChange(){
  console.log('State Change');
  console.log(doorbell.locked);
  // document.getElementById("autocloseSlider").value=garage.autoCloseTime;
  // // autocloseTime.innerText = garage.autoCloseTime + " s"
  if(doorbell.locked==true){
    document.getElementById("door-status").innerText="DOOR LOCKED";
    document.getElementById("toglock").innerText="Unlock Door";
  }
  else{
    document.getElementById("door-status").innerText="DOOR UNLOCKED";
    document.getElementById("toglock").innerText="Lock Door";
  }

  if(doorbell.autoLockEnabled==true){
    document.getElementById("changeAutoLockButton").value="Disable";
  }
  else{
    document.getElementById("changeAutoLockButton").value="Enable";
  }

  if(doorbell.rung==1){
    document.getElementById("activity").hidden = false;
    document.getElementById("no-activity").hidden = true;
  }else{
    document.getElementById("activity").hidden = true;
    document.getElementById("no-activity").hidden = false;
  }

}

function loadingPage(){
  doorbell.streamState();
  doorbell.setup();
  //var promise = new Promise(garage.setup();
  //alert(garage.setUp);
  //if(garage.setUp){
  doorbell.stateChange();
  document.getElementById('login-screen').hidden = true;
}
