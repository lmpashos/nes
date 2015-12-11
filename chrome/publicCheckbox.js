/*

This script automatically unchecks the "make event public"
checkbox in a ticket after an update type has been selected

*/

chrome.storage.sync.get({
    alwaysPrivate: true
}, function(items) {
	if (items.alwaysPrivate == true) {
		//alert("Private Enabled");
		makePrivate();
	}
});

chrome.storage.sync.get({
    prepNOC: true
}, function(items) {
	if (items.prepNOC == true) {
		prepForNOC();
	}
});

function makePrivate() {
	var inputs = document.getElementsByTagName("input");
	var checkBox;

	for (var i = 0; i < inputs.length; i++) {
	  if (inputs[i].type == "checkbox") {
	    checkBox = inputs[i];
	  }
	}

	var type = document.getElementById("subject");
	type.addEventListener("change", function(){
		checkBox.checked = false;
	});
}

function prepForNOC() {
	//alert("noc enabled");
	var noc = document.querySelector("#content > form > table > tbody > tr:nth-child(3) > td > select:nth-child(7)");
	//console.log(noc.innerHTML)
	if (noc.value != 2) {
		noc.addEventListener("click", function(){
			if (this.value == 2) {
				document.querySelector("#content > form:nth-child(8) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > select:nth-child(3) > option:nth-child(2)").selected = true;
				if (document.querySelector("#content > form:nth-child(8) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > select:nth-child(2) > option:nth-child(4)").selected == true) {
					document.querySelector("#content > form:nth-child(8) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > select:nth-child(2) > option:nth-child(3)").selected = true;
				}
			}
		});	
	}
}

var events = document.querySelectorAll("#content > table:nth-child(5) > tbody:nth-child(1) > tr > td:nth-child(2)");
var links = [];
for (var x = 0; x < events.length; x++) {
	var post = events[x].getElementsByTagName("a");
	for (var y = 0; y < post.length; y++) {
		if (post[y].href.toLowerCase().endsWith(".png") || post[y].href.toLowerCase().endsWith(".jpg") || post[y].href.toLowerCase().endsWith(".jpeg") || post[y].href.toLowerCase().endsWith(".gif")) {
			links.push(post[y]);
		}
		else if (post[y].href.toLowerCase().startsWith("http://mycacti.netcarrier.net/cacti/graph_image.php")) {
			links.push(post[y]);
		}
	}
}

for (var x = 0; x < links.length; x++) {
	var div = document.createElement("div");
	var anchor = document.createElement("a");
	anchor.href = links[x].href;
	var img = document.createElement("img");
	img.src = links[x].href;
	div.appendChild(anchor);
	anchor.appendChild(img);
	div.setAttribute("class", "resizableDiv");
	anchor.setAttribute("class", "resizableAnchor");
	img.setAttribute("class", "resizableImg");

	links[x].parentNode.insertBefore(div, links[x]);
	links[x].parentNode.removeChild(links[x]);
}

var imageDivs = document.getElementsByClassName("resizableDiv");
for (var x = 0; x < imageDivs.length; x++) {
	imageDivs[x].addEventListener("mouseup", resize)
}

function resize(){
	var image1 = this.firstChild;
	var image = image1.firstChild;
	this.style.width = image.clientWidth;
	this.style.height = image.clientHeight;
}