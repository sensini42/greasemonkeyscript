// ==UserScript==
// @name           kadokado
// @namespace      kadokado
// @include        http://www.kadokado.com/clan/2441/status
// ==/UserScript==

function dojob () {

	var css = document.createElement('style')
	css.setAttribute('type','text/css')
	css.innerHTML = "span.er {color : #466167 ; font-weight : bold; background : url(/gfx/icons/redStar.gif) no-repeat center left; padding-left : 19px;}"
		+ "span.ev {color : #466167 ; font-weight : bold; background : url(/gfx/icons/greenStar.gif) no-repeat center left; padding-left : 19px;}"
		+ "span.eo {color : #466167 ; font-weight : bold; background : url(/gfx/icons/orangeStar.gif) no-repeat center left; padding-left : 19px;}";
	document.lastChild.appendChild(css);


	var regniv = /level.*\.gif/;
	var regeto = /.*Star\.gif/;
	var regsup = /ok\.gif/;
	var deff = /.*defme.*/;
	var atak = /.*attack.*/;

	var orange = /.*orange/;
	var rouge = /.*red/;
	var vert = /.*green/;

	var etoileorange = "http://dat.kadokado.com/gfx/icons/orangeStar.gif";
	var etoilerouge = "http://dat.kadokado.com/gfx/icons/redStar.gif";
	var etoileverte = "http://dat.kadokado.com/gfx/icons/greenStar.gif";

	function getInfos(var1){
		var tab = [];
	
		tab[0] = ''; // etoile max
		tab[1] = ''; // niveau
		// lecture page perso
		var user = document.getElementById('iframe_user');
		var table = user.contentDocument.body.getElementsByTagName('table')[0];
		var trs = table.getElementsByTagName('tr');
		for(var i=1; i<trs.length; i++){
			var tr = trs[i];
			var a = tr.getElementsByTagName('a')[0];
			if(a.text == var1){
				var imgs = tr.getElementsByTagName('img');
				for(var j=0; j<imgs.length; j++){
					var img = imgs[j].getAttribute('src');
					if(regniv.exec(img)){
						tab[1] = img;
					}
					if(regeto.exec(img)){
						tab[0] = img;
					}
				}
			}
		}

		tab[2] = ''; // etoile
		tab[3] = ''; // superieur
		// lecture page site pour voir progression
		var site = document.getElementById('iframe_site');
		var table = site.contentDocument.body.getElementsByTagName('table')[1];
		var trs = table.getElementsByTagName('tr');
		for(var i=1; i<trs.length; i++){
			var tr = trs[i];
			var a = tr.getElementsByTagName('a')[2];
			if(a.text == var1){
				var imgs = tr.getElementsByTagName('img');
				for(var j=0; j<imgs.length; j++){
					var img = imgs[j].getAttribute('src');
					if(regeto.exec(img)){
						tab[2] = img;
					}
					if(regsup.exec(img)){
						tab[3] = img;
					}
				}
			}
		}
	
		return tab;
	}
	
	var table = document.getElementsByTagName('table')[0];

	var trs = table.getElementsByTagName('tr')
	
	var tr = trs[0];
	
	if(tr.getElementsByTagName('th').length==6){
		mission = 0	
	} else {
		mission = 1
	}

	var tab = ['M','N','E','S'];
	for(var i=0; i<tab.length; i++){
		var tmp = document.createElement('th');
		tmp.setAttribute('class','tiny');
		var tmp_txt = document.createTextNode(tab[i]);
		tmp.appendChild(tmp_txt);
		tr.appendChild(tmp);
	}

	for(var i=trs.length-1; i>0; i--){
		var tr = trs[i];
		if(mission == 1){
			if(trs[i].getAttribute('class') == 'false'){
				tr.parentNode.removeChild(tr);
			} else {
				var a = tr.getElementsByTagName('a')[0];
				var tab = getInfos(a.text);
				for(var j=0; j<tab.length; j++){
					var tmp = document.createElement('td');
					if(tab[j] != ''){
						var tmp_img = document.createElement('img');
						tmp_img.setAttribute('src',tab[j]);
						tmp.appendChild(tmp_img);
					}
					tr.appendChild(tmp);
				}
			}
		} else {
			var class = tr.getAttribute('class');
			if(deff.exec(class) || atak.exec(class)){
				var span = tr.getElementsByTagName('span')[1];
				var tmp_img = document.createElement('img');
				if(orange.exec(class)){
					span.setAttribute('class','eo');
				} else if(rouge.exec(class)){
					span.setAttribute('class','er');
				} else {
					span.setAttribute('class','ev');
				}
				if(deff.exec(class)){
					var tab = getInfos(span.innerHTML);
					for(var j=0; j<tab.length; j++){
						var tmp = document.createElement('td');
						if(tab[j] != ''){
							var tmp_img = document.createElement('img');
							tmp_img.setAttribute('src',tab[j]);
							tmp.appendChild(tmp_img);
						}
						tr.appendChild(tmp);
					}
				}
			} 
		}
	}
		
}

function star(){

	var resArray = document.getElementById('iframe_site').contentDocument.body.innerHTML.split("\n");
	var expr = /.*\/user\/(.*)\/starCompletion.*/
	for(var i=resArray.length-1; i>=0 ; i--){
		if(expr.exec(resArray[i])){
			num = resArray[i].replace(expr, "$1");
		}
	}

	var user = document.createElement('iframe');
	user.setAttribute('src','http://www.kadokado.com/user/'+num+'/starCompletion?st=st');
	user.setAttribute('onload','dojob()');
	user.setAttribute('id','iframe_user');
	var div2 = document.createElement('div');
	div2.setAttribute('style','display:none');
	div2.appendChild(user);
	document.lastChild.appendChild(div2);

}

var scr = document.createElement('script');
scr.setAttribute('type','text/javascript');
scr.appendChild(document.createTextNode(star+"\n"+dojob));
document.lastChild.appendChild(scr);


var site = document.createElement('iframe');
site.setAttribute('src','http://www.kadokado.com/site');
site.setAttribute('onload','star()');
site.setAttribute('id','iframe_site');
var div = document.createElement('div');
div.setAttribute('style','display:none');
div.appendChild(site);
document.lastChild.appendChild(div);


