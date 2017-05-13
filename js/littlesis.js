var getExtensionJs = function(path) {
	return $.ajax({
		type: 'GET',
		url: path,
	  	xhrFields: {
      		withCredentials: true
   	  	},
   	  	success: function(data) {
   	  		console.log(data);
   	  	}
	});	
}

var getExtensionJsPath = function() {
	return $.ajax({
		type: 'GET',
		url: BASEURL + '/home/extension_path',
	  	xhrFields: {
      		withCredentials: true
   	  	},
   	  	success: function(data) {
   	  		getExtensionJs(data);
   	  	}
	});
};

var getParams = function() {
    var entity1Id = $('#entity-1').attr('data-selected-entity-id');
    var entity2Id = $('#entity-2').attr('data-selected-entity-id');
    var categoryId = $('#relationship option:checked').attr('value');

	var sourceName = $('#source-name').val();
	var sourceUrl = $('#source-url').val();

	var params = {
		relationship: {
			entity1_id: entity1Id,
			entity2_id: entity2Id,
			category_id: categoryId,
		},

		reference: {
			name: sourceName,
			source: sourceUrl
		}
	}

	return params;
};

var submitData = function() {
	// inputsAreValid();

	if (csrfToken != null) {
		$.ajax({
		  	type: "POST",
		  	url: BASEURL + "/relationships",
		  	data: getParams(),
		  	dataType: "application/json",
			beforeSend: function (xhr) {
			    xhr.setRequestHeader("X-CSRF-Token", csrfToken);
			},
		  	xhrFields: {
	      		withCredentials: true
	   	  	}, 
		  	statusCode: {
		    	201: function() {
				   	$('.status-message').flashMessage({
			        	text: 'Relationship added!',
			        	how: 'append', 
			        	className: 'success',
			        	time: 2000
				    });

					$('.typeahead').typeahead('val', '');
				    $('input').val('');
					$('input').attr('data-selected-entity-id', null);
					$('select').val(0);
					$('.message-icon').removeClass('valid');
		    	}, 
		    	400: function() {
				   	$('.status-message').flashMessage({
			        	text: 'One or more of your inputs are incorrect. Try again.',
			        	how: 'append', 
			        	className: 'warn',
			        	time: 2000
				    });
		    	}
		  	}
		});

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

var useCurrentTab = function() {
	chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
		$('#source-url').val(tabs[0].url);
		$('#source-name').val(tabs[0].title);
	});
};

var submitNewEntity = function() {

};

var closeNewEntityDrawer = function(target) {
	$(target).closest('.add-entity').empty();
};

var showNewEntityDialogue = function(target) {
	console.log('in showNewEntityDialogue');
	var drawer = $(target).closest('.entity').find('.add-entity');
	console.log(drawer);
	drawer.load('add-entity.html', function() {
		$('.add-new-entity-btn').click(function() { submitNewEntity(); });
		$('.close-new-entity-btn').click(function() { closeNewEntityDrawer(this); });
	});
}

var entities = new Bloodhound({
	datumTokenizer: function(datum) {
		return Bloodhound.tokenizers.whitespace(datum.value);
  	},
  	queryTokenizer: Bloodhound.tokenizers.whitespace,
  	remote: {
  		wildcard: '%QUERY',
  		url: BASEURL + '/entities/search_by_name?q=%QUERY'
  	}
});

$(document).ready(function () {
	$('#new-relationship-btn').click(function() { submitData(); });
    $('#swap-entities-btn').click(function() { swapEntities(); });
    $('#use-current-tab-btn').click(function() { useCurrentTab(); });

	$('.typeahead').typeahead({
		highlight: true
	},
	{
		display: 'name',
		limit: 20, 	// Caution: 'limit' seems to have buggy behavior. For some reason 'limit: 20' produces a list of 10 results, but 'limit: 10' doesn't work. 
					// See https://github.com/twitter/typeahead.js/issues/1201
	  	source: entities,
	  	templates: {
	  		notFound: '<div>No results found. Try searching again; maybe you misspelled something? Or <a class="show-new-person-dialogue">add a new person or organization to the database</a>.</div>',
	  		suggestion: Handlebars.templates.suggestion
	  	}
	});

	// $('.message-icon').on('hover', function() {
	// 	displayIconMessage();
	// })
	
	$('.typeahead').on('typeahead:render', function() {
		$('.show-new-person-dialogue').click(function() {
			// openNewTab('/entities/new');
			showNewEntityDialogue(this);
		});
	});
});

