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

var disableInvalidRelationships = function() {
	var entity1Ext = $('#entity-1').data('entityExt');
	var entity2Ext = $('#entity-2').data('entityExt');
	var validCategories = relationshipCategories(entity1Ext, entity2Ext);
	var all = relationshipCategories('', '');

	all.forEach(function(category_id) {
		if (validCategories.includes(category_id)) {
			$('#relationship option[value=' + category_id + ']').attr('enabled', 'enabled');
		} else {
			$('#relationship option[value=' + category_id + ']').attr('disabled', 'disabled');
		}
	});

	if (!validCategories.includes($('#relationship').val())) {
		$('#relationship').val('');
	};
};	

$(function () {
	$(window).on('input change typeahead:select', function() {
		$(this).trigger('form:input');
	});

	$('.typeahead').on('typeahead:select', function() {
		$(this).closest('input').trigger('valid');
		disableInvalidRelationships();
	});

	$('.typeahead').on('input', function() {
		$(this).closest('input').trigger('invalid');
		disableInvalidRelationships();
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