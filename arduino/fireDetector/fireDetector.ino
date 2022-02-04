#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

// 연결되는 와이파이
const char* ssid = "와이파이 ssid";
const char* password = "와이파이 비번";

const int buzzerPin = 5; // buzzer sensor
const int flamePin = 0; // flame sensor
int Flame = HIGH;

void passData ()
{
  WiFiClient client; // 반드시 지역변수로 선언해줘야 함
  
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
  // wifi 연결이 안되어있다면
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

  // 불꽃이 감지된다면
  if (Serial.available() > 0) //Flame == 1
  {
    passData(); // 서버에 메시지 보냄
    digitalWrite(buzzerPin, HIGH); // 소리가 울리고
    Serial.println("Fire detection");
    delay(5000);
    digitalWrite(buzzerPin, LOW);
    delay(5000);
  }
  else // 일반적인 상황
  {
    Serial.println("No problem");
    delay(10000);
    digitalWrite(buzzerPin, LOW);
  }
}
