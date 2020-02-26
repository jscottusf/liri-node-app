//require variables
require('dotenv').config();
let keys = require('./keys');
let axios = require('axios');
let moment = require('moment');
let inquirer = require('inquirer');
let Spotify = require('node-spotify-api');
let spotify = new Spotify(keys.spotify);
let fs = require('fs');
//convert arguments to variables
let liriArr = process.argv;
let liriTask = liriArr[2];
let liriSearch;
let divider = '\n-----------------------------------------------------\n';


//format serach term based on command given
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

//search omdb api and console log data
function searchMovie() {
    var omdbApi = "http://www.omdbapi.com/?t=" + liriSearch + "&y=&plot=short&apikey=trilogy";
    axios.get(omdbApi).then(
        function(response) {
            var movieData = [
                '================MOVIE=======================',
                'Title: ' + response.data.Title,
                'Release year: ' + response.data.Year,
                'IMDB rating: ' + response.data.imdbRating,
                'Rotten Tomatoes rating: ' + response.data.Ratings[1].Value,
                'Nation: ' + response.data.Country,
                'Language: ' + response.data.Language,
                'Plot: ' + response.data.Plot,
                'Actors: ' + response.data.Actors,
                '============================================='
            ].join('\n');
            console.log(movieData);
            fs.appendFile('log.txt', movieData + divider, function(err) {
                if (err) {
                    console.log(err);
                }
            });
            // console.log('================MOVIE=======================');
            // console.log('Title: ' + response.data.Title);
            // console.log("Release year: " + response.data.Year);
            // console.log("IMDB rating: " + response.data.imdbRating);
            // console.log("Rotten Tomatoes rating: " + response.data.Ratings[1].Value);
            // console.log("Nation: " + response.data.Country);
            // console.log("Language: " + response.data.Language);
            // console.log("Plot: " + response.data.Plot);
            // console.log("Actors: " + response.data.Actors);
            // console.log('=============================================');
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

//search bands in town api and console log data
function searchBands() {
    var bandsApi = 'https://rest.bandsintown.com/artists/' + liriSearch + '/events?app_id=codingbootcamp';
    axios.get(bandsApi).then(
        function(response) {
            //console.log(response.data[0].venue.name);
            for (var i = 0; i < response.data.length; i++) {
                var eventDate = response.data[i].datetime;
                var convertedDate = moment(eventDate, 'YYYY/MM/DD hh:mm:ss');
                console.log('================EVENT=======================');
                console.log('Venue name: ' + response.data[i].venue.name);
                console.log('Venue city: ' + response.data[i].venue.city);
                console.log('Event Date: ' + convertedDate.format("MMM Do, YYYY hh:mm"));
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

//search spotify api for data behind song name and log data
function spotifySong() {
    spotify
        .search({ 
            type: 'track', 
            query: liriSearch,
            limit: 5
        })
        .then(function(response) {
            //console.log(response.tracks.items);
            const songs = response.tracks.items;
            for (var i = 0; i < songs.length; i++) {
                console.log('=============SPOTIFY-THIS-SONG===============');
                //console.log(response[key].items[0]);
                console.log('Artist Name: ' + songs[i].artists[0].name);
                console.log('Song Name: ' + songs[i].name);
                console.log('Preview song link: ' + songs[i].external_urls['spotify']);
                console.log('Song Album: ' + songs[i].album.name);
                console.log('---------------------------------------------');
            }  
        })
        .catch(function(err) {
            console.log(err);
        });
}

//read random.txt and do what it says
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

//inquirer procedures
function promptUser() {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'Select task...',
                choices: ['movie-this', 'concert-this', 'spotify-this-song'],
                name: 'liriPrompt'
            },
            {
                type: 'input',
                message: 'Enter search term',
                name: 'promptSearch'
            }
        ])
        .then(function(inquirerResponse) {
            liriTask = inquirerResponse.liriPrompt;
            if (liriTask === 'concert-this') {
                liriSearch = inquirerResponse.promptSearch.replace(/\s+/g, '');
                searchBands();
            }
            else if (liriTask === 'movie-this') {
                liriSearch = inquirerResponse.promptSearch;
                if (liriSearch) {
                    searchMovie();
                }
                else {
                    liriSearch = 'Mr. Nobody';
                    searchMovie();
                }
                
            }
            else if (liriTask === 'spotify-this-song') {
                liriSearch = inquirerResponse.promptSearch;
                if (liriSearch) {
                    spotifySong();
                }
                else {
                    liriSearch = 'The Sign';
                    spotifySong();
                }
            }
            setTimeout(promptAgain, 2000);
        });
}

//prompt user for another search
function promptAgain() {
    inquirer
        .prompt([
            {
                type: "confirm",
                message: "Would you like to search for anyting else?:",
                name: "confirm",
                default: true
            }
            ])
        .then(function(inquirerResponse) {
            // If the inquirerResponse confirms, we displays the inquirerResponse's username and pokemon from the answers.
            if (inquirerResponse.confirm) {
            console.clear();
            promptUser();
            }
            else {
            console.log('Auf Wiedersehen');
            }
        });
}

//main switchapplication procedures
switch (liriTask) {
    case 'movie-this':
        console.clear();
        getLiriSearch();
        searchMovie();
        break;
    case 'concert-this':
        console.clear();
        getLiriSearch();
        searchBands();
        break;
    case 'spotify-this-song':
        console.clear();
        getLiriSearch();
        spotifySong();
        break;
    case 'do-what-it-says':
        console.clear();
        readRandom();
        break;
    default:
        console.clear();
        promptUser();
}