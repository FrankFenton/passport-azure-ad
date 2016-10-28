/**
 * Copyright (c) Microsoft Corporation
 *  All Rights Reserved
 *  MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the 'Software'), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
 * OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT
 * OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

'use strict';

module.exports = function(strategyOptions, authenicateOptions, verifyFuncNumber) {
  var express = require('express');
  var cookieParser = require('cookie-parser');
  var expressSession = require('express-session');
  var bodyParser = require('body-parser');
  var methodOverride = require('method-override');
  var passport = require('passport');
  var OIDCStrategy = require('../../../../lib/index').OIDCStrategy;

  var users = []; 
  var findByOid = function(oid, fn) {
    for (var i = 0, len = users.length; i < len; i++) {
      var user = users[i];
      if (user.oid === oid)
        return fn(null, user);
    }
    return fn(null, null);
  };


  var fun = (profile, done) => {
    if (!profile.oid)
      return done(new Error('No oid found'));
    findByOid(profile.oid, (err, user) => {
      if (err)
        return done(err);
      if (!user) {
        users.push(profile);
        return done(null, profile);
      }
      return done(null, user);
    })
  };

  var strategy = new OIDCStrategy(strategyOptions, fun);
  passport.use(strategy);
  passport.serializeUser(function(user, done) { done(null, user.oid); });
  passport.deserializeUser(function(oid, done) {
    findByOid(oid, function (err, user) {
      done(err, user);
    });
  });

  var app = express();

  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.logger());
  app.use(methodOverride());
  app.use(cookieParser());
  app.use(expressSession({ secret: 'keyboard cat', resave: true, saveUninitialized: false }));
  app.use(bodyParser.urlencoded({ extended : true }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/../../public'));

  app.get('/', function(req, res) {
    res.render('index', { user: req.user });
  });

  app.get('/result', function(req, res) {
    res.render('result', { user: req.user });
  });

  app.get('/login',
    passport.authenticate('azuread-openidconnect', { resourceURL: null, customState: null, failureRedirect: '/result' }),
    function(req, res) {
      res.redirect('/result');
  });

  app.get('/auth/openid/return',
    passport.authenticate('azuread-openidconnect', { failureRedirect: '/result' }),
    function(req, res) {
      res.redirect('/result');
    });

  app.post('/auth/openid/return',
    passport.authenticate('azuread-openidconnect', { failureRedirect: '/result' }),
    function(req, res) {
      res.redirect('/result');
    });

  var server = app.listen(3000);
  return server;
};

