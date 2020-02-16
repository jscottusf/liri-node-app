require('dotenv').config();
let keys = require('./keys');
let axios = require('axios');
//let spotify = new Spotify(keys.spotify);

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
    
}

function searchMovie() {
    var omdbApi = "http://www.omdbapi.com/?t=" + liriSearch + "&y=&plot=short&apikey=trilogy";
    axios.get(omdbApi).then(
        function(response) {
            console.log('================MOVIE=======================');
            console.log(response.data.Title);
            console.log("The movie's rating is: " + response.data.imdbRating);
            console.log("The movie was released in " + response.data.Year);
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

switch (liriTask) {
    case 'movie-this':
        getLiriSearch();
        searchMovie();
        break;
    case 'concert-this':
        getLiriSearch();
        searchBands();
        break;
}