var expect = require('chai').expect;

var StorageApi = require('../lib/storage.js');

describe('storage api', function () {

  var api;
  beforeEach(function () {
    api = new StorageApi();
  });

  describe('organisations', function () {

    it('should create and query organisation', function () {
      api.createOrganisation('foo');
      expect(api.hasOrganisation('foo')).to.be.true;
    });

  });

  describe('data events', function () {

    it('should allow creating data events and add id if not provided', function () {
      api.createOrganisation('foo');
      var data = api.createData('foo', {
        type: 'size',
        value: 5
      });

      expect(data.type).to.equal('size');
      expect(data.value).to.equal(5);
      expect(data._id).to.equal(1);
    });
  });

  describe('graphs', function () {

    it('should build data for an added graph', function () {

      api.createOrganisation('foo');
      api.createData('foo', {
        "type": "size",
        "standard": 100,
        "min": 40,
        "gzip": 10,
        "buildNo": 37
      });
      api.createData('foo', {
        "type": "size",
        "standard": 110,
        "min": 45,
        "gzip": 11,
        "buildNo": 38
      });
      api.createData('foo', {
        "type": "size",
        "standard": 120,
        "min": 46,
        "gzip": 12,
        "buildNo": 39
      });

      api.createGraph('foo', 'size', {
        filter: {
          type: 'size'
        },
        series: [{x: 'buildNo', y: 'standard'}, {x: 'buildNo', y: 'min'}, {x: 'buildNo', y: 'gzip'}]
      });


      var graphData = api.getGraphData('foo', 'size');

      expect(graphData.xvalues).to.deep.equal([ [ 37, 38, 39 ], [ 37, 38, 39 ], [ 37, 38, 39 ] ]);
      expect(graphData.yvalues).to.deep.equal([ [ 100, 110, 120 ], [ 40, 45, 46 ], [ 10, 11, 12 ] ]);
    });
  });

});