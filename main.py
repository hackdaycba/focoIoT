from machine import Pin, TouchPad
from umqtt.simple import MQTTClient
import network
import esp32
import ujson
import time


class Foco(object):
    def __init__(self):
        self.wifi = None
        self.mqtt = None
        self.config = ujson.load(open("settings.json"))

        self.lighting = False
        self.pin = Pin(2, Pin.OUT)
        self.touchpad = TouchPad(Pin(13))
    
    def wifi_connect(self):
        self.wifi = network.WLAN(network.STA_IF)
        self.wifi.active(True)
        if not self.wifi.isconnected():
            print("connect to {} {}".format(self.config["wifi"]["ssid"], self.config["wifi"]["pass"]))
            self.wifi.connect(self.config["wifi"]["ssid"], self.config["wifi"]["pass"])
        while not self.wifi.isconnected():
            print("waiting for internet")
            time.sleep(1)
        return self.wifi.isconnected()
    
    def mqtt_connect(self):
        cfg = self.config["mqtt"]
        self.mqtt = MQTTClient(cfg["client_id"], 
                               cfg["host"],
                               port=cfg["port"],
                               user=cfg["user"],
                               password=cfg["pass"])
        
        self.mqtt.set_callback(self.message_received)

        status = self.mqtt.connect()
        if status == 0:
            return True
        return False

    def mqtt_subscribe(self):
        cfg = self.config["mqtt"]
        self.mqtt.subscribe(cfg["topic"])

    def message_received(self, topic, msg):
        print("{}--> {}".format(topic, msg))
        
        payload = ujson.loads(msg)
        if payload.get("type") == "light":
            self.toggle_light(payload.get("value"))

    def toggle_light(self, value=None):
        if value:
            self.lighting = value
        else:
            self.lighting = True if not self.lighting else False
        if self.lighting:
            self.pin.on()
        else:
            self.pin.off()

        cfg = self.config["mqtt"]
        self.mqtt.publish("{}/light".format(cfg["topic"]), ujson.dumps({"value":self.lighting}))

    def check_touchpad(self):
        value = self.touchpad.read()
        cfg = self.config["mqtt"]
        self.mqtt.publish("{}/touch".format(cfg["topic"]), ujson.dumps({"value":value}))
        if value < 200:
            self.toggle_light()

    def check_temp(self):
        temp_f = esp32.raw_temperature()
        temp_c = (temp_f - 32) * 5.0/9.0
        cfg = self.config["mqtt"]
        self.mqtt.publish("{}/temperature".format(cfg["topic"]), ujson.dumps({"value": temp_c}))
    
    def run(self):
        # Blocking wait for message
        #self.mqtt.wait_msg()
        print("RUN!")
        while True:
            self.mqtt.check_msg()
            self.check_touchpad()
            self.check_temp()
            time.sleep(.5)

    
def main():
    foco = Foco()
    foco.wifi_connect()
    foco.mqtt_connect()
    foco.mqtt_subscribe()
    foco.run()


main()