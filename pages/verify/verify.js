// pages/verify/verify.js
const dateUtil = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    progress: [
      {
        word: "完成注册",
        state: 1
      }, {
        word: "等待审核",
        state: 1
      }, {
        word: "审核通过",
        state: 0
      },
      {
        word: "开始领券",
        state: 0
      }
    ],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var regInfo = wx.getStorageSync('regInfo');

    this.setData({
      regInfo: regInfo
    })

    this.setProcessIcon();
  },

  /**
   * 设置进度
   */
  setProcessIcon: function () {
    var index = 0 //记录状态为1的最后的位置
    var processArr = this.data.progress
    for (var i = 0; i < this.data.progress.length; i++) {
      var item = this.data.progress[i]
      processArr[i].name = item.word
      if (item.state == 1) {
        index = i
        processArr[i].icon = "../../assets/process3.png"
        processArr[i].start = "#5ABF46"
        processArr[i].end = "#5ABF46"
      } else {
        processArr[i].icon = "../../assets/process1.png"
        processArr[i].start = "#c9caca"
        processArr[i].end = "#c9caca"
      }
    }
    processArr[index].icon = "../../assets/process2.png"
    processArr[index].end = "#c9caca"
    processArr[0].start = "#fff"
    processArr[this.data.progress.length - 1].end = "#fff"
    this.setData({
      processData: processArr
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