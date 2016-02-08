if (self.options.companyName == true) {
	//alert("company name enabled");
	useCompanyName();
}

function useCompanyName() {
	var val = "Company Name";
	var selArr = document.getElementsByTagName("select");
	var sel = selArr[0];
	var opts = sel.options;
	for(var opt, j = 0; opt = opts[j]; j++) {
	    if(opt.value == val) {
	        sel.selectedIndex = j;
	        break;
	    }
	}
}