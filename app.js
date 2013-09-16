
/**
 * Simple server for returning data to the site ticket portal.
 * All data is simple test data. There is a single authenticated
 * user, larry. His password is: larry123
 */

/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/**
 * get tickets specific to the indicated project
 */
function getTickets(projectId) {
	var tickets;

	var p1tickets = [
				{"assignedWorkItem":{"assignedUserId":-1, "completed":false, "deleted":false, "endpointId":1, "projectId":1, "purchaseOrderNumber":"111", "scheduledDate":null, "shippingDataReceived":false, "status":20, "type":"installation" },
					"site":{"address1":"741 W. Aft", "address2":"", "altPhone":"", "brandKey":"FOO", "city":"KENSINGTON", "primaryPhone":"301-992-2212", "siteIdentifier":"89383", "state":"MD", "zip":"20895      "},
					"siteWorkItem":{"assignedUserId":-1, "completed":false, "deleted":false, "endpointId":1, "projectId":1, "purchaseOrderNumber":"111", "scheduledDate":null, "shippingDataReceived":false, "status":25, "type":"siteRollout" }},
				{"assignedWorkItem":{"assignedUserId":-1, "completed":false, "deleted":false, "endpointId":1, "projectId":1, "purchaseOrderNumber":"222", "scheduledDate":"\/Date(1380171600000-0500)\/", "shippingDataReceived":false, "status":20, "type":"survey" },
					"site":{"address1":"212 N. Brump", "address2":"", "altPhone":"", "brandKey":"FOO", "city":"FLINT", "primaryPhone":"890-249-9711", "siteIdentifier":"73828", "state":"MI", "zip":"48504-7161 "},
					"siteWorkItem":{"assignedUserId":-1, "completed":false, "deleted":false, "endpointId":1, "projectId":1, "purchaseOrderNumber":"222", "scheduledDate":null, "shippingDataReceived":false, "status":24, "type":"siteRollout" }},
				{"assignedWorkItem":null, "site":{"address1":"16 N. Reep Ave", "address2":"", "altPhone":"", "brandKey":"FOO", "city":"MEMPHIS", "primaryPhone":"991-945-0953", "siteIdentifier":"98022", "state":"TN", "zip":"38116-3518 "},
					"siteWorkItem":{"assignedUserId":-1, "completed":true, "deleted":false, "endpointId":1, "projectId":1, "purchaseOrderNumber":"333", "scheduledDate":null, "shippingDataReceived":true, "status":3, "type":"siteRollout" }},
				{"assignedWorkItem":{"assignedUserId":-1, "completed":false, "deleted":false, "endpointId":1, "projectId":1, "purchaseOrderNumber":"007", "scheduledDate":"\/Date(1378530000000-0500)\/", "shippingDataReceived":false, "status":21, "type":"survey" },
					"site":{"address1":"501 Warbly St", "address2":"", "altPhone":"", "brandKey":"FOO", "city":"OCEAN SPRINGS", "primaryPhone":"928-895-7894", "siteIdentifier":"78322", "state":"MS", "zip":"39564      "},
					"siteWorkItem":{"assignedUserId":-1, "completed":false, "deleted":false, "endpointId":1, "projectId":1, "purchaseOrderNumber":"007", "scheduledDate":null, "shippingDataReceived":false, "status":24, "type":"siteRollout" }}
			];

	var p2tickets = [
		{"assignedWorkItem":{"assignedUserId":-1, "completed":false, "deleted":false, "endpointId":1, "projectId":2, "purchaseOrderNumber":"111", "scheduledDate":null, "shippingDataReceived":false, "status":20, "type":"installation" },
					"site":{"address1":"741 W. Aft", "address2":"", "altPhone":"", "brandKey":"FOO", "city":"KENSINGTON", "primaryPhone":"301-992-2212", "siteIdentifier":"89383", "state":"MD", "zip":"20895      "},
					"siteWorkItem":{"assignedUserId":-1, "completed":false, "deleted":false, "endpointId":1, "projectId":2, "purchaseOrderNumber":"111", "scheduledDate":null, "shippingDataReceived":false, "status":25, "type":"siteRollout" }}
			];

	var p3tickets = [
		{"assignedWorkItem":null,
					"site":{"address1":"212 N. Brump", "address2":"", "altPhone":"", "brandKey":"FOO", "city":"FLINT", "primaryPhone":"890-249-9711", "siteIdentifier":"73828", "state":"MI", "zip":"48504-7161 "},
					"siteWorkItem":{"assignedUserId":-1, "completed":false, "deleted":false, "endpointId":2, "projectId":3, "purchaseOrderNumber":"222", "scheduledDate":null, "shippingDataReceived":false, "status":36, "type":"siteService" }},
		{"assignedWorkItem":null,
					"site":{"address1":"8990 Sleef Rd", "address2":"", "altPhone":"434-332-3433", "brandKey":"FOO", "city":"INDIANAPOLIS", "primaryPhone":"892-202-7238", "siteIdentifier":"30022", "state":"IN", "zip":"46203"},
					"siteWorkItem":{"assignedUserId":-1, "completed":false, "deleted":false, "endpointId":2, "projectId":3, "purchaseOrderNumber":"234243", "scheduledDate":null, "shippingDataReceived":false, "status":37, "type":"siteService" }}
	];

	if (projectId == 1) {
		tickets = p1tickets;
	}
	else if (projectId == 2) {
		tickets = p2tickets;
	}
	else if (projectId == 3) {
		tickets = p3tickets;
	}

	return tickets;
}

