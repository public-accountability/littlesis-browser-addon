var BASEURL = 'http://localhost:8080';

var getToken = function() {
	return $.ajax({
		type: 'GET',
		url: BASEURL + '/home/token',
	  	xhrFields: {
      		withCredentials: true
   	  	}
	});
};

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
	inputsAreValid();

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

var useCurrentTab = function() {
	chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
		$('#source-url').val(tabs[0].url);
		$('#source-name').val(tabs[0].title);
	});
};

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

// var inputsAreValid = function() {
// 	if ($('#entity-1').hasClass('valid') && $('#entity-2').hasClass('valid')) {
// 		console.log('true');
// 	} else {
// 		console.log('false');
// 	}
// }

// var addValidationMessagingToInput = function(target) {
// 	var icon = $(target).parent().parent().find('.message-icon');

// 	if $(target).hasClass('valid') {
// 		icon.removeClass('fa-exclamation');		
// 		icon.addClass('fa-check');	
// 		icon.css('color', 'green');
// 	} else {
// 		icon.removeClass('fa-check');		
// 		icon.addClass('fa-exclamation');	
// 		icon.css('color', 'red');
// 	}
// }

document.addEventListener("DOMContentLoaded", function () {
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
	  		notFound: '<div>No results found. Try searching again; maybe you misspelled something? Or <a id="show-new-person-dialogue">add a new person or organization to the database</a>.</div>',
	  		suggestion: Handlebars.templates.suggestion
	  	}
	});

	$('.typeahead').on('typeahead:select', function(e, obj) {
		var entityInput = $(e.target).closest('input');
		var icon = $(entityInput).parent().parent().find('.message-icon');

		entityInput.attr('data-selected-entity-id', obj.id);
		icon.removeClass('invalid');
		icon.addClass('valid');
	});

	$('.typeahead').on('input', function(e, obj) {
		var entityInput = $(e.target).closest('input');
		var icon = entityInput.parent().parent().find('.message-icon');

		entityInput.removeAttr('data-selected-entity-id');
		icon.removeClass('valid');
		icon.addClass('invalid');
	});
});

var openNewEntityTab = function() {
	chrome.tabs.query( { currentWindow: true }, function(tabs) {
		var addNewTabs = $.grep(tabs, function(tab) {
			return tab.url == BASEURL + '/entities/new';
		});

		if (addNewTabs.length == 0) {
			chrome.tabs.create({ url: BASEURL + '/entities/new' }, function(){} );
		} else {
			chrome.tabs.update(addNewTabs[0].id, { active: true }, function(){} );
		}
	});
};

$('.typeahead').on('typeahead:render', function() {
	$('#show-new-person-dialogue').click(function() {
		openNewEntityTab();
	});
});
