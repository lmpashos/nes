// Saves options to chrome.storage
function save_options() {
  //var user = document.getElementById('user').value;
  //var pass = document.getElementById('pass').value;
  //var ext = document.getElementById('ext').value;
  var alwaysPrivate = document.getElementById('private').checked;
  var prepNOC = document.getElementById('prepNOC').checked;
  var companyName = document.getElementById('name').checked;
  var requeue = document.getElementById('requeue').checked;
  chrome.storage.sync.set({
    //username: user,
    //password: pass,
    //extension: ext,
    alwaysPrivate: alwaysPrivate,
    prepNOC: prepNOC,
    companyName: companyName,
    requeue: requeue
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}


// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    //username: 'Username Here',
    //password: 'Password Here',
    //extension: 'Extension Here',
    alwaysPrivate: true,
    prepNOC: true,
    companyName: true,
    requeue: false
  }, function(items) {
    //document.getElementById('user').value = items.username;
    //document.getElementById('pass').value = items.password;
    //document.getElementById('ext').value = items.extension;
    document.getElementById('private').checked = items.alwaysPrivate;
    document.getElementById('prepNOC').checked = items.prepNOC;
    document.getElementById('name').checked = items.companyName;
    document.getElementById('requeue').checked = items.requeue;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);