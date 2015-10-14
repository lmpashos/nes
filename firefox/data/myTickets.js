var rows = document.querySelectorAll("div#content form table thead tr");
var tickets = [];

for (var i = 1; i < rows.length; i++) {
	var cells = rows[i].getElementsByTagName("td");
	var link = cells[0].firstChild.href;
	var name = cells[8].innerHTML;

	if (name.trim() == self.options.name.trim()) {
		tickets.push(link);
	}
}

self.port.emit("linksRetrieved", tickets);