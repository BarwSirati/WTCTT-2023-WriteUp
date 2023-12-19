## Mobile 2 - TOTP Token Generator

#### Description
SMS OTP is not recommended. So, SecGuy 888’s admin secretly uses TOTP. However, a TOTP secret is leaked, and you need to find a way to utilize it in order to get the flag 2.  
  
__Flag format__ : WTCTT2023_MOB02{[a-z0-9]{32}}  
__File__ : sh.sth.secguy888.apk
__SHA256 Checksum__ : 450c8abb1ec0b4ffc18f4c3992007738c8439e8d8d6a6d22a3e8ebbed0d827cf

#### Solution
In previous challenge you will find hint of __FLAG2__ 
![[./assets/mobile2/1.png]]

- TOTP_SEED : IAMTOTPSEEDS
- Authorization: admin:1234 (decode)

use [TOTP Token Generator Online](https://totp.danhersam.com/)
![[./assets/mobile2/2.png]]

but we don't know number of digits, let's find in code. sh.sth.secguy888 > GameActivity

![[./assets/mobile2/3.png]]

Yummy, we got number of digits and api path. Let's exploit with value that we found in previous step.

![[./assets/mobile2/4.png]]

![[./assets/mobile2/5.png]]

Yeah, we got FLAG2