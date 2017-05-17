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

var getRelationshipParams = function() {
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
	};

	return params;
};

var getEntityParams = function() {
    var entityName = $('#entity-name').val();
    var entityBlurb = $('#entity-blurb').val();
    var primaryExt = $('input[name=entityType]:checked').val();
    var addRelationshipPage = $('#add-relationship-page').val();

	var params = {
		entity: {
			name: entityName,
			blurb: entityBlurb,
			primary_ext: primaryExt,
		},

		add_relationship_page: addRelationshipPage
	};

	return params;
};

var clearForm = function() {
	$('.typeahead').typeahead('val', '');
    $('input').val('');
	$('input').attr('data-selected-entity-id', null);
	$('select').val(0);
	$('.message-icon').removeClass('valid');
};

var clearEntityForm = function() {

};

var flashStatus = function(message, className) {
   	$('.status-message').flashMessage({
    	text: message,
    	how: 'append', 
    	className: className,
    	time: 2000
    });	
};

var submitData = function(route, data, successMessage, successCallback) {
	$.ajax({
	  	type: "POST",
	  	url: BASEURL + route,
	  	data: data,
	  	dataType: "application/json",
		beforeSend: function (xhr) {
		    xhr.setRequestHeader("X-CSRF-Token", csrfToken);
		},
	  	xhrFields: {
      		withCredentials: true
   	  	}, 
	  	statusCode: {
	  		200: function(data) {
	  			var res = JSON.parse(data.responseText);
	  			if(res.status == 'ERROR') {
	  				flashStatus(res.errors.name, 'warn');
	  			} else {
	  				flashStatus(successMessage, 'success');
					successCallback();
	  			}

	  		},
	    	201: function() {
	    		flashStatus(successMessage, 'success');
				successCallback();
	    	}, 
	    	400: function() {
			   	flashStatus('One or more of your inputs are incorrect. Try again.', 'warn');
	    	}
	  	}
	});
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

var closeNewEntityDrawer = function(target) {
	$(target).closest('.add-entity').empty();
};

var showNewEntityDialogue = function(target) {
	console.log('in showNewEntityDialogue');
	var drawer = $(target).closest('.entity').find('.add-entity');
	console.log(drawer);
	drawer.load('add-entity.html', function() {
		$('.add-new-entity-btn').click(function() { submitData('/entities', getEntityParams(), 'Entity added!', clearEntityForm); });
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
	$('#new-relationship-btn').click(function() { submitData('/relationships', getRelationshipParams(), 'Relationship added!', clearForm); });
    $('#swap-entities-btn').click(function() { swapEntities(); });

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

