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
      }
    ],

    date: '',
    company: '',
    contact: '',
    phone: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var today = dateUtil.formatDate(new Date());

    this.setData({
      date: today,
      company: options.company,
      contact: options.contact,
      phone: options.phone
    })

    this.setPeocessIcon();
  },

  /**
   * 设置进度
   */
  setPeocessIcon: function () {
    var index = 0 //记录状态为1的最后的位置
    var processArr = this.data.progress
    for (var i = 0; i < this.data.progress.length; i++) {
      var item = this.data.progress[i]
      processArr[i].name = item.word
      if (item.state == 1) {
        index = i
        processArr[i].icon = "../../assets/process3.png"
        processArr[i].start = "#45B2FE"
        processArr[i].end = "#45B2FE"
      } else {
        processArr[i].icon = "../../assets/process1.png"
        processArr[i].start = "#aaa"
        processArr[i].end = "#aaa"
      }
    }
    processArr[index].icon = "../../assets/process2.png"
    processArr[index].end = "#aaa"
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