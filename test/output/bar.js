;(function(){
	var n = 0;

	if (!window.Promise) n += 1 << 0;
	if (!window.fetch) n += 1 << 1;
	
	var script = document.createElement("script");
	script.src = "bar-" + n.toString(16) + ".js";
	script.type = "text/javascript";
	document.head.appendChild(script);
})();
