// pages/ticketroute/ticketroute.js
var api = require('../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 点击申请卡券
   */
  expectticket: function () {
    var regInfo = wx.getStorageSync('regInfo');
    var isReLogin = wx.getStorageSync('isReLogin');
    
    if (regInfo.authstatus == 1 && isReLogin == true) {
      wx.navigateTo({
        url: '../addticket/addticket',
      })
      wx.setStorageSync('isReLogin', false);
      setTimeout(function () {
        wx.showToast({
          title: '重新登录时，先看看是否还有未添加完的卡券吧~~',
          icon: 'none',
          duration: 3000
        })
      }, 2000)
    } else {
      wx.navigateTo({
        url: '../expectticket/expectticket',
      })
    }
  },

  /**
   * 点击添加券卡
   */
  addticket: function () {
    wx.navigateTo({
      url: '../addticket/addticket',
    })
  },

  /**
   * 点击我的券卡
   */
  myticket: function () {
    wx.navigateTo({
      url: '../distributeticket/distributeticket',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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