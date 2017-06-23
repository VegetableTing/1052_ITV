$(document).ready(function() {
  var density = {
    "新北市": 398.2268,
	"高雄市": 277.8415,
	"臺中市": 277.5294,
	"臺北市": 269.0813,
	"桃園市": 216.3728,
	"臺南市": 188.6473,
	"彰化縣": 128.4785,
	"屏東縣": 83.2994,
	"雲林縣": 69.2818,
	"苗栗縣": 55.6638,
	"新竹縣": 54.9118,
	"嘉義縣": 51.3393,
	"南投縣": 50.3575,
	"宜蘭縣": 45.7133,
    "新竹市": 43.8863,
    "基隆市": 37.1981,
    "花蓮縣": 33.0139,
    "嘉義市": 26.9793,
    "臺東縣": 22.0191,
    "金門縣": 13.5535,
    "澎湖縣": 10.3434,    
    "連江縣": 1.2696    
  };
  d3.json("county.json", function(topodata) {
    var features = topojson.feature(topodata, topodata.objects.county).features;
	var color = d3.scale.linear().domain([0,400]).range(["#7FFFD4","#2F4F4F"]);
    //var color = d3.scale.linear().domain([0,10000]).range(["#090","#f00"]);
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
      d3.select("svg").selectAll("path").attr({
        "d": path,
        "fill": function (d) { return color(d.density); }
      }).on("mouseover", function(d) {
        $("#name").text(d.properties.C_Name);
        $("#density").text(d.density);

      });
    }
    /*d3.select("svg").on("mousemove", function() {
      fisheye.focus(d3.mouse(this));
      update();
    });*/
    update();
  });
});
