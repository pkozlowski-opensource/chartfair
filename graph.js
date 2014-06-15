var Raphael = require('node-g.raphael');
var jsdom = require('jsdom').jsdom;
var doc = jsdom('');

Raphael.setWindow(doc.createWindow());

var paper = Raphael(0, 0, 600, 300);
paper.clear();

paper.linechart(15, 15, 570, 270, [[0,1,2,3,4,5], [0,1,2,3,4,5]], [[1,3,9,16,12,10], [7,5,9,12,8,8.5]], {
  colors: ['#F00', '#00F'],
  smooth: true
});

var svg = doc.body.firstChild.outerHTML;
require('fs').writeFile('graph.svg', svg, function (err) {
  if (err) throw err;
  console.log('It\'s saved!');
});
