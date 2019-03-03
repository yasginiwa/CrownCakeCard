// pages/distributeticket/distributeticket.js
const api = require('../../utils/api.js');
var dateUtil = require('../../utils/util.js');

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
    var groups = {};
    var obj = {};
    //遍历tickets对象数组
    for (var i in this.data.tickets) {
      groups = this.data.tickets[i];
      var expecttickets = groups.expecttickets;
      for (var j in expecttickets) {
        obj = expecttickets[j];
        if (obj.t_id === idx) {
          ticket = obj;
          break;
        }
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
        var tickets = [];
        var group = {};
        var ticket = {};
        for (var i in res.data.result) {
          var group = res.data.result[i];
          group.expectdate = dateUtil.formatLocal(group.expectdate);
          var expecttickets = group.expecttickets;
          for (var j in expecttickets) {
            ticket = expecttickets[j];
            ticket.price = dateUtil.formatMoney(ticket.price);
            group.ticket = ticket;
          }
          tickets.push(group);
        }
        that.setData({
          tickets: tickets.reverse()
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
    var updateStatus = function (ticket) {
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
        },

      })
    }

    var that = this,
      ticket = {},
      e = {};
    e.currentTarget = options.target;
    ticket = this.selectedModel(e);

    //  弹出确认转发对话框
    setTimeout(function () {
      wx.showModal({
        title: '确认是否转发给员工',
        content: '如点"取消"，请及时撤回微信消息...',
        success: function (res) {
          if (res.confirm) { //  点击确定
            //  请求刷新状态
            updateStatus(ticket);
            //  重新加载页面
            that.onLoad();
          } else if (res.cancel) {
            //  设置券状态为已分发
            // ticket.distributestatus = 0;
          }

        }
      })
    }, 1000)


    return {
      title: `${ticket.company} 祝您生日快乐！`,
      path: `/pages/ticketdetail/ticketdetail?ticketcode=${ticket.ticketcode}`,
      imageUrl: '../../assets/sendstaff.png'
    }
  }


})