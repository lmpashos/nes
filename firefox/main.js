/*

This is the main script for NES
All functionality is managed through thos script

*/


// add some necessary APIs 
var data = require("sdk/self").data;
var { ToggleButton } = require('sdk/ui/button/toggle');
var self = require("sdk/self");


// initialize preferences
var alwaysPrivate = require('sdk/simple-prefs').prefs['alwaysPrivate'];
var prepNOC = require('sdk/simple-prefs').prefs['prepNOC'];
var companyName = require('sdk/simple-prefs').prefs['companyName'];
var acdKicker = require('sdk/simple-prefs').prefs['acdKicker'];


// intitialize asssets
var expandImgUrl = self.data.url("images/expand.png");
var collapseImgUrl = self.data.url("images/collapse.png");
var cactiImgUrl = self.data.url("images/top_cacti.png");


// handles preference changes so the browser does not
// have to be restarted to change effect
require("sdk/simple-prefs").on("", onPrefChange);
function onPrefChange(prefName) {
  if (prefName == "alwaysPrivate") {
    alwaysPrivate = require('sdk/simple-prefs').prefs[prefName];
    notPublic.destroy();
    initNotPublic();
  }
  if (prefName == "prefNOC") {
    prepNOC = require('sdk/simple-prefs').prefs[prefName];
    notPublic.destroy();
    initNotPublic();
  }
  if (prefName == "companyName") {
    companyName = require('sdk/simple-prefs').prefs[prefName];
    ticketCreateDefault.destroy();
    initTicketCreateDefault();
  }
  if (prefName == "acdKicker") {
    acdKicker = require('sdk/simple-prefs').prefs[prefName];
    reach.destroy();
    initReach();
  }
}


// button in browser tool bar
var button = ToggleButton({
  id: "NES",
  label: "NES",
  icon: {
    "16": "./images/icon-16.png",
    "32": "./images/icon-32.png",
    "64": "./images/icon-64.png"
  },
  onChange: handleChange
});


