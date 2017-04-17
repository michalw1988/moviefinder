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

var globalResponse;


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
		
		//console.log(genres);
	});

	
	$('#genresList').on('click', '.genreItem', function(){
		var itemId = $(this).data('id');
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
	
	
	$('.sortOption').on('click', function(){
		$('.sortOption').css('background-color', '#222');
		$('.sortOption .optionTick').html('');
		$(this).css('background-color', 'green');
		$(this).children('.optionTick').html('<span class="glyphicon glyphicon-ok"></span>');
		sortType = $(this).data('type');
		//console.log(sortType);
		
	});
	
	
	$('#findButton').on('click', function() {
		validateSearchCriteria();
	});
	
	
	$('#adultSettings').on('click', function(){
		if(adultMovies) {
			adultMovies = false;
			adultMovies = false;
			$('#adultSettings').html('No');
			$('#adultSettings').css('background-color', 'red');
		} else {
			adultMovies = true;
			$('#adultSettings').html('Yes');
			$('#adultSettings').css('background-color', 'green');
		}
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
	console.log('sort options: ' + sortType);
	console.log('year from: ' + yearFromValue);
	console.log('year to: ' + yearToValue);
	console.log('score from: ' + scoreFromValue);
	console.log('score to: ' + scoreToValue);
	console.log('votes from: ' + votesFromValue);
	console.log('votes to: ' + votesToValue);
	
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
	
	console.log('included genres: ' + withGenres);
	console.log('excluded genres: ' + withoutGenres);
	
	var searchString = 'https://api.themoviedb.org/3/discover/movie?api_key='+apiKey+'&language=en-US&sort_by='+sortType+'&include_adult='+adultMovies+'&include_video=false&page='+page+'&release_date.gte='+yearFromValue+'&release_date.lte='+yearToValue+'&vote_count.gte='+votesFromValue+'&vote_count.lte='+votesToValue+'&vote_average.gte='+scoreFromValue+'&vote_average.lte='+scoreToValue+'&with_genres='+withGenres+'&without_genres='+withoutGenres;
	
	// TODO: bouild URL string
	
	/*
	https://api.themoviedb.org/3/discover/movie?api_key=5bfe27f2b48db1e3ad05dd9b4585bd16&language=en-US&sort_by=popularity.desc&include_adult=true&include_video=false&page=1&release_date.gte=1900&release_date.lte=2017&vote_count.gte=0&vote_count.lte=1000000&vote_average.gte=1&vote_average.lte=10&with_genres=28,12&without_genres=36,14
	
	*/
	

	var settings = {
		"async": true,
		"crossDomain": true,
		"url": searchString,
		"method": "GET",
		"headers": {},
		"data": "{}"
	}

	$.ajax(settings).done(function (response) {
		globalResponse = response;
	
		var resultsHtml = '';
		for (var i in response.results) {
			resultsHtml += '<div>' + response.results[i].title + ' (' + response.results[i].release_date.slice(0,4) + ')' + '</div>';
		}
	
		//$('#foundMovies').html(JSON.stringify(response));
		$('#foundMovies').html(resultsHtml);
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