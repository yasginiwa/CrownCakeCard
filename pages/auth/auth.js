// pages/auth/auth.js
var api = require('../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    clients: [],
    // startPoint: [0, 0]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
      icon: 'none'
    })

    var authUrl = api.authUrl;
    var that = this;

    wx.request({
      url: authUrl,
      method: 'POST',
      data: {
        authstatus: 0 // 0代表未审核的客户 1代表审核通过的客户
      },
      success: function(res) {
        that.setData({
          clients: res.data.result.reverse()
        })
      },
      fail: function(res) {

      },
      complete: function(res) {
        wx.hideLoading();
      }
    })
  },

  /**
   * 返回当前选择的client模型
   */
  selectedModel: function(e) {
    var idx = e.currentTarget.dataset.idx
    var client = {};
    var obj = {};
    //遍历client对象数组
    for (var i in this.data.clients) {
      obj = this.data.clients[i]
      if (obj.r_id === idx) {
        client = obj;
        break;
      }
    }
    return client;
  },

  onAuthorized: function(e) {
    var client = this.selectedModel(e);
    var that = this;
    var authupdateUrl = api.authupdateUrl;

    wx.request({
      url: authupdateUrl,
      method: 'POST',
      data: {
        sqlParams: ['authstatus', 'numbers'],
        sqlValues: [1, client.numbers],
        r_id: 'r_id',
        rangeValue: client.r_id
      },
      success: function(res) {
        that.onLoad();
      },
      fail: function(res) {},
      complete: function(res) {}
    })
  },

  /**
   * 数量输入监听
   */
  onCountInput: function(e) {
    var client = this.selectedModel(e);
    client.numbers = e.detail.value;
    this.setData({
      clients: this.data.clients
    })
  },

  /**
   * 点击数量加号
   */
  onPlus: function(e) {
    var client = this.selectedModel(e);
    var that = this;
    client.numbers++;
    if (client.numbers > 999) {
      client.numbers = 999;
    }
    this.setData({
      clients: this.data.clients
    })
  },

  /**
   * 点击数量减号
   */
  onMinus: function(e) {
    var that = this;
    var client = this.selectedModel(e);
    client.numbers--;
    if (client.numbers < 0) {
      client.numbers = 0;
    }
    this.setData({
      clients: this.data.clients
    })
  },


  // /**
  //  * 触摸开始
  //  */
  // touchstart: function (e) {
  //   this.setData({
  //     startPoint: [e.touches[0].pageX, e.touches[0].pageY]
  //     });
  // },

  // /**
  //  * 触摸移动
  //  */
  // touchmove: function(e) {
  //   var curPoint = [e.touches[0].pageX, e.touches[0].pageY];
  //   var startPoint = this.data.startPoint;

  //   if(curPoint[0] <= startPoint[0]) {
  //     if(Math.abs(curPoint[0] - startPoint[0]) >= Math.abs(curPoint[1] - startPoint[1])) {
  //       console.log(e.timeStamp + '- touch left move');
  //     }
  //   }
  // },

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