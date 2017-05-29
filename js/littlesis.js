// var getExtensionJs = function(path) {
// 	return $.ajax({
// 		type: 'GET',
// 		url: path,
// 	  	xhrFields: {
//       		withCredentials: true
//    	  	},
//    	  	success: function(data) {
//    	  		console.log(data);
//    	  	}
// 	});	
// }

// var getExtensionJsPath = function() {
// 	return $.ajax({
// 		type: 'GET',
// 		url: BASEURL + '/home/extension_path',
// 	  	xhrFields: {
//       		withCredentials: true
//    	  	},
//    	  	success: function(data) {
//    	  		getExtensionJs(data);
//    	  	}
// 	});
// };

var initializeForm = function() {
	setCurrentTab();
	retrieveProgress();
};

var getRelationshipParams = function() {
	var sourceName = $('#source-name').val();
	var sourceUrl = $('#source-url').val();

	var params = {
		relationship: getShortRelationshipParams(),

		reference: {
			name: sourceName,
			source: sourceUrl
		}
	};

	return params;
};

var getShortRelationshipParams = function() {
    var entity1Id = $('#entity-1').data('selected-entity-id');
    var entity2Id = $('#entity-2').data('selected-entity-id');
    var categoryId = $('#relationship option:checked').attr('value');

	var params = {
		entity1_id: entity1Id,
		entity2_id: entity2Id,
		category_id: categoryId
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
	$('input').removeData('selected-entity-id');
	$('select').val('');
	$('.valid').removeClass('valid');
	$('.invalid').removeClass('invalid');
	setCurrentTab();
};

var clearEntityForm = function() {

};

var fillEntityInput = function(target, data) {
	var res = JSON.parse(data.responseText);
	var entityName = res.entity.name;
	var entityId = res.entity.id;
	
	var entityInput = $(target).closest('.entity').find('.typeahead');
	$(entityInput).val(entityName);
	$(entityInput).data('selected-entity-id', entityId);

	setValidInput(entityInput);

	closeNewEntityDrawer(target);
	$(entityInput).typeahead('destroy');
	buildTypeahead(entityInput);
};

var buildTypeahead = function(target) {
	$(target).typeahead({
		highlight: true
	},
	{
		display: 'name',
		limit: 20, 	// Caution: 'limit' seems to have buggy behavior. For some reason 'limit: 20' produces a list of 10 results, but 'limit: 10' doesn't work. 
					// See https://github.com/twitter/typeahead.js/issues/1201
	  	source: entities,
	  	templates: {
	  		notFound: '<div class="entity-not-found">No results found. Try searching again; maybe you misspelled something? Or <a class="show-new-person-dialogue">add a new person or organization to the database</a>.</div>',
	  		suggestion: Handlebars.templates.suggestion
	  	}
	});
};

var submitData = function(target, route, data, successMessage, successCallback) {
	var msgTarget = $(target).closest('.button').find('.status-message');

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
	  				$(msgTarget).flashMessage({text: res.errors.name, className: 'warn' });
	  			} else {
	  				$(msgTarget).flashMessage({text: successMessage, className: 'success' });
					successCallback(target, data);
	  			}
	  		},
	    	201: function(data) {
	    		$(msgTarget).flashMessage({text: successMessage, className: 'success' });
				successCallback(target, data);
	    	}, 
	    	400: function() {
	    		$(msgTarget).flashMessage({text: 'One or more of your inputs is incorrect. Try again.', className: 'warn' });
	    	},
	    	500: function() {
	    		$(msgTarget).flashMessage({text: 'Sorry, something went wrong.', className: 'warn'});
	    	}
	  	}
	});
};

var swapEntities = function() {
	var entity1 = $('#entity-1').typeahead('val');
	var entity1Id = $('#entity-1').data('selected-entity-id') || null;

	var entity2 = $('#entity-2').typeahead('val');
	var entity2Id = $('#entity-2').data('selected-entity-id') || null;

	[entity1, entity2] = [entity2, entity1];
	[entity1Id, entity2Id] = [entity2Id, entity1Id];

	$('#entity-1').typeahead('val', entity1);
	$('#entity-1').data('selected-entity-id', entity1Id);

	$('#entity-2').typeahead('val', entity2);
	$('#entity-2').data('selected-entity-id', entity2Id);

	if (entity1Id) {
		setValidInput($('#entity-1'));
	} else {
		setInvalidInput($('#entity-1'));
	}

	if (entity2Id) {
		setValidInput($('#entity-2'));
	} else {
		setInvalidInput($('#entity-2'));
	}
};

