if (self.options.releaseKicker == true) {
	alert("Requeue Enabled");
	document.getElementsByTagName('body')[0].addEventListener("DOMNodeInserted", kicked, false);
}

function kicked() {
	//console.log("node added");

	var popup = document.querySelector(".bootbox")
	if (popup != null) {
		document.removeEventListener("DOMNodeInserted", kicked);
		//console.log("kicked");
		setTimeout(function(){
			if (document.querySelector("a.btn-primary:nth-child(1)") != null) {
				//document.querySelector("a.btn-primary:nth-child(1)").click();
				popup.parentNode.removeChild(popup);
				var background = document.querySelector(".modal-backdrop");
				background.parentNode.removeChild(background);	
				//console.log("noted")
				setTimeout(function(){
					if (document.querySelector("#session-manager-session-state").classList.contains("released")) {
						document.querySelector("#agent-state-session-button").click();
						//console.log("back in queue?")
						document.getElementsByTagName('body')[0].addEventListener("DOMNodeInserted", kicked, false);
					}
				}, 5000);

			}
		}, 5000);
	}
}