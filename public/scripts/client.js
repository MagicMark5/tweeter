/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const convertTimeStamp = (timestamp) => {
  // takes in a past timestamp and returns "x units of time ago"
  const date = new Date(timestamp * 1000);
  const hours = date.getHours();
  const minutes = "0" + date.getMinutes();
  const seconds = "0" + date.getSeconds();

  return hours;
  // return daysMonthsYearsAgo;
};

const createTweetElement = function(tweetObj) {
  const $tweet = `<article class="tweet">
  <header>
    <figure>
      <img src=${tweetObj.user.avatars}>
      <figcaption>${tweetObj.user.name}</figcaption> 
    </figure>
    <span>${tweetObj.user.handle}</span>
  </header>

  <p class="tweet-body">${tweetObj.content.text}</p>

  <footer>
    <small>${convertTimeStamp(tweetObj.created_at)}</small> 
    <div class="like-retweet-flag">
      <button><i class="fa fa-heart"></i></button>
      <button><i class="fa fa-retweet"></i></button>
      <button><i class="fa fa-flag"></i></button>
    </div>
  </footer>
</article>`;
  return $tweet;
};

const tweetData = {
  "user": {
    "name": "Newton",
    "avatars": "https://i.imgur.com/73hZDYK.png",
      "handle": "@SirIsaac"
    },
  "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
  "created_at": 1461116232227
}

const $tweet = createTweetElement(tweetData);


// Test / driver code (temporary)
console.log($tweet); // to see what it looks like


// document ready event handler needed so that the browser does not load the page before we dynamically append elements
$(document).ready(function () {
  $('#tweet-container').append($tweet); // to add it to the page so we can make sure it's got all the right elements, classes, etc.
});