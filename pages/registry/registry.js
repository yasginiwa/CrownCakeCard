// pages/registy/registry.js
var api = require('../../utils/api.js');
const dateUtil = require('../../utils/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    regInfo: {},
    authstatus: 0,
    recievestatus: 0,
    btnDisable: true,
    company: '',
    contact: '',
    phone: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  registrySubmit: function () {
    var wxopenid = wx.getStorageSync('wxopenid'),
      today = dateUtil.formatTime(new Date());
    var regInfo = {
      wxopenid: wxopenid,
      company: this.data.company,
      contact: this.data.contact,
      phone: this.data.phone,
      regdate: today,
      authstatus: 0
    };

    // 设置本地data数据
    this.setData({
      regInfo: regInfo
    })

    // 注册信息存储到本地
    wx.setStorage({
      key: 'regInfo',
      data: regInfo,
    })

    //  注册请求
    var registryUrl = api.registryUrl;

    var that = this;
    wx.showLoading({
      title: '提交中...',
    })
    wx.request({
      url: registryUrl,
      method: 'POST',
      data: {
        wxopenid: wx.getStorageSync('wxopenid'),
        company: that.data.regInfo.company,
        contact: that.data.regInfo.contact,
        phone: that.data.regInfo.phone,
        regdate: today,
        authstatus: that.data.authstatus
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 0) {  // 返回码0 是查询数据库有问题  返回码1 正常查询
          wx.showToast({
            title: '注册信息有误！',
            icon: 'none',
            mask: 'true',
            duration: 3000
          })
        } else {
          wx.navigateBack({
            delta: 1,
            success: function (res) {
              setTimeout(function () {
                wx.showToast({
                  title: '点击「发放福利券」开始申领卡券！',
                  duration: 3000,
                  icon: 'none'
                })
              }, 1000)
            }
          })
        }
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showToast({
          title: '网络错误，请检查手机网络连接！',
          icon: 'none',
          mask: 'true',
          duration: 3000
        })
      }
    })

    //  如是注册用户 不存在重登录 直接设置isReLogin为false
    wx.setStorageSync('isReLogin', false);

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
    var company = this.data.company;
    var contact = this.data.contact;
    var phone = this.data.phone;
    if (company.length && contact.length && phone.length) {
      this.setData({
        btnDisable: false
      })
    } else {
      this.setData({
        btnDisable: true
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