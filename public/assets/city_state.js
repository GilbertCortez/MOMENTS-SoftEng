/* This script and many more are available free online at
The JavaScript Source!! http://www.javascriptsource.com
Created by: Michael J. Damato | http://developing.damato.net/ */

var states = new Array();
//provinces
states['Philippines'] = new Array('Abra','Agusan del Norte','Agusan del Sur','Aklan','Albay','Antique','Apayao','Aurora','Basilan','Bataan','Batanes','Batangas','Benguet','Biliran','Bohol','Bukidnon','Bulacan','Cagayan','Camarines Norte','Camarines Sur','Camiguin','Capiz','Catanduanes','Cavite','Cebu','Compostela Valley','Cotabato','Davao del Norte','Davao del Sur','Davao Oriental','Dinagat Islands','Eastern Samar','Guimaras','Ifugao','Ilocos Norte','Ilocos Sur','Iloilo','Isabela','Kalinga','La Union','Laguna','Lanao del Norte','Lanao del Sur','Leyte','Maguindanao','Marinduque','Masbate','Metro Manila','Misamis Occidental','Misamis Oriental','Mountain Province','Negros Occidental','Negros Oriental','Northern Samar','Nueva Ecija','Nueva Vizcaya','Occidental Mindoro','Oriental Mindoro','Palawan','Pampanga','Pangasinan','Quezon','Quirino','Rizal','Romblon','Samar','Sarangani','Shariff Kabunsuan','Siquijor','Sorsogon','South Cotabato','Southern Leyte','Sultan Kudarat','Sulu','Surigao del Norte','Surigao del Sur','Tarlac','Tawi-Tawi','Zambales','Zamboanga del Norte','Zamboanga del Sur','Zamboanga Sibugay');


// City lists
var cities = new Array();

cities['Philippines'] = new Array();
cities['Philippines']['Abra']= new Array('Bangued','Boliney','Bucay','Bucloc','Daguioman','Danglas','Dolores','La Paz','Lacub','Lagangilang','Lagayan','Langiden','Licuan-Baay','Luba','Malibcong','Manabo','Peñarrubia','Pidigan','Pilar','Sallapadan','San Isidro','San Juan','San Quintin','Tayum','Tineg','Tubo','Villaviciosa');

cities['Philippines']['Agusan del Norte']= new Array('city1','city2');
cities['Philippines']['Agusan del Sur']= new Array('');
cities['Philippines']['Aklan']= new Array('');
cities['Philippines']['Albay']= new Array('');
cities['Philippines']['Antique']= new Array('');
cities['Philippines']['Apayao']= new Array('');
cities['Philippines']['Aurora']= new Array('');
cities['Philippines']['Basilan']= new Array('');
cities['Philippines']['Bataan']= new Array('');
cities['Philippines']['Batanes']= new Array('');
cities['Philippines']['Batangas']= new Array('');
cities['Philippines']['Benguet']= new Array('');
cities['Philippines']['Biliran']= new Array('');
cities['Philippines']['Bohol']= new Array('');
cities['Philippines']['Bukidnon']= new Array('');
cities['Philippines']['Bulacan']= new Array('');
cities['Philippines']['Cagayan']= new Array('');
cities['Philippines']['Camarines Norte']= new Array('');
cities['Philippines']['Camarines Sur']= new Array('');
cities['Philippines']['Camiguin']= new Array('');
cities['Philippines']['Capiz']= new Array('');
cities['Philippines']['Catanduanes']= new Array('');
cities['Philippines']['Cavite']= new Array('');
cities['Philippines']['Cebu']= new Array('');
cities['Philippines']['Compostela Valley']= new Array('');
cities['Philippines']['Cotabato']= new Array('');
cities['Philippines']['Davao del Norte']= new Array('');
cities['Philippines']['Davao del Sur']= new Array('');
cities['Philippines']['Davao Oriental']= new Array('');
cities['Philippines']['Dinagat Islands']= new Array('');
cities['Philippines']['Eastern Samar']= new Array('');
cities['Philippines']['Guimaras']= new Array('');
cities['Philippines']['Ifugao']= new Array('');
cities['Philippines']['Ilocos Norte']= new Array('');
cities['Philippines']['Ilocos Sur']= new Array('');
cities['Philippines']['Iloilo']= new Array('');
cities['Philippines']['Isabela']= new Array('');
cities['Philippines']['Kalinga']= new Array('');
cities['Philippines']['La Union']= new Array('');
cities['Philippines']['Laguna']= new Array('');
cities['Philippines']['Lanao del Norte']= new Array('');

