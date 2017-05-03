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
    var entity1Id = $('#entity-1').attr('data-selected-entity-id');
    var entity2Id = $('#entity-2').attr('data-selected-entity-id');
    var categoryId = $('#relationship option:checked').attr('value');

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

		$('input').val('');
		$('input').attr('data-selected-entity-id', null);
		$('select').val(1);
	} else {
		console.log("token not ready, try again");
	}
};

var swapEntities = function() {
	var entity1 = $('#entity-1').typeahead('val');
	var entity1Id = $('#entity-1').attr('data-selected-entity-id');

	var entity2 = $('#entity-2').typeahead('val');
	var entity2Id = $('#entity-2').attr('data-selected-entity-id');

	[entity1, entity2] = [entity2, entity1];
	[entity1Id, entity2Id] = [entity2Id, entity1Id];

	$('#entity-1').typeahead('val', entity1);
	$('#entity-1').attr('data-selected-entity-id', entity1Id);

	$('#entity-2').typeahead('val', entity2);
	$('#entity-2').attr('data-selected-entity-id', entity2Id);
};

var entities = new Bloodhound({
	datumTokenizer: function(datum) {
		return Bloodhound.tokenizers.whitespace(datum.value);
  	},
  	queryTokenizer: Bloodhound.tokenizers.whitespace,
  	remote: {
  		wildcard: '%QUERY',
  		url: 'http://localhost:8080/entities/search_by_name?q=%QUERY'
  	}

})

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("new-relationship-btn").onclick = submitData;
    document.getElementById("swap-entities-btn").onclick = swapEntities;

	$('.typeahead').typeahead({
		highlight: true
	},
	{
		display: 'name',
		limit: 20, 	// Caution: 'limit' seems to have buggy behavior. For some reason 'limit: 20' produces a list of 10 results. 
					// See https://github.com/twitter/typeahead.js/issues/1201
	  	source: entities,
	  	templates: {
	  		suggestion: Handlebars.templates.suggestion
	  	}
	});

	$('.typeahead').on('typeahead:select', function(e, obj) {
		$(e.target).closest('input').attr('data-selected-entity-id', obj.id);
	})
});
