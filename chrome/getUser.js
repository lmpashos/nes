var words = document.querySelector("#content > center:nth-child(3) > font:nth-child(1) > p:nth-child(2) > b:nth-child(1)").innerHTML;
var n = words.split(" ");
chrome.extension.sendRequest({greeting: "userGotten", name: n[n.length - 1].toLowerCase() + "&nbsp;"});