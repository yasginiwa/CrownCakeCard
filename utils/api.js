const crypto = requirePlugin('Crypto');
var safeBase64 = require('../utils/safebase64.js')

var ticketGenUrl = 'http://192.168.10.20:27777/icapi/tmticket';
var ticketQueryUrl = 'http://192.168.10.20:27777/icapi/tmticketquery';
var registryUrl = 'http://192.168.10.214:18000/registry';
var loginUrl = 'http://192.168.10.214:18000/login';
var authUrl = 'http://192.168.10.214:18000/auth';
var authupdateUrl = 'http://192.168.10.214:18000/authupdate';
var queryauthUrl = 'http://192.168.10.214:18000/queryauth';
var token = 'HGCakeECSell';
var appKey = 'SEdDYWtlT3JkZXJBbmRTZWxsMjAxOA==';
var signKey = 'BPe2XMzYP6UydzAuWiPuthAWVrMWkbmC';

/**
 * 返回加盐后签名
 */
var sign = function (content) {
  return new crypto.MD5(signKey + 'token' + token + 'content' + JSON.stringify(content) + signKey).toString()
}

//  AppKey从base64还原为字符串
var appKeyStr = crypto.Utf8.stringify(crypto.Base64.parse(appKey));
appKeyStr = appKeyStr.substring(0, 16);

var options = {
  mode: crypto.Mode.ECB,
  padding: crypto.Padding.Pkcs7
}

/**
 * AES加密
 */
var encryptContent = function (content) {
  var encContent = (new crypto.AES().encrypt(crypto.Utf8.parse(JSON.stringify(content)), crypto.Utf8.parse(appKeyStr), options)).toString();

  return encContent;
}

/**
 * AES解密
 */
var decryptContent = function (content) {
  var decContent = (new crypto.AES().decrypt(safeBase64.decode(content), crypto.Utf8.parse(appKeyStr), options));
  return JSON.parse(crypto.Utf8.stringify(decContent));
}

module.exports = {
  token: token,
  sign: sign,
  ticketGenUrl: ticketGenUrl,
  ticketQueryUrl: ticketQueryUrl,
  registryUrl: registryUrl,
  loginUrl: loginUrl,
  authUrl: authUrl,
  queryauthUrl: queryauthUrl,
  authupdateUrl: authupdateUrl,
  encryptContent: encryptContent,
  decryptContent: decryptContent
};