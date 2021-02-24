// document ready event handler needed so that the browser does not load the page before we dynamically append elements
$(document).ready(function () {

  // Returns an object with number values for date properties on the date object
  const getTimeData = (dateObj) => {  
    const timeData = {
      year: dateObj.getFullYear(), // 2016
      month: dateObj.getMonth() + 1, // 4 (for April)
      day: dateObj.getUTCDate(), // 20 (for 20th)
      hour: dateObj.getHours(), // 21 (24 hour clock)
      minute: dateObj.getMinutes(), // 37
      second: dateObj.getSeconds() // 12
    };
    return timeData; 
  }; 


  // takes in a past timestamp and returns "x units of time ago"
  const convertTimeToRelative = (timestamp) => {

    const timeOrder = ["year", "month", "day", "hour", "minute", "second"];

    // Time of Tweet object (multiplied by 1000 to convert seconds into ms)
    const timeOfTweet = getTimeData(new Date(timestamp)); 
    
    // Time of Now object
    const now = getTimeData(new Date(Date.now()));

    // loop through key names of timeOrder and the first inequality will be returned as relative time difference
    for (let time of timeOrder) {
      if (now[time] !== timeOfTweet[time]) {
        let plural = now[time] - timeOfTweet[time] === 1 ? "" : "s";
        return `${now[time] - timeOfTweet[time]} ${time += plural} ago`;
      }
    }
  };

  // Takes a single tweet Object and returns HTML article template with tweet data injected
  const createTweetElement = function(tweetObj) {
    const $tweet = `
      <article class="tweet">
        <header>
          <figure>
            <img src=${tweetObj.user.avatars}>
            <figcaption>${tweetObj.user.name}</figcaption> 
          </figure>
          <span>${tweetObj.user.handle}</span>
        </header>

        <p class="tweet-body">${tweetObj.content.text}</p>

        <footer>
          <small>${convertTimeToRelative(tweetObj.created_at)}</small> 
          <div class="like-retweet-flag">
            <button><i class="fa fa-heart"></i></button>
            <button><i class="fa fa-retweet"></i></button>
            <button><i class="fa fa-flag"></i></button>
          </div>
        </footer>
      </article>`;
    return $tweet;
  };

  // loops through array of tweet objects, calls createTweetElement for each tweet
  // takes return value and appends it to the tweets container in index.html
  const renderTweets = function(tweets) {
    for (const tweet of tweets) {
      const $tweet = createTweetElement(tweet); 
      $('#tweet-container').append($tweet); 
    }
  };
  
  const ajaxRequest = function(formData) {
    //${formData}
    const url = `/tweets`;
    
    $.ajax(url, {
      method: "POST",
      data: formData,
    })
    .done(function(data) {
      console.log("DONE! POST request made to /tweets");
    })
    .fail(function(error) {
      console.log("Something went wrong :(", error);
    })
    .always(function() {
      console.log("ajax request completed.");
    });
  };

  // On form submit gives serialized query string to ajax request func, from <textarea name="tweet"> as tweet=query 
  $('.new-tweet form').on('submit', function(event) {
    event.preventDefault();
    const formData = $(this).serialize();
    ajaxRequest(formData);
  });

  // responsible for fetching tweets from the http://localhost:8080/tweets page.
  const loadTweets = function() {
    $.ajax({
      url: '/tweets',
      method: "GET"
    })
    .done(function(data) {
      // do something with data you get from response
      renderTweets(data);
      console.log("DONE!");
    })
    .fail(function(error) {
      console.log("Something went wrong :(", error);
    })
    .always(function() {
      console.log("ajax request completed.");
    });
  };

  loadTweets();


  // Test / driver code (temporary)

  // const data = [
  //   {
  //     "user": {
  //       "name": "Newton",
  //       "avatars": "https://i.imgur.com/73hZDYK.png"
  //       ,
  //       "handle": "@SirIsaac"
  //     },
  //     "content": {
  //       "text": "If I have seen further it is by standing on the shoulders of giants"
  //     },
  //     "created_at": 1461116232227
  //   },
  //   {
  //     "user": {
  //       "name": "Descartes",
  //       "avatars": "https://i.imgur.com/nlhLi3I.png",
  //       "handle": "@rd" },
  //     "content": {
  //       "text": "Je pense , donc je suis"
  //     },
  //     "created_at": 1461113959088
  //   }
  // ];

  
  
});