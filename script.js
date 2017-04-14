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

var genres = [];

$(document).ready(function () {

	var settings = {
		"async": true,
		"crossDomain": true,
		"url": "https://api.themoviedb.org/3/genre/movie/list?language=en-US&api_key=5bfe27f2b48db1e3ad05dd9b4585bd16",
		"method": "GET",
		"headers": {},
		"data": "{}"
	}

	$.ajax(settings).done(function (response) {
		for(var i in response.genres) {
			//console.log('ID: ' + response.genres[i].id);
			//console.log(response.genres[i].name);
			
			var genresHTML = $('#genresList').html();
			genresHTML += '<div class="genreItem unselectable" data-id='+ i +'>' + response.genres[i].name + '</div>';
			$('#genresList').html(genresHTML);
			
			genres.push({
				id: response.genres[i].id,
				name: response.genres[i].name,
				status: 0
			});
			
		}
		
		console.log(genres);
	
		//console.log(response);
		//$('#genresDiv').html(JSON.stringify(response));
	});

	
	$('#genresList').on('click', '.genreItem', function(){
		//alert($(this).data('id'));
		var itemId = $(this).data('id');
		//console.log(genres[itemId].id);
		if (genres[itemId].status === 0) {
			genres[itemId].status = 1;
			$(this).css('background-color', 'green');
		} else if (genres[itemId].status === 1) {
			genres[itemId].status = 2;
			$(this).css('background-color', 'red');
		} else if (genres[itemId].status === 2) {
			genres[itemId].status = 0;
			$(this).css('background-color', '#222');
		}
		
		
		
	});
	
});