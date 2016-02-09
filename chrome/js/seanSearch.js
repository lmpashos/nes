chrome.extension.onRequest.addListener(
	function update(request, sender) {
		if (request.greeting == "seanSearchName") {
			var val = request.name;
			val = val.substring(0, val.length - 6);
			console.log(val);
			var sel = document.querySelector("#content > form:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(6) > td:nth-child(2) > select:nth-child(1)");
			var opts = sel.options;
			for (var opt, j = 0; opt = opts[j]; j++) {
			    if (opt.value == val) {
			        sel.selectedIndex = j;
			        break;
			    }
			}

			var status = document.querySelector("#content > form:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(4) > td:nth-child(2) > select:nth-child(1)");
			var statusOpts = status.options;
			for (var statusOpt, i = 0; statusOpt = statusOpts[i]; i++) {
				if (statusOpt.innerHTML == "not closed") {
					status.selectedIndex = i;
					break;
				}
			}

			document.querySelector("#content > form:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > input:nth-child(1)").click();
			chrome.extension.sendRequest({greeting: "seanSearchComplete"});
		}
	}
);