// panel to be displayed when clicked
var panel = require("sdk/panel").Panel({
  contentURL: data.url("html/panel.html"),
  contentScriptFile: [data.url("js/panel.js"), data.url("js/sorttable.js")],
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


// detaches page-mod scripts from page when page closed
var workers = [];
function detachWorker(worker, workerArray) {
  var index = workerArray.indexOf(worker);
  if(index != -1) {
    workerArray.splice(index, 1);
  }
}


// initializes script that handles unchecking the public checkbox when updating a ticket
// and puts the ticket into "NOC" mode

var notPublic;
initNotPublic();

function initNotPublic() {
  notPublic = require("sdk/page-mod").PageMod({
    include: ["http://tickets/tickets/viewticket.asp?id=*", "http://tickets.ncdomain.netcarrier.com/tickets/viewticket.asp?id=*"],
    contentScriptFile: data.url("js/ticket.js"),
    contentStyleFile: self.data.url("css/ticket.css"),
    contentScriptOptions: {
      alwaysPrivate: alwaysPrivate,
      prepNOC: prepNOC,
      expandImgUrl: expandImgUrl,
      collapseImgUrl: collapseImgUrl,
      cactiImgUrl: cactiImgUrl
    },
    onAttach: function(worker) {
      workers.push(worker);
      worker.on('detach', function() {
        detachWorker(this, workers);
      });
      worker.port.once("getEscalationTimer", function (link) {
        var getEscalationTimer = require("sdk/page-worker").Page({
          contentScriptFile: data.url("js/getEscalationTimer.js"),
          contentScriptOptions: {ticketLink: link},
          contentURL: "http://tickets/tickets/view.asp"
        });
        getEscalationTimer.port.once("timerRetrieved1", function (timer) {
          worker.port.emit("timerRetrieved", timer);
          getEscalationTimer.destroy();
        });
      });
    }
  });
}


// initializes script that makes the ticket create page default search "Company Name"
var ticketCreateDefault;
initTicketCreateDefault();
function initTicketCreateDefault() {
  ticketCreateDefault = require("sdk/page-mod").PageMod({
    include: ["http://tickets/tickets/create.asp", "http://tickets.ncdomain.netcarrier.com/tickets/create.asp"],
    contentScriptFile: data.url("js/createTicket.js"),
    contentScriptOptions: {
      companyName: companyName
    },
    onAttach: function(worker) {
      workers.push(worker);
      worker.on('detach', function() {
        detachWorker(this, workers);
      })
    }
  });
}


// itializes script that puts the user back into queue when released from queue
var reach;
initReach();
function initReach() {
  reach = require("sdk/page-mod").PageMod({
    include: ["https://pbx1.ncpbxnccorp.com/reach/d*", "http://pbx1.ncpbxnccorp.com/reach/d*"],
    contentScriptFile: self.data.url("js/reach.js"),
    contentScriptOptions: {
      releaseKicker: acdKicker
    },
    onAttach: function(worker) {
      workers.push(worker);
      worker.on('detach', function() {
        detachWorker(this, workers);
      })
    }
  });
}


// controller for the quick ticket view functionality
var viewTickets = require("sdk/page-mod");
viewTickets.PageMod({
  include: ["http://tickets/tickets/view.asp", "http://tickets.ncdomain.netcarrier.com/tickets/view.asp"],
  contentScriptFile: data.url("js/viewTickets.js"),
  contentStyleFile: self.data.url("css/viewTickets.css"),
  contentScriptOptions : {
    expandImgUrl: expandImgUrl,
    cactiImgUrl: cactiImgUrl
  },
  onAttach: function(worker) {
    worker.port.on("grabTicket", function(ticket){
      var pageWorker = require("sdk/page-worker").Page({
        contentScriptFile: data.url("js/getTicketInfo.js"),
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


// attatches getTicketNumbers.js to tickets tab to count up the tickets
function countTickets(tab) {
  worker = tab.attach({
    contentScriptFile: data.url("js/getTicketNumbers.js")
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
    contentScriptFile: data.url("loginOldACD.js"),
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


// gets the username of the current user
var userName;
panel.port.on("getMyTickets", function () {
  var pageWorker = require("sdk/page-worker").Page({
    contentURL: "http://tickets/",
    contentScriptFile: data.url("js/getUser.js")
  });
  pageWorker.port.once("userGot", function (name) {
    pageWorker.destroy();
    userName = name + "&nbsp;";
    openMyTickets();
  });
});


// opens all the tickets owned by the current user
function openMyTickets() {
  var pageWorker = require("sdk/page-worker").Page({
    contentURL: "http://tickets/tickets/view.asp",
    contentScriptFile: data.url("js/getUsersTickets.js"),
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


panel.port.on("openHisTickets", function (name) {
  var pageWorker = require("sdk/page-worker").Page({
    contentURL: "http://tickets/tickets/view.asp",
    contentScriptFile: data.url("js/getUsersTickets.js"),
    contentScriptOptions: {"name": name}
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
});



panel.port.on("seanSearch", function () {
  var pageWorker = require("sdk/page-worker").Page({
    contentURL: "http://tickets/",
    contentScriptFile: data.url("js/getUser.js")
  });
  pageWorker.port.once("userGot", function (name) {
    pageWorker.destroy();
    userName = name;
    seanSearchCaller();
  });
});

var searchTicketsTab = require("sdk/tabs")
function seanSearchCaller() {
  searchTicketsTab.open({
    url: "http://tickets/tickets/search.asp",
    inBackground: false
  });
  searchTicketsTab.on("ready", seanSearch);
}

function seanSearch(tab) {
  searchSearchWorker = tab.attach({
    contentScriptFile: data.url("js/seanSearch.js"),
    contentScriptOptions: {"name": userName}
  });
  searchSearchWorker.port.on("complete", function() {
    searchTicketsTab.removeListener("ready", seanSearch);
    searchSearchWorker.destroy();
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