


// TODO: Add the access token and device ID
var myParticleAccessToken = "31a4eb7f9635dd8fea3a6ff5ad63caaa5bead504"
var myDeviceId =            "3a0043001051363036373538"
var topic =                 "cse222Doorbell/thisDoorbell/lockBell"


//constructs doorbell variables
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

  //function to toggle the door's lock
  toggleLock: function() {
    var functionData = {
      deviceId:myDeviceId,
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
  },

  //particle function called when event is cleared from UI
  clearAlert: function() {
    var functionData = {
      deviceId:myDeviceId,
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
  },

//particle funcion to set auto lock, enabled or disabled
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

// function to set the time of auto lock
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
//event stream to update variables in the garage object from the particle
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
  //function to update variables after a state change
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

//set up function initializing the state
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
    }
    function onFailure(e) { console.log("publish failed")
    console.dir(e) }
    particle.callFunction(functionData).then(onSuccess,onFailure)
    doorbell.streamState();
  },
}
