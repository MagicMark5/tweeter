$(document).ready(function () {
  
  // strips potential html tags from tweets
  const escape =  function(str) {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

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

        <p class="tweet-body">${escape(tweetObj.content.text)}</p>

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
    // first clear the container
    $('#tweet-container').empty();
    // then render all tweets together
    for (const tweet of tweets) {
      const $tweet = createTweetElement(tweet); 
      $('#tweet-container').prepend($tweet); 
    }
  };
  
  // makes POST ajax request to /tweets with serialized formData
  const postTweet = function(formData) {
    const url = `/tweets`;
    
    $.ajax(url, {
      method: "POST",
      data: formData,
    })
    .done(function() {
      loadTweets(); // Refetch tweets on success
    })
    .fail(function(error) {
      console.log("Something went wrong :(", error);
    })
    .always(function() {
      console.log("Ajax POST tweet to server completed.");
    });
  };

  // Validate tweet post submission and show error/validation message
  const isDataValid = (formText) => {
    const $error = $('span.error-msg');
    let errorMsg;
    $error.empty(); // clear current contents of <span>
    
    if ($error.css("display") !== "none") {
      $error.slideToggle(100);
    } 

    if (formText === "" || formText === null) { 
      errorMsg = "Not even a chirp? Your tweet must contain some text."
    } else if (formText.length > 140) {
      errorMsg = "Your tweet is an epic ballad. Keep it below 140 characters.";
    } else {
      return formText; // successful tweet
    }

    // show validation error message
    $error.append(errorMsg);
    $error.slideToggle(300);

    return false;

  };

  // On form submit gives serialized query string to ajax request func, from <textarea name="tweet"> as tweet=query 
  $('.new-tweet form').on('submit', function(event) {
    
    event.preventDefault();

    // select textarea value  
    const tweet = $('#tweet-text').val();
    // check char limit and if empty
    const validData = isDataValid(tweet);

    // only submit to postTweet if valid
    if (validData) {
      const formData = $(this).serialize();
      postTweet(formData);
      $('#tweet-text').val(""); // clear textarea
      $('.counter').text(140); // reset counter
    }
  });

  // responsible for fetching tweets from the http://localhost:8080/tweets page.
  const loadTweets = function() {
    $.ajax({
      url: '/tweets',
      method: "GET"
    })
    .done(function(data) {
      renderTweets(data);
    })
    .fail(function(error) {
      console.log("Error: ", error);
    })
    .always(function() {
      console.log("AJAX GET tweets from server completed.");
    });
  };

  loadTweets();
  
});