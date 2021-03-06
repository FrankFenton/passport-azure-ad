
# Microsoft Azure Active Directory Passport.js Plug-In
=============

_passport-azure-ad_ is a collection of [Passport](http://passportjs.org/) Strategies 
to help you integrate with Azure Active Directory. It includes OpenID Connect, 
WS-Federation, and SAML-P authentication and authorization. These providers let you 
integrate your Node app with Microsoft Azure AD so you can use its many features, 
including web single sign-on (WebSSO), Endpoint Protection with OAuth, and JWT token 
issuance and validation.

_passport-azure-ad_ has been tested to work with both [Microsoft Azure Active Directory](https://azure.microsoft.com/en-us/services/active-directory/) 
and with [Microsoft Active Directory Federation Services](http://en.wikipedia.org/wiki/Active_Directory_Federation_Services).

## Security Vulnerability in Versions < 1.4.6 and 2.0.0
_passport-azure-ad_ has a known security vulnerability affecting versions <1.4.6 and 2.0.0. Please update to >=1.4.6 or >=2.0.1 immediately. For more details, see the [security notice](https://github.com/AzureAD/passport-azure-ad/blob/master/SECURITY-NOTICE.MD).

## Versions
Current version - 3.0.0  
Minimum  recommended version - 1.4.6  
You can find the changes for each version in the [change log](https://github.com/AzureAD/passport-azure-ad/blob/master/CHANGELOG.md).

## Contribution History

[![Stories in Ready](https://badge.waffle.io/AzureAD/passport-azure-ad.png?label=ready&title=Ready)](https://waffle.io/AzureAD/passport-azure-ad)

[![Throughput Graph](https://graphs.waffle.io/AzureAD/passport-azure-ad/throughput.svg)](https://waffle.io/AzureAD/passport-azure-ad/metrics)

## Installation

    $ npm install passport-azure-ad

## Usage

### Configure strategy

This sample uses the OAuth2Bearer Strategy:

```javascript

// We pass these options in to the ODICBearerStrategy.

var options = {
  identityMetadata: config.creds.identityMetadata,
  clientID: config.creds.clientID,
  validateIssuer: config.creds.validateIssuer,
  issuer: config.creds.issuer,
  passReqToCallback: config.creds.passReqToCallback,
  isB2C: config.creds.isB2C,
  policyName: config.creds.policyName,
  allowMultiAudiencesInToken: config.creds.allowMultiAudiencesInToken,
  audience: config.creds.audience,
  loggingLevel: config.creds.loggingLevel,
};

var bearerStrategy = new BearerStrategy(options,
  function(token, done) {
    log.info('verifying the user');
    log.info(token, 'was the token retreived');
    findById(token.oid, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        // "Auto-registration"
        log.info('User was added automatically as they were new. Their oid is: ', token.oid);
        users.push(token);
        owner = token.oid;
        return done(null, token);
      }
      owner = token.oid;
      return done(null, user, token);
    });
  }
);
```
This sample uses the OIDCStrategy:

```javascript
passport.use(new OIDCStrategy({
    identityMetadata: config.creds.identityMetadata,
    clientID: config.creds.clientID,
    responseType: config.creds.responseType,
    responseMode: config.creds.responseMode,
    redirectUrl: config.creds.redirectUrl,
    allowHttpForRedirectUrl: config.creds.allowHttpForRedirectUrl,
    clientSecret: config.creds.clientSecret,
    validateIssuer: config.creds.validateIssuer,
    isB2C: config.creds.isB2C,
    issuer: config.creds.issuer,
    passReqToCallback: config.creds.passReqToCallback,
    scope: config.creds.scope,
    loggingLevel: config.creds.loggingLevel,
    nonceLifetime: config.creds.nonceLifetime,
  },
  function(iss, sub, profile, accessToken, refreshToken, done) {
    if (!profile.oid) {
      return done(new Error("No oid found"), null);
    }
    // asynchronous verification, for effect...
    process.nextTick(function () {
      findByOid(profile.oid, function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          // "Auto-registration"
          users.push(profile);
          return done(null, profile);
        }
        return done(null, user);
      });
    });
  }
));
```

### Provide the authentication callback for OIDCStrategy

To complete the sample, provide a route that corresponds to the path 
configuration parameter that is sent to the strategy:

```javascript

app.get('/login', 
  passport.authenticate('azuread-openidconnect', { failureRedirect: '/' }),
  function(req, res) {
    log.info('Login was called in the Sample');
    res.redirect('/');
});

// POST /auth/openid/return
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   home page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.post('/auth/openid/return',
  passport.authenticate('azuread-openidconnect', { failureRedirect: '/' }),
  function(req, res) {
    
    res.redirect('/');
  });

  app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

```

### Options available for `passport.authenticate`

#### OIDCStrategy

* `failureRedirect`: the url redirected to when the authentication fails

* `session`: if you don't want a persistent login session, you can use `session: false`

* `customState`: if you want to use a custom state value instead of a random generated one

* `resourceURL`: if you need access_token for some resource. Note this option is only for v1 endpoint and `code`, `code id_token`, `id_token code` flow. For v2 endpoint, resource is considered as a scope, so it should be specified in the `scope` field when you create
the strategy.

Example:

```
  passport.authenticate('azuread-openidconnect', { failureRedirect: '/', session: false, customState: 'my_state', resourceURL: 'https://graph.microsoft.com/mail.send'});
```

#### BearerStrategy

* `session`: if you don't want a persistent login session, you can use `session: false`

Example:

```
  passport.authenticate('oauth-bearer', { session: false });
```

## Test

In the library root folder, type the following command to install the dependency packages:

```
    $ npm install
```

Then type the following command to run tests:

```
    $ npm test
```

Tests will run automatically and in the terminal you can see how many tests are passing/failing. More details can be found [here](https://github.com/AzureAD/passport-azure-ad/blob/master/contributing.md).

## Samples and Documentation

[We provide a full suite of sample applications and documentation on GitHub](https://azure.microsoft.com/en-us/documentation/samples/?service=active-directory) 
to help you get started with learning the Azure Identity system. This includes 
tutorials for native clients such as Windows, Windows Phone, iOS, OSX, Android, 
and Linux. We also provide full walkthroughs for authentication flows such as 
OAuth2, OpenID Connect, Graph API, and other awesome features. 

Azure Identity samples for this plug-in can be found in the following links:

### Samples for [OpenID connect strategy](https://github.com/AzureAD/passport-azure-ad/blob/master/lib/oidcstrategy.js)

* [sample using v1 endpoint](https://github.com/AzureADQuickStarts/WebApp-OpenIDConnect-NodeJS)

* [sample using v2 endpoint](https://github.com/AzureADQuickStarts/AppModelv2-WebApp-OpenIDConnect-nodejs)

* [sample using B2C tenant](https://github.com/AzureADQuickStarts/B2C-WebApp-OpenIDConnect-NodeJS)

### Samples for [Bearer strategy](https://github.com/AzureAD/passport-azure-ad/blob/master/lib/bearerstrategy.js)

* [sample using v1 endpoint](https://github.com/AzureADQuickStarts/WebAPI-Bearer-NodeJS)

* [sample using v2 endpoint](https://github.com/AzureADQuickStarts/AppModelv2-WebAPI-nodejs)

* [sample using B2C tenant](https://github.com/AzureADQuickStarts/B2C-WebApi-Nodejs)

## Community Help and Support

We leverage [Stack Overflow](http://stackoverflow.com/) to work with the community on supporting Azure Active Directory and its SDKs, including this one. We highly recommend you ask your questions on Stack Overflow (we're all on there!) Also browser existing issues to see if someone has had your question before. 

We recommend you use the "adal" tag so we can see it! Here is the latest Q&A on Stack Overflow for ADAL: [http://stackoverflow.com/questions/tagged/adal](http://stackoverflow.com/questions/tagged/adal)

## Security Reporting

If you find a security issue with our libraries or services please report it to [secure@microsoft.com](mailto:secure@microsoft.com) with as much detail as possible. Your submission may be eligible for a bounty through the [Microsoft Bounty](http://aka.ms/bugbounty) program. Please do not post security issues to GitHub Issues or any other public site. We will contact you shortly upon receiving the information. We encourage you to get notifications of when security incidents occur by visiting [this page](https://technet.microsoft.com/en-us/security/dd252948) and subscribing to Security Advisory Alerts.

## Contributing

All code is licensed under the MIT license and we triage actively on GitHub. We enthusiastically welcome contributions and feedback. You can clone the repo and start contributing now. 

More details [about contribution](https://github.com/AzureAD/passport-azure-ad/blob/master/contributing.md) 

## Versions
Please check the releases for updates.

## Acknowledgements

The code is based on Henri Bergius's [passport-saml](https://github.com/bergie/passport-saml) library and Matias Woloski's [passport-wsfed-saml2](https://github.com/auth0/passport-wsfed-saml2) library as well as Kiyofumi Kondoh's [passport-openid-google](https://github.com/kkkon/passport-google-openidconnect).

## License
Copyright (c) Microsoft Corp.  All rights reserved. Licensed under the MIT License;

## We Value and Adhere to the Microsoft Open Source Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
