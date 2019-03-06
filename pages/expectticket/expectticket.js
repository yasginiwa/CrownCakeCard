// pages/expectticket/expectticket.js
const api = require('../../utils/api.js');
const dateUtil = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    expectBtnStatus: false,
    expectnumbers: '',
    expectwaitstatus: false,
    expectticket: {},
    cover: ''
  },

  /**
   * 图片上传事件
   */
  uploadTicketCover: function() {
    wx.showLoading({
      title: '上传中...',
      icon: 'none'
    })
    var that = this,
      uploadUrl = api.uploadUrl;
    wx.chooseImage({
      success: function(res) {
        const tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: uploadUrl,
          filePath: tempFilePaths[0],
          name: 'cover',
          success: function(res) {
            wx.hideLoading();
            wx.showToast({
              title: '上传成功！',
              image: '../../assets/success.png',
              duration: 2000
            })
            var coverUrl = JSON.parse(res.data).coverUrl;
            that.setData({
              cover: coverUrl
            })
          },
          fail: function(err) {
            wx.hideLoading();
            wx.showToast({
              title: '上传失败~~',
              image: '../../assets/fail.png',
              duration: 2000
            })
          }
        })
      },
      fail: function() {
        wx.hideLoading();
      }
    })
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
    var expectnumbers = this.data.expectnumbers;
    if (expectnumbers.length) {
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
    var totalcount =  wx.getStorageSync('totalcount'),
      addcount = wx.getStorageSync('addcount');

      if (addcount < totalcount) {
        wx.showToast({
          title: '卡券未添加完...',
          image: '../../assets/warning.png',
          duration: 2000,
        })
        return;
      }

    wx.showLoading({
      title: '申领中...',
      mask: true
    })

    var that = this,
      addexpectticketUrl = api.addexpectticketUrl,
      wxopenid = wx.getStorageSync('wxopenid'),
      company = wx.getStorageSync('regInfo').company,
      expectnumbers = this.data.expectnumbers,
      expectdate = dateUtil.formatTime(new Date()),
      authstatus = 0, // 0 表示未审核 1表示审核成功
      cover = (that.data.cover.length) ? that.data.cover : `${api.host}/upload/default.png`,
      sqlParams = ['wxopenid', 'company', 'expectnumbers', 'expectdate', 'authstatus', 'cover'],
      sqlValues = [wxopenid, company, expectnumbers, expectdate, authstatus, cover];

      console.log(sqlValues);

    wx.request({
      url: addexpectticketUrl,
      method: 'POST',
      data: {
        sqlParams: sqlParams,
        sqlValues: sqlValues
      },
      success: function (res) {
        console.log(res);
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
          var expectticket = res.data.result.recordsets[0][0];
          var expectdate = dateUtil.formatLocal(expectticket.expectdate);
          expectticket.expectdate = expectdate;
          that.setData({
            expectwaitstatus: true,
            expectticket: expectticket
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
    this.onLoad();
    wx.stopPullDownRefresh();
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