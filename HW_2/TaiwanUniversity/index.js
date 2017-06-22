$(document).ready(function() {
  var density = {
    "新北市": 7,
	"高雄市": 10,
	"臺中市": 9,
	"臺北市": 19,
	"桃園市": 8,
	"臺南市": 8,
	"彰化縣": 3,
	"屏東縣": 1,
	"雲林縣": 0,
	"苗栗縣": 1,
	"新竹縣": 0,
	"嘉義縣": 5,
	"南投縣": 1,
	"宜蘭縣": 3,
    "新竹市": 5,
    "基隆市": 1,
    "花蓮縣": 3,
    "嘉義市": 1,
    "臺東縣": 1,
    "金門縣": 1,
    "澎湖縣": 0,    
    "連江縣": 0     
  };
  d3.json("county.json", function(topodata) {
    var features = topojson.feature(topodata, topodata.objects.county).features;
	var color = d3.scale.linear().domain([0,19]).range(["#FFFF77","#FF3333"]);
    
    var fisheye = d3.fisheye.circular().radius(100).distortion(2);
    var prj = function(v) {
      var ret = d3.geo.mercator().center([122,23.25]).scale(6000)(v);
      var ret = fisheye({x:ret[0],y:ret[1]});
      return [ret.x, ret.y];
    };
    var path = d3.geo.path().projection(prj);
    for(idx=features.length - 1;idx>=0;idx--) features[idx].density = density[features[idx].properties.C_Name];
    d3.select("svg").selectAll("path").data(features).enter().append("path");
    function update() {
		d3.select("svg").selectAll("path")
		.attr("stroke", "black")
        .attr("stroke-width", 0.5)
		.attr({
			"d": path,
			"fill": function (d) { return color(d.density); }
		})
		.on("mouseover", function(d) {
			$("#name").text(d.properties.C_Name);
			$("#density").text(d.density);	
			//$(this).css("stroke","red")
			$(this).css("stroke-width","2")
			d3.select(this)
				.attr("fill", "#AAAAAA");
			
		})
		.on("mouseout",function(d) {
			//$(this).css("stroke","black")
			$(this).css("stroke-width", 0.5)
			 d3.select(this)
                .attr("fill", function (d) {
                return color(d.density);
             });
		});
    }

    update();
  });
});
