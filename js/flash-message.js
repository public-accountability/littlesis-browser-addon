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
        html: 'Done',
        time: 2000,
        how: 'append',
        className: '',
        callback: function() {}
      }, options);
      
      return $(this).each(function() {
        if( $(this).parent().find('.flash-message').get(0) )
          return;
        
        var that = this;

        var message = $('<span />', {
          'class': 'flash-message ' + options.className,
          html: options.html
        }).hide().fadeIn('fast', function() {
          $('.close-message-btn').on('click', function() {
            message.remove();
            $(that).removeClass('visible');            
          });

          options.callback();
        });
        
        $(this).addClass('visible');
        $(this)[options.how](message);
        
        var delayTime = $('.close-message-btn').length ? 10000000 : options.time;  // I realize this is a little hacky...

        message.delay(delayTime).fadeOut('normal', function() {
          $(this).remove();
          $(that).removeClass('visible');
        });
        
      });
    };
})(jQuery);