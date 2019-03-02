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
        image: '../../assets/ticketdetail.png',
        name: '发放福利券',
        desc: '福利发放人员入口(需注册认证)',
        indicator: '../../assets/arrow.png',
        tap: 'onDistributeTicket'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },



  /**
   * 点击发放福利券
   */
  onDistributeTicket: function () {
    // 查询审核是否通过的网络请求 然后跳转至相应的页面
    var wxopenid = wx.getStorageSync('wxopenid');
    var regInfo = wx.getStorageSync('regInfo');

    if (regInfo.toString().length == 0) {
      wx.navigateTo({
        url: '../registry/registry',
      })
    } else {
      var queryauthUrl = api.queryauthUrl;
      var authstatus = 1; //0位审核未通过的客户 1为审核通过的客户
      var sqlParams = ['wxopenid', 'company', 'authstatus'];
      var sqlValues = [wxopenid, regInfo.company, authstatus];

      wx.request({
        url: queryauthUrl,
        method: 'POST',
        data: {
          sqlParams: sqlParams,
          sqlValues: sqlValues
        },
        success: function (res) {
          //  从本地获取卡券总数 和 添加的卡券数 如为空 则是卸载后的重新登录 直接跳转至 添加卡券 界面获取前面两个数值
          var totalcount = wx.getStorageSync('totalcount'),
            addcount = wx.getStorageSync('addcount');
          if (!totalcount || !addcount) {
            wx.navigateTo({
              url: '../addticket/addticket',
            })
          } else {
            wx.navigateTo({
              url: '../ticketroute/ticketroute',
            })
          }
        },
        fail: function (res) {
          wx.showToast({
            title: '网络错误...',
            image: '../../assets/fail.png',
            duration: 2000
          })
        }
      })
    }
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