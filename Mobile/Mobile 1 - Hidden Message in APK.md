## Mobile 1 - Hidden Message in APK

#### Description
A malicious mobile application, SecGuy 888, contains a secret flag 1 inside. Extract the apk file and find it. 
__Flag format__ : WTCTT2023_MOB01{[a-z0-9]{32}} 
__File__ : sh.sth.secguy888.apk  
__SHA256 Checksum__ : 450c8abb1ec0b4ffc18f4c3992007738c8439e8d8d6a6d22a3e8ebbed0d827cf

#### Solution
Reverse APK with JadX
![[./assets/mobile1/1.png]]

See In Resources > resources.arsc > res > values > strings.xml , In this file you can see all  static content that your code uses

![[./assets/mobile1/2.png]]

Yummy get flag in base32 format just decode it. XD!!
