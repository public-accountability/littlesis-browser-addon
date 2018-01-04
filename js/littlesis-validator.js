var validator = (function() {

  var checkFormValidity = function() {
    $('#new-relationship-btn').prop('disabled', false);

    $('#entity-1, #relationship, #entity-2, #source-url, #source-name').each(function(i, el) {
      if (!$(el).hasClass('valid')) {
	$('#new-relationship-btn').prop('disabled', true);
      }
    });

    $('#amount, #start-date, #end-date').each(function(i, el) {
      if ($(el).hasClass('invalid')) {
  $('#new-relationship-btn').prop('disabled', true);
      }
    });

    if($('#new-relationship-btn').prop('disabled') == false) {
      $('#new-relationship-btn').trigger('new-relationship-btn:enabled');
    }
  };

  var checkEntityFormValidity = function() {
    $('.add-new-entity-btn').prop('disabled', false);

    $('#entity-name, #entity-blurb, #primary-ext').each(function(i, el) {
      if (!$(el).hasClass('valid')) {
	$('.add-new-entity-btn').prop('disabled', true);
      }
    });
  };

  var checkEntityValidity = function() {
    $('#entity-1, #entity-2').each(function() {
      var validity = $(this).data('entityId') ? 'valid' : ($(this).val() == '' ? '' : 'invalid');
      if (validity == '') { clearInputValidity(this); }
      $(this).trigger(validity);
    });
  };

  // to check validity of inputs using HTML validation
  var validateInput = function(target) {
    if ($(target).val()) {
      var validity = target.checkValidity() ? 'valid' : 'invalid';
      $(target).trigger(validity);
    } else {
      clearInputValidity(target);
    }
  };

  var setInputValidity = function(input, validity) {
    console.log(input);
    var icon = $(input).closest('.input').find('.message-icon');

    input.removeClass('valid invalid').addClass(validity);
    icon.removeClass('valid invalid').addClass(validity);
    
    checkFormValidity();
    checkEntityFormValidity();
  };

  var clearInputValidity = function(input) {
    var icon = $(input).closest('.input').find('.message-icon');
    $(input).removeClass('valid invalid');
    icon.removeClass('valid invalid');

    checkFormValidity();
    checkEntityFormValidity();
  };

  var setNewEntityValidations = function() {
    $('#entity-name').on('input', function() {
      if ($(this).val()) {
	$(this).trigger('valid');
      } else {
	clearInputValidity(this);	
      }
    });

    $('#primary-ext').on('change', function() {
      $(this).trigger('valid');
    });

    $('#entity-name, #primary-ext').on('valid invalid', function(e) {
      setInputValidity($(this), e.type);
    });
  };

  var validateTypeahead = function(e, target) {
    if (e.type == 'typeahead:select') {
      $(target).closest('input').trigger('valid');
    } else if ($(target).val()) {
      $(target).closest('input').trigger('invalid');			
    } else {
      clearInputValidity(target);
    }
  };

  var validateAlwaysValid = function(target) {
    $(target).trigger('valid');
  };

  var validateValidOrBlank = function(target) {
    if ($(target).val()) {
      $(target).trigger('valid');
    } else {
      clearInputValidity(target);	
    }
  };

  var setDomListeners = function() {
    $(function () {
      $('#source-url, #source-name, #entity-1, #entity-2, #description-1, #description-2, #relationship, #amount, #start-date, #end-date').on('valid invalid', function(e) {
	setInputValidity($(this), e.type);
      });
    });
  }; 

  return {
    checkEntityValidity: checkEntityValidity,
    validateInput: validateInput,
    setNewEntityValidations: setNewEntityValidations,
    validateTypeahead: validateTypeahead,
    validateAlwaysValid: validateAlwaysValid,
    validateValidOrBlank: validateValidOrBlank,
    setDomListeners: setDomListeners
  };

})();
