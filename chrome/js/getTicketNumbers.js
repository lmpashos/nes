/*

This script querys the ticket page for total ticket count
as well as ticket count by user

*/


getTicketCount();

// grabs ticket counts from page and sends back to main
function getTicketCount() {
	var rows = document.querySelectorAll("div#content form table thead tr");
	var tickets = [];
	var escalationData = {};

	for (var i = 1; i < rows.length; i++) {
		var cells = rows[i].getElementsByTagName("td");
		var ticket = {
			"name": cells[8].innerHTML,
			"group": cells[9].innerHTML.trim(),
			"priority": cells[2].innerHTML.trim()
		}
		tickets.push(ticket);

		var url = cells[0].firstChild.href;
		var timer = cells[10].innerHTML.replace(/(\r\n|\n|\r|\t)/gm,"").trim().split("<br>").pop();

		escalationData[url] = timer
	}

	var escalationDataString = JSON.stringify(escalationData);

	tickets.sort(function (a, b) {
		if(a.name < b.name) return -1;
    	if(a.name > b.name) return 1;
    	return 0;
	});

	var html = "<thead><tr><th id=\"clickAtLoad\">Person</th><th>Count</th><th>Major</th><th>Mod</th><th>Info</th><th>Callctr</th></tr></thead><tbody>";
	var count = 0;
	var numTickets = tickets.length
	var temp = [];
	var current = tickets[0].name;

	var inCallCenterTotal = 0;
	var majorTotal = 0;
	var modTotal = 0;
	var infoTotal = 0;

	while (tickets.length >= 0) {
		if (tickets.length != 0 && tickets[0].name == current) {
			temp.push(tickets[0]);
		}
		else {
			count++;
			var inCallCenter = 0;
			var major = 0;
			var mod = 0;
			var info = 0;

			for (var i = 0; i < temp.length; i++) {
				if (temp[i].group == "CallCenter&nbsp;") {
					inCallCenter++;
					inCallCenterTotal++;
				}

				if (temp[i].priority == "Major&nbsp;") {
					major++;
					majorTotal++;
				}
				else if (temp[i].priority == "Moderate&nbsp;") {
					mod++;
					modTotal++;
				}
				else  {
					info++;
					infoTotal++;
				}
			}

			if (count % 2 == 1) {
				html += "<tr>" + "<td class=\"name\">" + formatName(temp[0].name) + "</td>" + "<td>" + temp.length + "</td>" + "<td>" + major + "</td>" + "<td>" + mod + "</td>" + "<td>" + info + "</td>" + "<td>" + inCallCenter + "</td>" + "</tr>"
			}
			else {
				html += "<tr class=\"alt\">" + "<td class=\"name\">" + formatName(temp[0].name) + "</td>" + "<td>" + temp.length + "</td>" + "<td>" + major + "</td>" + "<td>" + mod + "</td>" + "<td>" + info + "</td>" + "<td>" + inCallCenter + "</td>" + "</tr>"
			}

			if (tickets.length == 0) {
				break;
			}
			else {
				temp = [];
				current = tickets[0].name;
				temp.push(tickets[0]);
			}
		}
		tickets = tickets.slice(1,tickets.length);
	}

	html += "<tfoot><tr id=\"total\">" + "<td class=\"name\">" + "TOTAL" + "</td>" + "<td>" + numTickets + "</td>" + "<td>" + majorTotal + "</td>" + "<td>" + modTotal + "</td>" + "<td>" + infoTotal + "</td>" + "<td>" + inCallCenterTotal + "</td>" + "</tr></tfoot>"
	html += "</tbody>";
	chrome.extension.sendRequest({greeting:"timersRetrieved", escalationDataString: escalationDataString});
	chrome.extension.sendRequest({greeting:"tableRetrieved", table: html});

}

// formats name by removing dot and capitalizing first letters of first and last name
function formatName(name) {
	if (name == "schneiderd&nbsp;") {
		return "Dan Schneider"
	}
	if (name == "bartleyd&nbsp;") {
		return "Dan Bartley"
	}

	parts = name.split(".");
	var formated = parts[0].substring(0, 1).toUpperCase() + parts[0].substring(1).toLowerCase();
	if (parts[1] !== undefined) {
		formated += " " + parts[1].substring(0, 1).toUpperCase() + parts[1].substring(1).toLowerCase();
	}
	return formated;
}