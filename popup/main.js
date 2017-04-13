var getParams = function() {
    var entity1 = document.getElementById("entity-1").value;
    var entity2 = document.getElementById("entity-2").value;
    var categoryId = document.getElementById("relationship").value;

	return "entity1=" + encodeURIComponent(entity1) + "&entity2=" + encodeURIComponent(entity2) + "&category_id=" + encodeURIComponent(categoryId);
};

var submitForm = function() {
	var xhr = new XMLHttpRequest();
	var url = "https://littlesis.org/relationships";
	var params = getParams();
	console.log(params);
	
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send(params);
};

var swapEntities = function() {
    var entity1Box = document.getElementById("entity-1");
    var entity1 = entity1Box.value;
    var entity2Box = document.getElementById("entity-2");
    var entity2 = entity2Box.value;

    entity1Box.value = entity2;
    entity2Box.value = entity1;
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("new-relationship-btn").onclick = submitForm;
    document.getElementById("swap-entities-btn").onclick = swapEntities;
});


