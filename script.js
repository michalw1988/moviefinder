/* ******************************************

API:
https://api.themoviedb.org/3/

API documentation:
https://developers.themoviedb.org/3/

API Key:
5bfe27f2b48db1e3ad05dd9b4585bd16

****************************************** */

var apiKey = '5bfe27f2b48db1e3ad05dd9b4585bd16';

var genres = [];
var adultMovies = true;
var yearFromValue = 1900;
var yearToValue = 2100;
var scoreFromValue = 1;
var scoreToValue = 10;
var votesFromValue = 0;
var votesToValue = 1000000;
var sortType = 'popularity.desc';
var withGenres = '';
var withoutGenres = '';
var page = 1;
var totalPages;

var genresHelper = {};


$(document).ready(function () {

	initOptionsValues();

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
			
			var genresHTML = $('#genresList').html();
			genresHTML += '<div class="genreItem unselectable" data-id='+ i +'>' + response.genres[i].name + '</div>';
			$('#genresList').html(genresHTML);
			
			genres.push({
				id: response.genres[i].id,
				name: response.genres[i].name,
				status: 0
			});
			
			genresHelper[response.genres[i].id] = response.genres[i].name;
		}
	});

	
	$('#genresList').on('click', '.genreItem', function(){
		var itemId = $(this).data('id');
		if (genres[itemId].status === 0) {
			genres[itemId].status = 1;
			$(this).css('background-color', 'orange');
		} else if (genres[itemId].status === 1) {
			genres[itemId].status = 2;
			$(this).css('background-color', 'red');
		} else if (genres[itemId].status === 2) {
			genres[itemId].status = 0;
			$(this).css('background-color', 'black');
		}
	});
	
	
	$('.sortOption').on('click', function(){
		$('.sortOption').css('background-color', '#222');
		$('.sortOption .optionTick').html('');
		$(this).css('background-color', 'orange');
		$(this).children('.optionTick').html('<span class="glyphicon glyphicon-ok"></span>');
		sortType = $(this).data('type');
	});
	
	
	$('#findButton').on('click', function() {
		validateSearchCriteria();
	});
	
	
	$('#adultSettings').on('click', function(){
		if(adultMovies) {
			adultMovies = false;
			$('#adultSettings').html('No');
			$('#adultSettings').css('background-color', 'red');
		} else {
			adultMovies = true;
			$('#adultSettings').html('Yes');
			$('#adultSettings').css('background-color', 'orange');
		}
	});
	
	
	$('#firstPageLink').on('click', function() {
		if(page !== 1) {
			page = 1;
			getMovieList();
		}
	});
	
	
	$('#previousPageLink').on('click', function() {
		if(page > 1) {
			page--;
			getMovieList();
		}
	});
	
	
	$('#nextPageLink').on('click', function() {
		if(page < totalPages) {
			page++;
			getMovieList();
		}
	});
	
	
	$('#lastPageLink').on('click', function() {
		if(page !== totalPages) {
			page = totalPages;
			getMovieList();
		}
	});
	
	
	$('#foundMovies').on('click', '.movieCell', function() {
		var movieId = $(this).data('id');
		openIMDBlink(movieId);
	});
	
	
});


function validateSearchCriteria(){
	$('.validationStar').css('display', 'none');
	$('#validationText').css('display', 'none');
	
	validateYearFrom();
	validateYearTo();
	validateScoreFrom();
	validateScoreTo();
	validateVotesFrom();
	validateVotesTo();
	
	if(
		validateYearFrom() &&
		validateYearTo() &&
		validateScoreFrom() &&
		validateScoreTo() &&
		validateVotesFrom() &&
		validateVotesTo()
	) {
		getMovieList();
	} else {
		$('#validationText').css('display', 'block');
	}
}


function validateYearFrom() {
	var yearFrom = $('#yearFrom').val();
	if (yearFrom > 1800 && yearFrom < 2100 ) {
		yearFromValue = yearFrom;
		return true;
	} else {
		$('#yearFromStar').css('display', 'inline');
		return false;
	}
}


function validateYearTo() {
	var yearTo = $('#yearTo').val();
	if (yearTo > 1800 && yearTo < 2100 ) {
		yearToValue = yearTo;
		return true;
	} else {
		$('#yearToStar').css('display', 'inline');
		return false;
	}
}


function validateScoreFrom() {
	var scoreFrom = $('#scoreFrom').val();
	if (scoreFrom >= 1 && scoreFrom <= 10 ) {
		scoreFromValue = scoreFrom;
		return true;
	} else {
		$('#scoreFromStar').css('display', 'inline');
		return false;
	}
}


function validateScoreTo() {
	var scoreTo = $('#scoreTo').val();
	if (scoreTo >= 1 && scoreTo <= 10 ) {
		scoreToValue = scoreTo;
		return true;
	} else {
		$('#scoreToStar').css('display', 'inline');
		return false;
	}
}


function validateVotesFrom() {
	var votesFrom = parseInt($('#votesFrom').val());
	$('#votesFrom').val(parseInt($('#votesFrom').val()));
	
	if(isNaN($('#votesFrom').val())) {
		$('#votesFrom').val('');
	}
	
	if (votesFrom >=0 && Number.isInteger(votesFrom)) {
		votesFromValue = votesFrom;
		return true;
	} else {
		$('#votesFromStar').css('display', 'inline');
		return false;
	}
}


