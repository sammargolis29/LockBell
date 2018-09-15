

//Set up particle access tokens and how js will cnnect with photon
// TODO: Add the access token and device ID
var myParticleAccessToken = "31a4eb7f9635dd8fea3a6ff5ad63caaa5bead504"
var myDeviceId =            "3a0043001051363036373538"
var topic =                 "cse222Doorbell/thisDoorbell/lockBell"


//set initial state of doorbell in UI
var doorbell = {
  locked: true,
  rung:0,
  autoLockEnabled:false,
  autoLockTime:25,
  stateChangeHandler: null,
  particle: null,
  setUp: false,

  // getState: Get the initial state and eventually pass it to the "callback" function
  getState: function(callback) {
    var state = { "locked":this.locked,
    "rung":this.rung,
    "autoLockEnabled":this.autoLockEnabled,
    "autolockTime":this.autolockTime};
    //setTimeout(function () {setStateChangeHandler(state)},  1000);
  },

//Called to toggle whether the lock is locked or unlocked.  This both sends to the photon and updates only aftr it has recied info
  toggleLock: function() {
    var functionData = {
      deviceId:myDeviceId,
      //  name: "setGarOpen",
      name: "toggleLock",
      argument: "Tog",
      auth: myParticleAccessToken
    }
    // Include functions to provide details about the process.
    function onSuccess(e) { console.log("toggleLock call success");
    doorbell.streamState(); }
    function onFailure(e) { console.log("toggleLock failed")
    doorbell.streamState();
    console.dir(e) }
    particle.callFunction(functionData).then(onSuccess,onFailure);

    // this.stateChange();
  },

//Take away the alert.  This on the photon turns the alert to false
  clearAlert: function() {
    var functionData = {
      deviceId:myDeviceId,
      //  name: "setGarOpen",
      name: "clearAlert",
      argument: "Hey",
      auth: myParticleAccessToken
    }
    // Include functions to provide details about the process.
    function onSuccess(e) { console.log("clearAlert call success");
    doorbell.streamState(); }
    function onFailure(e) { console.log("clearAlert failed")
    doorbell.streamState();
    console.dir(e) }
    particle.callFunction(functionData).then(onSuccess,onFailure);

    // this.stateChange();
  },

//Updates the autolock feature on the the photon
//sends f to turn auto lock off if it was previously on and turns it off
//sends t to turn auto lock off if it was previously off and turns it on
  changeAutoLock: function(){
  if(this.autoLockEnabled){
    this.autoLockEnabled=false;
    var functionData = {
      deviceId:myDeviceId,
      //  name: "setGarOpen",
      name: "autoLock",
      argument: "f" + this.autoCloseTime,
      auth: myParticleAccessToken
    }
    // Include functions to provide details about the process.
    function onSuccess(e) { console.log("autoLock call success");
    doorbell.stateChange();}
    function onFailure(e) { console.log("autoLock failed");
    doorbell.stateChange();
    console.dir(e) }
    particle.callFunction(functionData).then(onSuccess,onFailure);
  }
  else{
    this.autoLockEnabled=true;
    var functionData = {
      deviceId:myDeviceId,
      //  name: "setGarOpen",
      name: "autoLock",
      argument: "t" + this.autoLockTime,
      auth: myParticleAccessToken
    }
    // Include functions to provide details about the process.
    function onSuccess(e) { console.log("autoLock call success");
  doorbell.stateChange(); }
    function onFailure(e) { console.log("autoLock failed");
    doorbell.stateChange();
    console.dir(e) }
    particle.callFunction(functionData).then(onSuccess,onFailure)
    this.stateChange();
  }
},
//updates autolock time without updating whether it is on or off

setAutoLockTime: function(time){
  this.autoLockTime= time;
  var functionData = {
    deviceId:myDeviceId,
    //  name: "setGarOpen",
    name: "autoLock",
    argument: "g" + this.autoLockTime,
    auth: myParticleAccessToken
  }
  // Include functions to provide details about the process.
  function onSuccess(e) { console.log("autoLockTime call success") }
  function onFailure(e) { console.log("autoLockTime failed")
  console.dir(e) }
  particle.callFunction(functionData).then(onSuccess,onFailure)
  this.stateChange();
},
//getting the state at the begging to set the state on the UI
  streamState: function() {
    var newState;
    //Get your devices events
    particle.getEventStream({ deviceId: myDeviceId, auth: myParticleAccessToken }).then(function(stream) {
      stream.on('event', function(data) {
        var obj = JSON.parse(data.data);
        doorbell.autoLockTime=(obj.autoTi/1000);
        doorbell.autoLockEnabled=obj.autoEn;
        newState = obj.state;
        doorbell.rung = obj.dbRung;
        console.log("whadup")
        console.log(obj.dbRung);

        switch(newState) {
          case 0:
          // lock
          doorbell.locked=false;
          break;
          case 1:
          // unlock
          doorbell.locked=true;
          break;
          default:
        }
        doorbell.stateChange();
      });
    });


  },
  //if there is a statechange then update this and change it in the UI aswell
  stateChange: function() {
    console.log("made it to state change");
    var newState = { locked: this.locked, //garage initialized as open
       autoLockEnabled:this.autoLockEnabled,
       autoLockTime:this.autoLockTime,
       rung:this.rung
    };

    console.log(newState);
    logStateChange();
  },


//Initial set up of the particle on the UI side and sets up the initial state of everything.
  setup: function() {
    // Create a particle object
    particle = new Particle();

    var functionData = {
      deviceId:myDeviceId,
      //  name: "setGarOpen",
      name: "publishState",
      argument: "pub",
      auth: myParticleAccessToken
    }
    // Include functions to provide details about the process.
    function onSuccess(e) {
      console.log("publishState call success");
      load_settings();
      doorbell.streamState();
      // doorbell.stateChange();
      //setAutoOffTime();
    }
    function onFailure(e) { console.log("publish failed")
    console.dir(e) }
    particle.callFunction(functionData).then(onSuccess,onFailure)
    doorbell.streamState();
    // Subscribe to the stream
    // doorbell.stateChange();
  },
}
