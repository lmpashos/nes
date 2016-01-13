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

self.port.emit("getEscalationTimer", window.location.href)
self.port.once("timerRetrieved", function (timer) {
	document.querySelector("#content > table:nth-child(5) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1)").innerHTML += "- Escalation Timer: " + timer;
});




// finds image links posted in the ticket

var events = document.querySelectorAll("#content > table:nth-child(5) > tbody:nth-child(1) > tr > td:nth-child(2)");
var links = [];
for (var x = 0; x < events.length; x++) {
	var post = events[x].getElementsByTagName("a");
	for (var y = 0; y < post.length; y++) {
		if (post[y].href.toLowerCase().endsWith(".png") || post[y].href.toLowerCase().endsWith(".jpg") || post[y].href.toLowerCase().endsWith(".jpeg") || post[y].href.toLowerCase().endsWith(".gif")) {
			links.push(post[y]);
		}
		else if (post[y].href.toLowerCase().startsWith("http://mycacti.netcarrier.net/cacti/graph_image.php")) {
			links.push(post[y]);
		}
	}
}

// sets the posted image link in image tags for in line viewing

for (var x = 0; x < links.length; x++) {
	var anchor = document.createElement("a");
	anchor.href = links[x].href;
	var img = document.createElement("img");
	img.src = links[x].href;
	anchor.appendChild(img);
	anchor.setAttribute("class", "resizableAnchor");
	img.setAttribute("class", "resizableImg");
	links[x].parentNode.insertBefore(anchor, links[x]);
	links[x].parentNode.removeChild(links[x]);
}



// long chunk of code that makes the images resizable

var imageData = Array();

/*
 * Find all img elements on the page and feed them to makeImageZoomable().
 * Also, record the image's original width in imageData[] in case the user
 * wants to restore size later.
 */
function findAllImages()
{
  var imgs = document.getElementsByClassName("resizableImg");

  for (i=0; i<imgs.length; i++)
  {

    // We will populate this as the user interacts with the image, if they
    // do at all.
    imageData[imgs[i]] = {
		zindex: imgs[i].style.zIndex,
		width: imgs[i].style.width,
		height: imgs[i].style.height,
		position: imgs[i].style.position,
		resized: 0,
		resizable: true
	};

    makeImageZoomable(imgs[i]);
  }

}

/*
 * Calculate the drag size for the event. This is taken directly from
 * honestbleeps's Reddit Enhancement Suite.
 *
 * @param e mousedown or mousemove event.
 * @return Size for image resizing.
 */
function getDragSize(e)
{
		return (p = Math.pow)(p(e.clientX - (rc = e.target.getBoundingClientRect()).left, 2) + p(e.clientY - rc.top, 2), .5);
}

/*
 * Get the viewport's vertical size. This should work in most browsers. We'll
 * use this when making images fit the screen by height.
 *
 * @return Viewport size.
 */
function getHeight() {
  return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
}

/*
 * Set up events for the given img element to make it zoomable via
 * drag to zoom. Most of this is taken directly from honestbleeps's
 * Reddit Enhancement Suite. Event functions are currently written
 * inline. For readability, I may move them. But the code is small
 * enough that I don't yet care.
 *
 * @param imgTag Image element.
 */
function makeImageZoomable(imgTag)
{
  DragData = {};

  imgTag.addEventListener('mousedown', function(e)
  {
    if(e.ctrlKey != 0)
      return true;

    /*
     * This is so we can support the command key on Mac. The combination of OS
     * and browser changes how the key is passed to JavaScript. So we're just
     * going to catch all of them. This means we'll also be catching meta keys
     * for other systems. Oh well! Patches are welcome.
     */
    if(e.metaKey != null) // Can be on some platforms
      if(e.metaKey != 0)
        return true;


	if(e.button == 0) {
		DragData.width = e.target.width;
		DragData.delta = getDragSize(e);
		DragData.dragging = true;

		e.preventDefault();
    }

  }, true);

  imgTag.addEventListener('contextmenu', function(e){
	if(imageData[e.target].resized != 0) {
		imageData[e.target].resized = 0;
		e.target.style.zIndex = imageData[e.target].zIndex;
		e.target.style.maxWidth = e.target.style.width = imageData[e.target].width;
		e.target.style.maxHeight = e.target.style.height = imageData[e.target].height;
		e.target.style.position = imageData[e.target].position;

		// Prevent the context menu from actually appearing.
		e.preventDefault();
		e.returnValue = false;
		e.stopPropagation();
		return false;
    }
	return true;

  }, true);
  imgTag.addEventListener('mousemove', function(e)
  {


	if (DragData.dragging){

		clingdelta = Math.abs(DragData.delta - getDragSize(e));

		//console.log("Cling [mousemove]: "+clingdelta);

		if (clingdelta > 5) {

			var prevwidth = parseInt(e.target.style.width.replace('px', ''));

			e.target.style.maxWidth = e.target.style.width = Math.floor(((getDragSize(e)) * DragData.width / DragData.delta)) + "px";
			e.target.style.maxHeight = '';
			e.target.style.height = 'auto';
			e.target.style.zIndex = 1000; // Make sure the image is on top.

			if(e.target.style.position == '') {
				e.target.style.position = 'relative';
			}

			imageData[e.target].resized = (prevwidth - parseInt(e.target.style.width.replace('px', '')));
		}
    }
  }, false);

  imgTag.addEventListener('mouseout', function(e) {

	  if (DragData.dragging) {
		DragData.dragging = false;
		e.preventDefault();
		return false;
	  }

	  return true;

  }, true);

  imgTag.addEventListener('mouseup', function(e) {

	  if (DragData.dragging) {
		DragData.dragging = false;
		e.preventDefault();
		return false;
	  }

	  return true;

  }, true);

  imgTag.addEventListener('click', function(e)
  {
    if(e.ctrlKey != 0)
      return true;

    if(e.metaKey != null && e.metaKey != 0) // Can be on some platforms
        return true;

	//console.log("Click [click]: "+e.button);
	//console.log("Resize [click]: "+imageData[e.target].resized);

    if (!isNaN(imageData[e.target].resized) && imageData[e.target].resized != 0) {
      e.preventDefault();
      return false;
    }

	return true;
  }, true);

}

findAllImages();
document.addEventListener('dragstart', function() {return false}, false);