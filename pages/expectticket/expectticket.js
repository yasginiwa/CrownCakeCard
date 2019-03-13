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
    // cover: `${api.host}/upload/default.png`
  },

  /**
   * 图片上传事件
   */
  // uploadTicketCover: function () {
  //   wx.showLoading({
  //     title: '上传中...',
  //     icon: 'none'
  //   })

  //   let that = this;

    // function uploadcover(cover) {
    //   let uploadUrl = api.uploadUrl;
    //   wx.uploadFile({
    //     url: uploadUrl,
    //     filePath: cover,
    //     name: 'cover',
    //     success: (res) => {
    //       wx.hideLoading();
    //       wx.showToast({
    //         title: '上传成功！',
    //         image: '../../assets/success.png',
    //         duration: 2000
    //       })

    //       var coverUrl = JSON.parse(res.data).coverUrl;
    //       that.setData({
    //         cover: coverUrl
    //       })

    //     },
    //     fail: (err) => {
    //       wx.hideLoading();
    //       wx.showToast({
    //         title: '上传失败~~',
    //         image: '../../assets/fail.png',
    //         duration: 2000
    //       })
    //     }
    //   })
    // }

  //   let ctx = wx.createCanvasContext('coverCanv');
  //   wx.chooseImage({
  //     success: (res) => {
  //       const tempFilePaths = res.tempFilePaths;
  //       ctx.drawImage(tempFilePaths[0], 0, 0, 500, 249);
  //       ctx.drawImage('../../assets/waterprint.png', 370, 215, 100, 21);
  //       ctx.draw(false, () => {
  //         wx.canvasToTempFilePath({
  //           canvasId: 'coverCanv',
  //           success: (res) => {
  //             uploadcover(res.tempFilePath);
  //           }
  //         })
  //       });
  //     },
  //     fail: (err) => {
  //       wx.hideLoading();
  //     }
  //   })

  // },

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
    if (!isNaN(expectnumbers) && expectnumbers > 0 && expectnumbers.length) {
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
    var totalcount = wx.getStorageSync('totalcount'),
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

    var addexpectticketUrl = api.addexpectticketUrl,
      wxopenid = wx.getStorageSync('wxopenid'),
      company = wx.getStorageSync('regInfo').company,
      expectnumbers = this.data.expectnumbers,
      expectdate = dateUtil.formatTime(new Date()),
      authstatus = 0, // 0 表示未审核 1表示审核成功
      // cover = (this.data.cover.length) ? this.data.cover : `${api.host}/upload/default.png`,
      sqlParams = ['wxopenid', 'company', 'expectnumbers', 'expectdate', 'authstatus'],
      sqlValues = [wxopenid, company, expectnumbers, expectdate, authstatus];

    wx.request({
      url: addexpectticketUrl,
      method: 'POST',
      data: {
        sqlParams: sqlParams,
        sqlValues: sqlValues
      },
      success: (res) => {
        wx.hideLoading();
        if (res.data.code == 1) {
          wx.showToast({
            title: '提交成功！',
            image: '../../assets/success.png',
            mask: true,
            duration: 2000
          })
          this.setData({
            expectwaitstatus: true
          })
          this.onLoad();
        } else {
          wx.showToast({
            title: '申领失败！',
            image: '../../assets/fail.png',
            mask: true,
            duration: 2000
          })
        }
      },
      fail: (err) => {
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

    let ctx = wx.createCanvasContext('coverCanv');
    ctx.drawImage('../../assets/ticketdetail.png', 0, 0, 500, 249);
    ctx.draw()


    var expectunauthUrl = api.expectunauthUrl,
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
      success: (res) => {
        wx.hideLoading();
        if (res.data.result.recordsets[0].length == 0) {
          this.setData({
            expectwaitstatus: false
          })

          var isReLogin = wx.getStorageSync('isReLogin');
          if (isReLogin == true) {
            wx.showToast({
              title: '先到「添加卡券」中，查看上次是否有未添加完的卡券~',
              icon: 'none',
              duration: 4000
            })
            wx.setStorageSync('isReLogin', false);
          }

        } else {
          var expectticket = res.data.result.recordsets[0][0];
          var expectdate = dateUtil.formatLocal(expectticket.expectdate);
          expectticket.expectdate = expectdate;
          this.setData({
            expectwaitstatus: true,
            expectticket: expectticket
          })
        }
      },
      fail: (err) => {
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