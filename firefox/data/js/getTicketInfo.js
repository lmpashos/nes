var customer = document.querySelector("#content > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2)").innerHTML;
var ticket = document.querySelector("#content > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1)").innerHTML;
var description = document.querySelector("#content > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(9) > td:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1)").innerHTML;
var lastUpdateHeader = document.querySelector("#content > table:nth-child(5) > tbody:nth-child(1) > tr:nth-last-child(2)").outerHTML;
var lastUpdate = document.querySelector("#content > table:nth-child(5) > tbody:nth-child(1) > tr:nth-last-child(1)").outerHTML;
var newUpdate = document.querySelector("#content > form > table");
newUpdate.setAttribute("id","newUpdate");
newUpdate = newUpdate.outerHTML;

self.port.emit("returnTicket", customer, ticket, description, lastUpdateHeader, lastUpdate, newUpdate);
self.port.once("submitUpdate2", function (text, type, priority, status, merge, owner, group, pub) {


	document.querySelector("#content > form:nth-child(8) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > textarea:nth-child(1)").value = text;
	document.querySelector("#subject").value = type;
	document.querySelector("#content > form:nth-child(8) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > select:nth-child(2)").value = priority;
	document.querySelector("#content > form:nth-child(8) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > select:nth-child(3)").value = status;
	document.querySelector("#content > form:nth-child(8) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > select:nth-child(5)").value = merge;
	document.querySelector("#content > form:nth-child(8) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > select:nth-child(6)").value = owner;
	document.querySelector("#content > form:nth-child(8) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > select:nth-child(7)").value = group;
	document.querySelector("#content > form:nth-child(8) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(4) > td:nth-child(1) > input:nth-child(2)").checked = pub;

	document.querySelector("#content > form:nth-child(8) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(4) > td:nth-child(1) > input:nth-child(1)").click();
	
	self.port.emit("submitted");
});