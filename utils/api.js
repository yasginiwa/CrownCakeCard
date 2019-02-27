const crypto = requirePlugin('Crypto');
var safeBase64 = require('../utils/safebase64.js')

var host = 'http://192.168.0.172:18000';
var ticketGenUrl = `${host}/icapi/tmticket`,
  ticketQueryUrl = `${host}/icapi/tmticketquery`,
  getwxopenidUrl = `${host}/getwxopenid`,
  querywxopenidsUrl = `${host}/querywxopenids`,
  registryUrl = `${host}/registry`,
  loginUrl = `${host}/login`,
  authUrl = `${host}/auth`,
  authupdateUrl = `${host}/authupdate`,
  queryauthUrl = `${host}/queryauth`,
  authdelUrl = `${host}/authdel`,
  addticketUrl = `${host}/addticket`,
  ticketaddcountUrl = `${host}/ticketaddcount`,
  tickettotalcountUrl = `${host}/tickettotalcount`,
  ticketsUrl = `${host}/tickets`,
  updatedisributestatusUrl = `${host}/updatedistributestatus`,
  addexpectticketUrl = `${host}/addexpectticket`,
  expectunauthUrl = `${host}/expectunauth`,
  expectauthUrl = `${host}/expectauth`,
  token = 'HGCakeECSell',
  appKey = 'SEdDYWtlT3JkZXJBbmRTZWxsMjAxOA==',
  signKey = 'BPe2XMzYP6UydzAuWiPuthAWVrMWkbmC';

/**
 * 返回加盐后签名
 */
var sign = function(content) {
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
var encryptContent = function(content) {
  var encContent = (new crypto.AES().encrypt(crypto.Utf8.parse(JSON.stringify(content)), crypto.Utf8.parse(appKeyStr), options)).toString();

  return encContent;
}

/**
 * AES解密
 */
var decryptContent = function(content) {
  var decContent = (new crypto.AES().decrypt(safeBase64.decode(content), crypto.Utf8.parse(appKeyStr), options));
  return JSON.parse(crypto.Utf8.stringify(decContent));
}

module.exports = {
  token: token,
  sign: sign,
  ticketGenUrl: ticketGenUrl,
  ticketQueryUrl: ticketQueryUrl,
  getwxopenidUrl: getwxopenidUrl,
  querywxopenidsUrl: querywxopenidsUrl,
  registryUrl: registryUrl,
  loginUrl: loginUrl,
  authUrl: authUrl,
  queryauthUrl: queryauthUrl,
  authupdateUrl: authupdateUrl,
  authdelUrl: authdelUrl,
  addticketUrl: addticketUrl,
  ticketaddcountUrl: ticketaddcountUrl,
  tickettotalcountUrl: tickettotalcountUrl,
  ticketsUrl: ticketsUrl,
  updatedisributestatusUrl: updatedisributestatusUrl,
  addexpectticketUrl: addexpectticketUrl,
  expectunauthUrl: expectunauthUrl,
  expectauthUrl: expectauthUrl,
  encryptContent: encryptContent,
  decryptContent: decryptContent
};