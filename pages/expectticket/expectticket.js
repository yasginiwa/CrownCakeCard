// pages/expectticket/expectticket.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    expectBtnStatus: false,
    expectnumbers: '',
  },

  /**
 * 点击数量加号
 */
  onPlus: function (e) {
    var expectnumbers = this.data.expectnumbers;
    expectnumbers++;
    if (expectnumbers > 999 || expectnumbers <= 0) {
      expectnumbers = 1;
      this.setData({
        expectnumbers: expectnumbers,
        expectBtnStatus: false,
      })
    }
    this.setData({
      expectnumbers: expectnumbers,
      expectBtnStatus: true
    })
  },

  /**
   * 点击数量减号
   */
  onMinus: function (e) {
    var expectnumbers = this.data.expectnumbers;
    expectnumbers--;
    if (expectnumbers > 999 || expectnumbers <= 0) {
      expectnumbers = 1;
      this.setData({
        expectnumbers: expectnumbers,
        expectBtnStatus: false,
      })
    }
    this.setData({
      expectnumbers: expectnumbers,
      expectBtnStatus: true
    })
  },

  /**
 * 数量输入监听
 */
  onCountInput: function (e) {
    var expectnumbers = e.detail.value;
    if (isNaN(expectnumbers) || expectnumbers <= 0 || expectnumbers == null) {
      this.setData({
        expectBtnStatus: false
      })
    } else {
      this.setData({
        expectnumbers: expectnumbers,
        expectBtnStatus: true
      })
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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