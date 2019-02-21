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
    numbers: 0,
    totalcount: 0,
    addcount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载页面...',
      mask: true
    })
    var that = this,
      tickettotalcountUrl = api.tickettotalcountUrl,
      ticketaddcountUrl = api.ticketaddcountUrl,
      sqlParam = 'wxopenid',
      sqlValue = wx.getStorageSync('openid'),
      col = 'numbers';

    //  请求卡券总数
    var totalCountRequest = new Promise(function (resolve, reject) {
      wx.request({
        url: tickettotalcountUrl,
        method: 'POST',
        data: {
          col: col,
          sqlParam: sqlParam,
          sqlValue: sqlValue
        },
        success: function (res) {
          resolve(res);
        },
        fail: function (err) {
          reject(err);
        }
      })
    });

    //  请求已添加的卡券数
    var addCountRequest = new Promise(function (resolve, reject) {
      wx.request({
        url: ticketaddcountUrl,
        method: 'POST',
        data: {
          sqlParam: sqlParam,
          sqlValue: sqlValue
        },
        success: function (res) {
          resolve(res);
        },
        fail: function (err) {
          reject(err);
        }
      })
    });

    /**
     * 链式调用两个请求 保证数据同步
     */
    totalCountRequest.then(function (res) {
      var totalcount = res.data.result.recordset[0].numbers;
      that.setData({
        totalcount: totalcount
      })
      return addCountRequest;
    }).then(function (res) {
      var addcount = res.data.result.recordset[0].addcount;
      that.setData({
        addcount: addcount
      })
      wx.hideLoading();
    }).catch(function (err) {
      wx.showToast({
        title: '数据错误',
        image: '../../assets/fail.png',
        mask: true,
        duration: 2000
      })
    })
  },

  /**
   * 点击数量加号
   */
  onPlus: function (e) {
    var numbers = this.data.numbers;
    numbers++;
    if (numbers > 999) {
      numbers = 999;
    }
    this.setData({
      numbers: numbers,
      addBtnStatus: true,
    })
  },

  /**
   * 点击数量减号
   */
  onMinus: function (e) {
    var numbers = this.data.numbers;
    numbers--;

    if (numbers <= 0) {
      numbers = 0;
      this.setData({
        addBtnStatus: false,
      })
    }
    this.setData({
      numbers: numbers
    })
  },

  /**
   * 数量输入监听
   */
  onCountInput: function (e) {
    var numbers = e.detail.value;

    if (isNaN(numbers)) {
      wx.showToast({
        title: '请输入数字',
        image: '../../assets/warning.png',
        mask: true,
        duration: 2000
      })
      this.setData({
        numbers: 1,
      })
    } else {
      this.setData({
        numbers: numbers,
      })
    }
  },

  /**
   * 统一处理添加卡券
   */
  addtickets: function () {
    var totalcount = this.data.totalcount;
    var addcount = this.data.addcount;
    if (addcount >= totalcount) {
      wx.showToast({
        title: '已添加至最大张数',
        image: '../../assets/warning.png',
        mask: true,
        duration: 2000
      })
      return;
    }

    var that = this;
    wx.showLoading({
      title: '添加中，请勿关闭！',
      mask: true
    })
    this.addticket()
      .then(function (res) {
        wx.hideLoading();
        wx.showToast({
          title: '添加成功！',
          mask: true,
          image: '../../assets/success.png',
          duration: 2000,
        })
        setTimeout(function(){
          that.onLoad()
        }, 1000)
      })
      .catch(function (err) {
        wx.showToast({
          title: '添加失败！',
          image: '../../assets/fail.png',
          mask: true,
          duration: 2000
        })
      })
  },

  /**
   * 添加卡券
   */
  addticket: function () {
    let that = this;
    let numbers = that.data.numbers;
    return new Promise(function (resolve, reject) {
      that.genTicket().then(function (res) {
        that.setData({
          numbers: numbers--
        })
        if (numbers >= 0 && res.code == 0) {
          var content = api.decryptContent(res.content);
          that.setData({
            numbers: numbers,
            addBtnStatus: false
          })
          that.addticket();
          that.addToDB(that, content);
        }
        resolve(res);
      }, function (err) {
        reject(err);
      })
    })
  },

  /**
   * 请求卡券
   */
  genTicket: function () {
    return new Promise(function (resolve, reject) {
      var that = this;
      var now = dateUtil.formatTime(new Date());
      var content = {
        'productid': 1014519,
        'customername': '皇冠蛋糕',
        'datasource': 11,
        'timestamp': now
      }

      var ticketGenUrl = api.ticketGenUrl;
      var ticketQueryUrl = api.ticketQueryUrl;
      var encContent = urlSafeBase64.encode(api.encryptContent(content));
      var sign = api.sign(content);
      var token = api.token;
      wx.request({
        url: ticketGenUrl,
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          token: token,
          sign: sign,
          content: encContent
        },
        success: function (res) {
          var data = JSON.parse(res.data);
          resolve(data);
        },
        fail: function (err) {
          reject(err);
        }
      })
    })
  },

  /**
   * 客户卡券请求插入数据库
   */
  addToDB: function (that, content) {
    var addticketUrl = api.addticketUrl;
    var wxopenid = wx.getStorageSync('openid');
    var company = wx.getStorageSync('regInfo').company;

    wx.request({
      url: addticketUrl,
      method: 'POST',
      data: {
        company: company,
        ticketcode: content.ticketcode,
        ticketno: content.ticketno,
        productname: content.productname,
        price: content.price,
        wxopenid: wxopenid,
        distributestatus: 0 // 状态0为未使用 1为已使用
      },
      success: function (res) { },
      fail: function (err) {

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