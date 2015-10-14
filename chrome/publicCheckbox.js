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