cities['Philippines']['Lanao del Sur']= new Array('');
cities['Philippines']['Leyte']= new Array('');
cities['Philippines']['Maguindanao']= new Array('');
cities['Philippines']['Marinduque']= new Array('');
cities['Philippines']['Masbate']= new Array('');
cities['Philippines']['Metro Manila']= new Array('');
cities['Philippines']['Misamis Occidental']= new Array('');
cities['Philippines']['Misamis Oriental']= new Array('');
cities['Philippines']['Mountain Province']= new Array('');
cities['Philippines']['Negros Occidental']= new Array('');
cities['Philippines']['Negros Oriental']= new Array('');
cities['Philippines']['Northern Samar']= new Array('');
cities['Philippines']['Nueva Ecija']= new Array('');
cities['Philippines']['Nueva Vizcaya']= new Array('');
cities['Philippines']['Occidental Mindoro']= new Array('');
cities['Philippines']['Oriental Mindoro']= new Array('');
cities['Philippines']['Palawan']= new Array('');
cities['Philippines']['Pampanga']= new Array('');
cities['Philippines']['Pangasinan']= new Array('');
cities['Philippines']['Quezon']= new Array('');
cities['Philippines']['Quirino']= new Array('');

cities['Philippines']['Rizal']= new Array('');
cities['Philippines']['Romblon']= new Array('');
cities['Philippines']['Samar']= new Array('');
cities['Philippines']['Sarangani']= new Array('');
cities['Philippines']['Shariff Kabunsuan']= new Array('');
cities['Philippines']['Siquijor']= new Array('');
cities['Philippines']['Sorsogon']= new Array('');
cities['Philippines']['South Cotabato']= new Array('');
cities['Philippines']['Southern Leyte']= new Array('');
cities['Philippines']['Sultan Kudarat']= new Array('');
cities['Philippines']['Sulu']= new Array('');
cities['Philippines']['Surigao del Norte']= new Array('');
cities['Philippines']['Surigao del Sur']= new Array('');
cities['Philippines']['Tarlac']= new Array('');
cities['Philippines']['Tawi']= new Array('');
cities['Philippines']['Zambales']= new Array('');
cities['Philippines']['Zamboanga del Norte']= new Array('');
cities['Philippines']['Zamboanga del Sur']= new Array('');
cities['Philippines']['Zamboanga Sibugay']= new Array('');



function setStates() {
  cntrySel = document.getElementById('country');
  stateList = states[cntrySel.value];
  changeSelect('state', stateList, stateList);
  setCities();
}

function setCities() {
  cntrySel = document.getElementById('country');
  stateSel = document.getElementById('state');
  cityList = cities[cntrySel.value][stateSel.value];
  changeSelect('city', cityList, cityList);
}

function changeSelect(fieldID, newOptions, newValues) {
  selectField = document.getElementById(fieldID);
  selectField.options.length = 0;
  for (i=0; i<newOptions.length; i++) {
    selectField.options[selectField.length] = new Option(newOptions[i], newValues[i]);
  }
}

// Multiple onload function created by: Simon Willison
// http://simonwillison.net/2004/May/26/addLoadEvent/
function addLoadEvent(func) {
  var oldonload = window.onload;
  if (typeof window.onload != 'function') {
    window.onload = func;
  } else {
    window.onload = function() {
      if (oldonload) {
        oldonload();
      }
      func();
    }
  }
}

addLoadEvent(function() {
  setStates();
});
