// Callback function for input event to textarea
const counterCB = function(e) { 
  const $textarea = $(this); 
  const $counter = $('.counter'); // counter <output>
  const maxChars = 140;
  const tweetLength = $textarea.val().length; 

  // Decrements innerHTML number value of our <output> on every character typed
  $counter.text(maxChars - tweetLength);
  
  // Changes counter <output> to red if character limit is exceeded
  if ($counter.val() < 0) {
    $counter.css( "color", "red" );
  } else if ($counter.val() >= 0) {
    $counter.removeAttr('style');
  }
};

$(document).ready(function() {
  // After DOM is rendered
  const $tweet = $('#tweet-text'); // <textarea> for tweets
  $tweet.on('input', counterCB); // Attach the input handler
});