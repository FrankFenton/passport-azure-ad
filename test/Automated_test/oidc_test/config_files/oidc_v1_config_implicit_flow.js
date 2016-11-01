
exports.creds = {
  // Required
  identityMetadata: 'https://login.microsoftonline.com/sijun.onmicrosoft.com/.well-known/openid-configuration', 
  // or equivalently: 'https://login.microsoftonline.com/<tenant_guid>/.well-known/openid-configuration'
  //
  // or you can use the common endpoint
  // 'https://login.microsoftonline.com/common/.well-known/openid-configuration'
  // To use the common endpoint, you have to either set `validateIssuer` to false, or provide the `issuer` value.

  // Required, the client ID of your app in AAD  
  clientID: '683ead13-3193-43f0-9677-d727c25a588f',

  // Required, must be 'code', 'code id_token', 'id_token code' or 'id_token' 
  responseType: 'id_token', 

  // Required
  responseMode: 'form_post', 

  // Required, the reply URL registered in AAD for your app
  redirectUrl: 'http://localhost:3000/auth/openid/return', 

  // Required if we use http for redirectUrl
  allowHttpForRedirectUrl: true,
  
  // Required if `responseType` is 'code', 'id_token code' or 'code id_token'. 
  // If app key contains '\', replace it with '\\'.
  clientSecret: 'X8TynX/Jo06ZepNFgLNvwCu9gYK/HRj1sJn+P96spDw=', 

  // Required to set to false if you don't want to validate issuer
  validateIssuer: true,

  // Required if you want to provide the issuer(s) you want to validate instead of using the issuer from metadata
  issuer: ['https://sts.windows.net/268da1a1-9db4-48b9-b1fe-683250ba90cc/'],

  // Required to set to true if the `verify` function has 'req' as the first parameter
  passReqToCallback: false,

  // Optional. The additional scope you want besides 'openid', for example: ['email', 'profile'].
  scope: null,

  // Optional, 'error', 'warn' or 'info'
  loggingLevel: null,

  // Optional. The lifetime of nonce in session, the default value is 3600 (seconds).
  nonceLifetime: null,
};

// Optional.
// If we want to get access_token for a particular resource, you can specify the resource here.
// Note that 'responseType' should be 'code', 'code id_token' or 'id_token code'.
exports.resourceURL = 'https://graph.windows.net';