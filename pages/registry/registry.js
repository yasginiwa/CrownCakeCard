// pages/registy/registry.js
var customerRegUrl = require('../../utils/api.js');
var api = require('../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    registryInfo: [
      {
        desc: '公司名称',
        placeH: '公司名称',
        name: 'company',
        focus: 'true',
        type: 'text',
        bindInput: 'companyInput'
      },
      {
        desc: '联系人',
        placeH: '福利券发放人',
        name: 'contact',
        focus: 'false',
        type: 'text',
        bindInput: 'contactInput'
      },
      {
        desc: '手机',
        placeH: '联系人手机号',
        name: 'phone',
        focus: 'false',
        type: 'number',
        bindInput: 'phoneInput'
      }
    ],
    company: '',
    contact: '',
    phone: '',
    authstatus: 0,
    recievestatus: 0,
    ticket: '',
    submitBtnStatus: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  registrySubmit: function (e) {
    //  获取openid
    wx.login({
      success: function(res) {
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session',
          data: {
            appid: 'wx7fc7b53df0fe91d2',
            secret: '64fa906971b92a829115e5011ba92aa5',
            js_code: res.code,
            grant_type: 'authorization_code'
          },
          method: 'GET',
          success: function(result) {
            wx.setStorageSync('openid', result.data.openid);
          },
          fail: function(res) {},
          complete: function(res) {}
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })

    //  注册请求
    var customerRegUrl = api.customerRegUrl;
    var that = this;

    wx.showLoading({
      title: '提交中...',
    })
    wx.request({
      url: customerRegUrl,
      method: 'POST',
      data: {
        openid: wx.getStorageSync('openid'),
        company: that.data.company,
        contact: that.data.contact,
        phone: that.data.phone,
        authstatus: that.data.authstatus,
        recievestatus: that.data.recievestatus,
        ticket: that.data.ticket
      },
      success: function(res) {
        wx.hideLoading();
        if (res.data.code == 0){
          wx.showToast({
            title: '注册信息有误!',
            icon: 'none',
            mask: 'true',
            duration: 3000
          })
        } else {
          wx.navigateTo({
            url: '../verify/verify',
          })
        }
      },
      fail: function(res) {
        wx.hideLoading();
        wx.showToast({
          title: '网络错误，请检查手机网络连接',
          icon: 'none',
          mask: 'true',
          duration: 3000
        })
      }
    })
  },
  /**
   * 监听输入公司名称
   */
  companyInput: function (e) {
    this.setData({
      company: e.detail.value
    })

    this.onInput();
  },

  /**
   * 监听输入联系人
   */
  contactInput: function (e) {
    this.setData({
      contact: e.detail.value
    })

    this.onInput();
  },

  /**
   * 监听输入电话号码
   */
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })

    this.onInput();
  },

  /**
   * 判断输入时的提交按钮状态
   */
  onInput: function () {
    if (this.data.company.length && this.data.contact.length && this.data.phone.length) {
      this.setData({
        submitBtnStatus: true
      })
    } else {
      this.setData({
        submitBtnStatus: false
      })
    }
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