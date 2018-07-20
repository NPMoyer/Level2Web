var socket = io('/email');

function search() {
	var email = document.getElementById("fName").value + "." + document.getElementById("lName").value + "@aksteel.com";
	var crownAlarm = ["LV1", "LV2"];
	var taskColdAlarm = ["LV2"];
	var taskHotAlarm = ["LV1", "LV2"];
	var ridgingAlarm = ["LV1", "LV2", "LV3", "PRD"];
	var stratModeAlarm = ["LV1", "LV2", "LV3", "PRD", "TEC"];
	var millStretchAlarm = ["LV1", "LV2", "PRD", "TEC"];

	// Send the email to the server
	socket.emit('search', email);

	// Email was found in the database
	socket.on('found', function (data) {
		var group = data[0].group;
		var i;

		document.getElementById("list").innerHTML = "";

		for (i = 0; i < crownAlarm.length; i++) {
			if (crownAlarm[i] == group) {
				document.getElementById("list").innerHTML += "<br/>Crown Calculation Error";
			}
		}
		for (i = 0; i < taskColdAlarm.length; i++) {
			if (taskColdAlarm[i] == group) {
				document.getElementById("list").innerHTML += "<br/>Cold Task Restarts";
			}
		}
		for (i = 0; i < taskHotAlarm.length; i++) {
			if (taskHotAlarm[i] == group) {
				document.getElementById("list").innerHTML += "<br/>Hot Task Restarts";
			}
		}
		for (i = 0; i < stratModeAlarm.length; i++) {
			if (stratModeAlarm[i] == group) {
				document.getElementById("list").innerHTML += "<br/>Strategy Mode";
			}
		}
		for (i = 0; i < millStretchAlarm.length; i++) {
			if (millStretchAlarm[i] == group) {
				document.getElementById("list").innerHTML += "<br/>Mill Stretch";
			}
		}
		for (i = 0; i < ridgingAlarm.length; i++) {
			if (ridgingAlarm[i] == group) {
				document.getElementById("list").innerHTML += "<br/>Ridging";
			}
		}
	});

	// Email was not found in the database
	socket.on('notFound', function (data) {
		document.getElementById("list").innerHTML = email + " does not exist in the database!";
	});
}