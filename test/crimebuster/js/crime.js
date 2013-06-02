// function callData() {
// 	$.ajax({
// 		url: 'http://data.sfgov.org/resource/gxxq-x39z.json',
// 		type: 'GET',
// 		dataType: 'json',
// 		complete: function(xhr, textStatus) {
// 			//called when complete
// 		},
// 		success: function(data, textStatus, xhr) {
// 			// alert(1);
// 			alert(data.length);
// createMarker(data);


// 		},
// 		error: function(xhr, textStatus, errorThrown) {
// 			//called when there is an error
// 		}
// 	});
// }

var lines = [];

$(document).ready(function() {
	$.ajax({
		type: "GET",
		url: "data/data.txt",
		dataType: "text",
		success: function(data) {
			processData(data);
		}
	});
});


function processData(allText) {
	var allTextLines = allText.split(/\r\n|\n/);
	var headers = allTextLines[0].split('\t');
	
	// alert(allTextLines.length);
	for (var i = 1; i < allTextLines.length; i++) {
		var data = allTextLines[i].split('\t');
		// console.log(data[0]);

		if (data.length == headers.length) {
			
			var tarr = new Object();
			tarr.Date = data[0];
			tarr.PdDistrict = data[1];
			tarr.X = data[2];
			tarr.Y = data[3];
			lines.push(tarr);
		}
	}
	// createMarker(lines);
}