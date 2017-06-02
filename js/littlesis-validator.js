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

	$(window).trigger('form:input');
};

var validateInput = function(target) {						// to check validity of inputs using HTML validation
	var validity = target.checkValidity() ? 'valid' : 'invalid';
	$(target).trigger(validity);
};

var findMessageIcon = function(input) {
	return $(input).closest('.input').find('.message-icon');
};

var setValidInput = function(input) {
	var icon = findMessageIcon(input);

	input.removeClass('invalid');
	icon.removeClass('invalid');
	
	input.addClass('valid');
	icon.addClass('valid');

	checkFormValidity();
};

var setInvalidInput = function(input) {
	var icon = findMessageIcon(input);

	input.removeClass('valid');
	icon.removeClass('valid');
	
	input.addClass('invalid');
	icon.addClass('invalid');

	checkFormValidity();
};

// var setInputValidity = function(input, isValid) {
// 	var toAdd = isValid ? 'valid' : 'invalid';
// 	var toRemove = isValid ? 'invalid' : 'valid';
// 	var icon = findMessageIcon(input);

// 	input.removeClass(toRemove);
// 	icon.removeClass(toRemove);
	
// 	input.addClass(toAdd);
// 	icon.addClass(toAdd);

// 	checkFormValidity();
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
		validateInput(this);
	});

	$('#source-url, #source-name, #entity-1, #entity-2, #relationship, #current, #entity-name').on('valid', function() {
		setValidInput($(this));
	});

	$('#source-url, #source-name, #entity-1, #entity-2, #relationship, #current, #entity-name').on('invalid', function() {
		setInvalidInput($(this));
	});
});