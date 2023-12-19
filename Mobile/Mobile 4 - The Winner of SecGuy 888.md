## Mobile 4 - The Winner of SecGuy 888
#### Description
Get the jackpot with the slot.  
  
__Flag format__ : WTCTT2023_MOB04{[a-z0-9]{32}}  
__File__ : sh.sth.secguy888.apk 
__SHA256 Checksum__ : 450c8abb1ec0b4ffc18f4c3992007738c8439e8d8d6a6d22a3e8ebbed0d827cf

#### Solution
See In code, we will find api path that we can use to spin slot but we don't know how much of balance.
![1.png](./assets/mobile4/1.png)

I found getBalance() now use it to see my balance.

![2.png](./assets/mobile4/2.png)

Generate POST API by yourself if you can't I think skill issue!!  Just Kidding

![3.png](./assets/mobile4/3.png)

![4.png](./assets/mobile4/4.png)

If you see in code you will find this function that told you about API is debug mode.

![5.png](./assets/mobile4/5.png)

Craft API for spin slot. After spin without debug key in body, I got no reward

![6.png](./assets/mobile4/6.png)

Put debug key in body. I got hidden_action, Let's use it.

![7.png](./assets/mobile4/7.png)

Result was told you about your balance is not sufficient. it's require 31337.

![11.png](./assets/mobile4/11.png)

After a bit of thought, it got to me that if I transmit the bet in minus digits, the API will update the amount to something like your balance -(- bet). Remember spin_slot mode !!!!

![8.png](./assets/mobile4/8.png)

My balance is 99999

![9.png](./assets/mobile4/9.png)

![10.png](./assets/mobile4/10.png)

Yummy, we got FLAG4. XD!!!