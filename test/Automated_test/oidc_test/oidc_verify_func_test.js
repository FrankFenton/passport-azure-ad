
// Set up selenium webdriver and chromedriver
var webdriver = require('selenium-webdriver');
var By = require('selenium-webdriver').By;
var until = require('selenium-webdriver').until;
var chrome = require('selenium-webdriver/chrome');
var path = require('chromedriver').path;
var service = new chrome.ServiceBuilder(path).build();
chrome.setDefaultService(service);

// config files
var config_template = {
  identityMetadata: 'https://login.microsoftonline.com/sijun.onmicrosoft.com/.well-known/openid-configuration', 
  clientID: '683ead13-3193-43f0-9677-d727c25a588f',
  responseType: 'code id_token', 
  responseMode: 'form_post', 
  redirectUrl: 'http://localhost:3000/auth/openid/return', 
  allowHttpForRedirectUrl: true,
  clientSecret: 'X8TynX/Jo06ZepNFgLNvwCu9gYK/HRj1sJn+P96spDw=', 
  validateIssuer: true,
  issuer: ['https://sts.windows.net/268da1a1-9db4-48b9-b1fe-683250ba90cc/'],
  passReqToCallback: false,
  scope: null,
  loggingLevel: null,
  nonceLifetime: null,
};

// hybrid flow config with 'code id_token'
var hybrid_config = config_template;

// hybrid flow config with 'id_token code'
var hybrid_config_alternative = JSON.parse(JSON.stringify(config_template));
hybrid_config_alternative.responseType = 'id_token code';

// hybrid flow config with 'id_token code'
var hybrid_config_passReqToCallback = JSON.parse(JSON.stringify(config_template));
hybrid_config_passReqToCallback.passReqToCallback = true;

// authorization flow config
var code_config = JSON.parse(JSON.stringify(config_template));
code_config.responseType = 'code';

// implicit flow config with 'id_token
var implicit_config = JSON.parse(JSON.stringify(config_template));
implicit_config.responseType = 'id_token';

// set up chai testing tool
var chai = require('chai');
var expect = chai.expect;

const TEST_TIMEOUT = 30000; // 30 seconds
const LOGIN_WAITING_TIME = 1000; // 1 second

var stopService = (done) => {
  service.stop();
  done();
}; 

var checkCorrectResult = (driver, server, arity, done) => {
  driver.get('http://localhost:3000/login')
  //.then(() => { driver.findElement(By.xpath('/html/body/p/a')).click(); })
  .then(() => { 
    var usernamebox = driver.findElement(By.name('login'));
    usernamebox.sendKeys('robot@sijun.onmicrosoft.com');
    var passwordbox = driver.findElement(By.name('passwd'));
    passwordbox.sendKeys('Tmp123456');
    setTimeout(() => {
      passwordbox.sendKeys(webdriver.Key.ENTER);
    }, LOGIN_WAITING_TIME);
  })
  .then(() => {
    driver.wait(until.titleIs('result'), 10000);
    driver.findElement(By.id('status')).getText().then((text) => { 
      expect(text).to.equal('succeeded');
    });
    driver.findElement(By.id('sub')).getText().then((text) => { 
      expect(text).to.equal('J6hslv5qvTNd3LnvPC9rAK2rwqzhe4XVbAo7nCBizdo');
    });
    driver.findElement(By.id('upn')).getText().then((text) => {
      // arity 3 means we are using function(iss, sub, done), so there is no profile.displayName
      if (arity !== 3) 
        expect(text).to.equal('robot@sijun.onmicrosoft.com');
      else
        expect(text).to.equal('none');
    });
    driver.findElement(By.id('access_token')).getText().then((text) => { 
      if (arity >= 6)
        expect(text).to.equal('exists');
      else
        expect(text).to.equal('none');
    });
    driver.findElement(By.id('refresh_token')).getText().then((text) => { 
      if (arity >= 6)
        expect(text).to.equal('exists');
      else
        expect(text).to.equal('none');
      driver.manage().deleteAllCookies();
      driver.quit();
      server.close(done); 
    });
  });
};

