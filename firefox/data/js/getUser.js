var words = document.querySelector("#content > center:nth-child(3) > font:nth-child(1) > p:nth-child(2) > b:nth-child(1)").innerHTML;
var n = words.split(" ");
self.port.emit("userGot", n[n.length - 1].toLowerCase());