var closeNewEntityDrawer = function(target) {
	$(target).closest('.add-entity').empty();
};

var showNewEntityDialogue = function(target) {
	var openDrawer = $('#new-entity-drawer');
	if (openDrawer) {
		closeNewEntityDrawer(openDrawer);
	}

	var drawer = $(target).closest('.entity').find('.add-entity');
	drawer.load('add-entity.html', function() {
		$('.add-new-entity-btn').click(function() { submitData(this, '/entities', getEntityParams(), 'Entity added!', fillEntityInput); });
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

var checkSimilarRelationships = function(params) {
	return $.ajax({
		type: 'GET',
		url: BASEURL + '/relationships/find_similar',
	  	xhrFields: {
      		withCredentials: true
   	  	},
   	  	data: getShortRelationshipParams(),
   	  	statusCode: {
   	  		200: function(data) {
   	  			if (data.length > 0) {
					var msgTarget = $('#new-relationship-btn').closest('.button').find('.status-message');
		  			$(msgTarget).flashMessage({text: "A similar relationship already exists. Continue?", time: 10000, className: 'warn' });
   	  			}
   	  		}
   	  	}
	});
};

var saveProgress = function() {
	var relationshipParams = getRelationshipParams();
	var entity1Name = $('#entity-1').typeahead('val');
	var entity2Name = $('#entity-2').typeahead('val');
	var newEntityParams = getEntityParams();
	console.log(newEntityParams);

	var relationshipData = {
		relationshipParams: relationshipParams,
		entity1Name: entity1Name,
		entity2Name: entity2Name,
		newEntityParams: newEntityParams
	};

	chrome.storage.sync.set({'relationshipData': relationshipData});
};

var populateForm = function(data) {
	$('#entity-1').typeahead('val', data.entity1Name);
	var entity1Id = data.relationshipParams.relationship.entity1_id;
	if (entity1Id) { $('#entity-1').data('selected-entity-id', entity1Id).trigger('valid'); }

	var categoryId = data.relationshipParams.relationship.category_id;
	if (categoryId) { $('#relationship').val(categoryId).trigger('valid'); }

	$('#entity-2').typeahead('val', data.entity2Name);
	var entity2Id = data.relationshipParams.relationship.entity2_id;
	if (entity2Id) { $('#entity-2').data('selected-entity-id', entity2Id).trigger('valid'); }

	var sourceUrl = data.relationshipParams.reference.source;
	var sourceName = data.relationshipParams.reference.name;
	if (sourceUrl) { $('#source-url').val(sourceUrl).trigger('input'); }
	if (sourceName) { $('#source-name').val(sourceName).trigger('input'); }
};

var retrieveProgress = function() {
	chrome.storage.sync.get('relationshipData', function(data) {
		populateForm(data.relationshipData);
	});
};

$(function () {
	$('#new-relationship-btn').click(function() { submitData(this, '/relationships', getRelationshipParams(), 'Relationship added!', clearForm); });
	$('#set-current-tab-btn').click(function() { setCurrentTab(); });
    $('#swap-entities-btn').click(function() { swapEntities(); });
    $('#clear-btn').click(function() { clearForm(); });

    buildTypeahead('.typeahead');

	$('.typeahead').on('typeahead:render', function() {
		$('.show-new-person-dialogue').click(function() {
			showNewEntityDialogue(this);
		});
	});

	$('#new-relationship-btn').on('new-relationship-btn:enabled', function() {
		checkSimilarRelationships();
	});

	// for <select> styling hack:

	$('select').on('focus', function() {
		$('.select-style').css('border', '1px solid #999');
	});

	$('select').on('blur', function() {
		$('.select-style').css('border', '1px solid #ddd');
	});

	$(window).on('form:input', function() {
		saveProgress();
	});

	$('.container').ready(function() {
		initializeForm();
	});
});

