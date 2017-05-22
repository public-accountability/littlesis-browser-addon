var checkTypeaheadValidity = function(target) {
	// might need this function at some point
};

var validateInput = function(target) {
	var validity = target.checkValidity() ? 'valid' : 'invalid';
	$(target).trigger(validity);
};

var setValidInput = function(input, icon) {
	input.removeClass('invalid');
	icon.removeClass('invalid');
	
	input.addClass('valid');
	icon.addClass('valid');
};

var setInvalidInput = function(input, icon) {
	input.removeClass('valid');
	icon.removeClass('valid');
	
	input.addClass('invalid');
	icon.addClass('invalid');
};

var setEntityInput = function(input, entityId) {
	input.attr('data-selected-entity-id', entityId);
};

var clearEntityInput = function(input) {
	input.removeAttr('data-selected-entity-id');
};

var checkFormValidity = function() {
	$('#new-relationship-btn').prop('disabled', false);

	$('#entity-1, #relationship, #entity-2, #source-url, #source-name').each(function(i, el) {
		if (!$(el).hasClass('valid')) {
			$('#new-relationship-btn').prop('disabled', true);
		}
	})
};

// var inputsAreValid = function() {
// 	if ($('#entity-1').hasClass('valid') && $('#entity-2').hasClass('valid')) {
// 		console.log('true');
// 	} else {
// 		console.log('false');
// 	}
// }

$(document).ready(function () {
	$('input, select').on('input', function() {
		checkFormValidity();
	});

	$('.typeahead').on('typeahead:select', function(e, obj) {
		var entityInput = $(e.target).closest('input');
		var icon = $(entityInput).closest('.entity').find('.message-icon');

		setEntityInput(entityInput, obj.id);
		setValidInput(entityInput, icon);
		checkFormValidity();
	});

	$('.typeahead').on('input', function(e, obj) {
		var entityInput = $(e.target).closest('input');
		var icon = entityInput.closest('.entity').find('.message-icon');

		clearEntityInput(entityInput);
		setInvalidInput(entityInput, icon);
	});

	$('#relationship').on('change', function() {
		var icon = $(this).closest('.select').find('.message-icon');
		setValidInput($(this), icon);
	});

	$('#source-url, #source-name').on('input', function() {
		validateInput(this);
	});

	$('#source-url, #source-name').on('valid', function() {
		var icon = $(this).closest('.source').find('.message-icon');
		setValidInput($(this), icon);
	});

	$('#source-url, #source-name').on('invalid', function() {
		var icon = $(this).closest('.source').find('.message-icon');
		setInvalidInput($(this), icon);
	});

	validateInput(document.getElementById('source-url'));
	validateInput(document.getElementById('source-name'));
});