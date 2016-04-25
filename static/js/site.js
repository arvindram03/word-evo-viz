fetchTextClassData();

function fetchTextClassData() {
  var word = "accident"
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      var chart = {
                "data":JSON.parse(xhttp.responseText),
                "selector":".scatter-text",
                "xAxisTitle":"newX",
                "yAxisTitle":"newY",
                "title":"Review Text Classification(+ve, -ve) using LSA with tf-idf",
              };
      // console.log(xhttp.responseText);
        drawScatter(chart);
    }
  };
  xhttp.open("GET", "/word?q="+word, true);
  xhttp.send();

}