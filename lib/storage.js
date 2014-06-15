var _ = require('lodash');

var StorageApi = function () {
  this.idGenerator = 1;
  this.data = {};
  this.graphs = {};
};

StorageApi.prototype.createOrganisation = function (organisationName) {
  if (this.hasOrganisation(organisationName)) {
    throw new Error('Organisation "' + organisationName + '" already exists');
  }
  this.data[organisationName] = {};
  this.graphs[organisationName] = {};
};

StorageApi.prototype.hasOrganisation = function (organisationName) {
  return !!this.data[organisationName];
};

StorageApi.prototype.getOrganisations = function () {
  return _.keys(this.data);
};

StorageApi.prototype.createData = function(organisationName, data) {
  if (!data._id) {
    data._id = this.idGenerator++;
  }

  return this.data[organisationName][data._id] = data;
};

StorageApi.prototype.createGraph = function(organisationName, graphName, graphDetails) {
  this.graphs[organisationName][graphName] = graphDetails;
};

StorageApi.prototype.getGraphData = function(organisationName, graphNameOrDef) {

  var xvalues = [], yvalues = [];
  var graphDef = _.isString(graphNameOrDef) ? this.graphs[organisationName][graphName] : graphNameOrDef;

  var dataToGraph = _.filter(this.data[organisationName], graphDef.filter);

  for (var i = 0; i < graphDef.series.length; i++) {
    var seriesDef = graphDef.series[i];

    xvalues.push(_.pluck(dataToGraph, seriesDef.x));
    yvalues.push(_.pluck(dataToGraph, seriesDef.y));
  }

  return {
    xvalues: xvalues,
    yvalues: yvalues
  };
}

module.exports = StorageApi;