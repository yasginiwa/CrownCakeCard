// pages/auth/auth.js
var api = require('../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    clients: [],
    btnLoadStatus: 'false',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
      icon: 'none'
    })

    var authUrl = api.authUrl;
    var that = this;

    wx.request({
      url: authUrl,
      method: 'POST',
      data: {
        authstatus: 0 // 0代表未审核的客户 1代表审核通过的客户
      },
      success: function(res) {
        that.setData({
          clients: res.data.result
        })
      },
      fail: function(res) {

      },
      complete: function(res) {
        wx.hideLoading();
      }
    })
  },

  onAuthorized: function(e) {
    var authupdateUrl = api.authupdateUrl;
    var that = this;
    var unAuthCustomer = that.data.clients[e.currentTarget.dataset.idx];
    console.log(unAuthCustomer);

    wx.request({
      url: authupdateUrl,
      method: 'POST',
      data: {
        authstatus: 'authstatus',
        sqlValue: 1,
        r_id: 'r_id',
        rangValue: that.data.clients[idx].r_id
      },
      success: function(res) {
        console.log(res);
      },
      fail: function(res) {},
      complete: function(res) {}
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