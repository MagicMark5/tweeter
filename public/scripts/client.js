// document ready event handler needed so that the browser does not load the page before we dynamically append elements
$(document).ready(function () {
    
    // keeping track of new-tweet <section> display
    let composeShowing = false;

    // click handler for compose tweet button (to make new-tweet section slide in)
    $('.compose button').on("click", function(event) {

      composeShowing = !composeShowing ? true : false;

      const $composeArea = $('section.new-tweet');
      
      $composeArea.slideToggle({
        duration: 400,
        start: function() {
          $(this).css('display', 'flex');
        }
      });
      $('#tweet-text').focus();
    });
  
  // escape strips potential html from tweets
  const escape =  function(str) {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }
  
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
    return `Just a moment ago.`;
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
      console.log("DONE! POST request made to /tweets");
      loadTweets(); // Refetch tweets on success
    })
    .fail(function(error) {
      console.log("Something went wrong :(", error);
    })
    .always(function() {
      console.log("ajax request completed.");
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
  
  // When document is scrolled down from top, fixes auto scroll up button position
  const $scrollUp = $('button.scroll-up');

  $(document).on('scroll', function(e) {
    let scrollFromTop = $(window).scrollTop();

    if (scrollFromTop > 200) {
      $scrollUp.css('visibility', 'visible');
    } else {
      $scrollUp.css('visibility', 'hidden');
    }

    $scrollUp.css('position', 'fixed');
  });


  // Scroll up to top of page and show compose tweet if hidden
  $scrollUp.on('click', function(e) {
    e.preventDefault();
    $(document).scrollTop(70);
    
    if (!composeShowing) {
      $('.compose button').click();
    }
    
    $scrollUp.css('visibility', 'hidden');
    $(this).blur();
    $('#tweet-text').focus();
  });
  
});