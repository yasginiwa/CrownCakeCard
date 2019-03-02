// pages/auth/auth.js
var api = require('../../utils/api.js');
const dateUtil = require('../../utils/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    expecttickets: [],
    delBtnWidth: 180,
    netbakeid: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...'
    })

    //  请求客户申请未审核券的详细信息
    var that = this,
      authUrl = api.authUrl;
    wx.request({
      url: authUrl,
      method: 'POST',
      success: function (res) {
        var expectticket = {};
        var expecttickets = [];
        for (var i in res.data.result) {
          expectticket = res.data.result[i];
          expectticket.price = dateUtil.formatMoney(expectticket.price);
          expectticket.expectdate = dateUtil.formatLocal(expectticket.expectdate);
          expecttickets.push(expectticket);
        }
        that.setData({
          expecttickets: expecttickets.reverse()
        })
        wx.hideLoading();
      },
      fail: function (res) {
        wx.showToast({
          title: '网络错误',
          image: '../../assets/fail.png',
          duration: 2000
        })
      }
    })
  },

  /**
   * 通过点击是绑定的idx返回当前选择的client模型
   */
  selectedModel: function (e) {
    var idx = e.currentTarget.dataset.idx
    var expectticket = {};
    var obj = {};
    //遍历client对象数组
    for (var i in this.data.expecttickets) {
      obj = this.data.expecttickets[i]
      if (obj.e_id === idx) {
        expectticket = obj;
        break;
      }
    }
    return expectticket;
  },

  onIdInput: function (e) {
    this.setData({
      netbakeid: e.detail.value
    })
  },

  onAuthorized: function (e) {
    wx.showLoading({
      title: '审核中...',
    })

    if (isNaN(this.data.netbakeid) || this.data.netbakeid <= 0) {
      wx.showToast({
        title: 'ID填写不规范',
        image: '../../assets/warning.png',
        mask: true,
        duration: 2000
      })
      return;
    }

    //  审核注册信息
    var updateregistryUrl = api.updateregistryUrl,
      that = this,
      sqlParam = 'authstatus',
      sqlValue = 1,   //  等于0 注册未审核  等于1 注册已审核
      rangeParam = 'wxopenid',
      rangeValue = wx.getStorageSync('wxopenid');
    wx.request({
      url: updateregistryUrl,
      method: 'POST',
      data: {
        sqlParam: sqlParam,
        sqlValue: sqlValue,
        rangeParam: rangeParam,
        rangeValue: rangeValue
      },
      success: function (res) {
        if (res.data.code == 1) {

        } else {
          wx.showToast({
            title: '注册信息审核失败！',
            image: '../../assets/fail.png',
            duration: 2000
          })
        }
      },
      fail: function (err) {
        wx.showToast({
          title: '网络错误！',
          image: '../../assets/fail.png',
          duration: 2000
        })
      }
    })


    //  审核申领的券
    var expectticket = this.selectedModel(e),
      authupdateUrl = api.authupdateUrl;
    wx.request({
      url: authupdateUrl,
      method: 'POST',
      data: {
        sqlParams: ['authstatus', 'netbakeid'],
        sqlValues: [1, that.data.netbakeid],
        rangeParam: 'e_id',
        rangeValue: expectticket.e_id
      },
      success: function (res) {
        if (res.data.code == 1) {
          wx.showToast({
            title: '审核成功！',
            image: '../../assets/success.png',
            mask: true,
            duration: 2000
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '审核失败！',
          image: '../../assets/fail.png',
          mask: true,
          duration: 2000
        })
      },
      complete() {
        that.onLoad();
      }
    })

    //  设置申领券总数到本地存储
    wx.setStorageSync('totalcount', expectticket.expectnumbers);
  },


  /**
   * 触摸开始
   */
  touchS: function (e) {
    var expectticket = this.selectedModel(e);
    //  如果是已审核过的客户 不能被删除
    if (expectticket.authstatus == 1) return;

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
      if (disX == 0 || disX < 0) { //如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0rpx";
      } else if (disX > 0) { //移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "rpx";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "rpx";
        }
      }

      var expectticket = this.selectedModel(e);
      expectticket.slideStyle = txtStyle;
      this.setData({
        expecttickets: this.data.expecttickets
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
      var txtStyle = (disX > delBtnWidth / 2) ? "left:-" + delBtnWidth + "rpx" : "left:0rpx";

      if (txtStyle != "left:0rpx") {
        this.slideItem(e, txtStyle);
      }

      var expectticket = this.selectedModel(e);
      expectticket.slideStyle = txtStyle;
      this.setData({
        expecttickets: this.data.expecttickets
      })
    }
  },

  /**
   * 滑动一个item
   */
  slideItem: function (e, style) {
    var expectticket = this.selectedModel(e);
    expectticket.slideStyle = style;
    this.setData({
      expecttickets: this.data.expecttickets
    })
  },

  /**
   * 删除一个item
   */
  delItem: function (e) {
    // 遍历对象数组 所有的滑动归0
    var expectticket = this.selectedModel(e);
    for (var i in this.data.expecttickets) {
      expectticket = this.data.expecttickets[i];
      expectticket.slideStyle = 'left:0rpx';
    }
    this.setData({
      expecttickets: this.data.expecttickets
    })

    // 发送请求 删除数据
    var authdelUrl = api.authdelUrl;
    var that = this;
    wx.request({
      url: authdelUrl,
      method: 'POST',
      data: {
        e_id: 'e_id',
        sqlValue: expectticket.e_id
      },
      success: function (res) {
        that.onLoad();
        wx.showToast({
          title: '删除成功！',
          image: '../../assets/success.png',
          mask: true,
          duration: 2000
        })
      },
      fail: function () {
        wx.showToast({
          title: '删除失败！',
          image: '../../assets/fail.png',
          mask: true,
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