//set up particle
var particle = new Particle();
var token;
//login to particle account
particle.login({username: 'sorayamoss@wustl.edu', password: '8ysgkh83SKRSJ7'}).then(
  function(data) {
    token = data.body.access_token;
  },
  function (err) {
    console.log('Could not log in.', err);
  }
);


let locked = true;
let enabled = false;

document.getElementById('status-screen').hidden = true;
document.getElementById('login-screen').hidden = false;
document.getElementById('account-creation').hidden = true;
document.getElementById('advanced-settings-screen').hidden = true;
document.getElementById("activity").hidden = true;


function load_settings() {
  document.getElementById('status-screen').hidden = false;
  document.getElementById('login-screen').hidden = true;
  document.getElementById('account-creation').hidden = true;
  document.getElementById('advanced-settings-screen').hidden = true;
}

function load_ac() {
  document.getElementById('status-screen').hidden = true;
  document.getElementById('login-screen').hidden = true;
  document.getElementById('account-creation').hidden = false;
  document.getElementById('advanced-settings-screen').hidden = true;
}

function load_login() {
  document.getElementById('status-screen').hidden = true;
  document.getElementById('login-screen').hidden = false;
  document.getElementById('account-creation').hidden = true;
  document.getElementById('advanced-settings-screen').hidden = true;
}

function load_advanced() {
  document.getElementById('status-screen').hidden = true;
  document.getElementById('login-screen').hidden = true;
  document.getElementById('account-creation').hidden = true;
  document.getElementById('advanced-settings-screen').hidden = false;
}



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
  document.getElementById("changeAutoLockButton").innerHTML="Disable";
  }
  else{
    document.getElementById("changeAutoLockButton").innerHTML="Enable";
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
