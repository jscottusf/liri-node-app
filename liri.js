require('dotenv').config();
let keys = require('./keys');
let axios = require('axios');
let Spotify = require('node-spotify-api');
let spotify = new Spotify(keys.spotify);
let fs = require('fs');

let liriArr = process.argv;
let liriTask = liriArr[2];
let liriSearch;

function getLiriSearch() {
    liriSearch = '';
    if (liriTask === 'movie-this') {
      if (liriArr.length > 3) {
       for (var i = 3; i < liriArr.length; i++) {
        liriSearch += (liriArr[i] + ' ');
        } 
        }
        else {
            liriSearch = 'Mr. Nobody';
        }  
    }
    else if (liriTask === 'concert-this') {
        for (var i = 3; i < liriArr.length; i++) {
            liriSearch += liriArr[i];
        }
    }
    else if (liriTask === 'spotify-this-song') {
        if (liriArr.length > 3) {
           for (var i = 3; i < liriArr.length; i++) {
            liriSearch += (liriArr[i] + ' ');
            }    
        }
        else {
           liriSearch = 'The Sign'; 
        }
    }
}

function searchMovie() {
    var omdbApi = "http://www.omdbapi.com/?t=" + liriSearch + "&y=&plot=short&apikey=trilogy";
    axios.get(omdbApi).then(
        function(response) {
            console.log('================MOVIE=======================');
            console.log('Title:' + response.data.Title);
            console.log("Release year: " + response.data.Year);
            console.log("IMDB rating: " + response.data.imdbRating);
            console.log("Rotten Tomatoes rating: " + response.data.Ratings[1].Value);
            console.log("Nation: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
            console.log('=============================================');
        })
        .catch(function(error) {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log("---------------Data---------------");
            console.log(error.response.data);
            console.log("---------------Status---------------");
            console.log(error.response.status);
            console.log("---------------Status---------------");
            console.log(error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an object that comes back with details pertaining to the error that occurred.
            console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
          }
          console.log(error.config);
        });
}

function searchBands() {
    var bandsApi = 'https://rest.bandsintown.com/artists/' + liriSearch + '/events?app_id=codingbootcamp';
    axios.get(bandsApi).then(
        function(response) {
            //console.log(response.data[0].venue.name);
            for (var i = 0; i < response.data.length; i++) {
                console.log('================EVENT=======================');
                console.log('Venue name:' + response.data[i].venue.name);
                console.log('Venue city:' + response.data[i].venue.city);
                console.log('event date:' + response.data[i].datetime);
                console.log('++++++++++++++++++++++++++++++++++++++++++++');
            }
        })
        .catch(function(error) {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log("---------------Data---------------");
            console.log(error.response.data);
            console.log("---------------Status---------------");
            console.log(error.response.status);
            console.log("---------------Status---------------");
            console.log(error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an object that comes back with details pertaining to the error that occurred.
            console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
          }
          console.log(error.config);
        });
}

function spotifySong() {
    spotify
        .search({ 
            type: 'track', 
            query: liriSearch,
            limit: 1
        })
        .then(function(response) {
            for (var key in response) {
                //console.log(response[key]);
                console.log('=============SPOTIFY-THIS-SONG===============');
                //console.log(response[key].items[0]);
                console.log('Artist Name: ' + response[key].items[0].artists[0].name);
                console.log('Song Name: ' + response[key].items[0].name);
                console.log('Preview song link: ' + response[key].items[0].external_urls['spotify']);
                console.log('Song Album: ' + response[key].items[0].album.name);
                console.log('=============================================');
            }
            //console.log(response.items[key]);
        })
        .catch(function(err) {
            console.log(err);
        });

        //https://api.spotify.com/v1/search?query=all+the+small+things+&type=track&offset=0&limit=20
        //node liri.js spotify-this-song all the small things
}

function readRandom() {
    fs.readFile('random.txt', 'utf8', function(error, data) {
        // If the code experiences any errors it will log the error to the console.
        if (error) {
          return console.log(error);
        }
        let dataArr = data.split(",");
        liriTask = dataArr[0];
        liriSearch = dataArr[1];
        if (liriTask === 'movie-this') {
            searchMovie();
        }
        else if (liriTask === 'concert-this') {
            searchBands();
        }
        else if (liriTask === 'spotify-this-song') {
            spotifySong();
        }
        else {
            console.log('Not a recognized command');
        }
      });
}

switch (liriTask) {
    case 'movie-this':
        getLiriSearch();
        searchMovie();
        break;
    case 'concert-this':
        getLiriSearch();
        searchBands();
        break;
    case 'spotify-this-song':
        getLiriSearch();
        spotifySong();
        break;
    case 'do-what-it-says':
        readRandom();
        break;
    default:
        console.log('Not a recognized command');
}