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
        tap: 'onDistributeTicket'
      },
      {
        image: '../../assets/yellowCard.png',
        name: '领取福利券',
        desc: '员工入口',
        indicator: '../../assets/arrow.png',
        tap: 'onGetTicket'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //  获取openid
    wx.login({
      success: function (res) {
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session',
          data: {
            appid: 'wx7fc7b53df0fe91d2',
            secret: '64fa906971b92a829115e5011ba92aa5',
            js_code: res.code,
            grant_type: 'authorization_code'
          },
          method: 'GET',
          success: function (result) {
            wx.setStorage({
              key: 'openid',
              data: result.data.openid,
            });
          },
          fail: function (res) { },
          complete: function (res) { }
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })

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

    /**
     * 生成券码
     */
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

    /**
     * 查询券码
     */
    // var queryContent = {
    //   'ticketcode': '916111072682369465',
    //   'datasource': 11,
    //   'timestamp': now
    // }

    // var encContent = urlSafeBase64.encode(api.encryptContent(queryContent));
    // var sign = api.sign(queryContent);
    // var token = api.token;

    // wx.request({
    //   url: ticketQueryUrl,
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

  },

  /**
   * 点击发放福利券
   */
  onDistributeTicket: function () {
    // 查询审核是否通过的网络请求 然后跳转至相应的页面

    var openid = wx.getStorageSync('openid');
    var regInfo = wx.getStorageSync('regInfo');

    if (regInfo.toString().length == 0) {
      wx.navigateTo({
        url: '../registry/registry',
      })
    } else {
      var queryauthUrl = api.queryauthUrl;
      var authstatus = 1; //0位审核未通过的客户 1为审核通过的客户
      var sqlParams = ['openid', 'company', 'authstatus'];
      var sqlValues = [openid, regInfo.company, authstatus];

      wx.request({
        url: queryauthUrl,
        method: 'POST',
        data: {
          sqlParams: sqlParams,
          sqlValues: sqlValues
        },
        success: function (res) {
          if (res.data.result.length == 0) {
            wx.reLaunch({
              url: '../verify/verify',
            })
          } else {
            wx.navigateTo({
              url: '../ticketroute/ticketroute',
            })
          }
        },
        fail: function (res) {},
        complete: function (res) {}
      })
    }
  },

  /**
   * 点击领取福利券
   */
  onGetTicket: function () {
    console.log('onGetTicket');
  },

  /**
   * 点击进入审核管理
   */
  onSupervise: function () {
    wx.navigateTo({
      url: '../login/login',
    })
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