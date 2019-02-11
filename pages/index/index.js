// pages/index/index.js

const api = require('../../utils/api.js');
const dateUtil = require('../../utils/util.js');
var urlSafeBase64 = require('../../utils/safebase64.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    operations: [
      {
        image: '../../assets/blueCard.png',
        name: '发放福利券',
        desc: '福利发放人员入口(需注册认证)',
        indicator: '../../assets/arrow.png',
        tap: 'getTicket'
      },
      {
        image: '../../assets/yellowCard.png',
        name: '领取福利券',
        desc: '员工入口',
        indicator: '../../assets/arrow.png',
        tap: 'recieveTicket'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var now = dateUtil.formatTime(new Date());
    var content = {
      'productid': 1014519,
      'startdate': '2019-02-10',
      'enddate': '2019-06-30',
      'customername': '皇冠蛋糕',
      'datasource': 11,
      'timestamp': now
    }

    var ticketGenUrl = api.ticketGenUrl;
    var ticketQueryUrl = api.ticketQueryUrl;
    // var encContent = urlSafeBase64.encode(api.encryptContent(content));
    // var sign = api.sign(content);
    // var token = api.token;

    // wx.request({
    //   url: ticketGenUrl,
    //   method: 'POST',
    //   header: {
    //     "Content-Type": "application/x-www-form-urlencoded"
    //   },
    //   data: {
    //     token: token,
    //     sign: sign,
    //     content: encContent
    //   },
    //   success: function (res) {
    //     var data = JSON.parse(res.data);
    //     var content = api.decryptContent(data.content);
    //     console.log(content);
    //   },
    //   fail: function (res) {

    //   },
    //   complete: function (res) {

    //   }
    // })

    var queryContent = {
      'ticketcode': '402946641730261286',
      'datasource': 11,
      'timestamp': now
    }

    var encContent = urlSafeBase64.encode(api.encryptContent(queryContent));
    var sign = api.sign(queryContent);
    var token = api.token;

    wx.request({
      url: ticketQueryUrl,
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        token: token,
        sign: sign,
        content: encContent
      },
      success: function (res) {
        var data = JSON.parse(res.data);
        var content = api.decryptContent(data.content);
        console.log(content);
      },
      fail: function (res) {

      },
      complete: function (res) {

      }
    })

  },

  getTicket: function() {
    wx.navigateTo({
      url: '../registry/registry',
    })
  },

  recieveTicket: function () {
    console.log('recieveTicket');
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