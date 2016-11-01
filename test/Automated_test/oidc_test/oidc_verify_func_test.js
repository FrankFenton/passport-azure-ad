
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
const LOGIN_WAITING_TIME = 1000; // 1 second

describe('oidc v1 positive test', function() {
  this.timeout(TEST_TIMEOUT);

  it('should succeed', function(done) {
    var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
    var server = require('./app/app')(require('./config_files/oidc_v1_config').creds, {}, 8);

    driver.get('http://localhost:3000')
    .then(() => { driver.findElement(By.xpath('/html/body/p/a')).click(); })
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
      driver.findElement(By.id('iss')).getText().then((text) => { 
        expect(text).to.equal('https://sts.windows.net/268da1a1-9db4-48b9-b1fe-683250ba90cc/');
      });
      driver.findElement(By.id('displayName')).getText().then((text) => { 
        expect(text).to.equal('robot 1');
      });
      driver.findElement(By.id('access_token')).getText().then((text) => { 
        expect(text).to.equal('exists');
      });
      driver.findElement(By.id('refresh_token')).getText().then((text) => { 
        expect(text).to.equal('exists');
        driver.quit();
        server.close(done); 
      });
    });
  });
});
