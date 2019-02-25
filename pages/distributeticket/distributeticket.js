// pages/distributeticket/distributeticket.js
const api = require('../../utils/api.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    tickets: []
  },

  /**
   * 通过点击是绑定的idx返回当前选择的ticket模型
   */
  selectedModel: function (e) {
    var idx = e.currentTarget.dataset.idx
    var ticket = {};
    var obj = {};
    //遍历tickets对象数组
    for (var i in this.data.tickets) {
      obj = this.data.tickets[i]
      if (obj.t_id === idx) {
        ticket = obj;
        break;
      }
    }
    return ticket;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })

    var ticketsUrl = api.ticketsUrl,
      sqlParam = 'wxopenid',
      sqlValue = wx.getStorageSync('wxopenid'),
      that = this;

    wx.request({
      url: ticketsUrl,
      method: 'POST',
      data: {
        sqlParam: sqlParam,
        sqlValue: sqlValue
      },
      success: function (res) {
        that.setData({
          tickets: res.data.result.reverse()
        })
        wx.hideLoading();
      },
      fail: function (err) {
        wx.showToast({
          title: '网络错误...',
          image: '../../assets/fail.png',
          mask: true,
          duration: 2000
        })
      }
    })

    wx.showShareMenu();
  },

  onTicketDetail: function (e) {
    var ticket = this.selectedModel(e);
    var ticketcode = ticket.ticketcode;
    wx.navigateTo({
      url: `../ticketdetail/ticketdetail?ticketcode=${ticketcode}`,
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
  onShow: function () { },

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
  onShareAppMessage: function (options) {
var updateStatus = function () {
    var updatedisributestatusUrl = api.updatedisributestatusUrl,
      sqlParam = 'distributestatus',
      sqlValue = 1,
      rangeParam = 't_id',
      rangeValue = ticket.t_id;
    //  更新ticket 的 发布/未发布 状态
    wx.request({
      url: updatedisributestatusUrl,
      method: 'POST',
      data: {
        sqlParam: sqlParam,
        sqlValue: sqlValue,
        rangeParam: rangeParam,
        rangeValue: rangeValue
      },
      success: function (res) {
        // success(res);
      },
      fail: function (err) {
        // fail(res);
      }
    })
}
  
    var that = this,
      idx = options.target.dataset.idx,
      obj = {},
      ticket = {};
    for (var i in this.data.tickets) {
      obj = this.data.tickets[i];
      if (obj.t_id == idx) {
        ticket = obj;
        break;
      }
    }

    wx.showModal({
      title: '温馨提示',
      content: '确认已转发给员工',
      success: function(res) {
        if(res.confirm) {

          updateStatus();
          that.onLoad();
        } else if(res.cancel) {



        }

      },

    })

    return {
      title: `${ticket.company} 祝您生日快乐！`,
      path: `/pages/ticketdetail/ticketdetail?ticketcode=${ticket.ticketcode}`,
      imageUrl: '../../assets/sendstaff.png'
    }
  }


})