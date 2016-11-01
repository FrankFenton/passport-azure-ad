
// Set up selenium webdriver and chromedriver
var webdriver = require('selenium-webdriver');
var By = require('selenium-webdriver').By;
var until = require('selenium-webdriver').until;
var chrome = require('selenium-webdriver/chrome');
var path = require('chromedriver').path;
var service = new chrome.ServiceBuilder(path).build();
chrome.setDefaultService(service);

// set up chai testing tool
var chai = require('chai');
var expect = chai.expect;

const TEST_TIMEOUT = 30000; // 30 seconds
const LOGIN_WAITING_TIME = 500; // 0.5 second

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

  it('should succeed with arity 8 for verify function', function(done) {
    var arity = 8;
    var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
    var server = require('./app/app')(require('./config_files/oidc_v1_config').creds, {}, arity);
    checkCorrectResult(driver, server, arity, done);
  });

  it('should succeed with arity 7 for verify function', function(done) {
    var arity = 7;
    var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
    var server = require('./app/app')(require('./config_files/oidc_v1_config').creds, {}, arity);
    checkCorrectResult(driver, server, arity, done);
  });

  it('should succeed with arity 6 for verify function', function(done) {
    var arity = 6;
    var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
    var server = require('./app/app')(require('./config_files/oidc_v1_config').creds, {}, arity);
    checkCorrectResult(driver, server, arity, done);
  }); 

  it('should succeed with arity 4 for verify function', function(done) {
    var arity = 4;
    var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
    var server = require('./app/app')(require('./config_files/oidc_v1_config').creds, {}, arity);
    checkCorrectResult(driver, server, arity, done);
  });

  it('should succeed with arity 3 for verify function', function(done) {
    var arity = 3;
    var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
    var server = require('./app/app')(require('./config_files/oidc_v1_config').creds, {}, arity);
    checkCorrectResult(driver, server, arity, done);
  });

  it('should succeed with arity 2 for verify function', function(done) {
    var arity = 2;
    var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
    var server = require('./app/app')(require('./config_files/oidc_v1_config').creds, {}, arity);
    checkCorrectResult(driver, server, arity, done);
  }); 

  it('should succeed with arity 8 for verify function', function(done) {
    var arity = 8;
    var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
    var server = require('./app/app')(require('./config_files/oidc_v1_config_with_passReqToCallback').creds, {}, arity);
    checkCorrectResult(driver, server, arity, done);
  });

  it('should succeed with arity 7 for verify function', function(done) {
    var arity = 7;
    var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
    var server = require('./app/app')(require('./config_files/oidc_v1_config_with_passReqToCallback').creds, {}, arity);
    checkCorrectResult(driver, server, arity, done);
  });

  it('should succeed with arity 6 for verify function', function(done) {
    var arity = 6;
    var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
    var server = require('./app/app')(require('./config_files/oidc_v1_config_with_passReqToCallback').creds, {}, arity);
    checkCorrectResult(driver, server, arity, done);
  }); 

  it('should succeed with arity 4 for verify function', function(done) {
    var arity = 4;
    var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
    var server = require('./app/app')(require('./config_files/oidc_v1_config_with_passReqToCallback').creds, {}, arity);
    checkCorrectResult(driver, server, arity, done);
  });

  it('should succeed with arity 3 for verify function', function(done) {
    var arity = 3;
    var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
    var server = require('./app/app')(require('./config_files/oidc_v1_config_with_passReqToCallback').creds, {}, arity);
    checkCorrectResult(driver, server, arity, done);
  });

  it('should succeed with arity 2 for verify function', function(done) {
    var arity = 2;
    var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
    var server = require('./app/app')(require('./config_files/oidc_v1_config_with_passReqToCallback').creds, {}, arity);
    checkCorrectResult(driver, server, arity, stopService(done));
  }); 
});
