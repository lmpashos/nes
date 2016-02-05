var clicked;

function insertAfter(newNode, referenceNode) {
		referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

var tickets = document.querySelectorAll("tr td:first-child a:first-child");

for (var i = 0; i < tickets.length - 1; i++) {
	var space = document.createElement("span");
	space.innerHTML = "&nbsp;&nbsp;";
	insertAfter(space, tickets[i]);
    var wrapper = document.createElement("a");
    wrapper.href = "javascript:void(0)";
	var button = document.createElement("img");
	button.src = self.options.expandImgUrl;
	button.classList.add("quick");
	button.className = button.className + " " + tickets[i].innerHTML.replace(/\D/g,'');
	wrapper.appendChild(button);
    insertAfter(wrapper, space);
	button.addEventListener('click', popup, false);
}


function popup(e) {
    if (! this.id) {
        clicked = this;
        var overlay = document.createElement("div");
        
        var random = "n" + Math.random();
        this.id = random;
        overlay.setAttribute("id","overlay");
        overlay.dataset.pointer = random;

        var exit = document.createElement("div");
        //exit.innerHTML = "x";
        exit.setAttribute("id","exit");
        exit.addEventListener('click', destroy, false);

        /*
        var burn = false;
        $(document).click(function remove(e) {
            if (!$(e.target).parents().andSelf().is('#overlay') && burn) {
                $(document).unbind("click", remove)
                self.port.emit("overlayClosed");
                exit.click();
            }
            else {
                burn = true;
            }
        });
*/

        var content = document.createElement("div");
        content.setAttribute("id","ticketContent");

        document.body.appendChild(exit);
        document.body.appendChild(overlay);
        document.body.style.overflow = "hidden";
        overlay.appendChild(content);

        var classes = this.className.split(" ");

        self.port.emit("grabTicket", classes[1]);
        self.port.once("returnTicket2", function (cust, tic, desc, lastHead, lastUpdate, newUpdate) {
        	content.innerHTML = "<table id=\"ticketInfo\"><tr><td>Customer:</td><td>" + cust + "</td></tr><tr><td>Ticket:</td><td>" + tic + "</td></tr><tr><td>Description:</td><td>" + desc + "</td></tr></table><table id=\'lastPost\'>" + lastHead + lastUpdate + "</table>" + newUpdate;
        	
            var pub = document.querySelector("#newUpdate > tbody:nth-child(1) > tr:nth-child(4) > td:nth-child(1) > input:nth-child(2)");
            pub.checked = false;

            var submit = document.querySelector("#newUpdate tr:last-child input")

            submit.addEventListener("click", function submitClick() {
                //submit.removeEventListener("click", submitClick);

                var text = document.querySelector("#newUpdate > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > textarea:nth-child(1)").value;
                var type = document.getElementById("subject").value;
                var priority = document.querySelector("#newUpdate > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > select:nth-child(2)").value;
                var status = document.querySelector("#newUpdate > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > select:nth-child(3)").value;
                var merge = document.querySelector("#newUpdate > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > select:nth-child(5)").value;
                var owner = document.querySelector("#newUpdate > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > select:nth-child(6)").value;
                var group = document.querySelector("#newUpdate > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > select:nth-child(7)").value;
                pub = document.querySelector("#newUpdate > tbody:nth-child(1) > tr:nth-child(4) > td:nth-child(1) > input:nth-child(2)").checked;              

                if (type == 999) {
                    alert("Select a type!");
                    return;
                }
/*
                console.log(text);
                console.log(type);
                console.log(priority);
                console.log(status);
                console.log(merge);
                console.log(owner);
                console.log(group);
                console.log(pub);
                console.log("");
*/
                self.port.emit("submitUpdate", text, type, priority, status, merge, owner, group, pub);
                self.port.once("submitted2", function() {
                    exit.click();
                    var body = document.getElementsByTagName("body");
                    body[0].click();
                    clicked.click();
                });
            });
        });


    }
}

function destroy(evt) {
    var overlay = document.getElementById("overlay");
    var span = document.getElementById(overlay.dataset.pointer);
    span.removeAttribute("id");
    document.body.removeChild(overlay);
    document.body.removeChild(this);
    document.body.style.overflow = "auto";
    //self.port.removeListener("submitted2");
    self.port.emit("overlayClosed");
}



// fix cacti link

document.querySelector("#rightNav > a:nth-child(2)").href = "http://mycacti.netcarrier.net/cacti/";
document.querySelector("#rightNav > a:nth-child(2) > img:nth-child(1)").src = self.options.cactiImgUrl;