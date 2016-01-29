// fix cacti link

document.querySelector("#rightNav > a:nth-child(2)").href = "http://mycacti.netcarrier.net/cacti/";
document.querySelector("#rightNav > a:nth-child(2) > img:nth-child(1)").src = chrome.extension.getURL("top_cacti.png");