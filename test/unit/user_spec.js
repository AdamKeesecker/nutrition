/* global describe, it, before, beforeEach */
/* jshint expr:true */

'use strict';

process.env.DBNAME = 'todo-test';

var expect = require('chai').expect;
var Mongo = require('mongodb');
var app = require('../../app/app');
var request = require('supertest');
var traceur = require('traceur');

var User;
var sue;

describe('User', function(){
  before(function(done){
    request(app)
    .get('/')
    .end(function(){
      User = traceur.require(__dirname + '/../../app/models/user.js');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.collection('users').drop(function(){
      User.register({email:'sue@aol.com', password:'abcd'}, function(u){
        sue = u;
        console.log(u);
        done();
      });
    });
  });

  describe('.register', function(){
    it('should successfully register a user', function(done){
      User.register({email:'bob@aol.com', password:'1234'}, function(u){
        expect(u).to.be.ok;
        expect(u).to.be.an.instanceof(User);
        expect(u._id).to.be.an.instanceof(Mongo.ObjectID);
        expect(u.password).to.have.length(60);
        done();
      });
    });

    it('should NOT successfully register a user', function(done){
      User.register({email:'sue@aol.com', password:'does not matter'}, function(u){
        expect(u).to.be.null;
        done();
      });
    });
  });

  describe('.login', function(){
    it('should successfully login a user', function(done){
      User.login({email:'sue@aol.com', password:'abcd'}, function(u){
        expect(u).to.be.ok;
        done();
      });
    });

    it('should NOT login user - bad email', function(done){
      User.login({email:'wrong@aol.com', password:'abcd'}, function(u){
        expect(u).to.be.null;
        done();
      });
    });

    it('should NOT login user - bad password', function(done){
      User.login({email:'sue@aol.com', password:'wrong'}, function(u){
        expect(u).to.be.null;
        done();
      });
    });

    it('should return a user from a cookie Id', function(done){
      User.findByUserId(sue._id.toString(), function(u){
        expect(u).to.be.ok;
        expect(u).to.be.an.instanceof(User);
        expect(u._id).to.be.an.instanceof(Mongo.ObjectID);
        expect(u.password).to.have.length(60);
        done();
      });
    });

    it('should NOT return a user', function(done){
      User.findByUserId('123456789111', function(u){
        expect(u).to.be.null;
        done();
      });
    });
  });


  describe('.lookup', function(){
    it('should contain the userId in all pages', function(done){
      User.findByUserId(sue._id.toString(), function(u){
        expect(u._id.toString()).to.eql(sue._id.toString());
        done();
      });
    });
  });

  describe('#updateIntake', function(){
    it('should update the User obj with the intake array', function(done){
      User.findByUserId(sue._id.toString(), function(u){
        sue.intake = [{name:'chicken', calories:100, cholestoral:200, fiber:500, protien:4, sodium:200, sugar:150, carbs:20, fat:100000}];
        console.log(sue);
        done();
      });
    });
  });

});
