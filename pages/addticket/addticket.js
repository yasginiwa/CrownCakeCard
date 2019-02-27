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
    expectdate: '无',
    numbers: '',
    totalcount: 0,
    addcount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //  请求卡券总数 查出最后一条申请卡券的记录
    var expectAuthRequest = new Promise(function(resolve, reject) {
      var that = this,
        expectauthUrl = api.expectauthUrl,
        sqlParams = ['wxopenid', 'authstatus'],
        sqlValues = [wx.getStorageSync('wxopenid'), 1];
      wx.request({
        url: expectauthUrl,
        method: 'POST',
        data: {
          sqlParams: sqlParams,
          sqlValues: sqlValues
        },
        success: function(res) {
          resolve(res);
        }
      })
    });

    //  请求已添加的卡券数
    var addCountRequest = new Promise(function(resolve, reject) {
      var ticketaddcountUrl = api.ticketaddcountUrl,
        sqlParam = 'wxopenid',
        sqlValue = wx.getStorageSync('wxopenid');
      wx.request({
        url: ticketaddcountUrl,
        method: 'POST',
        data: {
          sqlParam: sqlParam,
          sqlValue: sqlValue
        },
        success: function(res) {
          resolve(res);
        },
        fail: function(err) {
          reject(err);
        }
      })
    });

    wx.showLoading({
      title: '页面加载...',
    })
    var that = this;
    // promise异步线程保证数据同步完成
    Promise.all([expectAuthRequest]).then(function(res) {
      // var addcount = res[0].data.result[0].addcount;
      console.log(res[0].data.result);
      var lastExpectTicket = res[0].data.result[res[0].data.result.length - 1];
      that.setData({
        // addcount: addcount,
        totalcount: lastExpectTicket.expectnumbers,
        expectdate: lastExpectTicket.expectdate
      })
      wx.hideLoading();
    }).catch(function(err) {
      console.log(err);
      wx.showToast({
        title: '网络错误...',
        image: '../../assets/fail.png',
        mask: true,
        duration: 2000
      })
    })
  },

  /**
   * 点击数量加号
   */
  onPlus: function(e) {
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
  onMinus: function(e) {
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
  onCountInput: function(e) {
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
  addtickets: function() {

    // 客户无法超越申请数量的券总数
    var totalcount = this.data.totalcount;
    var addcount = Number(this.data.addcount) + Number(this.data.numbers);
    if (addcount > totalcount) {
      wx.showToast({
        title: '超出总券数！',
        image: '../../assets/warning.png',
        mask: true,
        duration: 2000
      })
      return;
    }

    //  生成券码请求
    var ticketgenRequest = new Promise(function(resolve, reject) {
      var now = dateUtil.formatTime(new Date());
      var regInfo = wx.getStorageSync('regInfo');
      var wxopenid = wx.getStorageSync('wxopenid');
      var content = {
        'productid': 1014519,
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
        success: function(res) {
          resolve(res);
        },
        fail: function(err) {}
      })
    });

    // 券卡插入数据库请求
    var addToDBRequest = function(ticket, success, fail) {
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
          distributedate: dateUtil.formatTime(new Date())
        },
        success: function(res) {
          success(res);
        },
        fail: function(err) {
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

    return new Promise(function(resolve, reject) {
      ticketgenRequest.then(function(res) {
        var data = JSON.parse(res.data);
        var ticket = api.decryptContent(data.content);
        if (data.code == 0 && numbers > 0) {
          resolve();
          numbers--;
          that.setData({
            numbers: numbers,
            addBtnStatus: false
          })
          addToDBRequest(ticket, function(res) {
            addcount++;
            that.setData({
              addcount: addcount
            })
            that.addtickets();
          }, function(err) {
            reject(err);
          })
        } else {
          wx.hideLoading();
        }
      })
    }).then(function() {
      if (that.data.numbers == 0) {
        that.setData({
          numbers: ''
        })
      }
      wx.hideLoading();
    }).catch(function(err) {
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
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})