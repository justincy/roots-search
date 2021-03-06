String.prototype.toProperCase = function () {
  return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

var bgPage, tabId;
var mappings = [
  ['givenName', 'first-name'],
  ['familyName', 'last-name'],
  ['birthDate', 'birth-date'],
  ['birthPlace', 'birth-place'],
  ['deathDate', 'death-date'],
  ['deathPlace', 'death-place'],
  ['spouseGivenName', 'spouse-first-name'],
  ['spouseFamilyName', 'spouse-last-name'],
  ['marriageDate', 'marriage-date'],
  ['marriagePlace', 'marriage-place'],
  ['fatherGivenName', 'father-first-name'],
  ['fatherFamilyName', 'father-last-name'],
  ['motherGivenName', 'mother-first-name'],
  ['motherFamilyName', 'mother-last-name']
];

$(document).ready(function(){
  
  // Create input fields
  $.each(mappings, function(i, vals){
    var properLabel = vals[1].replace(/\-/g,' ').toProperCase();
    var fieldWrap = $('<div>').addClass('field-wrap span2')
      .append( $('<div>').addClass('field-label').html(properLabel) )
      .append( 
        $('<input>').addClass('span2').attr({'id': vals[1], 'type': 'text'}).change(function(){
          _gaq.push(['_trackEvent', 'Data', 'Change', properLabel]);
          personData = bgPage.personDataObjects[tabId]['updated'] = getPersonData();
        })        
      )
      .appendTo('#form');
  });
  
  // Get the id of the tab
  chrome.tabs.query({active: true}, function(tabs){
    
    bgPage = chrome.extension.getBackgroundPage();
    tabId = tabs[0].id;
    
    var personData = bgPage.personDataObjects[tabId]['original'];
    if( bgPage.personDataObjects[tabId]['updated'] ) {
      personData = bgPage.personDataObjects[tabId]['updated'];
    }
    
    fillForm(personData);
    
    $('#update-button').attr('disabled', false).click(function(){
      _gaq.push(['_trackEvent', 'Data', 'Update Links']);
      updateLinks();
    });
    
    updateLinks();
    
  });
  
});

function fillForm(personData) {
  $.each(mappings, function(i, vals){
    $('#'+vals[1]).val(personData[vals[0]]);
  });
}

function updateLinks() {
  
  // Delete previous links and show ajax loader for a moment
  $('#search-links .btn').addClass('disabled');
  
  setTimeout(buildLinks, 300);
  
}

function getPersonData() {
  var personData = {};
  $.each(mappings, function(i, vals){
    personData[vals[0]] = $('#'+vals[1]).val();
  });
  return personData;
}

function buildLinks() {
  
  var searchLinks = bgPage.rs.executeLinkBuilders(getPersonData());
  
  // Remove ajax loader and add search links
  $('#search-links').html('');
  $.each(searchLinks, function(i, link){
      $('<a target="_blank">').addClass('btn btn-info').html(link.text).attr('href', link.url).appendTo('#search-links').click(function(){
        _gaq.push(['_trackEvent', 'Links', 'Click', link.text]);
      });
  });
  
}