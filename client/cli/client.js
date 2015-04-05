var request = require('request');
var argv = require('minimist')(process.argv.slice(2));

;(function() {
	var serverAddress = "http://192.168.1.14:8000";

	var Client = function () {
		this.userid = false;
	};

	Client.prototype = {
		init : function() {
			//start the cli client
			console.log("init");
			var self = this;
			self.request({
				endpoint : "",
			}, function(response) {
				if (response.YAY) {
					console.log("got YAY");
					self.apiJoinServer();
				} else {
					console.log("did not got YAY");
				}
			});
		},
		request : function(options, callback) {
			//request something from the server
			var self = this;
			var response = function (error, response) {
				if (error || response.statusCode != 200) {
					console.log("error is " + error + " status code is " + response.statusCode);
					self.waitForInput();
				} else {
					if (typeof(response.body) === "string") {
						response.body = JSON.parse(response.body);
					}
					callback.call(self, response.body);
				}
			};
			if (options.method == "POST") {
				request.post(
					{
						url : serverAddress + "/" + (options.endpoint || ""),
						json : options.form || {}
					},
					response
				);
			} else {
				request(
					serverAddress + "/" + (options.endpoint || ""),
					response
				);
			}
		},
		nextLine : function(prompt, callback) {
			//get the next line from stdin and pass it to callback
			//callback should return true (worked) or false (ask same question again)
			var stdin = process.stdin, stdout = process.stdout, self = this;

			stdin.resume();
			stdout.write(prompt + ": ");

			stdin.once('data', function(data) {
				data = data.toString().trim();
				setTimeout(function(){
					if(!callback.call(self, [data])){
						self.nextLine(prompt, callback);
					}
				}, 0);
			});
		},
		waitForInput : function() {
			//allow the user to call any function defined on Client
			var self = this;
			this.nextLine('what do? ', function(data) {
				if (self[data]) {
					setTimeout(self[data].bind(self), 0);
					return true;
				} else {
					return false;
				}
			});
		},
		apiJoinServer : function () {
			console.log("apiJoinServer");
			var self = this;
			self.request({
				endpoint : "joinserver"
			}, function (response){
				self.userid = parseInt(response.userid, 10);
				if (self.userid) {
					console.log("new user id: " + self.userid);
					self.waitForInput();
				} else {
					console.log("got a bad user id: " + response.body);
				}
			});
		},
		apiListGames : function() {
			var self = this;
			console.log("apiListGames");
			self.request({
				endpoint : "listgames",
				method : "POST"
			}, function(response) {
				console.log('listgames: ' + JSON.stringify(response));
				self.waitForInput();
			});
		},
		apiJoinGame : function() {
			console.log("apiJoinGame");
			var self = this;
			self.nextLine("Which game id?", function(data) {
				var gameid = parseInt(data, 10);
				if (!gameid) {
					return false;
				}
				self.request({
					endpoint : "joingame",
					method : "POST",
					form : {
						userid : self.userid,
						gameid : gameid
					}
				}, function(response) {
					console.log('response ' + JSON.stringify(response));
					self.waitForInput();
				});
				return true;
			});
		},
		apiUpdate : function() {
			console.log("apiUpdate");
		},
		apiPoll : function() {
			console.log("apiCall");
		}
	};

	var c = new Client();
	var connected = c.init();
})();
