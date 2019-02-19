// pages/addticket/addticket.js

const api = require('../../utils/api.js');
const dateUtil = require('../../utils/util.js');
var urlSafeBase64 = require('../../utils/safebase64.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addBtnStatus: true,
    numbers: 1,
    tickets: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
 * 点击数量加号
 */
  onPlus: function (e) {
    var numbers = this.data.numbers;
    numbers++;
    if (numbers > 999) {
      numbers = 999;
    }
    this.setData({
      numbers: numbers,
      addBtnStatus: true,
    })
  },

  /**
   * 点击数量减号
   */
  onMinus: function (e) {
    var numbers = this.data.numbers;
    numbers--;

    if (numbers <= 0) {
      numbers = 0;
      this.setData({
        addBtnStatus: false,
      })
    }
    this.setData({
      numbers: numbers
    })
  },

  /**
 * 数量输入监听
 */
  onCountInput: function (e) {
    var numbers = e.detail.value;

    if (isNaN(numbers)) {
      wx.showToast({
        title: '请输入数字',
        image: '../../assets/warning.png',
        mask: true,
        duration: 2000
      })
      this.setData({
        numbers: 1,
      })
    } else {
      this.setData({
        numbers: numbers,
      })
    }
  },

  /**
   * 添加卡券
   */
  addticket: function () {
    for (let i = 0; i < 10; i++) {
      this.genTicket();
    }
  },

  genTicket: function () {
    var that = this;
    var now = dateUtil.formatTime(new Date());
    var content = {
      'productid': 1014519,
      'customername': '皇冠蛋糕',
      'datasource': 11,
      'timestamp': now
    }

    var ticketGenUrl = api.ticketGenUrl;
    var ticketQueryUrl = api.ticketQueryUrl;
    var encContent = urlSafeBase64.encode(api.encryptContent(content));
    var sign = api.sign(content);
    var token = api.token;
    wx.request({
      url: ticketGenUrl,
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