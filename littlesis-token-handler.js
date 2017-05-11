var getToken = function(baseUrl) {
	return $.ajax({
		type: 'GET',
		url: baseUrl + '/home/token',
	  	xhrFields: {
      		withCredentials: true
   	  	}
	});
};

var parseResponse = function(data) {
	var tags = $.parseHTML(data).filter(function(tag) {
    	return ($(tag).attr('name') == 'csrf-token');
    });
    
    csrfToken = $(tags[0]).attr('content');
}