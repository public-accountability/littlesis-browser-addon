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

var validateInput = function(target) {						// to check validity of inputs using HTML validation
	var validity = target.checkValidity() ? 'valid' : ($(target).val() == '' ? '' : 'invalid');
	$(target).trigger(validity);
};

var setInputValidity = function(input, validity) {
	var icon = $(input).closest('.input').find('.message-icon');

	input.removeClass('valid invalid').addClass(validity);
	icon.removeClass('valid invalid').addClass(validity);
	
	checkFormValidity();
};

// var clearInputValidity = function(input) {
// 	var icon = $(input).closest('.input').find('.message-icon');
// 	$(input).removeClass('valid invalid');
// 	icon.removeClass('valid invalid');
// };

$(function () {
	$('.typeahead').on('typeahead:select', function() {
		$(this).closest('input').trigger('valid');
	});

	$('.typeahead').on('input', function() {
		$(this).closest('input').trigger('invalid');
	});

	$('#relationship, #current').on('change', function() {
		$(this).trigger('valid');
	});

	$('#source-url, #source-name, #entity-name').on('input', function() {
		// clearInputValidity(this);
		validateInput(this);
	});

	// $('#source-name, #entity-name').on('input', function() {
	// 	var validity = $(this).val() == '' ? 'invalid' : 'valid';
	// 	$(this).trigger('validity');
	// });

	$('#source-url, #source-name, #entity-1, #entity-2, #relationship, #current, #entity-name').on('valid invalid', function(e) {
		setInputValidity($(this), e.type);
	});
});