var directionsDisplay;

var directionsService = new google.maps.DirectionsService();
var infowindow;
var map;
var geocoder;
var routes;
var routeResponse;
var routeCrimePts = [];
var checkRun = [];
var markersArray = [];
var clusterArray = [];


function load() {
	navigator.geolocation.getCurrentPosition(userLocation, error);
}

var userLocation = function(pos) {
	var lat = 37.7750;
	var lng = -122.4183;

	initialize(lat, lng);
}

var error = function(error) {
	if (error.code === 1) {
		alert('Unable to get location');
	}
}

	function initialize(lat, lng) {
		var polyOption = {
			strokeColor: "red"
		}
		var renderOption = {
			polylineOptions: polyOption
		}
		directionsDisplay = new google.maps.DirectionsRenderer(renderOption);
		

		var mapOptions = {
			zoom: 15,
			center: new google.maps.LatLng(lat, lng),
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		geocoder = new google.maps.Geocoder();
		map = new google.maps.Map(document.getElementById('map-canvas'),
			mapOptions);
		directionsDisplay.setMap(map);
	

		var start = "420 Taylor St San Francisco, CA";
		var end = "75 Folsom St San Francisco, CA";

		// checkRun[0] = true;
		// checkRun[1] = true;
		// checkRun[2] = true;
		// for (var i = 0; i < 3; i++) {
		// 	calcRoute(start, end, i, true);
		// };

		// updateRouteRenderer(start, end, 0, routeCrimePts);

	}
	
	function updateRouteRenderer(start, end, number) {
		var request = {
			origin: start,
			destination: end,
			provideRouteAlternatives: true,
			travelMode: google.maps.DirectionsTravelMode.WALKING
		};

		directionsService.route(request, function(response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				directionsDisplay.setDirections(response);
				directionsDisplay.setRouteIndex(number);
				// console.log(JSON.stringify(response))
			}
		});
		updateMarkers(number, routeCrimePts);
	}

	function updateMarkers(number) {
		// console.log(routeCrimePts);
		var markers = [];
		// console.log(routeCrimePts[number].last);
		for (var i = routeCrimePts[number].last, j = 0; i < routeCrimePts[number].array.length; i++) {
			
			markers[j++] = createMark(routeCrimePts[number].array[i].Y, routeCrimePts[number].array[i].X);
			
		}

		var mcOptions = {
			gridSize: 40,
			maxZoom: 20
		};
		var markerCluster = new MarkerClusterer(map, markers, mcOptions);
		// markerCluster.setMap(null);
		clusterArray.push(markerCluster);


	}

	function ftToMi(distanceFt) {
		return distanceFt / 1609.24;
	}

	function calcRoute(start, end, routeNum, checkRun) {
		// console.log(hi);
		if (checkRun) {
			var totalDistance = 0;

			var selectedLines = new Object;
			selectedLines.array = [];
			selectedLines.last = 0;
			selectedLines.via;
			selectedLines.duration;
			selectedLines.swap = function(curr) {
				var temp = selectedLines.array[selectedLines.last];
				selectedLines.array[selectedLines.last] = selectedLines.array[curr];
				selectedLines.array[curr] = temp;
				if (selectedLines.last > 0)
					selectedLines.last--;

			};
			selectedLines.totalCrimes;

			var request = {
				origin: start,
				destination: end,
				provideRouteAlternatives: true,
				travelMode: google.maps.DirectionsTravelMode.WALKING
			};

			directionsService.route(request, function(response, status) {
				
				// console.log(response.routes[routeNum].legs[0].via_waypoints.length);
				// for (var i = 0; i < response.routes[routeNum].legs[0].via_waypoints.length; i++) {
					selectedLines.via = response.routes[routeNum].summary;
					console.log(selectedLines.via);
				// };
				selectedLines.duration =response.routes[routeNum].legs[0].duration.text;
				// console.log(selectedLines.via);
				console.log(selectedLines.duration);
				if (status == google.maps.DirectionsStatus.OK) {

					// var routeNum = 0;
					var steps = response.routes[routeNum].legs[0].steps;

					for (var j = 0; j < steps.length; j++) {
						totalDistance += steps[j].distance.value;
					};

					//totalDistance = steps[steps.length-1].distance.value;

					var initialStepJB = steps[0].start_location.jb;
					var initialStepKB = steps[0].start_location.kb;
					var finalStepKB = steps[steps.length - 1].start_location.kb;
					var finalStepJB = steps[steps.length - 1].start_location.jb;

					var midJB = (initialStepJB + finalStepJB) / 2;
					var midKB = (initialStepKB + finalStepKB) / 2;
					var radiusMi = ftToMi(totalDistance);

					// var selectedLines = [];


					// console.log("total distance meters " + totalDistance);
					// console.log("total distance Mi " + radiusMi);

					for (var i = 0, j = 0; i < lines.length; i++) {

						if (haversine(midJB, midKB, lines[i].Y, lines[i].X, radiusMi)) {
							selectedLines.array[j++] = lines[i];
							//createMark(lines[i].Y, lines[i].X);
						}
					};
					// console.log("total selected lines " + selectedLines.array.length);
					selectedLines.last = selectedLines.array.length - 1;

					for (var i = 0; i < steps.length; i++) {
						updateCrimeCount(i, selectedLines);
						// console.log(selectedLines.last);
					}

					function updateCrimeCount(num, selectedLines) {
						var radius = 0.1; //in mile

						for (var i = 0; i < steps[num].path.length; i++) {
							for (var j = 0; j < selectedLines.last; j++) {
								if (haversine(steps[num].path[i].jb, steps[num].path[i].kb, selectedLines.array[j].Y, selectedLines.array[j].X, radius)) {
									selectedLines.swap(j);
								}

							}

						}
						// console.log("total found " + selectedLines.length + " " + selectedLines.last);
					}


					selectedLines.totalCrimes = selectedLines.array.length - selectedLines.last;
					// console.log("total crimes is " + selectedLines.totalCrimes);
				}
				routeCrimePts[routeNum] = selectedLines;
	

			});

		} else {
			clearOverlays(); 
			updateRouteRenderer(start, end, routeNum);
		}

	}

	function createMark(lat, lng) {

		var marker = new google.maps.Marker({
			map: map,
			position: new google.maps.LatLng(lat, lng),
			zIndex: 1
		});
		markersArray.push(marker);
		return marker;

	}

	function createMarker(data) {

		var markers = [];
		for (var i = 0; i < data.length; i++) {
			var marker = new google.maps.Marker({
				map: map,
				position: new google.maps.LatLng(data[i].Y, data[i].X),
				zIndex: 1
			});
			markers.push(marker);
			
		};
		var mcOptions = {
			gridSize: 200,
			maxZoom: 20
		};
		var markerCluster = new MarkerClusterer(map, markers, mcOptions);

		// yourMarker();
	}

	function yourMarker(lat, lng) {
		var marker = new google.maps.Marker({
			map: map,
			position: new google.maps.LatLng(lat, lng),
			zIndex: 1
		});

		google.maps.event.addListener(marker, 'click', function() {
			if (infowindow) infowindow.close();
			infowindow = new google.maps.InfoWindow({
				content: generateInfo(),
				maxWidth: 310
			});
			infowindow.open(map, marker);
		});

	}

	function codeAddress(place) {

		var address = place;

		geocoder.geocode({
			'address': address
		}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				map.setCenter(results[0].geometry.location);
				var marker = new google.maps.Marker({
					map: map,
					position: results[0].geometry.location
				});
			} else {
				alert("Geocode was not successful for the following reason: " + status);
			}
		});
	}

	function generateInfo() {
		text = '<div class="marker">';
		text += '<p> This is you! </p>';
		text += '</div>';
		return text;
	}

	function haversine(nlat, nlong, mlat, mlong, distance) {

		var R = 6371; // radius of earth in km
		var distances = [];
		var closest = -1;
		var dLat = rad(mlat - nlat);
		var dLong = rad(mlong - nlong);
		var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(nlat)) * Math.cos(rad(nlat)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		var d = R * c;
		if (d < distance) {
			return 1;
		} else {
			return 0;
		}
	}

	function rad(x) {
		return x * Math.PI / 180;
	}



	function clearOverlays() {

		var size = markersArray.length;
		for (var i = 0; i < size; i++) {
			console.log(1);
			var marker = markersArray.pop();
			marker.setMap(null);
		}
		
		var clustersize = clusterArray.length;
		for (var i = 0; i < clustersize; i++) {
			var cluster = clusterArray.pop();
			cluster.clearMarkers();
		};
	}

$(document).delegate('#page3', 'pageinit', function(){
	
	load();
});
