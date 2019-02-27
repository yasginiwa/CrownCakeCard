// pages/expectticket/expectticket.js
const api = require('../../utils/api.js');
const dateUtil = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    expectBtnStatus: false,
    expectname: '',
    expectprice: '',
    expectnumbers: ''
  },

  /**
  * 卡券名称输入事件
  */
  ticketnameInput: function (e) {
    var expectname = e.detail.value;
    this.setData({
      expectname: expectname
    })

    this.onInput();
  },

  /**
   * 卡券价格输入事件
   */
  ticketpriceInput: function (e) {
    var expectprice = e.detail.value;
    this.setData({
      expectprice: expectprice
    })
    this.onInput();
  },

  /**
   * 卡券数量输入事件
   */
  ticketcountsInput: function (e) {
    var expectnumbers = e.detail.value;
    this.setData({
      expectnumbers: expectnumbers
    })
    this.onInput();
  },

  /**
   * 监听输入事件
   */
  onInput: function () {
    var expectname = this.data.expectname;
    var expectprice = this.data.expectprice;
    var expectnumbers = this.data.expectnumbers;
    if (expectname.length && expectprice.length && expectnumbers.length) {
      this.setData({
        expectBtnStatus: true
      })
    } else {
      this.setData({
        expectBtnStatus: false
      })
    }
  },

  /**
   * 点击申领卡券
   */
  expectticket: function () {
    var expectname = this.data.expectname,
      expectprice = this.data.expectprice,
      expectnumbers = this.data.expectnumbers,
      today = dateUtil.formatDate(new Date());
    if (expectname.length > 0 && expectprice.length > 0 && expectnumbers.length > 0) {
      this.setData({
        expectBtnStatus: true
      })
    }
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