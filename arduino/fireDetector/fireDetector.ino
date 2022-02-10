#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

// Connected wifi
const char* ssid = "wifi ssid";
const char* password = "wifi password";

const int buzzerPin = 5; // buzzer sensor
const int flamePin = 0; // flame sensor
int Flame = HIGH;

void passData ()
{
  WiFiClient client; // Must be declared as a local variable
  
  HTTPClient http;  //Declare an object of class HTTPClient
    
  String fire="fire";
  http.begin(client, "http://3.19.6.82:8080/fireAlarm?message="+fire);  //Specify request destination
  int httpCode = http.GET();                                  //Send the request

  if (httpCode > 0) { //Check the returning code

    String payload = http.getString();   //Get the request response payload
    Serial.println(payload);             //Print the response payload 
  }
  http.end();   //Close connection
}

void connectWifi ()
{
  // start searching to wifi
  WiFi.begin(ssid, password);

  Serial.print("Connecting");
  // If there is no wifi connection
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.print("Connected");  
}

void setup () {
  pinMode(buzzerPin, OUTPUT);
  pinMode(flamePin, INPUT);
  
  Serial.begin(115200);
  connectWifi();  
}

void loop() {
  // flame sensor reaction
  Flame = digitalRead(flamePin);

  // If a flame is detected
  if (Serial.available() > 0) //Flame == 1
  {
    passData(); // Send message to server
    digitalWrite(buzzerPin, HIGH); // Sound
    Serial.println("Fire detection");
    delay(5000);
    digitalWrite(buzzerPin, LOW);
    delay(5000);
  }
  else // general situation
  {
    Serial.println("No problem");
    delay(10000);
    digitalWrite(buzzerPin, LOW);
  }
}
