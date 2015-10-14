/*

This script handles interactivity for the panel.

*/

/*


// listens for ticket info relayed from main that originated in tickets.js
self.port.on("updatePanel", function (text,numTickets){
	//console.log("!!!!!!")
	document.getElementById("ticketCount").innerHTML = text;
	document.getElementById("numTickets").innerHTML = "Ticket Count: " + numTickets;

	if (document.getElementById("cumberbutton").checked == true) {
		var names = document.getElementsByClassName("name");
		var numNames = names.length;
		var index = Math.floor((Math.random() * numNames)); 
		names[index].innerHTML = generator();
	}
});

*/

document.addEventListener("DOMContentLoaded", function(){

	getSavedData();

	// handles link clicks
	var links = document.getElementsByTagName("a");
	for (var i = 0; i < links.length; i++) {
		links[i].addEventListener('click', function(){
			var link = this.id;
			chrome.tabs.create({url: link});
		});
	}

	// tells main when update ticket count button is clicked
	var button = document.getElementById("button");
	button.addEventListener('click', function() {
		//console.log("clicked button")
		getNewData();
	});

	document.getElementById("acd").addEventListener('click', function(){
		//console.log("lol")
		chrome.extension.sendRequest({greeting: "login"});
	});

});


// genetates a fake Benedict Cumberbatch name
// ripped off from http://benedictcumberbatchgenerator.tumblr.com
function generator(){
			
	var firstnamelist = ["Bumblebee", "Bandersnatch", "Broccoli", "Rinkydink", "Bombadil", "Boilerdang", "Bandicoot", "Fragglerock", "Muffintop", "Congleton", "Blubberdick", "Buffalo", "Benadryl", "Butterfree", "Burberry", "Whippersnatch", "Buttermilk", "Beezlebub", "Budapest", "Boilerdang", "Blubberwhale", "Bumberstump", "Bulbasaur", "Cogglesnatch", "Liverswort", "Bodybuild", "Johnnycash", "Bendydick", "Burgerking", "Bonaparte", "Bunsenburner", "Billiardball", "Bukkake", "Baseballmitt", "Blubberbutt", "Baseballbat", "Rumblesack", "Barister", "Danglerack", "Rinkydink", "Bombadil", "Honkytonk", "Billyray", "Bumbleshack", "Snorkeldink", "Anglerfish", "Beetlejuice", "Bedlington", "Bandicoot", "Boobytrap", "Blenderdick", "Bentobox", "Anallube", "Pallettown", "Wimbledon", "Buttercup", "Blasphemy", "Syphilis", "Snorkeldink", "Brandenburg", "Barbituate", "Snozzlebert", "Tiddleywomp", "Bouillabaisse", "Wellington", "Benetton", "Bendandsnap", "Timothy", "Brewery", "Bentobox", "Brandybuck", "Benjamin", "Buckminster", "Bourgeoisie", "Bakery", "Oscarbait", "Buckyball", "Bourgeoisie", "Burlington", "Buckingham", "Barnoldswick"];
	var lastnamelist = ["Coddleswort", "Crumplesack", "Curdlesnoot", "Calldispatch", "Humperdinck", "Rivendell", "Cuttlefish", "Lingerie", "Vegemite", "Ampersand", "Cumberbund", "Candycrush", "Clombyclomp", "Cragglethatch", "Nottinghill", "Cabbagepatch", "Camouflage","Creamsicle", "Curdlemilk", "Upperclass", "Frumblesnatch", "Crumplehorn", "Talisman", "Candlestick", "Chesterfield", "Bumbersplat", "Scratchnsniff", "Snugglesnatch", "Charizard", "Carrotstick", "Cumbercooch", "Crackerjack", "Crucifix", "Cuckatoo", "Cockletit", "Collywog", "Capncrunch", "Covergirl", "Cumbersnatch", "Countryside","Coggleswort", "Splishnsplash", "Copperwire", "Animorph", "Curdledmilk", "Cheddarcheese", "Cottagecheese", "Crumplehorn", "Snickersbar", "Banglesnatch", "Stinkyrash", "Cameltoe", "Chickenbroth", "Concubine", "Candygram", "Moldyspore", "Chuckecheese", "Cankersore", "Crimpysnitch", "Wafflesmack", "Chowderpants", "Toodlesnoot", "Clavichord", "Cuckooclock", "Oxfordshire", "Cumbersome", "Chickenstrips", "Battleship", "Commonwealth", "Cunningsnatch", "Custardbath", "Kryptonite", "Curdlesnoot", "Cummerbund", "Coochyrash", "Crackerdong", "Crackerdong", "Curdledong", "Crackersprout", "Crumplebutt", "Colonist", "Coochierash"] 
	var fullnamelist = ["Wimbledon Tennismatch", "Rinkydink Curdlesnoot", "Butawhiteboy Cantbekhan", "Benadryl Claritin", "Bombadil Rivendell", "Wanda's Crotchfruit", "Wanda's Crotchfruit", "Biblical Concubine", "Butawhiteboy Cantbekhan", "Syphilis Cankersore", "Butawhiteboy Cantbekhan", "Benedict Timothy Carlton Cumberbatch", "Wanda's Son", "Buckminster Fullerene", "Bourgeoisie Capitalist"];	
	
	var random1 = parseInt(Math.random() * firstnamelist.length);
	var random2 = parseInt(Math.random() * lastnamelist.length);
	var randomfull = parseInt(Math.random() * fullnamelist.length);		

	var name = firstnamelist[random1] + " " + lastnamelist[random2];
	var fullname = fullnamelist[randomfull];
	
	var numberroll=Math.floor(Math.random() * 10) + 1;
	var finalname=""
	if (numberroll > 9) {
		finalname=fullname;
	}
	else {
		finalname=name;
	}
	
	if(document.getElementById("result")){
		document.getElementById("placeholder").removeChild(document.getElementById("result"));
	}
	return finalname + "&nbsp;"
}

function getSavedData(){
	var table = document.getElementsByTagName("table");
	if (localStorage.getItem("tableSaved") !== null && localStorage.getItem("tableSaved") !== "reload") {
		table[0].innerHTML = localStorage.getItem("tableSaved");
		sorttable.makeSortable(table[0]);
		document.getElementById("clickAtLoad").click();
	}
	else{
		getNewData()
	}
	
}

function getNewData(){
	var table = document.getElementsByTagName("table");
	chrome.tabs.create({url: "http://tickets/tickets/view.asp", active: false}, function (tab) {
	 	chrome.tabs.executeScript(tab.id, {file: "tickets.js"})
		chrome.extension.onRequest.addListener(
		    function update(request, sender) {
		        table[0].innerHTML = request.table;
		        sorttable.makeSortable(table[0]);
		        localStorage.setItem("tableSaved", table[0].innerHTML)
		    	chrome.tabs.remove(tab.id)
		    	chrome.extension.onRequest.removeListener(update);
		    	document.getElementById("clickAtLoad").click();
		    }
		);
	});
}