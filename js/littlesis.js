// FORM CONTROL

var initializeForm = function() {
	setCurrentTab();
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
	$('#current').prop('checked', true).trigger('change');
	setCurrentTab();
};

var clearEntityForm = function() {

};

var setEntityInput = function(input, entityId, entityExt) {
	input.data('entityId', entityId);
	input.data('entityExt', entityExt);
};

var clearEntityInput = function(input) {
	input.removeData('entityId entityExt');
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

	if (entity1Data.entityId) {
		setValidInput($('#entity-1'));
	} else {
		setInvalidInput($('#entity-1'));
	}

	if (entity2Data.entityId) {
		setValidInput($('#entity-2'));
	} else {
		setInvalidInput($('#entity-2'));
	}
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
	var relationshipParams = getRelationshipParams();
	var entity1Name = $('#entity-1').typeahead('val');
	var entity2Name = $('#entity-2').typeahead('val');
	var isCurrent = $('#current').is(':checked');
	var newEntityParams = getNewEntityParams();
	// console.log(newEntityParams);

	var relationshipData = {
		relationshipParams: relationshipParams,
		entity1Name: entity1Name,
		entity2Name: entity2Name,
		isCurrent: isCurrent,
		newEntityParams: newEntityParams
	};

	chrome.storage.sync.set({'relationshipData': relationshipData});
};

var populateForm = function(data) {
	$('#entity-1').typeahead('val', data.entity1Name);
	var entity1Id = data.relationshipParams.relationship.entity1_id;
	var entity1Ext = data.relationshipParams.relationship.extity1_ext;
	if (entity1Id) { $('#entity-1').data( {'entityId': entity1Id, 'entity1Ext': entity1Ext} ).trigger('valid'); }
	// var entity1Validity = !!data.relationshipParams.relationship.entity1_id ? 'valid' : 'invalid';
	// $('#entity-1').data({
	// 	'entityId': data.relationshipParams.relationship.entity1_id, 
	// 	'entity1Ext': data.relationshipParams.relationship.extity1_ext
	// }).trigger(entity1Validity);


	var categoryId = data.relationshipParams.relationship.category_id;
	if (categoryId) { $('#relationship').val(categoryId).trigger('valid'); }

	$('#entity-2').typeahead('val', data.entity2Name);
	var entity2Id = data.relationshipParams.relationship.entity2_id;
	var entity2Ext = data.relationshipParams.relationship.extity2_ext;
	if (entity2Id) { $('#entity-2').data( {'entityId': entity2Id, 'entity1Ext': entity2Ext} ).trigger('valid'); }

	$('#current').prop('checked', data.isCurrent).trigger('change');

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
		relationship: $.extend(getShortRelationshipParams(), getEntityExtensions()),
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
		extity1_ext: $('#entity-1').data('entityExt'),
		extity2_ext: $('#entity-2').data('entityExt'),
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
		  			$(msgTarget).flashMessage({text: "A similar relationship already exists. Continue?", time: 10000, className: 'warn' });
   	  			}
   	  		}
   	  	}
	});
};

var submitRelationshipData = function(target) {
	var newRelationshipHtml = 'Relationship added! <button class="new-tab-btn success">Edit in a new tab?</button>';
	submitData(target, '/relationships', getRelationshipParams(), newRelationshipHtml, addLinkAndClearForm);
};

var addLinkAndClearForm = function(target, data) {
	var newRelationshipId = JSON.parse(data.responseText).relationship_id;
	var newTabSlug = '/relationship/view/id/' + newRelationshipId;
	$(target).closest('.button').find('.status-message').find('.new-tab-btn').data('slug', newTabSlug);
	$(window).trigger('relationship:success');
	clearForm();
};

// NEW ENTITY

var getNewEntityParams = function() {
    var entityName = $('#entity-name').val();
    var entityBlurb = $('#entity-blurb').val();
    var primaryExt = $('input[name=entityType]:checked').val();

	var params = {
		entity: {
			name: entityName,
			blurb: entityBlurb,
			primary_ext: primaryExt,
		},

		add_relationship_page: true
	};

	return params;
};

var showNewEntityDialogue = function(target) {
	var openDrawer = $('#new-entity-drawer');
	if (openDrawer) {
		closeNewEntityDrawer(openDrawer);
	}

	var drawer = $(target).closest('.entity').find('.add-entity');
	var messageHtml = 'Entity added! <a href="http://www.google.com">Edit in a new tab?</a>';
	drawer.load('add-entity.html', function() {
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
	var entityExt = res.entity.primary_ext;
	
	var entityInput = $(target).closest('.entity').find('.typeahead');
	$(entityInput).val(entityName);
	$(entityInput).data({'entityId': entityId, 'entityExt': entityExt});

	setValidInput(entityInput);

	closeNewEntityDrawer(target);
	$(entityInput).typeahead('destroy');
	buildTypeahead(entityInput);
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
    $('#clear-btn').click(function() { clearForm(); });
    $('#current').change(function() { setDropdownText(); });

    buildTypeahead('.typeahead');

	$('.typeahead').on('typeahead:render', function() {
		$('.show-new-person-dialogue').click(function() {
			showNewEntityDialogue(this);
		});
	});

	$('.typeahead').on('typeahead:select', function(e, obj) {
		var entityInput = $(e.target).closest('input');
		setEntityInput(entityInput, obj.id, obj.primary_ext);
	});

	$('.typeahead').on('input', function(e, obj) {
		var entityInput = $(e.target).closest('input');
		clearEntityInput(entityInput);
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

	$(window).on('relationship:success', function() {
    	$('.new-tab-btn').click(function() { openNewTab(BASEURL + $(this).data('slug')) });
	});

	$('.container').ready(function() {
		initializeForm();
	});
});

