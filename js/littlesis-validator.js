var checkFormValidity = function() {
	$('#new-relationship-btn').prop('disabled', false);

	$('#entity-1, #relationship, #entity-2, #source-url, #source-name').each(function(i, el) {
		if (!$(el).hasClass('valid')) {
			$('#new-relationship-btn').prop('disabled', true);
		}
	})

	if($('#new-relationship-btn').prop('disabled') == false) {
		$('#new-relationship-btn').trigger('new-relationship-btn:enabled');
	}
};

var checkEntityValidity = function() {
	$('#entity-1, #entity-2').each(function() {
		var validity = $(this).data('entityId') ? 'valid' : ($(this).val() == '' ? '' : 'invalid');
		if (validity == '') { clearInputValidity(this); }
		$(this).trigger(validity);
	});
};

var setInputValidity = function(input, validity) {
	var icon = $(input).closest('.input').find('.message-icon');

	input.removeClass('valid invalid').addClass(validity);
	icon.removeClass('valid invalid').addClass(validity);
	
	checkFormValidity();
};

var clearInputValidity = function(input) {
	var icon = $(input).closest('.input').find('.message-icon');
	$(input).removeClass('valid invalid');
	icon.removeClass('valid invalid');
};

$(function () {
	$('.typeahead').on('typeahead:select input', function(e) {
		if (e.type == 'typeahead:select') {
			$(this).closest('input').trigger('valid');
		} else if ($(this).val()) {
			$(this).closest('input').trigger('invalid');			
		} else {
			clearInputValidity(this);
		}
	})

	$('#current').on('change', function() {
		$(this).trigger('valid');
	});

	$('#relationship').on('change', function() {
		if ($(this).val()) {
			$(this).trigger('valid');
		} else {
			clearInputValidity(this);	
		}
	});

	$('#source-url, #source-name').on('input change', function() {
		// clearInputValidity(this);
		var validity = this.checkValidity() ? 'valid' : ($(this).val() == '' ? '' : 'invalid');   // check validity of inputs using HTML validation
		$(this).trigger(validity);
	});

	$('#source-url, #source-name, #entity-1, #entity-2, #relationship, #current').on('valid invalid', function(e) {
		setInputValidity($(this), e.type);
	});
});