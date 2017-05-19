$(document).ready(function () {
	$('.typeahead').on('typeahead:select', function(e, obj) {
		var entityInput = $(e.target).closest('input');
		var icon = $(entityInput).parent().parent().find('.message-icon');

		entityInput.attr('data-selected-entity-id', obj.id);

		entityInput.removeClass('invalid');
		icon.removeClass('invalid');
		
		entityInput.addClass('valid');
		icon.addClass('valid');
	});

	$('.typeahead').on('input', function(e, obj) {
		var entityInput = $(e.target).closest('input');
		var icon = entityInput.parent().parent().find('.message-icon');

		entityInput.removeAttr('data-selected-entity-id');
		
		entityInput.removeClass('valid');
		icon.removeClass('valid');
		
		entityInput.addClass('invalid');
		icon.addClass('invalid');
	});

	$('#relationship').on('change', function() {
		var icon = $(this).closest('.select').find('.message-icon');

		if ($(this).val() == 0) {
			$(this).trigger('invalid');
			icon.addClass('invalid');
		} else {
			$(this).trigger('valid');
			icon.addClass('valid');
		}
	});

	$('#source-url, #source-name').on('input', function() {
		var validity = this.checkValidity() ? 'valid' : 'invalid';
		$(this).trigger(validity);
	});

	$('#source-url, #source-name').on('valid', function() {
		var icon = $(this).parent().next();
		icon.addClass('valid');
		icon.removeClass('invalid');
	});

	$('#source-url, #source-name').on('invalid', function() {
		var icon = $(this).parent().next();
		icon.addClass('invalid');
		icon.removeClass('valid');
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
});