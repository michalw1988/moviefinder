/* ******************************************

API:
https://api.themoviedb.org/3/

API documentation:
https://developers.themoviedb.org/3/

API Key:
5bfe27f2b48db1e3ad05dd9b4585bd16

Sample request:
https://api.themoviedb.org/3/movie/550?api_key=5bfe27f2b48db1e3ad05dd9b4585bd16

To overcome CORS error, add http://crossorigin.me/ to the beginning of the API request URL

****************************************** */


$(document).ready(function () {
	
	
	jsonUrl = 'https://api.themoviedb.org/3/genre/movie/list?api_key=5bfe27f2b48db1e3ad05dd9b4585bd16&language=en-US';
	
	console.log('Getting data...');
	$.getJSON(jsonUrl)
  .done(function(json) {
    console.log('Data received.');
		$('#rightCol').html(JSON.stringify(json));
  })
  .fail(function( jqxhr, textStatus, error ) {
    var err = textStatus + ", " + error;
    console.log( "Request Failed: " + err );
});
	
});