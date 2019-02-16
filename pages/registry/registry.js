// pages/registy/registry.js
var api = require('../../utils/api.js');
const dateUtil = require('../../utils/util.js');

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
    regInfo: {},
    authstatus: 0,
    recievestatus: 0,
    submitBtnStatus: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  registrySubmit: function (e) {
    var today = dateUtil.formatDate(new Date());
    console.log(e);
    var regInfo = {
      date: today,
      company: e.detail.value.company,
      contact: e.detail.value.contact,
      phone: e.detail.value.phone
    }

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
        openid: wx.getStorageSync('openid'),
        company: that.data.regInfo.company,
        contact: that.data.regInfo.contact,
        phone: that.data.registryInfo.phone,
        authstatus: that.data.authstatus,
        regdate: that.data.regInfo.date
      },
      success: function(res) {
        wx.hideLoading();
        if (res.data.code == 0){
          wx.showToast({
            title: '注册信息有误！',
            icon: 'none',
            mask: 'true',
            duration: 3000
          })
        } else {
          wx.reLaunch({
            url: `../verify/verify?company=${that.data.company}&contact=${that.data.contact}&phone=${that.data.phone}`,
          })
        }
      },
      fail: function(res) {
        wx.hideLoading();
        wx.showToast({
          title: '网络错误，请检查手机网络连接！',
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
    var company = this.data.regInfo.company;
    var contact = this.data.regInfo.contact;
    var phone = this.data.regInfo.phone;
    if (company.length && contact.length && phone.length) {
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