// pages/auth/auth.js
var api = require('../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    clients: [],
    delBtnWidth: 180
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
      success: function (res) {
        that.setData({
          clients: res.data.result.reverse()
        })
      },
      fail: function (res) {

      },
      complete: function (res) {
        wx.hideLoading();
      }
    })
  },

  /**
   * 返回当前选择的client模型
   */
  selectedModel: function (e) {
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

  onAuthorized: function (e) {
    var client = this.selectedModel(e);
    var that = this;
    var authupdateUrl = api.authupdateUrl;

    if (client.numbers <= 0) {
      wx.showToast({
        title: '卡券数值须大于0！',
        icon: 'none',
        mask: true,
        duration: 2000
      })
      return;
    }

    wx.request({
      url: authupdateUrl,
      method: 'POST',
      data: {
        sqlParams: ['authstatus', 'numbers'],
        sqlValues: [1, client.numbers],
        r_id: 'r_id',
        rangeValue: client.r_id
      },
      success: function (res) {
        that.onLoad();
      },
      fail: function (res) { },
      complete: function (res) { }
    })
  },

  /**
   * 数量输入监听
   */
  onCountInput: function (e) {
    var client = this.selectedModel(e);
    client.numbers = e.detail.value;
    this.setData({
      clients: this.data.clients
    })
  },

  /**
   * 点击数量加号
   */
  onPlus: function (e) {
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
  onMinus: function (e) {
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


  /**
   * 触摸开始
   */
  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置
        startX: e.touches[0].clientX
      });
    }
  },

  /**
   * 触摸移动
   */
  touchM: function (e) {
    if (e.touches.length == 1) {
      //手指移动时水平方向位置
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0rpx";
      } else if (disX > 0) { //移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "rpx";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "rpx";
        }
      }

      var client = this.selectedModel(e);
      client.slideStyle = txtStyle;
      this.setData({
        clients: this.data.clients
      })
    }
  },

  /**
   * 触摸结束
   */
  touchE: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "rpx" : "left:0rpx";
      if (txtStyle != "left:0rpx") {
        this.slideItem(e, txtStyle);
      }

      var client = this.selectedModel(e);
      client.slideStyle = txtStyle;
      this.setData({
        clients: this.data.clients
      })
    }
  },

  /**
   * 滑动一个item
   */
  slideItem: function (e, style) {
    var client = this.selectedModel(e);
    client.slideStyle = style;
    this.setData({
      clients: this.data.clients
    })
  },

  /**
   * 删除一个item
   */
  delItem: function (e) {
    // 遍历对象数组 所有的滑动归0
    var idx = e.currentTarget.dataset.idx
    var client = {};
    for (var i in this.data.clients) {
      client = this.data.clients[i];
      client.slideStyle = 'left:0rpx';
    }
    this.setData({
      clients: this.data.clients
    })

    // 发送请求 删除数据
    var authdelUrl = api.authdelUrl;
    var r_id = idx;
    var that = this;
    wx.request({
      url: authdelUrl,
      method: 'POST',
      data: {
        r_id: 'r_id',
        sqlValue: r_id
      },
      success: function (res) {
        that.onLoad();
      },
      fail: function () { },
      complete: function () { }
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