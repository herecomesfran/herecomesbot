var Twit = require('twit');
var fs = require('fs');
var rita = require('rita');
var inputText = '';
var filePath = 'tweets.txt';
var T = new Twit({ // create a new Twit object with all Twitter access info
	consumer_key: process.env.T_CONSUMER_KEY, 
    consumer_secret: process.env.T_CONSUMER_SECRET,
    access_token: process.env.T_ACCESS_TOKEN,
    access_token_secret: process.env.T_ACCESS_TOKEN_SECRET,
	timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
})

function tweetIt() {
	//var r = Math.floor(Math.random()*100);
	function cleanText(text) {
		return rita.RiTa.tokenize(text).join(' ').trim();
	}

	function tweeted(err, data, response) {
		if (err) {
			console.log(err);
		} else {
			console.log("All good!");
		}
	}
	var textData = fs.readFile(filePath, 'utf-8', function(err, data) {
		if (err) {
			console.log(err);
		} else {
			var cleanedText = cleanText(data);
			//console.log(cleanedText);
			var markov = new rita.RiMarkov(2);
			markov.loadText(cleanedText);
			var sentence = markov.generateSentences(1);
			console.log(sentence);
			var tweet = {
				status: sentence
			}
			T.post('statuses/update', tweet, tweeted);
		}
	});
}

tweetIt();
setInterval(tweetIt, 1000 * 60 * 60); // every hour