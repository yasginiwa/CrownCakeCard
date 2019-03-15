// pages/addticket/addticket.js

const api = require('../../utils/api.js');
const dateUtil = require('../../utils/util.js');
var urlSafeBase64 = require('../../utils/safebase64.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addBtnStatus: false,
    limitstartdate: 'N/A',
    limitenddate: 'N/A',
    netbakeid: '',
    numbers: '',
    totalcount: 0,
    addcount: 0,
    cover: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //  canvas画券封面
    // function drawCover(expectticket) {
    //   let that = this,
    //     ctx = wx.createCanvasContext('coverCanv');
    //   ctx.drawImage('../../assets/ticketpattern.png', 0, 0, 496, 189);
    //   ctx.setFontSize(22);
    //   ctx.setFillStyle('white');
    //   ctx.fillText(expectticket.productname, 105, 108);
    //   ctx.scale(2, 2);
    //   ctx.draw(false, function () {
    //     wx.canvasToTempFilePath({
    //       canvasId: 'coverCanv',
    //       success: (res) => {
    //         uploadCover(res.tempFilePath, expectticket);
    //       }
    //     })
    //   })
    // }

    //  上传图片
    // function uploadCover(cover, expectticket) {
    //   let uploadUrl = api.uploadUrl;
    //   wx.uploadFile({
    //     url: uploadUrl,
    //     filePath: cover,
    //     name: 'cover',
    //     success: (res) => {
    //       wx.hideLoading();
    //       // wx.showToast({
    //       //   title: '上传成功！',
    //       //   image: '../../assets/success.png',
    //       //   duration: 2000
    //       // })
    //       var coverUrl = JSON.parse(res.data).coverUrl;
    //       that.setData({
    //         cover: coverUrl
    //       })

    //       updateCover(expectticket);
    //     },
    //     fail: (err) => {
    //       wx.hideLoading();
    //       // wx.showToast({
    //       //   title: '上传失败~~',
    //       //   image: '../../assets/fail.png',
    //       //   duration: 2000
    //       // })
    //     }
    //   })
    // }

    //  更新申领图片封面
    // function updateCover(expectticket) {
    //   let updateexpectticketcoverUrl = api.updateexpectticketcoverUrl,
    //     sqlParam = 'cover',
    //     sqlValue = that.data.cover,
    //     rangeParam = 'e_id',
    //     rangeValue = expectticket.e_id;
    //   wx.request({
    //     url: updateexpectticketcoverUrl,
    //     method: 'POST',
    //     data: {
    //       sqlParam: sqlParam,
    //       sqlValue: sqlValue,
    //       rangeParam: rangeParam,
    //       rangeValue: rangeValue
    //     },
    //     success: (res) => {
    //       // wx.showToast({
    //       //   title: '封面更新成功',
    //       //   icon: 'none'
    //       // })
    //     },
    //     fail: (err) => {
    //       wx.showToast({
    //         title: '网络错误',
    //         icon: 'none'
    //       })
    //     }
    //   })
    // }

    //  请求卡券总数 查出最后一条申请卡券的记录
    var expectAuthRequest = new Promise(function (resolve, reject) {
      var that = this,
        expectauthUrl = api.expectauthUrl,
        sqlParams = ['wxopenid', 'authstatus'],
        sqlValues = [wx.getStorageSync('wxopenid'), 1],
        condition = 'expectdate';
      wx.request({
        url: expectauthUrl,
        method: 'POST',
        data: {
          sqlParams: sqlParams,
          sqlValues: sqlValues,
          condition: condition
        },
        success: (res) => {
          let expectticket = res.data.result.recordsets[0][0];
          if (expectticket) {
            resolve(expectticket);
          } else {
            wx.showToast({
              title: '请等待审核...',
              image: '../../assets/warning.png',
              duration: 2000
            })
          }
        }
      })
    });

    //  请求已添加的卡券数
    var addCountRequest = function (repectdate, success, fail) {
      var ticketaddcountUrl = api.ticketaddcountUrl,
        sqlParams = ['wxopenid', 'expectdate'],
        sqlValues = [wx.getStorageSync('wxopenid'), repectdate];
      wx.request({
        url: ticketaddcountUrl,
        method: 'POST',
        data: {
          sqlParams: sqlParams,
          sqlValues: sqlValues
        },
        success: function (res) {
          if (res.data.code == 1) {
            success(res.data.result.recordsets[0][0]);
          } else {
            wx.showToast({
              title: '加载失败...',
              image: '../../assets/fail.png',
              duration: 2000
            })
          }
        },
        fail: function (err) {
          fail(err);
        }
      })
    };

    wx.showLoading({
      title: '页面加载...',
    })
    var that = this;
    // promise异步线程保证数据同步完成
    expectAuthRequest.then((res) => {
      that.setData({
        totalcount: res.expectnumbers,
        expectdate: dateUtil.formatLocal(res.expectdate),
        netbakeid: res.netbakeid,
        limitstartdate: dateUtil.formatLocalDate(res.limitstartdate),
        limitenddate: dateUtil.formatLocalDate(res.limitenddate)
      })

      // 总数存入本地存储
      wx.setStorageSync('totalcount', res.expectnumbers);
      addCountRequest(res.expectdate, function (res) {
        wx.hideLoading();
        that.setData({
          addcount: res.addcount
        })

        // 总数存入本地存储
        wx.setStorageSync('addcount', res.addcount);

      }, (err) => {
        wx.showToast({
          title: '加载失败...',
          image: '../../assets/fail.png',
          duration: 2000
        })
      })

      // if (res.cover != null) return;
      // drawCover(res);
    })
  },

  /**
   * 点击数量加号
   */
  onPlus: function (e) {
    var numbers = this.data.numbers;
    numbers++;
    if (numbers > 999 || numbers <= 0) {
      numbers = 1;
      this.setData({
        numbers: numbers,
        addBtnStatus: false,
      })
    }
    this.setData({
      numbers: numbers,
      addBtnStatus: true
    })
  },

  /**
   * 点击数量减号
   */
  onMinus: function (e) {
    var numbers = this.data.numbers;
    numbers--;
    if (numbers > 999 || numbers <= 0) {
      numbers = 1;
      this.setData({
        numbers: numbers,
        addBtnStatus: false,
      })
    }
    this.setData({
      numbers: numbers,
      addBtnStatus: true
    })
  },

  /**
   * 数量输入监听
   */
  onCountInput: function (e) {
    var numbers = e.detail.value;
    if (isNaN(numbers) || numbers <= 0 || numbers == null) {
      this.setData({
        addBtnStatus: false
      })
    } else {
      this.setData({
        numbers: numbers,
        addBtnStatus: true
      })
    }
  },

  /**
   * 统一处理添加卡券
   */
  addtickets: function () {
    // 客户无法超越申请数量的券总数
    var that = this,
      totalcount = this.data.totalcount,
      addcount = Number(this.data.addcount) + Number(this.data.numbers);
    if (addcount > totalcount) {
      wx.showToast({
        title: '超出总券数！',
        image: '../../assets/warning.png',
        mask: true,
        duration: 2000
      })
      return;
    }

    //  获取时间戳
    function getTimeStamps(time) {
      return time.valueOf();
    }

    // 当前时间
    let now = new Date();

    //  如当前日期>截止日期
    if (getTimeStamps(now) > getTimeStamps(this.data.limitenddate)) {
      wx.showToast({
        title: '添加卡券已逾期，请重新申领...',
        image: '../../assets/warning.png',
        duration: 2000
      })
      return;
    }

    //  生成券码请求  'productid': 1014519,
    var ticketgenRequest = new Promise(function (resolve, reject) {
      var now = dateUtil.formatTime(new Date());
      var regInfo = wx.getStorageSync('regInfo');
      var wxopenid = wx.getStorageSync('wxopenid');
      var content = {
        'productid': that.data.netbakeid,
        'customername': '皇冠蛋糕',
        'datasource': 11,
        'timestamp': now,
        'wxopenid': wxopenid
      };
      var ticketGenUrl = api.ticketGenUrl;
      var encContent = urlSafeBase64.encode(api.encryptContent(content));
      var sign = api.sign(content);
      var token = api.token;

      wx.request({
        url: ticketGenUrl,
        method: 'POST',
        data: {
          token: token,
          sign: sign,
          content: encContent
        },
        success: function (res) {
          resolve(res);
        },
        fail: function (err) { }
      })
    });

    // 券卡插入数据库请求
    var addToDBRequest = function (ticket, success, fail) {
      var addticketUrl = api.addticketUrl;
      var wxopenid = wx.getStorageSync('wxopenid');
      var company = wx.getStorageSync('regInfo').company;
      wx.request({
        url: addticketUrl,
        method: 'POST',
        data: {
          wxopenid: wxopenid,
          company: company,
          ticketcode: ticket.ticketcode,
          ticketno: ticket.ticketno,
          productname: ticket.productname,
          price: ticket.price,
          distributestatus: 0, // 状态0为未分发 1为已分发
          distributedate: dateUtil.formatTime(new Date()),
          expectdate: that.data.expectdate
        },
        success: function (res) {
          success(res);
        },
        fail: function (err) {
          fail(err);
        }
      })
    };

    var that = this;
    var numbers = that.data.numbers;
    var addcount = that.data.addcount;
    wx.showLoading({
      title: '添加中...',
    })

    return new Promise(function (resolve, reject) {
      ticketgenRequest.then(function (res) {
        var data = JSON.parse(res.data);
        var ticket = api.decryptContent(data.content);
        if (data.code == 0 && numbers > 0) {
          resolve();
          numbers--;
          that.setData({
            numbers: numbers,
            addBtnStatus: false
          })
          addToDBRequest(ticket, function (res) {
            addcount++;
            that.setData({
              addcount: addcount
            })
            wx.setStorageSync('addcount', addcount);
            that.addtickets();
          }, function (err) {
            reject(err);
          })
        } else {
          wx.hideLoading();
        }
      })
    }).then(function () {
      if (that.data.numbers == 0) {
        that.setData({
          numbers: ''
        })
      }
      wx.hideLoading();
    }).catch(function (err) {
      wx.showToast({
        title: '添加失败！',
        image: '../../assets/fail.png',
        mask: true,
        duration: 2000
      })
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