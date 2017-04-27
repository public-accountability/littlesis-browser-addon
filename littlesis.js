var getToken = function() {
	return $.ajax({
		type: 'GET',
		url: 'http://localhost:8080/home/token',
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

getToken().done(parseResponse);


var getParams = function() {
    var entity1Id = document.getElementById("entity-1").value;
    var entity2Id = document.getElementById("entity-2").value;
    var categoryId = document.getElementById("relationship").value;

	var name = "A really great URL";
	var source = "http://www.google.com";
	var sourceDetail = "this really awesome search engine";
	var publicationDate = "2017-01-01";
	var refType = 1;

	var params = {
		relationship: {
			entity1_id: entity1Id,
			entity2_id: entity2Id,
			category_id: categoryId,
		},

		reference: {
			name: name,
			source: source,
			source_detail: sourceDetail,
			publication_date: publicationDate,
			ref_type: refType
		}
	}

	return params;
};

var submitData = function() {
	if (csrfToken != null) {
		$.ajax({
		  	type: "POST",
		  	url: "http://localhost:8080/relationships",
		  	data: getParams(),
		  	dataType: "application/json",
			beforeSend: function (xhr) {
			    xhr.setRequestHeader("X-CSRF-Token", csrfToken);
			},
		  	xhrFields: {
	      		withCredentials: true
	   	  	}
		});
	} else {
		console.log("token not ready, try again");
	}
};

var swapEntities = function() {
    var entity1Box = document.getElementById("entity-1");
    var entity1 = entity1Box.value;
    var entity2Box = document.getElementById("entity-2");
    var entity2 = entity2Box.value;

    entity1Box.value = entity2;
    entity2Box.value = entity1;
};

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("new-relationship-btn").onclick = submitData;
    document.getElementById("swap-entities-btn").onclick = swapEntities;
});