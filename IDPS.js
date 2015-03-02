/*-----------------------------------------------------------------------------------
--	SOURCE FILE:	IPS.js-   A simple Intrusion Detection and Prevention System that
--  					 	  tracks intrusions by observing a log file, and then blo-
							  cks that IP if a user specified number of unsuccessful attempts
							  are made within a user defined span of time.
--
--	DATE:		02 Mar 2015
--
--
--	PROGRAMMERS:	Thilina Ratnayake (A00802338) & Elton Sia (A00800541)
--
--	NOTES:

------------------------------------------------------------------------------------*/

var fs = require('fs');
var ft = require('file-tail').startTailing("/var/log/secure");
var shell = require('shelljs');
var EventedArray = require('array-events');


//=====================DATA STRUCTURES ==============//
/*---	

----*/

var incorrectAttempts = new EventedArray();
var blockedUsers = new EventedArray();

// Constructor
function userElement(IP) {
  // always initialize all instance properties
  this.IP = IP;
  this.attempts = new Array();
}
// class methods
userElement.prototype.addAttempt = function() {
	var timeStamp = new Date();
	console.log("addAttempt invoked with data"+timeStamp);
	this.attempts.push(timeStamp);
	console.log(this.attempts);
};
// export the class
module.exports = userElement;

//===================== USER INPUT ==================//
//Grab command line arguments
var arguments = process.argv.slice(2);

//Number of logins to block after
var numAttempts = arguments[0];
console.log("The number of attempts to block after is "+numAttempts);
//Number of time interval to check for
var timeInterval = arguments[1];
console.log("Time interval is "+timeInterval);


//===================== HELPER FUNCTIONS ==================//

function parseInformation(line){
	
}

//===================== MAIN ==================//


//
blockedUsers.on('add',function(event){
	console.log("The following person has been added to the blockedUsers list");
	console.log(event);

	
});

// The actual Main 
ft.on('line', function(line) {
    if(line.indexOf('Failed password') > -1){
    	console.log("MATCH FOUND!");
    	console.log(line);


    	var re = /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/; 
    	
    	var m;
    	var IP;

    	while ((m = re.exec(line)) != null) {
		    if (m.index === re.lastIndex) {
		        re.lastIndex++;
		    }
		    // View your result using the m-variable.
		    // eg m[0] etc.
		    IP = m[0];
		    break;
		}

		var re = /[0-9]{2}\:[0-9]{2}\:[0-9]{2}/;
		var m;
		var timeStamp;

		while ((m = re.exec(line)) != null) {
		    if (m.index === re.lastIndex) {
		        re.lastIndex++;
		    }
		    // View your result using the m-variable.
		    // eg m[0] etc.
		    timeStamp = m[0];
		    break;
		}

		console.log("The IP address is "+IP);
		console.log("The timeStamp is "+timeStamp);



		//1. Check if it's the first failure EVER
			//Nothing in incorrectAttempts

		if (incorrectAttempts.length == 0){
			console.log("user elements is empty");

			var user = new userElement(IP);
			user.addAttempt();
			incorrectAttempts.push(user);
		}

		//else, other failures HAVE occured, there are elements in incorrectAttempts[]
		else{
			for (var i = 0; i < incorrectAttempts.length; i++) {
				//Check if there is a user element already existing for this offending IP
				if(incorrectAttempts[i].IP == IP){
					console.log("userElement already exists for IP "+IP);

					var user = incorrectAttempts[i];

					//add an attempt to his record
					user.addAttempt(timeStamp);

					console.log("length of user attempts is now"+user.attempts.length);

					if (user.attempts.length < numAttempts){

						console.log("do nothing until they get to our max number of attempts because number of attemtps is at "+user.attempts.length+" and i is" + i);

						break;

					}
					else{

						var length = user.attempts.length;
						
						var currElement = length - 1;

						var firstElement = currElement - (numAttempts - 1);

						//Get the timestamps

						var currTime = user.attempts[currElement];			

						var firstTime = user.attempts[firstElement];			

						var elapsedTime = new Date(currTime - firstTime);
					
						



						//E.g if the attempts have occured within (less than) the allowed amount of time.
						if (elapsedTime.getMinutes() < timeInterval){

							//console.log("Elapsed time is "+elapsedTime.getMinutes());
							//console.log("Time interval is"+timeInterval);
							//console.log("Time")

							console.log("BLOCK! for IP "+user.IP);
							shell.exec("iptables -A INPUT -s "+user.IP+" -j DROP");
							console.log("Firewall rule invoked for"+user.IP);

							shell.exec("iptables -L");

							//Take out of incorrectAttempts[]

							//Add to blockedUsers[]
							blockedUsers.push(user);


							
						}
						else{
							console.log("Number of attempts are within the the acceptable timeInterval");
							console.log("--------Do nothing!");
						}

						break;		
					}

					break;

				}

					//a userElement doesn't exist for this connection
					else{

						//create a new userElement
						var user = new UserElement(IP);
						var user = addAttempt();
						incorrectAttempts.push(user);
					}

				} //End for loop 

			} //End else
		}

		//Accepted Password

	  if(line.indexOf('Accepted password for root') > -1){

	  }

    });