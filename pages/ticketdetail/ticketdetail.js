// pages/ticketdetail/ticketdetail.js
const api = require('../../utils/api.js');
const dateUtil = require('../../utils/util.js');
var urlSafeBase64 = require('../../utils/safebase64.js');
var barcode = require('../../utils/qrcode/index.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ticket: {},
    code: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })

    //  查询券编号的券的封面信息
    var queryTicketCover = function (ticket, successCb, failCb) {
      var queryticketcoverUrl = api.queryticketcoverUrl,
        ticketcode = ticket.ticketcode;
      wx.request({
        url: queryticketcoverUrl,
        method: 'POST',
        data: {
          sqlParam: 'ticketcode',
          sqlValue: ticketcode
        },
        success: function (res) {
          successCb(res);
        },
        fail: function (err) {
          failCb(err);
        }
      })
    };


    var ticketcode = options.ticketcode;
    var that = this;

    //  查询券码
    var now = dateUtil.formatTime(new Date());
    var ticketQueryUrl = api.ticketQueryUrl;
    var queryContent = {
      'ticketcode': ticketcode,
      'datasource': 11,
      'timestamp': now
    }
    var encContent = urlSafeBase64.encode(api.encryptContent(queryContent));
    var sign = api.sign(queryContent);
    var token = api.token;

    wx.request({
      url: ticketQueryUrl,
      method: 'POST',
      // header: {
      //   "Content-Type": "application/x-www-form-urlencoded"
      // },
      data: {
        token: token,
        sign: sign,
        content: encContent
      },
      success: function (res) {
        var data = JSON.parse(res.data);
        var ticket = api.decryptContent(data.content);
        
        // ticket.enddate = ticket.enddate.substring(0,11);
        queryTicketCover(ticket, function (res) {
          ticket.price = ticket.price.toFixed(2);
          ticket.cover = res.data.result[0].cover;
          ticket.startdate = dateUtil.formatLocalDate(ticket.startdate);
          ticket.enddate = dateUtil.formatLocalDate(ticket.enddate);
          that.setData({
            ticket: ticket,
            code: ticket.ticketcode
          })
          barcode.barcode('barcode', ticket.ticketcode, 640, 200);
          wx.hideLoading();

        }, function (err) {
          wx.showToast({
            title: '网络错误',
            image: '../../assets/fail.png',
            duration: 2000
          })
        });
      },
      fail: function (err) {
        wx.showToast({
          title: '网络错误',
          image: '../../assets/fail.png',
          duration: 2000
        })
      }
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