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
    expectnumbers: '',
    expectwaitstatus: false,
    expectticket: {}
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
    wx.showLoading({
      title: '申领中...',
      mask: true
    })

    var that = this,
      addexpectticketUrl = api.addexpectticketUrl,
      wxopenid = wx.getStorageSync('wxopenid'),
      company = wx.getStorageSync('regInfo').company,
      productname = this.data.expectname,
      price = this.data.expectprice,
      expectnumbers = this.data.expectnumbers,
      expectdate = dateUtil.formatTime(new Date()),
      authstatus = 0, // 0 表示未审核 1表示审核成功
      netbakeid = 0;

    wx.request({
      url: addexpectticketUrl,
      method: 'POST',
      data: {
        wxopenid: wxopenid,
        company: company,
        productname: productname,
        price: price,
        expectnumbers: expectnumbers,
        expectdate: expectdate,
        authstatus: authstatus,
        netbakeid: netbakeid
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 1) {
          wx.showToast({
            title: '提交成功！',
            image: '../../assets/success.png',
            mask: true,
            duration: 2000
          })
          that.setData({
            expectwaitstatus: true
          })
          that.onLoad();
        } else {
          wx.showToast({
            title: '申领失败！',
            image: '../../assets/fail.png',
            mask: true,
            duration: 2000
          })
        }
      },
      fail: function (err) {
        wx.showToast({
          title: '网络错误',
          image: '../../fail.png',
          duration: 2000
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    var that = this,
      expectunauthUrl = api.expectunauthUrl,
      sqlParams = ['wxopenid', 'authstatus'],
      sqlValues = [wx.getStorageSync('wxopenid'), '0'],
      condition = 'expectdate';
    wx.request({
      url: expectunauthUrl,
      method: 'POST',
      data: {
        sqlParams: sqlParams,
        sqlValues: sqlValues,
        condition: condition
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.result.recordsets[0].length == 0) {
          that.setData({
            expectwaitstatus: false
          })
        } else {
          that.setData({
            expectwaitstatus: true,
            expectticket: res.data.result.recordsets[0][0]
          })
        }
      },
      fail: function (err) {
        wx.showToast({
          title: '网络错误',
          image: '../../fail.png',
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