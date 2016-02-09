/*

This script querys the ticket page for total ticket count
as well as ticket count by user

*/

window.addEventListener("load", function () {
	localStorage.setItem("tableSaved", "reload")
});


chrome.extension.onRequest.addListener(
    function update(request, sender) {
   		if (request.greeting == "login"){
   			getMyTickets();
    	}
    }
);


function getMyTickets() {
	chrome.tabs.create({url: "http://tickets/", active: false}, function (tab) {
	 	chrome.tabs.executeScript(tab.id, {file: "js/getUser.js"})
		chrome.extension.onRequest.addListener(
		    function update(request, sender) {
		    	if (request.greeting == "userGotten") {
			    	chrome.extension.onRequest.removeListener(update);
			    	chrome.tabs.remove(tab.id);
			    	retrieveLinks(request.name);
		    	}
		    }
		);
	});
}

function retrieveLinks(name) {
	chrome.tabs.create({url: "http://tickets/tickets/view.asp", active: false}, function (tab) {
	 	chrome.tabs.executeScript(tab.id, {file: "js/getUsersTickets.js"}, function() {
	 		chrome.tabs.sendRequest(tab.id, {greeting: "passingName", name: name});
	 	});
		chrome.extension.onRequest.addListener(
		    function update(request, sender) {
		    	if (request.greeting == "linksRetrieved") {
			    	chrome.extension.onRequest.removeListener(update);
			    	chrome.tabs.remove(tab.id);
			    	for (var i = 0 ; i < request.links.length; i++) {
			    		chrome.tabs.create({url: request.links[i], active: false});
			    	}
		    	}
		    }
		);
	});
}

chrome.extension.onRequest.addListener(
    function update(request, sender) {
   		if (request.greeting == "getXTickets"){
   			openHisTickets(request.name)
    	}
    }
);

function openHisTickets(name) {
	chrome.tabs.create({url: "http://tickets/tickets/view.asp", active: false}, function (tab) {
	 	chrome.tabs.executeScript(tab.id, {file: "js/getUsersTickets.js"}, function() {
	 		chrome.tabs.sendRequest(tab.id, {greeting: "passingName", name: name});
	 	});
		chrome.extension.onRequest.addListener(
		    function update(request, sender) {
		    	if (request.greeting == "linksRetrieved") {
			    	chrome.extension.onRequest.removeListener(update);
			    	chrome.tabs.remove(tab.id);
			    	for (var i = 0 ; i < request.links.length; i++) {
			    		chrome.tabs.create({url: request.links[i], active: false});
			    	}
		    	}
		    }
		);
	});
}

var escalationData;

chrome.extension.onRequest.addListener(
	function update(request, sender, sendResponse) {
		if (request.greeting == "getEscalationTimer") {
			sendResponse({timer: getEscalationTimer(request.ticketURL)});
		}
	}
);

function getEscalationTimer(ticketURL) {
	if (escalationData != undefined) {
		var timer = escalationData[ticketURL];
		if (timer != undefined) {
			return timer;
		}
		else return null;
	}
	else return null;
}

chrome.extension.onRequest.addListener(
    function getTimer(request, sender) {
    	if (request.greeting == "timersRetrieved") {
	    	updateEscalationData(request.escalationDataString);
    	}
    }
)

function updateEscalationData(data) {
	localStorage.setItem("escalationData", data);
	escalationData = JSON.parse(localStorage.getItem("escalationData"));
}

chrome.extension.onRequest.addListener(
    function update(request, sender) {
   		if (request.greeting == "seanSearch"){
   			seanSearchNameGetter();
    	}
    }
);

function seanSearchNameGetter() {
	chrome.tabs.create({url: "http://tickets/", active: false}, function (tab) {
	 	chrome.tabs.executeScript(tab.id, {file: "js/getUser.js"})
		chrome.extension.onRequest.addListener(
		    function update(request, sender) {
		    	if (request.greeting == "userGotten") {
			    	chrome.extension.onRequest.removeListener(update);
			    	chrome.tabs.remove(tab.id);
			    	seanSearch(request.name);
		    	}
		    }
		);
	});
}

function seanSearch(name) {
	chrome.tabs.create({url: "http://tickets/tickets/search.asp", active: true}, function (tab) {
	 	chrome.tabs.executeScript(tab.id, {file: "js/seanSearch.js"}, function() {
	 		chrome.tabs.sendRequest(tab.id, {greeting: "seanSearchName", name: name});
	 	});
		chrome.extension.onRequest.addListener(
		    function update(request, sender) {
		    	if (request.greeting == "seanSearchComplete") {
			    	chrome.extension.onRequest.removeListener(update);
		    	}
		    }
		);
	});
}


/*
function login() {
	var tabID;
	chrome.tabs.create({url: "http://netcarrier.qmax.netcarrier.net/cti/agents/", active: false, pinned: true}, function (tab) {
		tabID = tab.id;
		chrome.tabs.executeScript(tab.id, {file: "login.js"});

		var step1 = 0;
		var step1Complete = false;
		var step2 = 0;
		var step2Complete = false;
		var step3 = 0;
		var step3complete = false;
		var tabClosed = false;

		chrome.extension.onRequest.addListener(
		    function closeTab(request, sender) {
		   		if (request.greeting == "loginError"){
		    		chrome.tabs.remove(tab.id);
		    		chrome.extension.onRequest.removeListener(closeTab);
		    		tabClosed = true;
		    	}
		    }
		);

		chrome.tabs.onUpdated.addListener(function attachScript(tabId, changeInfo, tab) {
    		if (tabClosed) {
    			chrome.tabs.onUpdated.removeListener(attachScript);
    			return;
    		}

    		if (tabID !== tab.id) {
        		console.log("1")
    		}

    		else{
    			if (! step1Complete) {
	    			step1 ++;
	    			if (step1 == 6) {
	    				chrome.tabs.executeScript(tab.id, {file: "login.js"});
	    				step1Complete = true;
	    			}
    			}
    			else if (! step2Complete) {
    				step2 ++;
    				if (step2 == 3) {
	    				chrome.tabs.executeScript(tab.id, {file: "login.js"});
	    				step2Complete = true;
	    			}
    			}
    			else if (! step3complete) {
    				step3 ++;
    				if (step3 == 3) {
    					chrome.tabs.executeScript(tab.id, {file: "login.js"});
	    				step3Complete = true;
	    				chrome.tabs.onUpdated.removeListener(attachScript);
	    			}
    			}
    		}
		}); 

	});
}
*/