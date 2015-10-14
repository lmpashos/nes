/*

This is the main script for NES
All functionality is managed through thos script

*/


// add some necessary APIs 
var data = require("sdk/self").data;
var pageMod1 = require("sdk/page-mod");
var pageMod2 = require("sdk/page-mod");
var { ToggleButton } = require('sdk/ui/button/toggle');
var self = require("sdk/self");

// button in browser tool bar
var button = ToggleButton({
  id: "NES",
  label: "NES",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  onChange: handleChange
});

// panel to be displayed when clicked
var panel = require("sdk/panel").Panel({
  contentURL: data.url("panel.html"),
  contentScriptFile: [data.url("panel.js"), data.url("sorttable.js")],
  height: 550,
  width: 600,
  onHide: handleHide
});

// displays panel when clicked
function handleChange(state) {
  if (state.checked) {
    panel.show({
      position: button
    });
  }
}

// hides panel
function handleHide() {
  button.state('window', {checked: false});
}

// opens a "Useful Link" in a new tab when link when clicked in panel
panel.port.on("clickedLink", function (link) {
  var newTab = require("sdk/tabs");
  newTab.open({
    url: link
  });
});

// handles unchecking the public checkbox when updating a ticket
pageMod1.PageMod({
  include: ["http://tickets/tickets/viewticket.asp?id=*", "http://tickets.ncdomain.netcarrier.com/tickets/viewticket.asp?id=*"],
  contentScriptFile: data.url("publicCheckbox.js"),
  contentScriptOptions: {
    alwaysPrivate: require('sdk/simple-prefs').prefs['alwaysPrivate'],
    prepNOC: require('sdk/simple-prefs').prefs['prepNOC']
  }
});

pageMod2.PageMod({
  include: ["http://tickets/tickets/create.asp", "http://tickets.ncdomain.netcarrier.com/tickets/create.asp"],
  contentScriptFile: data.url("companyName.js"),
  contentScriptOptions: {
    companyName: require('sdk/simple-prefs').prefs['companyName']
  }
});

var imgurl = self.data.url("expand.png");
var ticketsPage = require("sdk/page-mod");
ticketsPage.PageMod({
  include: ["http://tickets/tickets/view.asp", "http://tickets.ncdomain.netcarrier.com/tickets/view.asp"],
  contentScriptFile: [data.url("jquery-1.11.1.js"), data.url("jquery-ui.js"), data.url("ticketsPage.js")],
  contentStyleFile: self.data.url("ticketsPage.css"),
  onAttach: function(worker) {
    worker.port.emit("imgurl", imgurl);
    worker.port.on("grabTicket", function(ticket){
      var pageWorker = require("sdk/page-worker").Page({
        contentScriptFile: data.url("ticketBody.js"),
        contentURL: "http://tickets/tickets/viewticket.asp?id=" + ticket
      });
      pageWorker.port.on("returnTicket", function (cust, tic, desc, lastHead, lastUpdate, newUpdate) {
        worker.port.emit("returnTicket2", cust, tic, desc, lastHead, lastUpdate, newUpdate);
      });
      pageWorker.port.once("submitted", function() {
        pageWorker.destroy();
        worker.port.emit("submitted2");
      });
      worker.port.once("submitUpdate", function (text, type, priority, status, merge, owner, group, pub) {
        pageWorker.port.emit("submitUpdate2", text, type, priority, status, merge, owner, group, pub);
      });
      worker.port.once("overlayClosed", function() {
        pageWorker.destroy();
        //console.log("closed")
      });
    });

  }
});

// initiates the ticket counter functionality
openTickets();

// opens a new tab with the tickets page and calls the below function to count the tickets
function openTickets() {
  var tabs = require("sdk/tabs");
  tabs.open({
    url: "http://tickets/tickets/view.asp",
    onReady: countTickets,
    inBackground: true
  });
}

// attatches tickets.js to tickets tab to count up the tickets
function countTickets(tab) {
  worker = tab.attach({
    contentScriptFile: data.url("tickets.js")
  });

  worker.port.on("returnTicketCount", function (html,numTickets){
    panel.port.emit("updatePanel",html)
    tab.close();
  })

  panel.port.once("clicked", function () {
    openTickets();
  });
}

/*
function login(tab) {
  worker = tab.attach({
    contentScriptFile: data.url("login.js"),
    contentScriptOptions: {
      username: require('sdk/simple-prefs').prefs['username'],
      password: require('sdk/simple-prefs').prefs['password'],
      extension: require('sdk/simple-prefs').prefs['extension'],
    }
  });
  worker.port.once("loginError", function () {
    tab.close();
  });
  worker.port.on("loginFinished", function () {
    acdTab.removeListener("ready", login)
  })
}


var acdTab = require("sdk/tabs");
panel.port.on("acdClicked", function () {

  acdTab.open({
    url: "http://netcarrier.qmax.netcarrier.net/cti/agents",
    isPinned: true,
    inBackground: true
  });
  acdTab.on("ready",login)
});
*/

var reach = require("sdk/page-mod");
reach.PageMod({
  include: ["https://pbx1.ncpbxnccorp.com/reach/d*", "http://pbx1.ncpbxnccorp.com/reach/d*"],
  contentScriptFile: self.data.url("reach.js"),
  contentScriptOptions: {
    releaseKicker: require('sdk/simple-prefs').prefs['acdKicker']
  }
});


var userName;
panel.port.on("getMyTickets", function () {
  var pageWorker = require("sdk/page-worker").Page({
    contentURL: "http://tickets/",
    contentScriptFile: data.url("getUser.js")
  });
  pageWorker.port.once("userGot", function (name) {
    pageWorker.destroy();
    userName = name + "&nbsp;";
    openMyTickets();
  });
});

function openMyTickets() {
  var pageWorker = require("sdk/page-worker").Page({
    contentURL: "http://tickets/tickets/view.asp",
    contentScriptFile: data.url("myTickets.js"),
    contentScriptOptions: {"name": userName}
  });
  pageWorker.port.once("linksRetrieved", function (links){
    pageWorker.destroy();
    var tabs = require("sdk/tabs");
    for (var i = 0; i < links.length; i++) {
      tabs.open({
        url: links[i],
        inBackground: true
      });
 
    }
  });
}





/*
  {
      "name": "username",
      "title": "ACD Username",
      "type": "string",
      "value": "Username Here"
  },
  {
      "name": "password",
      "title": "ACD Password",
      "type": "string",
      "value": "Password Here"
  },
  {
    "name": "extension",
      "title": "Extension",
      "type": "string",
      "value": "Extension Here"
  },
*/