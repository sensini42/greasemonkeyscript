// ==UserScript==
// @name           microtravail
// @namespace      microtravail
// @include        http://microtravail.com/jobs.php*
// ==/UserScript==

if(window.location=="http://microtravail.com/jobs.php"){
	window.location="http://microtravail.com/jobs.php?Sort=NEWEST";
}

function rouge() {

	j = 0;
	tab = [];

	//alert(GM_getValue("txt"));
	var resArray = GM_getValue("txt").split("\n");
	var expr = /.*jobs_details_notrunning.php\?Id=(.*)=.*/

	for(var i=resArray.length-1; i>=0 ; i--){
		if(expr.exec(resArray[i])){
			//alert(resArray[i].replace(expr, "$1"));
			tab[j] = resArray[i].replace(expr, "$1").substring(0,3);
			j++;	
		}
	}


	var expr = /jobs_details.php\?Id=(.*)=/;
	var listBalises = document.getElementsByTagName('a');

	for(var i=listBalises.length-1; i>=0 ; i--){
		var elem = listBalises[i];
		var val = elem.getAttribute('href');
		if(expr.exec(val)){
			val = val.replace(expr, "$1").substring(0,3);
		
			app = 0;
			for(var jj=0; jj<j; jj++){
				if(tab[jj] == val){
					app = 1;
					jj = j;
				}
			}
			if(app == 1){
				elem.style.color='red';
			}
		}
	}

	GM_setValue("txt",null);

}


GM_xmlhttpRequest({
	method: "GET",
	url: "http://microtravail.com/worker.php",
	headers: {
		"User-Agent": "Mozilla/5.0",    // If not specified, navigator.userAgent will be used.
		"Accept": "text/xml"            // If not specified, browser defaults will be used.
	},
	onload: function(response) {
		GM_setValue("txt",response.responseText);
		rouge();
	}
});




