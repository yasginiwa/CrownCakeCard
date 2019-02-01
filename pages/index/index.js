// pages/index/index.js

const api = require('../../utils/api.js');
var CryptoJS = require('../../utils/cryptojs.js');
const dateUtil = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var token = api.token;
    var appKey = api.appKey;
    var signKey = api.signKey;
    var ticketGen = api.ticketGen;
    var ticketQuery = api.ticketQuery;

    var now = dateUtil.formatTime(new Date());

    var content = {
      'productid': 1608,
      'startdate': '2019-02-01',
      'enddate': '2019-06-30',
      'sellprice': 123.00,
      'customername': '皇冠蛋糕',
      'timestamp': now
    }

    wx.request({
      url: ticketGen,
      data: {
        token: token,
        sign: CryptoJS.MD5(signKey + 'token' + token + 'content' + JSON.stringify(content) + signKey).toString(),
        content: CryptoJS.AES.encrypt(JSON.stringify(content), appKey).toString()
      },
      method: 'POST',
      success: function (res) {
        console.log(res);
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) { },
    })

    // // md5
    // var md5Str = CryptoJS.MD5('123').toString();
    // console.log('MD5 '+ md5Str);

    // //Base64编码
    // var src = CryptoJS.enc.Utf8.parse("anlige");
    // var base64string = CryptoJS.enc.Base64.stringify(src);
    // console.log('Base64编码 ' + base64string.toString());

    // //Base64解码
    // var base64string = CryptoJS.enc.Base64.parse("YW5saWdl");
    // console.log('Base64解码 ' + CryptoJS.enc.Utf8.stringify(base64string));

    // // AES Encrypt
    // var ciphertext = CryptoJS.AES.encrypt('my message', 'secret key 123');
    // console.log('AES加密 ' + ciphertext);

    // // AES Decrypt
    // var bytes = CryptoJS.AES.decrypt(ciphertext.toString(), 'secret key 123');
    // var plaintext = bytes.toString(CryptoJS.enc.Utf8);
    // console.log('AES解密 ' + plaintext);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})