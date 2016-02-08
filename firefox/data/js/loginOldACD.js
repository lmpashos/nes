

if (window.location.href == "http://netcarrier.qmax.netcarrier.net/cti/agents/") {
	var username = self.options.username;
	var password = self.options.password;

	if (username != "Username Here" && password != "Password Here") {
		var inputs = document.getElementsByClassName('login');
		inputs[0].value = username;
		inputs[1].value = password;
		var buttons = document.getElementsByTagName("button");
		buttons[0].click();
	}
	else {
		alert("Login Failed: Username and/or password not set.")
		self.port.emit("loginError");
	}
}

if (window.location.href.startsWith("http://netcarrier.qmax.netcarrier.net/cti/agents/campaign.html?language=1&employee_id=")) {
	document.getElementById("inbound").checked = true;
	var buttons = document.getElementsByTagName("input");
	buttons[5].click();
}

if (window.location.href == "http://netcarrier.qmax.netcarrier.net/cti/agents/home.html") {
	var extension = self.options.extension;

	if (extension != "Extension Here") {
		var sel = document.getElementById("nailupTarget");
		var opts = sel.options;
		for(var opt, j = 0; opt = opts[j]; j++) {
		    if(opt.innerHTML == extension) {
		        sel.selectedIndex = j;
		        break;
		    }
		}
		var inputs = document.getElementsByTagName("input");
		inputs[7].click();
		alert("Click away after phone initialization.")
		document.getElementById("call").click();
	}
	else {
		alert("Login Failed: Extension not set.");
		self.port.emit("loginError");
	}
}

if (window.location.href == "http://netcarrier.qmax.netcarrier.net/cti/agents/call.html") {
	var links = document.getElementsByClassName("link");
	links[0].click();
	self.port.emit("loginFinished");
}