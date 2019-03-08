// Create a client instance
client = new Paho.MQTT.Client(settings.host, settings.port, settings.client_id);
//Example client = new Paho.MQTT.Client("m11.cloudmqtt.com", 32903, "web_" + parseInt(Math.random() * 100, 10));

// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;
var options = {
  useSSL: true,
  userName: settings.user,
  password: settings.pass,
  onSuccess:onConnect,
  onFailure:doFail
}

// connect the client
client.connect(options);

// called when the client connects
function onConnect() {
  // Once a connection has been made, make a subscription and send a message.
  console.log("onConnect");
  client.subscribe(settings.topic + "/#");
  message = new Paho.MQTT.Message('{"type": "test"}');
  message.destinationName = settings.topic + "/dash";
  client.send(message);
}

function doFail(e){
  console.log(e);
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:"+responseObject.errorMessage);
  }
}

// called when a message arrives
function onMessageArrived(message) {
  console.log("onMessageArrived:"+message.payloadString);
  console.log(message)
  actions(message)
}

function actions(message) {
    let payload = JSON.parse(message.payloadString)
    let topic = message.destinationName

    if (topic.indexOf("temperature") > 0) {
        document.getElementById("temperature").innerText = Math.round(payload.value, 2) + "°C"
    
    } else if (topic.indexOf("light") > 0) {
        if (payload.value){
            document.getElementById("bulb").classList.add("light_up")
        } else {
            document.getElementById("bulb").classList.remove("light_up")
        }
        
        document.getElementById("light").checked = payload.value
    
    } else if (topic.indexOf("touch") > 0) {
        updateData(chart,"default",chart.count,payload.value)
        chart.count++

    } else {
        console.log(payload)
    }
}


document.getElementById("light").addEventListener('click', () => {
    let value = document.getElementById("light").checked
    message = new Paho.MQTT.Message('{"type": "light", "value": '+ value +'}')
    message.destinationName = settings.topic + "/events"
    client.send(message)
    })