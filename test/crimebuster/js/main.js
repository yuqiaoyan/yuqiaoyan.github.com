function submit(){
	var start=$(".inputA").val();
	var end= $(".inputB").val();
	for (var i = 0; i < 3; i++) {
			calcRoute(start, end, i, true);
		};

}