$.holdReady(true);

var getToken = function() {
	return $.ajax({
		type: 'GET',
		url: BASEURL + '/home/token',
	  	xhrFields: {
      		withCredentials: true
   	  	},
   	  	statusCode: {
   	  		200: displayMain,
   	  		401: openLoginTab
   	  	}
	});
};

var displayMain = function(data) {
	parseResponse(data);

	$('.container').removeClass('loading');
	$('.container').load('littlesis.html', function() {
		$.holdReady(false);
		setCurrentTab();
	});
};

var parseResponse = function(data) {
	var tags = $.parseHTML(data).filter(function(tag) {
    	return ($(tag).attr('name') == 'csrf-token');
    });
    
    csrfToken = $(tags[0]).attr('content');
};

var openLoginTab = function() {
	window.close();
	openNewTab('/login');
};


getToken();
