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

var checkTypeaheadValidity = function(target) {
	// might need this function at some point
};

var validateInput = function(target) {						// to check validity of inputs using HTML validation
	var validity = target.checkValidity() ? 'valid' : 'invalid';
	$(target).trigger(validity);
};

var findMessageIcon = function(input) {
	return $(input).closest('.input').find('.message-icon');
};

var setValidInput = function(input) {
	var icon = findMessageIcon(input) || null;

	input.removeClass('invalid');
	icon.removeClass('invalid');
	
	input.addClass('valid');
	icon.addClass('valid');

	checkFormValidity();
};

var setInvalidInput = function(input, icon) {
	var icon = findMessageIcon(input) || null;

	input.removeClass('valid');
	icon.removeClass('valid');
	
	input.addClass('invalid');
	icon.addClass('invalid');

	checkFormValidity();
};

var setEntityInput = function(input, entityId) {
	input.data('selected-entity-id', entityId);
};

var clearEntityInput = function(input) {
	input.removeData('selected-entity-id');
};

$(function () {
	$('.typeahead').on('typeahead:select', function(e, obj) {
		var entityInput = $(e.target).closest('input');
		setEntityInput(entityInput, obj.id);
		entityInput.trigger('valid');
	});

	$('.typeahead').on('input', function(e, obj) {
		var entityInput = $(e.target).closest('input');
		clearEntityInput(entityInput);
		entityInput.trigger('invalid');
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