describe('oidc v1 positive test', function() {
  this.timeout(TEST_TIMEOUT);

  /****************************************************************************
   *  Test the verify function where passReqToCallback is false
   *  We are using the hybrid flow
   ***************************************************************************/

  it('should succeed with arity 8 for verify function', function(done) {
    var arity = 8;
    var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
    var server = require('./app/app')(hybrid_config, {}, arity);
    checkCorrectResult(driver, server, arity, done);
  });

  it('should succeed with arity 7 for verify function', function(done) {
    var arity = 7;
    var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
    var server = require('./app/app')(hybrid_config, {}, arity);
    checkCorrectResult(driver, server, arity, done);
  });

  it('should succeed with arity 6 for verify function', function(done) {
    var arity = 6;
    var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
    var server = require('./app/app')(hybrid_config, {}, arity);
    checkCorrectResult(driver, server, arity, done);
  }); 

  it('should succeed with arity 4 for verify function', function(done) {
    var arity = 4;
    var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
    var server = require('./app/app')(hybrid_config, {}, arity);
    checkCorrectResult(driver, server, arity, done);
  });

  it('should succeed with arity 3 for verify function', function(done) {
    var arity = 3;
    var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
    var server = require('./app/app')(hybrid_config, {}, arity);
    checkCorrectResult(driver, server, arity, done);
  });

  it('should succeed with arity 2 for verify function', function(done) {
    var arity = 2;
    var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
    var server = require('./app/app')(hybrid_config, {}, arity);
    checkCorrectResult(driver, server, arity, done);
  }); 

  /****************************************************************************
   *  Test the verify function where passReqToCallback is true
   *  We are using the hybrid flow
   ***************************************************************************/

  it('should succeed with arity 8 for verify function', function(done) {
    var arity = 8;
    var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
    var server = require('./app/app')(hybrid_config_passReqToCallback, {}, arity);
    checkCorrectResult(driver, server, arity, done);
  });

  it('should succeed with arity 7 for verify function', function(done) {
    var arity = 7;
    var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
    var server = require('./app/app')(hybrid_config_passReqToCallback, {}, arity);
    checkCorrectResult(driver, server, arity, done);
  });

  it('should succeed with arity 6 for verify function', function(done) {
    var arity = 6;
    var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
    var server = require('./app/app')(hybrid_config_passReqToCallback, {}, arity);
    checkCorrectResult(driver, server, arity, done);
  }); 

  it('should succeed with arity 4 for verify function', function(done) {
    var arity = 4;
    var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
    var server = require('./app/app')(hybrid_config_passReqToCallback, {}, arity);
    checkCorrectResult(driver, server, arity, done);
  });

  it('should succeed with arity 3 for verify function', function(done) {
    var arity = 3;
    var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
    var server = require('./app/app')(hybrid_config_passReqToCallback, {}, arity);
    checkCorrectResult(driver, server, arity, done);
  });

  it('should succeed with arity 2 for verify function', function(done) {
    var arity = 2;
    var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
    var server = require('./app/app')(hybrid_config_passReqToCallback, {}, arity);
    checkCorrectResult(driver, server, arity, done);
  }); 

  /****************************************************************************
   *  Test hybrid flow with 'id_token code'
   ***************************************************************************/

  it('should succeed', function(done) {
    var arity = 8;
    var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
    var server = require('./app/app')(hybrid_config_alternative, {}, arity);
    checkCorrectResult(driver, server, arity, done);
  }); 

  /****************************************************************************
   *  Test authorization code flow
   ***************************************************************************/

  it('should succeed', function(done) {
    var arity = 8;
    var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
    var server = require('./app/app')(code_config, {}, arity);
    checkCorrectResult(driver, server, arity, done);
  }); 

  /****************************************************************************
   *  Test implicit flow
   ***************************************************************************/

  it('should succeed', function(done) {
    var arity = 2;
    var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
    var server = require('./app/app')(implicit_config, {}, arity);
    checkCorrectResult(driver, server, arity, stopService(done));
  }); 

});
