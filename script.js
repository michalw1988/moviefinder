/* ******************************************

API:
https://api.themoviedb.org/3/

API documentation:
https://developers.themoviedb.org/3/

API Key:
5bfe27f2b48db1e3ad05dd9b4585bd16

****************************************** */



// global variables
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
var genresHelper = {}; // holds only genre id and name (for quick assigning genres to movies)



$(document).ready(function () {

	// after loading the page, reset search parameters
	initOptionsValues();

	// get genres from API
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
		
			// display genres possible to select
			var genresHTML = $('#genresList').html();
			genresHTML += '<div class="genreItem unselectable" data-id='+ i +'>' + response.genres[i].name + '</div>';
			$('#genresList').html(genresHTML);
			
			// and fill the genres lists
			genres.push({
				id: response.genres[i].id,
				name: response.genres[i].name,
				status: 0
			});
			
			genresHelper[response.genres[i].id] = response.genres[i].name;
		}
	});

	
	// selecting / deselecting genre in setting box
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
	
	
	// selecting sort options
	$('.sortOption').on('click', function(){
		$('.sortOption').css('background-color', '#222');
		$('.sortOption .optionTick').html('');
		$(this).css('background-color', 'orange');
		$(this).children('.optionTick').html('<span class="glyphicon glyphicon-ok"></span>');
		sortType = $(this).data('type');
	});
	
	
	// handling the "find" button click
	$('#findButton').on('click', function() {
		// validating the search options
		validateSearchCriteria();
	});
	
	
	// selecting / deselecting option to find also adult movies
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
	
	
	// pagination - go to first page
	$('#firstPageLink').on('click', function() {
		if(page !== 1) {
			page = 1;
			getMovieList();
		}
	});
	
	
	// pagination - go to previous page
	$('#previousPageLink').on('click', function() {
		if(page > 1) {
			page--;
			getMovieList();
		}
	});
	
	
	// pagination - go to next page
	$('#nextPageLink').on('click', function() {
		if(page < totalPages) {
			page++;
			getMovieList();
		}
	});
	
	
	// pagination - go to last page
	$('#lastPageLink').on('click', function() {
		if(page !== totalPages) {
			page = totalPages;
			getMovieList();
		}
	});
	
	
	// handling click on movie cell - navigating to movie's IMDB page
	$('#foundMovies').on('click', '.movieCell', function() {
		var movieId = $(this).data('id');
		openIMDBlink(movieId);
	});
	
});



// validating search criteria set by user
function validateSearchCriteria(){
	$('.validationStar').css('display', 'none');
	$('#validationText').css('display', 'none');
	
	// validate every input
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
		// if everything is fine, get the movies list from the API
		getMovieList();
	} else {
		// if something is wrong, display the validation text
		$('#validationText').css('display', 'block');
	}
}


// input validation - year from
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


// input validation - year to
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


// input validation - score from
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


// input validation - score to
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


// input validation - votes from
function validateVotesFrom() {
	var votesFrom = parseInt($('#votesFrom').val());
	$('#votesFrom').val(parseInt($('#votesFrom').val()));
	
	// reset field value if it's not correct
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


// input validation - votes to
function validateVotesTo() {
	var votesTo = parseInt($('#votesTo').val());
	$('#votesTo').val(parseInt($('#votesTo').val()));
	
	// reset field value if it's not correct
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


// getting movie list from the API
function getMovieList() {
	withGenres = '';
	withoutGenres = '';
	
	// specifying which genres to include / exclude
	for (var i in genres) {
		if (genres[i].status === 1) {
			withGenres += genres[i].id + ',';
		} else if (genres[i].status === 2) {
			withoutGenres += genres[i].id + ',';
		}
	}
	
	// removing unneeded comas from genres lists
	if (withGenres.length > 0) {
		withGenres = withGenres.slice(0,withGenres.length-1);
	}
	if (withoutGenres.length > 0) {
		withoutGenres = withoutGenres.slice(0,withoutGenres.length-1);
	}
	
	// building ajax query string
	var searchString = 'https://api.themoviedb.org/3/discover/movie?api_key='+apiKey+'&language=en-US&sort_by='+sortType+'&include_adult='+adultMovies+'&include_video=false&page='+page+'&release_date.gte='+yearFromValue+'&release_date.lte='+yearToValue+'&vote_count.gte='+votesFromValue+'&vote_count.lte='+votesToValue+'&vote_average.gte='+scoreFromValue+'&vote_average.lte='+scoreToValue+'&with_genres='+withGenres+'&without_genres='+withoutGenres;

	var settings = {
		"async": true,
		"crossDomain": true,
		"url": searchString,
		"method": "GET",
		"headers": {},
		"data": "{}"
	}
	
	// handling the API response
	$.ajax(settings).done(function (response) {
	
		if(response.total_results === 0) {
			// if no movies found
			$('#nothingFoundMessage').css('display', 'block');
			$('#foundMovies').html('');
			page = 1;
			totalPages = 1;
			$('#paginationDiv').css('display', 'block');
			$('#currentPageText').html('page <strong>' + page + '</strong> out of <strong>' + totalPages + '</strong> total pages');
		} else {
			// if some movies found
			$('#nothingFoundMessage').css('display', 'none');
			var resultsHtml = '';
			
			// biulding movie cells
			for (var i in response.results) {	

				// trimming movie description if needed
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
			
			// somehow API only allows for 1000 movie pages, so if there's more of the, just don't show them
			if (response.total_pages > 1000) {
				totalPages = 1000;
			} else {
				totalPages = response.total_pages;
			}
			
			// showing and updating pagination
			$('#paginationDiv').css('display', 'block');
			$('#currentPageText').html('page <strong>' + page + '</strong> out of <strong>' + totalPages + '</strong> total pages');		
		}
		
	});
}


// initiating search options after opening the page
function initOptionsValues() {
	$('#yearFrom').val(yearFromValue);
	$('#yearTo').val(new Date().getFullYear());
	$('#scoreFrom').val(scoreFromValue);
	$('#scoreTo').val(scoreToValue);
	$('#votesFrom').val(votesFromValue);
	$('#votesTo').val(votesToValue);
}


// assigning genres for a movie from genresHelper list based on IDs returned from API
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


// getting movie poster and, if there's no poster for a movie, displaying a placeholder
function getMoviePoster(posterLink) {
	console.log(posterLink);
	if(posterLink){
		return '<img class="posterImg" src=https://image.tmdb.org/t/p/w185_and_h278_bestv2' + posterLink + ' alt="movie poster">';
	} else {
		return '<div class="placeholderPoster">Poster unavailable</div>';
	}
}


// opening an IMDB page for a movie after clicking on it
function openIMDBlink(id) {
	// first, an IMDB ID is needed to it has to be returned from TMDb API
	var settings = {
		"async": true,
		"crossDomain": true,
		"url": "https://api.themoviedb.org/3/movie/" + id + "?language=en-US&api_key=5bfe27f2b48db1e3ad05dd9b4585bd16",
		"method": "GET",
		"headers": {},
		"data": "{}"
	}

	// then, a new page is opened
	$.ajax(settings).done(function (response) {
		var imdbId = response.imdb_id;
		window.open('http://www.imdb.com/title/' + imdbId, '_blank');
	});
}