// pages/distributeticket/distributeticket.js
var api = require('../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tickets: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var ticketsUrl = api.ticketsUrl,
        sqlParam = 'wxopenid',
        sqlValue = wx.getStorageSync('openid'),
        that = this;

    wx.request({
      url: ticketsUrl,
      method: 'POST',
      data: {
        sqlParam: sqlParam,
        sqlValue: sqlValue 
      },
      success: function(res) {
        console.log(res);
        that.setData({
          tickets: res.data.result
        })
      },
      fail: function(err) {

      }
    })
  },

  onTicketDetail: function() {
    wx.navigateTo({
      url: '../ticketdetail/ticketdetail',
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
    return {
      title: '发你一张券!',
      path: '/pages/distributeticket/distributeticket?name=jack&gender=male',
      success: function(res) {
        console.log(res);
      },
      fail: function(res) {
        console.log(res);
      }
    }
  }
})