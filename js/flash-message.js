// Modified from http://jsfiddle.net/BaylorRae/vwvAd/

// Sample use:
// $('.add-item').click(function() {

//     $('#status-area').flashMessage({
//         text: 'Added to cart!',
//         how: 'append'
//     });
// });

(function($) {
    $.fn.flashMessage = function(options) {
      
      options = $.extend({
        text: 'Done',
        time: 1000,
        how: 'before',
        className: ''
      }, options);
      
      return $(this).each(function() {
        if( $(this).parent().find('.flash-message').get(0) )
          return;
        
        var message = $('<span />', {
          'class': 'flash-message ' + options.className,
          text: options.text
        }).hide().fadeIn('fast');
        
        $(this)[options.how](message);
        
        message.delay(options.time).fadeOut('normal', function() {
          $(this).remove();
        });
        
      });
    };
})(jQuery);