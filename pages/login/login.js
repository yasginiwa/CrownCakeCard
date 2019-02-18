// pages/login/login.js
const api = require('../../utils/api.js');
const crypto = requirePlugin('Crypto');

Page({

  /*
   * 页面的初始数据
   */
  data: {
    loginBtnStatus: false,
    username: '',
    password: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 用户名输入
   */
  onUserInput: function(e) {
    this.setData({
      username: e.detail.value
    })
    this.onInput();
  },

  /**
   * 密码输入
   */
  onPwdInput: function(e) {
    this.setData({
      password: e.detail.value
    })
    this.onInput();
  },

  /**
   * 判断输入时的提交按钮状态
   */
  onInput: function () {
    if (this.data.username.length && this.data.password.length) {
      this.setData({
        loginBtnStatus: true
      })
    } else {
      this.setData({
        loginBtnStatus: false
      })
    }
  },

  /**
   * 登录请求
   */
  loginSubmit: function (e) {
    wx.showLoading({
      title: '登录中...',
      mask: true
    })

    const loginUrl = api.loginUrl;
    var username = e.detail.value.username;
    var password = new crypto.MD5(new crypto.MD5(e.detail.value.password).toString()).toString();
    wx.request({
      url: loginUrl,
      method: 'POST',
      data: {
        username: username
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.result[0]) {
          if (password === res.data.result[0].password) {
            wx.navigateTo({
              url: '../auth/auth',
            })
          } else {
            wx.showToast({
              title: '用户名或密码错误',
              image: '../../assets/fail.png',
              mask: true,
              duration: 2000
            })
          }
        } else {
          wx.showToast({
            title: '用户名或密码错误',
            image: '../../assets/fail.png',
            mask: true,
            duration: 2000
          })
        }
      },
      fail: function (err) {
        wx.hideLoading();
        wx.showToast({
          title: '网络错误，请检查手机网络',
          icon: 'none',
          mask: true,
          duration: 2000
        })
      },
      complete: function (res) {
        
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
    this.setData({
      username: '',
      password: '',
      loginBtnStatus: false
    })
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