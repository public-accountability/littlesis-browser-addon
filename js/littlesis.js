// FORM CONTROL

var initializeForm = function() {
	retrieveProgress();	
	setDropdownText();
};

var clearForm = function() {
	$('.typeahead').typeahead('val', '');
    $('input').val('');
	$('input').removeData('entityId entityExt');
	$('select').val('');
	$('.valid').removeClass('valid');
	$('.invalid').removeClass('invalid');
	$('#current').prop('checked', true);
	chrome.storage.sync.remove('relationshipData');
	setCurrentTab();
};

var clearEntityForm = function() {

};

var swapEntities = function() {
	var entity1 = $('#entity-1').typeahead('val');
	var entity1Data = $('#entity-1').data();

	var entity2 = $('#entity-2').typeahead('val');
	var entity2Data = $('#entity-2').data();

	[entity1, entity2] = [entity2, entity1];
	[entity1Data, entity2Data] = [entity2Data, entity1Data];

	$('#entity-1').typeahead('val', entity1);
	$('#entity-1').removeData();
	$('#entity-1').data(entity1Data);

	$('#entity-2').typeahead('val', entity2);
	$('#entity-2').removeData();
	$('#entity-2').data(entity2Data);

	disableInvalidRelationships();
	checkEntityValidity();
	saveProgress();
};

var setDropdownText = function() {
	var isCurrent = $('#current').is(':checked');
	var textList = isCurrent ? DROPDOWN_TEXT_PRESENT : DROPDOWN_TEXT_PAST;

	$('#relationship').children().each(function(i, el) {
		var categoryId = $(el).val();      // in case some options are not being used
		$(el).text(textList[categoryId]);
	});
};

// SAVE AND RETRIEVE WORK

var saveProgress = function() {
	var relationshipData = $.extend(
		{
			entity1Name: $('#entity-1').val(),
			entity2Name: $('#entity-2').val(),
		}, 
		getShortRelationshipParams(), 
		getShortNewEntityParams(), 
		getReference(), 
		getEntityExtensions()
	);

	chrome.storage.sync.set({relationshipData: relationshipData});
};

var populateForm = function(data) {
	$('#entity-1').typeahead('val', data.entity1Name);
	$('#entity-2').typeahead('val', data.entity2Name);
	$('#relationship').val(data.category_id).trigger('change');

	$('#current').prop('checked', data.is_current);
	setDropdownText();

	$('#entity-1').data( {'entityId': data.entity1_id, 'entityExt': data.entity1_ext} );
	$('#entity-2').data( {'entityId': data.entity2_id, 'entityExt': data.entity2_ext} );

	$('#source-url').val(data.source).trigger('change');
	$('#source-name').val(data.name).trigger('change');

	checkEntityValidity();
	saveProgress();
};

var retrieveProgress = function() {
	chrome.storage.sync.get('relationshipData', function(data) {
		if (data.relationshipData) {
			populateForm(data.relationshipData);
			disableInvalidRelationships();
		} 
	});
};

// DATA SUBMISSION

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
	  				$(msgTarget).flashMessage({html: res.errors.name, className: 'warn' });
	  			} else {
	  				$(msgTarget).flashMessage({html: successMessage, className: 'success' });
					successCallback(target, data);
	  			}
	  		},
	    	201: function(data) {
	    		$(msgTarget).flashMessage({html: successMessage, className: 'success' });
				successCallback(target, data);
	    	}, 
	    	400: function() {
	    		$(msgTarget).flashMessage({html: 'One or more of your inputs is incorrect. Try again.', className: 'warn' });
	    	},
	    	500: function() {
	    		$(msgTarget).flashMessage({html: 'Sorry, something went wrong.', className: 'warn'});
	    	}
	  	}
	});
};

// NEW RELATIONSHIP

var getRelationshipParams = function() {
	return {
		relationship: getShortRelationshipParams(),
		reference: getReference()
	};
};

var getReference = function() {
	return {
		name: $('#source-name').val(),
		source: $('#source-url').val()
	};
};

var getShortRelationshipParams = function() {
	return {
		entity1_id: $('#entity-1').data('entityId'),
		entity2_id: $('#entity-2').data('entityId'),
		category_id: $('#relationship option:checked').attr('value'),
		is_current: $('#current').is(':checked')
	};
};

var getEntityExtensions = function() {
	return {
		entity1_ext: $('#entity-1').data('entityExt'),
		entity2_ext: $('#entity-2').data('entityExt')
	};
};

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
		  			$(msgTarget).flashMessage({html: "A similar relationship already exists. Continue?", time: 10000, className: 'warn' });
   	  			}
   	  		}
   	  	}
	});
};