function validateVotesTo() {
	var votesTo = parseInt($('#votesTo').val());
	$('#votesTo').val(parseInt($('#votesTo').val()));
	
	if(isNaN($('#votesTo').val())) {
		$('#votesTo').val('');
	}
	
	if (votesTo >=0 && Number.isInteger(votesTo)) {
		votesToValue = votesTo;
		return true;
	} else {
		$('#votesToStar').css('display', 'inline');
		return false;
	}
}



function getMovieList() {
	withGenres = '';
	withoutGenres = '';
	
	for (var i in genres) {
		if (genres[i].status === 1) {
			withGenres += genres[i].id + ',';
		} else if (genres[i].status === 2) {
			withoutGenres += genres[i].id + ',';
		}
	}
	
	if (withGenres.length > 0) {
		withGenres = withGenres.slice(0,withGenres.length-1);
	}
	
	if (withoutGenres.length > 0) {
		withoutGenres = withoutGenres.slice(0,withoutGenres.length-1);
	}
	
	var searchString = 'https://api.themoviedb.org/3/discover/movie?api_key='+apiKey+'&language=en-US&sort_by='+sortType+'&include_adult='+adultMovies+'&include_video=false&page='+page+'&release_date.gte='+yearFromValue+'&release_date.lte='+yearToValue+'&vote_count.gte='+votesFromValue+'&vote_count.lte='+votesToValue+'&vote_average.gte='+scoreFromValue+'&vote_average.lte='+scoreToValue+'&with_genres='+withGenres+'&without_genres='+withoutGenres;

	var settings = {
		"async": true,
		"crossDomain": true,
		"url": searchString,
		"method": "GET",
		"headers": {},
		"data": "{}"
	}

	$.ajax(settings).done(function (response) {
		if(response.total_results === 0) {
			$('#nothingFoundMessage').css('display', 'block');
			$('#foundMovies').html('');
			page = 1;
			totalPages = 1;
			$('#paginationDiv').css('display', 'block');
			$('#currentPageText').html('page <strong>' + page + '</strong> out of <strong>' + totalPages + '</strong> total pages');
		} else {
			$('#nothingFoundMessage').css('display', 'none');
			var resultsHtml = '';
			for (var i in response.results) {	
				var description = response.results[i].overview;
				if (description.length > 300) {
					description = description.slice(0,300) + '...';
				}
				
				resultsHtml += 
					'<div class="col-md-6 paddingRemover">' +
						'<div class="movieCell" data-id="' + response.results[i].id + '">' +
							//'<img class="posterImg" src=https://image.tmdb.org/t/p/w185_and_h278_bestv2' + response.results[i].poster_path + ' alt="movie poster">' +
							getMoviePoster(response.results[i].poster_path) +
							'<h4>' + response.results[i].title + ' (' + response.results[i].release_date.slice(0,4) + ')' + '</h4>' +
							'<h6>Score: <strong>' + response.results[i].vote_average + '</strong> based on <strong>' + response.results[i].vote_count + '</strong> votes</h6>' +
							'<p>' + description + '</p>' +
							'<h6><strong>Genres:</strong> ' + getGenres(response.results[i].genre_ids) + '</h6>' +
						'</div>' +
					'</div>';
			}
		
			$('#foundMovies').html(resultsHtml);
			
			if (response.total_pages > 1000) {
				totalPages = 1000;
			} else {
				totalPages = response.total_pages;
			}
			
			$('#paginationDiv').css('display', 'block');
			$('#currentPageText').html('page <strong>' + page + '</strong> out of <strong>' + totalPages + '</strong> total pages');		
		}
		
	});
}


function initOptionsValues() {
	$('#yearFrom').val(yearFromValue);
	$('#yearTo').val(new Date().getFullYear());
	$('#scoreFrom').val(scoreFromValue);
	$('#scoreTo').val(scoreToValue);
	$('#votesFrom').val(votesFromValue);
	$('#votesTo').val(votesToValue);
}


function getGenres(arr) {
	var genreString = '';
	
	for (var i in arr) {
		genreString += genresHelper[arr[i]] + ', ';
	}
	if (genreString.length > 0) {
		genreString = genreString.slice(0, genreString.length-2);
	}
	
	return genreString;
}


function openIMDBlink(id) {
		var settings = {
		"async": true,
		"crossDomain": true,
		"url": "https://api.themoviedb.org/3/movie/" + id + "?language=en-US&api_key=5bfe27f2b48db1e3ad05dd9b4585bd16",
		"method": "GET",
		"headers": {},
		"data": "{}"
	}

	$.ajax(settings).done(function (response) {
		var imdbId = response.imdb_id;
		window.open('http://www.imdb.com/title/' + imdbId, '_blank');
	});
}


function getMoviePoster(posterLink) {
	console.log(posterLink);
	if(posterLink){
		return '<img class="posterImg" src=https://image.tmdb.org/t/p/w185_and_h278_bestv2' + posterLink + ' alt="movie poster">';
	} else {
		return '<div class="placeholderPoster">Poster unavailable</div>';
	}
}




