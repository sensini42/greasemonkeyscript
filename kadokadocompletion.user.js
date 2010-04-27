// ==UserScript==
// @name           kadokadocomp
// @namespace      kadokadocomp
// @include        http://www.kadokado.com/user/*
// ==/UserScript==

if(location.search!='?st=st'){ 
const GAME_URL_PREFIX = 'http://www.kadokado.com/game/';
const GAME_URL_SUFFIX = '/play';
const SCORE_TD = /<td class="left">(<img alt="step\.alt" src="http:\/\/dat\.kadokado\.com\/gfx\/icons\/redStar\.gif"\/> <span class="num2img">(<img alt="[0-9\.]" src="http:\/\/dat\.kadokado\.com\/gfx\/typo\/sred\/(dot|[0-9])\.gif"\/>)+<\/span>)<\/td>/;

function get(url, cb, param) {
	GM_xmlhttpRequest({
		method: "GET",
		url: url,
		onload: function(response) {
			cb(response, param);
		}
	})
}
function parseScore(dom) {
	var str = dom.getElementsByTagName('span')[0].innerHTML;
	return parseInt(str.replace(/[0-9]\.gif/g, '').replace(/[^0-9]/g, ''));
}

var gameTable = document.getElementsByTagName('table')[0];

for (var i =  gameTable.rows.length-1;i>=0; i--) {
    var row = gameTable.rows[i];
    if (i == 0) {
	var th = document.createElement('th');
	th.innerHTML = 'Rouge';
	row.insertBefore(th, row.cells[2]);
	var th2 = document.createElement('th');
	th2.innerHTML = 'Pourcent';
	row.appendChild(th2);
    } else {
	var etrg = row.getElementsByTagName('img')[1];
	if(etrg){
	    if(etrg.getAttribute('alt')=="Red"){
		row.parentNode.removeChild(row);
	    }
	    else{
		var cell = row.insertCell(2);
		var url = row.cells[1].getElementsByTagName('a')[0].href;
		get(url, (function(xhr, tmpRow) {			    
			    var tmpCell = tmpRow.cells[2];;
			    var match = SCORE_TD.exec(xhr.responseText);
			    if (match){
				tmpCell.innerHTML =match[1];
				var current = parseScore(tmpRow.cells[3]);
				var qualif = parseScore(tmpCell);
				var cell2 = tmpRow.insertCell(4);
				var taux=Math.round(current/qualif*100);
				if (taux>=100){
				    cell2.innerHTML="<font color='#EE0000'><b>"+taux+"</b></font>";
				}
				else{
				    if (taux>=80){
					cell2.innerHTML="<font color='#990000'>"+taux+"</font>";
				    }
				    else{
					cell2.innerHTML=taux;
				    }
				}

			    }
			}), row);
		
	    }
	}
    }
}
//fi location st
}
