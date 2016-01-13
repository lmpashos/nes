var anchors = document.getElementsByTagName("a");
var anchor;
for (var i = 0; i < anchors.length; i++) {
	if (anchors[i] == self.options.ticketLink) {
		anchor = anchors[i];
		break;
	}
}

var timer = anchor.parentElement.parentElement.children[10].innerHTML.replace(/(\r\n|\n|\r|\t)/gm,"").trim().split("<br>").pop();


self.port.emit("timerRetrieved1", timer);