/**
 * given the brandKey and siteIdentifier, return the matching site detail object
 */
function getSite(brandKey, siteIdentifier) {
	var site;

	if (brandKey == 'FOO' && siteIdentifier == '89383') {
		site = {"address1":"741 W. Aft", "address2":"", "altPhone":"", "brandKey":"FOO", "city":"KENSINGTON", "primaryPhone":"301-992-2212", "siteIdentifier":"89383", "state":"MD", "zip":"20895      "};
	}
	else if (brandKey == 'FOO' && siteIdentifier == '73828') {
		site = {"address1":"212 N. Brump", "address2":"", "altPhone":"", "brandKey":"FOO", "city":"FLINT", "primaryPhone":"890-249-9711", "siteIdentifier":"73828", "state":"MI", "zip":"48504-7161 "};
	}
	else if (brandKey == 'FOO' && siteIdentifier == '98022') {
		site = {"address1":"16 N. Reep Ave", "address2":"", "altPhone":"", "brandKey":"FOO", "city":"MEMPHIS", "primaryPhone":"991-945-0953", "siteIdentifier":"98022", "state":"TN", "zip":"38116-3518 "};
	}
	else if (brandKey == 'FOO' && siteIdentifier == '78322') {
		site = {"address1":"501 Warbly St", "address2":"", "altPhone":"", "brandKey":"FOO", "city":"OCEAN SPRINGS", "primaryPhone":"928-895-7894", "siteIdentifier":"78322", "state":"MS", "zip":"39564      "};
	}
	else if (brandKey == 'FOO' && siteIdentifier == '30022') {
		site = {"address1":"8990 Sleef Rd", "address2":"", "altPhone":"434-332-3433", "brandKey":"FOO", "city":"INDIANAPOLIS", "primaryPhone":"892-202-7238", "siteIdentifier":"30022", "state":"IN", "zip":"46203"};
	}

	return site;
}

/**
 * determines if the request is authenticated. we're hardcoding the
 * credentials for one user: larry / larry123
 */
function checkAuth(req, res, next) {

	var headers = req.headers;
	var providedAuthString = headers['authorization'];
	var acceptedAuthString = 'Basic bGFycnk6bGFycnkxMjM=';

	if (providedAuthString != acceptedAuthString) {
		res.statusCode = 401;
		res.send("Not authorized");
	}
	else {
		next();
	}
}

/**
 * allow access from any host
 */
app.all('*', function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
	res.header('Access-Control-Allow-Headers', 'Authorization');

	next();
});

/**
 * REST endpoint for getting user object
 */
app.get('/services/user/:username', checkAuth, function (request, response) {
	var user = {"emailAddress":"larry@larry.com", "firstName":"Larry", "lastName":"McTim", "uniqueId":1, "userName":"larry"};
	response.send(user);
});

/**
 * REST endpoint for getting project list
 */
app.get('/services/project', checkAuth, function (request, response) {
	var projects = [
		{"endpointId":1, "name":"Green Onion Slicer", "status":6, "type":"rollout", "uniqueId":1},
		{"endpointId":1, "name":"Shake Machine 5000", "status":6, "type":"rollout", "uniqueId":2},
		{"endpointId":2, "name":"Midwest Fryer Panel Service", "status":6, "type":"serviceContract", "uniqueId":3}
		];

	response.send(projects);
});

/**
 * REST endpoint for getting tickets for a project
 */
app.get('/instances/:projectType/services/project/:projectId', checkAuth, function (req, res) {

	var projectId = req.params.projectId;

	var tickets = getTickets(projectId);

	res.send(tickets);
});

/**
 * REST endpoint for getting site details
 */
app.get('/services/sites', checkAuth, function (req, res) {

	// query params filter down list of all sites
	var brandKey = req.query.brand;
	var siteIdentifier = req.query.site;

	// for this simple server, we're filtering down
	// to a single site. we need to return that single site,
	// in an array.
	var site = getSite(brandKey, siteIdentifier);
	var result = [];
	result.push(site);

	res.send(result);
});

/**
 * REST endpoint for getting system endpoints
 */
app.get('/services/endpoint', checkAuth, function (request, response) {
	var endpoints = [
		{"defaultNamespace":"ticket.client.rollout", "host":"instances\/rollout", "name":"Rollout", "type":"rollout", "uniqueId":1},
		{"defaultNamespace":"ticket.client.service", "host":"instances\/service", "name":"Service", "type":"serviceContract", "uniqueId":2}
		];

	response.send(endpoints);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
