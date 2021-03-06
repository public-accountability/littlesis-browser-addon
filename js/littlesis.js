var littlesis = (function() {

  // FORM CONTROL
  var initializeForm = function() {
    retrieveProgress();	
    setCurrentTab();
    // setDropdownText();
  };


  /**
   * Returns the selected relationship category
   * It will return an empty string if none is selected.
   * @returns {String} 
   */
  var categoryIdSelection = function() {
    return $('#relationship option:checked').attr('value');
  };
  

  var isPositionRelationship = function() {
    return categoryIdSelection() === '1';
  };

  var getEntityExtensions = function() {
    return {
      entity1_ext: $('#entity-1').data('entityExt'),
      entity2_ext: $('#entity-2').data('entityExt')
    };
  };

  /**
     Gets information about the is current buttons
     
     Use:
     isCurrentSelection.value() => retrieves current value
     isCurrentSelection.reset() => sets it back to unknown
  */
  var isCurrentSelection = {
    "value": () => $('input[name="is_current"]:checked').val(),
    "reset": () => $('#is_current_null').prop('checked', true)
  };

  var isBoardSelection = {
    "value": () => $('input[name="is_board"]:checked').val(),
    "reset": () => $('#is_board_null').prop('checked', true)
  };

  var clearForm = function() {
    $('.typeahead').typeahead('val', '');
    $('input').val('');
    $('textarea').val('');
    $('input').removeData('entityId entityExt');
    $('select').val('');
    showHideFields();
    $('.valid').removeClass('valid');
    $('.invalid').removeClass('invalid');
    isCurrentSelection.reset();
    isBoardSelection.reset();
    chrome.storage.sync.remove('relationshipData');
    setCurrentTab();
  };

  var swapEntities = function() {
    var entity1 = $('#entity-1').typeahead('val');
    var entity1Data = $('#entity-1').data();

    var entity2 = $('#entity-2').typeahead('val');
    var entity2Data = $('#entity-2').data();

    var description1 = $('#description-1').val();
    var description2 = $('#description-2').val();

    [entity1, entity2] = [entity2, entity1];
    [entity1Data, entity2Data] = [entity2Data, entity1Data];
    [description1, description2] = [description2, description1];

    $('#entity-1').typeahead('val', entity1);
    $('#entity-1').removeData();
    $('#entity-1').data(entity1Data);

    $('#entity-2').typeahead('val', entity2);
    $('#entity-2').removeData();
    $('#entity-2').data(entity2Data);

    $('#description-1').val(description1).trigger('change');
    $('#description-2').val(description2).trigger('change');

    checkSimilarRelationships();
    disableInvalidRelationships();
    validator.checkEntityValidity();
    saveProgress();
  };

  var setDropdownText = function() {
    var textList = (isCurrentSelection.value() == 'yes') ? DROPDOWN_TEXT_PRESENT : DROPDOWN_TEXT_PAST;
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
	isBoard: isBoardSelection.value()
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

    // setDropdownText();

    $('#entity-1').data( {'entityId': data.entity1_id, 'entityExt': data.entity1_ext} );
    $('#entity-2').data( {'entityId': data.entity2_id, 'entityExt': data.entity2_ext} );

    $('#description-1').val(data.description1).trigger('change');
    $('#description-2').val(data.description2).trigger('change');

    $('#amount').val(data.amount).trigger('change');
    $('#start-date').val(data.start_date).trigger('change');
    $('#end-date').val(data.end_date).trigger('change');

    $('#is_board_' + data.isBoard).prop('checked', true);
    $('#is_current_' + data.is_current).prop('checked', true);

    validator.checkEntityValidity();
    saveProgress();
    checkSimilarRelationships();
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
    var msgTarget = $(target).closest('.input').find('.status-message');

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

  var getShortRelationshipParams = function() {
    return {
      entity1_id: $('#entity-1').data('entityId'),
      entity2_id: $('#entity-2').data('entityId'),
      description1: $('#description-1').val(),
      description2: $('#description-2').val(),
      category_id: $('#relationship option:checked').attr('value'),
      is_current: isCurrentSelection.value(),
      amount: $('#amount').val(),
      start_date: $('#start-date').val(),
      end_date: $('#end-date').val()
    };
  };

  var getReference = function() {
    return {
      name: $('#source-name').val(),
      url: $('#source-url').val()
    };
  };


  var getBaseRelationshipParams = function() {
    return {
      relationship: getShortRelationshipParams(),
      reference: getReference()
    };
  };
  
  var getPositionParams = function() {
    return {
      "position_attributes": {
	"is_board": isBoardSelection.value(),
	"compensation": $('#amount').val() }
    };
  };

  var getRelationshipParams = function() {
    if (isPositionRelationship()) {
      var params = deepMerge(getBaseRelationshipParams(), { "relationship": getPositionParams() });
      delete params['relationship']['amount']; // position relationships don't use the amount field
      return params;
    } else {
      return getBaseRelationshipParams();
    }
  };


  var handleSimilarRelationship = function(data) {
    var msgTarget = $('#relationship-status-message');
    
    if (data.length > 0) {
      $(msgTarget).flashMessage({
	"html": "Caution: <span id='similar-relationship-link' class='external-link fa'>a similar relationship </span> already exists." + CLOSEBUTTON,
	"className": 'warn',
	"callback": function() {
	  $('#similar-relationship-link').click(function() {
	    openNewTab(data[0].url);
	  });
	}
      });
    } else {
      $(msgTarget).find('.flash-message').remove();
      $(msgTarget).removeClass('visible');
    }

  };

  var checkSimilarRelationships = function() {
    var params = getShortRelationshipParams();

    if (params.entity1_id && params.entity2_id && params.category_id) {
      return $.ajax({
	type: 'GET',
	url: BASEURL + '/relationships/find_similar',
	xhrFields: {
	  withCredentials: true
	},
	data: params,
	statusCode: {
	  200: function(data) {
	    console.log('statusCode 200');
	    handleSimilarRelationship(data);
	  }
	}
      });
    }
  };

  var showHideFields = function() {
    var catId = parseInt($('#relationship').val());

    if (catId == 1) {
      $('#is-board-radio-buttons').removeClass('hidden');
    } else {
      $('#is-board-radio-buttons').addClass('hidden');
    }

    if (Object.keys(AMOUNT_LABELS).includes(catId.toString())) {
      $('#amount-input').removeClass('hidden');
      $('#amount-label').text(AMOUNT_LABELS[catId]);
    } else {
      $('#amount-input').addClass('hidden');    
    } 
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

  var setDescriptionFields = function() {
    var currentCategoryId = parseInt($('#relationship').val());

    if ([1, 3, 10].includes(currentCategoryId)) {
      $('#description-2').val('').trigger('change');
      $('#description-2').prop('disabled', true);
      $('#description-2').closest('.input').find('label').addClass('disabled');
    } else {
      $('#description-2').prop('disabled', false);
      $('#description-2').closest('.input').find('label').removeClass('disabled');
    }
  };

  /**
   * When a hierarchical relationship is selected,
   * set the label to display 'Child and 'Parent'.
   * Otherwise, use the defaults: 'Entity 1' and 'Entity 2'
   * @param {Integer|String} selectedCategory
   */
  var setEntityLabelValues = function(selectedCategory) {
    if (Number(selectedCategory) === 11) {
      $('#entity-1-label').text('Child (required)');
      $('#entity-2-label').text('Parent (required)');
    } else {
      $('#entity-1-label').text('Entity 1 (required)');
      $('#entity-2-label').text('Entity 2 (required)');
    }
  };

  var submitRelationshipData = function(target) {
    var newRelationshipHtml = 'Relationship added! <span id="new-tab-link" class="external-link fa">Edit in a new tab? </span>' + CLOSEBUTTON;
    submitData(target, '/relationships', getRelationshipParams(), newRelationshipHtml, addLinkAndClearForm);
  };

  var addLinkAndClearForm = function(target, data) {
    var newRelationshipId = JSON.parse(data.responseText).relationship_id;
    var newTabSlug = '/relationships/' + newRelationshipId + '/edit';
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
    var messageHtml = 'Entity added! <span id="new-entity-link" class="external-link fa">Edit in a new tab? </span>' + CLOSEBUTTON;
    drawer.load('add-entity.html', function() {
      validator.setNewEntityValidations();

      var entityInput = $(target).closest('.input').find('.typeahead.invalid').val();
      $('#entity-name').val(entityInput).trigger('input');


      $('.add-new-entity-btn').click(function() { submitData(this, '/entities', getNewEntityParams(), messageHtml, fillEntityInput); });
      $('.close-new-entity-btn').click(function() { closeNewEntityDrawer(this); });

      $('.typeahead').typeahead('close');
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
    var entityInputContainer = $(target).closest('.entity');

    $('#new-entity-link').click(function() {
      openNewTab(res.entity.url);
    });

    closeNewEntityDrawer(target);
    $(entityInput).typeahead('destroy');
    buildTypeahead(entityInput);

    entityInputContainer.find('input').trigger('typeahead:select', {id: entityId, primary_ext: entityExt});
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
      url: BASEURL + '/search/entity?q=%QUERY'
    }
  });


  var typeaheadTemplates = {
    notFound: '<div class="entity-not-found">No results found. Try searching again; maybe you misspelled something? <div class="new-entity-footer"><button class="new-entity-btn primary">CREATE NEW ENTITY</button></div></div>',
    suggestion: function(data) {
      var urlSlug = '/entities/' + data.id + '-' + data.name.replace(/\s/g, '_');

      return `<div class="entity-suggestion">
		  		      ${data.name}  <div class="entity-name external-link"><a href="${BASEURL}${urlSlug}"></a></div>
				     <div class="entity-blurb">${data.blurb || ""}</div>
							</div>`;
    },
    footer: '<div class="new-entity-footer"><button class="new-entity-btn primary">CREATE NEW ENTITY</button></div>'
  };

  var buildTypeahead = function(target) {
    $(target).typeahead({ highlight: true},
			{
			  display: 'name',
			  limit: 20, 	// Caution: 'limit' seems to have buggy behavior. For some reason 'limit: 20' produces a list of 10 results, but 'limit: 10' doesn't work. 
			  // See https://github.com/twitter/typeahead.js/issues/1201
		  	  source: entities,
		  	  templates: typeaheadTemplates
			})
      .on('typeahead:render', function() {
	$('.new-entity-btn').click(function() { showNewEntityDialogue(this); });
	$('.entity-name').click(function() { openNewTab( $(this).find('a').attr('href')); });
      });
  };

  // UI

  var setDomListeners = function() {

    $(function () {
      $('#new-relationship-btn').click(function() { submitRelationshipData(this); });
      $('#set-current-tab-btn').click(function() { setCurrentTab(); });
      $('#swap-entities-btn').click(function() { swapEntities(); });
      $('#clear-btn').click(function() { clearForm(); });
      $('#advanced-options-btn').click(function() { showAdvancedOptions(); });

      $('input[name="is_current"], input[name="is_board"]').on('change', function(e) {
        saveProgress();
      });

      buildTypeahead('.typeahead');

      $('.typeahead').on('typeahead:select input', function(e, obj) {
	var entityInput = $(e.target).closest('input');
	var hiddenData = $(e.target).closest('.input').find('.hidden-data');	// for testing

	if (e.type == 'typeahead:select') {
	  entityInput.data('entityId', obj.id);
	  entityInput.data('entityExt', obj.primary_ext);

	  hiddenData.attr('data-id', entityInput.data('entityId'));	// for testing
	  hiddenData.attr('data-ext', entityInput.data('entityExt'));	// for testing
	} else {
	  entityInput.removeData('entityId entityExt');
	}

	validator.validateTypeahead(e, this);
	saveProgress();
	checkSimilarRelationships();
	disableInvalidRelationships();
      });

      $('#current').on('change', function() {
	validator.validateAlwaysValid(this);
	saveProgress();
      });

      $('#relationship').on('change', function() {
	setDescriptionFields();
	setEntityLabelValues($(this).val());
	validator.validateValidOrBlank(this);
	saveProgress();
	checkSimilarRelationships();
	showHideFields();
      });

      $('#source-name, #description-1, #description-2').on('input change', function() {
	validator.validateValidOrBlank(this);
	saveProgress();
      });

      $('#source-url, #amount').on('input change', function() {
	validator.validateInput(this);
	saveProgress();
      });

      $('#start-date, #end-date').on('input change', function() {
	validator.checkDateValidity(this);
	saveProgress();
      });

      $('#new-relationship-btn').on('new-relationship-btn:enabled', function() {
	// checkSimilarRelationships();
      });

      // for <select> styling hack:

      $('select').on('focus', function() {
	$('.select-style').css('border', '1px solid #999');
      });

      $('select').on('blur', function() {
	$('.select-style').css('border', '1px solid #ddd');
      });


      $(window).on('relationship:success', function() {
	$('#new-tab-link').click(function() { openNewTab(BASEURL + $(this).data('slug')); });
      });

      $('.container').ready(function() {
	initializeForm();
      });
    });

  };

  return {
    // clearForm: clearForm,
    setDomListeners: setDomListeners,
    isCurrentSelection: isCurrentSelection,
    isBoardSelection: isBoardSelection
  };

})();

