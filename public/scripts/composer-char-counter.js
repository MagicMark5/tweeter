$(document).ready(function() {
  
  // selector for <textarea> element
  const tweet = $('#tweet-text');

  // Callback function for input event to textarea
  const counterCB = function(e) {
    const $textarea = $(this); // use jquery selector on 'this' so we can use jquery methods on the textarea
    const maxChars = 140;
    const tweetLength = $textarea.val().length; // can also use e.target.value.length
    const $counter = $(this).siblings('.tweet-button-area').children('.counter'); // Get the counter element

    // Decrement the innerHTML value of our <output> element
    $counter.text(maxChars - tweetLength);

    // Changes counter <output> to red if character limit is exceeded
    if ($counter.val() < 0) {
      $counter.css( "color", "red" );
    } else if ($counter.val() >= 0) {
      $counter.removeAttr('style');
    }
  };
  
  // Attach the input handler
  tweet.on('input', counterCB);

});