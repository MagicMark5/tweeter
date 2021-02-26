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

  // When document is scrolled down, fixes auto scroll up button position
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

