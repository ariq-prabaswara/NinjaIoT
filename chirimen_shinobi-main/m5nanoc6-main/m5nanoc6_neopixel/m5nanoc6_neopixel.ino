#include <M5NanoC6.h>
#include <Adafruit_NeoPixel.h>
#include "BLEDevice.h"

#define NEOPIXEL_PIN 1  // NeoPixelのデータピンに接続するArduinoのピン番号
#define NUMPIXELS 16    // 接続するNeoPixelの数
#define UART_RX_PIN 2   // rapsbeery pi からUARTでデータを受け取る

#define BEACON_UUID "87b99b2c-90fd-11e9-bc42-526af7764f64"  // 任意のUUIDを設定
#define BEACON_MAJOR 100                                    // 任意のMajor値
#define BEACON_MINOR 1                                      // 任意のMinor値
#define TX_POWER -59                                        // 校正された信号強度

Adafruit_NeoPixel led(1, M5NANO_C6_RGB_LED_DATA_PIN, NEO_GRB + NEO_KHZ800);
Adafruit_NeoPixel pixels(NUMPIXELS, NEOPIXEL_PIN, NEO_GRB + NEO_KHZ800);
HardwareSerial RSP(1);

void setGlobal(int r, int g, int b) {
  for (int i = 0; i < NUMPIXELS; i++) {
    pixels.setPixelColor(i, pixels.Color(r, g, b));
    delay(10);
    pixels.show();
  }
}


void TestRGB() {
  setGlobal(40, 0, 0);  // 赤
  delay(100);
  setGlobal(15, 0, 5);  // ピンク
  delay(100);
  setGlobal(17, 3, 0);  // オレンジ
  delay(100);
  setGlobal(14, 6, 0);  // 黄色
  delay(100);
  setGlobal(8, 12, 0);  // 黄緑
  delay(100);
  setGlobal(0, 20, 0);  // 緑
  delay(100);
  setGlobal(0, 10, 10);  // 水色
  delay(100);
  setGlobal(0, 0, 20);  // 青
  delay(100);
  setGlobal(0, 0, 0);  // off
}

void setup() {
  NanoC6.begin();

  pinMode(M5NANO_C6_RGB_LED_PWR_PIN, OUTPUT);
  digitalWrite(M5NANO_C6_RGB_LED_PWR_PIN, HIGH);

  led.begin();
  led.show();


  pixels.begin();             // 初期化
  pixels.show();              // 全てのLEDをオフにする
  pixels.setBrightness(255);  // 明るさを0～255の範囲で設定

  //setGlobal(0, 0, 20);
  //delay(1000);
  //setGlobal(0, 0, 0);
  TestRGB();

  led.setPixelColor(0, led.Color(0, 0, 255));
  led.show();

  Serial.begin(115200);
  RSP.begin(9600, SERIAL_8N1, UART_RX_PIN, -1);
  Serial.println("UART受信モード開始");

  // BLEデバイスの初期化
  BLEDevice::init("NINJAIOT_SINOBI");
  BLEDevice::startAdvertising();
  Serial.println("BLE Beacon started");

}

void DistanceToRGB(int distance) {
  if (distance == 0) {
    setGlobal(0, 0, 0);  // off
  } else if (distance <= 5) {
    setGlobal(40, 0, 0);  // 赤
  } else if (distance <= 10) {
    setGlobal(15, 0, 5);  // ピンク
  } else if (distance <= 15) {
    setGlobal(17, 3, 0);  // オレンジ
  } else if (distance <= 20) {
    setGlobal(14, 6, 0);  // 黄色
  } else if (distance <= 25) {
    setGlobal(8, 12, 0);  // 黄緑
  } else if (distance <= 30) {
    setGlobal(0, 20, 0);  // 緑
  } else if (distance <= 35) {
    setGlobal(0, 10, 10);  // 水色
  } else {
    setGlobal(0, 0, 20);  // 青
  }
}

void loop() {
  if (RSP.available()) {
    int received = RSP.parseInt();
    led.setPixelColor(0, led.Color(255, 0, 0));
    led.show();

    Serial.print("Received: ");
    Serial.println(received);
    DistanceToRGB(received);

    led.setPixelColor(0, led.Color(0, 0, 255));
    led.show();
  }
  delay(10);
}