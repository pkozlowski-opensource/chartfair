var express = require('express');
var bodyParser = require('body-parser');

//http://g.raphaeljs.com/
var gRaphael = require('node-g.raphael');
var jsdom = require('jsdom').jsdom;

var storageApi = new (require('./lib/storage.js'))();

var doc = jsdom('');
gRaphael.setWindow(doc.createWindow());

//TODO: allow setting output graph size
var paper = gRaphael(0, 0, 600, 300);

//fake data container - to be replaced with a real DB
var data = {};

var app = express();
var port = process.env.PORT || 8080;

var router = express.Router();

router.get('/:account/graph', function (req, res) {
  var graphData = storageApi.getGraphData(req.params.account, {
    filter: {
      type: 'size'
    },
    series: [
      {x: 'buildNo', y: 'standard'},
      {x: 'buildNo', y: 'min'},
      {x: 'buildNo', y: 'gzip'}
    ]
  });

  //TODO: I'm not sure at all if we can simply reuse the SVG container like this....
  paper.clear();

  paper.linechart(15, 15, 570, 270, graphData.xvalues, graphData.yvalues, {
    smooth: true
  });

  //finally send svg
  res.set('Content-Type', 'image/svg+xml');
  res.send(doc.body.firstChild.outerHTML);
});

router.post('/:account/data', function (req, res) {
  res.json(storageApi.createData(req.params.account, req.body));
});

router.post('/:account', function (req, res) {
  storageApi.createOrganisation(req.params.account);
  res.send(200);
});

//TODO: woooops, this is not good at all :-)
router.get('/:account', function (req, res) {
  res.json(storageApi.getOrganisations());
});


app.use(bodyParser());
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
