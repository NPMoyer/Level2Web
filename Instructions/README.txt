How to get started with development:
1. Install VS Code - https://code.visualstudio.com/download
2. Install Node.js - https://nodejs.org/en/download/
3. Clone the repo - Automatn_Pub\Git\Repos\General\Level2Web
   - Compelte the Git Basics tutorial if you are new to git - Automatn_Pub\Git\Repos\Tutorials\GitBasics
4. Open the Windows Explorer in your local repo and open a command window (Hold shift + Right-click and press "Open Command Window Here")
5. Configure the proxy for npm - https://jjasonclark.com/how-to-setup-node-behind-web-proxy/
   - Enter npm config set proxy http://proxy1.akst.com:3128
6. Enter npm i to fetch and install all npm packages 
7. Enter npm ls --depth=0 to view all installed pacages
   - The necessary packages are:
     +-- express
     +-- mongodb
     +-- ping
     +-- socket.io
     +-- winston
     `-- winston-daily-rotate-file
8. Now you can test the site by highlighting server.js in VS code and pressing F5
   - Navigate to http://localhost to view it
   - As you make changes to the files, refresh the browser to view them once saved
   - If you make changes to server.js, you must restart the server in VS code
9. Copy the local changes to Automatn_Pub\Level 2 Web to move them into production
10. Remember to commit changes as you go!

How to run the server in production:
1. Go to Automatn_Pub\Level 2 Web and open a new command window
2. Enter node server.js
3. Your computer is now a server capable of handling HTTP requests across the LAN
4. Anyone can go to http://youripaddress and they will be redirected to the website

Hoe to manage the database:
The database files are stored in Automatn_Pub\Level 2 Web\data
This database uses MongoDB which is a NoSQL database
It's easy to modify the database usign MongoDB's UI - Compass
1. Install Compass on the machine running the website - https://www.mongodb.com/products/compass
2. When you open up Compass, on the connect to host screen:
   Hostname: localhost
   Port: 27017
   Leave everything else as is
3. Go to the "mydb" database and you can see the following collections
   - IPs: Predefined IP addresses for the chat usernames
   - alarms: All availbe MMI and email alarms
   - users: The users for the email alarms and the groups that they belong to
4. Documents can be removed/added/updated from Compass and the website will refelct the changes immediately