var disableInvalidRelationships = function() {
	var catId = $('#relationship').val();
	var currentCategoryId = parseInt(catId);

	var validCategories = relationshipCategories($('#entity-1').data('entityExt'), $('#entity-2').data('entityExt'));
	var all = relationshipCategories(undefined, undefined);

	all.forEach(function(category_id) {
		if (validCategories.includes(category_id)) {
			$('#relationship option[value=' + category_id + ']').prop('disabled', false);
		} else {
			$('#relationship option[value=' + category_id + ']').prop('disabled', true);
		}
	});

	if (catId == null || catId == '') { 
		return; 
	} else if (!validCategories.includes(currentCategoryId)) {
		$('#relationship').val('').trigger('change');

		var msgTarget = $('#relationship').closest('.input').find('.status-message');
		$(msgTarget).flashMessage({html: "Invalid relationship type", className: 'warn', time: 2000 });
	};
};	

var submitRelationshipData = function(target) {
	var newRelationshipHtml = 'Relationship added! <span id="new-tab-link">Edit in a new tab?</span>';
	submitData(target, '/relationships', getRelationshipParams(), newRelationshipHtml, addLinkAndClearForm);
};

var addLinkAndClearForm = function(target, data) {
	var newRelationshipId = JSON.parse(data.responseText).relationship_id;
	var newTabSlug = '/relationship/view/id/' + newRelationshipId;
	$(target).closest('.button').find('.status-message').find('#new-tab-link').data('slug', newTabSlug);
	$(window).trigger('relationship:success');
	clearForm();
};

// NEW ENTITY

var getNewEntityParams = function() {
	return {
		entity: getShortNewEntityParams(),
		add_relationship_page: true
	};
};

var getShortNewEntityParams = function() {
	return {
		name: $('#entity-name').val(),
		blurb: $('#entity-blurb').val(),
		primary_ext: $('input[name=entityType]:checked').val()
	};
};

var showNewEntityDialogue = function(target) {
	var openDrawer = $('#new-entity-drawer');
	if (openDrawer) {
		closeNewEntityDrawer(openDrawer);
	}

	var drawer = $(target).closest('.entity').find('.add-entity');
	var messageHtml = 'Entity added! <a href="http://www.google.com">Edit in a new tab?</a>';
	drawer.load('add-entity.html', function() {
		setNewEntityValidations();

		var entityInput = $(target).closest('.input').find('.typeahead.invalid').val();
		$('#entity-name').val(entityInput).trigger('input');


		$('.add-new-entity-btn').click(function() { submitData(this, '/entities', getNewEntityParams(), messageHtml, fillEntityInput); });
		$('.close-new-entity-btn').click(function() { closeNewEntityDrawer(this); });
	});
};

var closeNewEntityDrawer = function(target) {
	$(target).closest('.add-entity').empty();
};

var fillEntityInput = function(target, data) {
	var res = JSON.parse(data.responseText);
	var entityName = res.entity.name;
	var entityId = res.entity.id;
	var entityExt = res.entity.primary_type;  // whhhhyyyyyyy does the ajax response call it this
	
	var entityInput = $(target).closest('.entity').find('.typeahead');
	var entityInputContainer = $(target).closest('.entity');

	closeNewEntityDrawer(target);
	$(entityInput).typeahead('destroy');
	buildTypeahead(entityInput);

	entityInputContainer.find('input').trigger('typeahead:select', {id: entityId, primary_ext: entityExt})
	entityInputContainer.find('input').val(entityName);

	saveProgress();
	disableInvalidRelationships();
};


// TYPEAHEAD 

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

// UI

$(function () {
	$('#new-relationship-btn').click(function() { submitRelationshipData(this); });
	$('#set-current-tab-btn').click(function() { setCurrentTab(); });
    $('#swap-entities-btn').click(function() { swapEntities(); });
    $('#new-entity-btn').click(function() { showNewEntityDialogue(this); })
    $('#clear-btn').click(function() { clearForm(); });
    $('#current').change(function() { setDropdownText(); });

    buildTypeahead('.typeahead');

	$('.typeahead').on('typeahead:render', function() {
		$('.show-new-person-dialogue').click(function() {
			showNewEntityDialogue(this);
		});
	});

	$('.typeahead').on('typeahead:select input', function(e, obj) {
		var entityInput = $(e.target).closest('input')

		if (e.type == 'typeahead:select') {
			entityInput.data('entityId', obj.id);
			entityInput.data('entityExt', obj.primary_ext);
		} else {
			entityInput.removeData('entityId entityExt');
		}

		saveProgress();
		disableInvalidRelationships();
	});

	$('#relationship, #current').on('change', function() {
		saveProgress();
	});

	$('#source-url, #source-name').on('change', function() {
		saveProgress();
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


	$(window).on('relationship:success', function() {
    	$('#new-tab-link').click(function() { openNewTab(BASEURL + $(this).data('slug')) });
	});

	$('.container').ready(function() {
		initializeForm();
	});
});

