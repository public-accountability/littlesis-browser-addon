var openNewTab = function(slug) {
	chrome.tabs.query( { currentWindow: true }, function(tabs) {
		var addNewTabs = $.grep(tabs, function(tab) {
			return tab.url == BASEURL + slug;
		});

		if (addNewTabs.length == 0) {
			chrome.tabs.create({ url: BASEURL + slug }, function(){} );
		} else {
			chrome.tabs.update(addNewTabs[0].id, { active: true }, function(){} );
		}
	});
};

var setCurrentTab = function(cb) {
	chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
		$('#source-url').val(tabs[0].url);
		$('#source-name').val(tabs[0].title);
		if (cb) { cb(); };
	});
};