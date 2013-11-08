var server = require('../lib/unhangout-server'),
	should = require('should'),
	_ = require('underscore')._,
	request = require('superagent'),
    common = require('./common');

var sock;
var session;

describe('HTTP ADMIN API', function() {
	afterEach(common.standardShutdown);

	describe('/admin/event/new (non-admin)', function() {
		beforeEach(common.mockSetup(false));
		it('should reject well-formed requests from non-admins', function(done) {
			request.post('http://localhost:7777/admin/event/new')
				.send({title:"Test Event", description:"Description of the test event."})
				.redirects(0)
				.end(function(res) {
					res.status.should.equal(302);
					res.header['location'].should.equal("/");
					done();
				});
		});
	});

	describe('/admin/event/new (admin)', function() {
		beforeEach(common.mockSetup(true));

		it('should accept well-formed creation request from admin', function(done) {
			request.post('http://localhost:7777/admin/event/new')
				.send({title:"Test Event", description:"Description of the test event."})
				.redirects(0)
				.end(function(res) {
					res.status.should.equal(302);
                    var evt = common.server.events.at(common.server.events.length-1);
                    evt.get("title").should.equal("Test Event");
                    evt.get("description").should.equal("Description of the test event.");

					res.header['location'].should.equal("/admin");

					done();
				});
		});

		it('should reject requests that are missing required parameters', function(done) {
			// title is missing
			request.post('http://localhost:7777/admin/event/new')
				.send({description:"Description of the test event."})
				.redirects(0)
				.end(function(res) {
					res.status.should.equal(400);
					done();
				});
		});

		it('should redirect to /admin/ on successful creation', function(done) {
			request.post('http://localhost:7777/admin/event/new')
				.send({title:"Test Event", description:"Description of the test event."})
				.redirects(0)
				.end(function(res) {
					res.status.should.equal(302);
					res.header['location'].should.equal("/admin");
					done();
				});
		});
	});

	describe('/admin/event/:id (non-admin)', function() {
		beforeEach(common.mockSetup(false));

		it('should reject well-formed requests from non-admins', function(done) {
			request.post('http://localhost:7777/admin/event/1')
				.send({title:"Test Event", description:"Description of the test event."})
				.redirects(0)
				.end(function(res) {
					res.status.should.equal(302);
					res.header['location'].should.equal("/");
					done();
				});
		});
	});

	describe('/admin/event/:id (admin)', function() {
		beforeEach(common.mockSetup(true));

		it('should accept well-formed creation request from admin', function(done) {
			request.post('http://localhost:7777/admin/event/1')
				.send({title:"Test Event", description:"Description of the test event."})
				.redirects(0)
				.end(function(res) {
					res.status.should.equal(302);
                    var evt = common.server.events.at(0);
                    evt.get("title").should.equal("Test Event");
                    evt.get("description").should.equal("Description of the test event.");
					done();
				});
		});

		it('should redirect to /admin/event/:id on successful creation', function(done) {
			request.post('http://localhost:7777/admin/event/1')
				.send({title:"Test Event", description:"Description of the test event."})
				.redirects(0)
				.end(function(res) {
					res.status.should.equal(302);
					res.header['location'].should.equal("/admin/event/1");
					done();
				});
		});
	});
});
