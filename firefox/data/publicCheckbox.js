/*

This script automatically unchecks the "make event public"
checkbox in a ticket after an update type has been selected

*/


if (self.options.alwaysPrivate == true) {
	//alert("private enabled");
	makePrivate();
}

if (self.options.prepNOC == true) {
	prepForNOC();
}

function makePrivate() {
	var inputs = document.getElementsByTagName("input");
	var checkBox;

	for (var i = 0; i < inputs.length; i++) {
	  if (inputs[i].type == "checkbox") {
	    checkBox = inputs[i];
	  }
	}

	var type = document.getElementById("subject");
	var options = type.getElementsByTagName("*");

	for (var i = 0; i < options.length; i++) {
		options[i].addEventListener("click", function(){
			checkBox.checked = false;
		});
	}
}

function prepForNOC() {
	var noc = document.querySelector("#content > form:nth-child(8) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > select:nth-child(7) > option:nth-child(2)");
	noc.addEventListener("click", function(){
		document.querySelector("#content > form:nth-child(8) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > select:nth-child(3) > option:nth-child(2)").selected = true;
		if (document.querySelector("#content > form:nth-child(8) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > select:nth-child(2) > option:nth-child(4)").selected == true) {
			document.querySelector("#content > form:nth-child(8) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > select:nth-child(2) > option:nth-child(3)").selected = true;
		}
	});	
}