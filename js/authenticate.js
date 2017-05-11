$.holdReady(true);

var getToken = function(baseUrl) {
	console.log('hello world');
	return $.ajax({
		type: 'GET',
		url: baseUrl + '/home/token',
	  	xhrFields: {
      		withCredentials: true
   	  	},
   	  	statusCode: {
   	  		200: displayMain,
   	  		401: displayLoginMessage
   	  	}
	});
};

var displayMain = function(data) {
	parseResponse(data);
	$('.container').load('littlesis.html', function() {
		$.holdReady(false);
	});
};

var parseResponse = function(data) {
	var tags = $.parseHTML(data).filter(function(tag) {
    	return ($(tag).attr('name') == 'csrf-token');
    });
    
    csrfToken = $(tags[0]).attr('content');
};

var displayLoginMessage = function() {
	$('.container').load('login.html');
};

var BASEURL = 'http://localhost:8080';
getToken(BASEURL);
