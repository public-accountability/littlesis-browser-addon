var openNewTab = function(url) {
	chrome.tabs.query( { currentWindow: true }, function(tabs) {
		var addNewTabs = $.grep(tabs, function(tab) {
			return tab.url == url;
		});

		if (addNewTabs.length == 0) {
			chrome.tabs.create({ url: url }, function(){} );
		} else {
			chrome.tabs.update(addNewTabs[0].id, { active: true }, function(){} );
		}
	});
};

var setCurrentTab = function() {
	chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
		$('#source-url').val(tabs[0].url.substring(0,1000));
		$('#source-name').val(tabs[0].title.substring(0,100));
		$('#source-url, #source-name').trigger('change');
	});
};

// SETS

var union = function(a, b) {
	return Array.from(new Set([...a, ...b]));
};