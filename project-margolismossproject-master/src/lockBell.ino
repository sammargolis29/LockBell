  /*
  * Project lockBell
  * Description:
  * Author: Sam and Soraya
  * Date:
  */
  //setting our event topics
  const String topic = "cse222Doorbell/thisDoorbell/lockBell";
  const String topic2 = "cse222Doorbell/bellRung/lockBell";

  //doorbell pin button
  const int doorBell = D2;

  //setting our doorbell/locks variables
  unsigned long switchTogTime=0;
  bool vTog=0;
  bool vTogFlag=true;
  bool canChangeFlag=1;
  bool theState = 0;
  bool togLock =0;
  bool doorBellHit=false;
  bool autoEnabled = false;
  bool doorbellRung = false;
  bool startAutoFlag=true;

  //initial autoLockTime
  int alTime=25000;

  //timer to auto lock the door
  Timer autoLockTimer(5000, alFunc);

  //Timer publishLate(200, publishLatePls);
  //function called after autolock timer
  void alFunc(){
      Serial.println("HELLO FRIENDS");
      if (theState==0){
        togLock=1;
        theState = 1;
      }
      publishState("");
  }

  //function that debounces button
  Timer togTimer(100, checkTog);

  //use
  // void publishLatePls(){
  // publishState("");
  // }

  //function that is called after tog Timer it will actually set if the doorbell was hit
  void checkTog(){
    if(digitalRead(doorBell)==1){
      vTog=1;
    }
    else{
      vTog=0;
      vTogFlag=true;
    }
    togTimer.stop();
  }//end check


  //States of our door- locked and unlocked
  enum State {
    Locked,
    Unlocked
  };


  State counterState = Unlocked;

  //initializes servo motor, acts as our "lock"
  Servo servo;

  //publishes state containing state of door, state of auto lock, auto lock times, and doorbell
  int publishState(String arg) {
    String data = "{";
    data += "\"state\":";
    data += theState;
    data += ",";
    data += "\"autoEn\":";
    data += autoEnabled;
    data += ",";
    data += "\"autoTi\":";
    data += alTime;
    data += ",";
    data += "\"dbRung\":";
    data += doorBellHit;
    data += "}";
    Particle.publish(topic, data);
    return 0;
  }

  //sets door to locked, then publishes state
  int toggleLock(String tog){
    togLock=1;
    publishState("");
    return 1;
  }

  //When the UI is cleared, doorbell ringing state set to false
  int clearAlert(String tog){
  doorBellHit=false;
    publishState("");
    return 1;
  }

  //auto lock function, sets auto lock time and starts/stops timer when necessary
  int autoLock(String al){
    startAutoFlag=true;
    alTime= 1000*(al.substring(1,3).toInt());
    autoLockTimer.changePeriod(alTime);
    Serial.println(alTime);
    //autoCloseTimer.start();

    if(al.substring(0,1)=="t"){
      autoEnabled=true;
      autoLockTimer.reset();
      autoLockTimer.start();
      Serial.println("started the timer");
      //Serial.println(autoEnabled);
    }
    else if(al.substring(0,1)=="f"){
      autoEnabled=false;
      Serial.println("timer stopped");
      autoLockTimer.stop();
    }
    publishState("");
    return 1;
  }



  //set up functio for the particle
  void setup() {
    //set pins as inputs or outputs
    Serial.begin(9600);
    //initializing particle functions
    Particle.function("toggleLock", toggleLock);
    Particle.function("publishState", publishState);
    Particle.function("clearAlert", clearAlert);
    Particle.function("autoLock", autoLock);
    Particle.function("sendMessage", sendMessage);
    pinMode(D2, INPUT_PULLDOWN);
    servo.attach( D0 );
    servo.write( 3 );
    //publishLate.start();
  }

  //particle function that calls event to text user
  int sendMessage(String command){
      Particle.publish("twilio", "Doorbell rung!", 60, PRIVATE);
      //publishState("");
  }

  // switch statement for our lock states
  State nextState(State state) {
    unsigned long now=millis();//get current run time
    switch (state) {
      case Locked:
      autoLockTimer.stop();
      servo.write( 100 );
      if(togLock){
        if(autoEnabled){
          autoLockTimer.reset();
          autoLockTimer.start();
        }
        state=Unlocked;
        theState = 0;
        togLock=0;
        publishState("");
      }
      break;

      case Unlocked:

      servo.write( 3 );
      if(togLock){
        state=Locked;
        theState = 1;
        togLock=0;
        publishState("");
      }
      break;
    }//endswitch statement
    return state;
  }

  //main loop
  void loop() {
    if(vTog&&canChangeFlag){ //if doorbell button pushed
      //sendMessage("Hi");
      doorBellHit=true;
      //delay(200);
      publishState("");
      canChangeFlag=false;
      vTogFlag=true;
    }

  //calls the next state function and passes in previous state
    counterState= nextState(counterState);
    if(digitalRead(doorBell)&&vTogFlag){
        vTogFlag=false;
        togTimer.reset();
        togTimer.start();
      }
      //reseting flags
      if(digitalRead(doorBell)==0){
        canChangeFlag=true;
        vTog=0;
      }
      if(switchTogTime<millis()){
        if(digitalRead(doorBell)==0){
          vTogFlag=true;
        }
        switchTogTime+=100;
      }
  }//end check
