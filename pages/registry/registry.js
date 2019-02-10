// pages/registy/registry.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    registryInfo: [
      {
        desc: '公司名称',
        placeH: '公司名称',
        name: 'company',
        focus: 'true',
        type: 'text',
        bindInput: 'companyInput'
      },
      {
        desc: '联系人',
        placeH: '福利券发放人',
        name: 'contact',
        focus: 'false',
        type: 'text',
        bindInput: 'contactInput'
      },
      {
        desc: '手机',
        placeH: '联系人手机号',
        name: 'phone',
        focus: 'false',
        type: 'number',
        bindInput: 'phoneInput'
      }
    ],
    company: '',
    contact: '',
    phone: '',
    submitBtnStatus: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  registrySubmit: function (e) {
    console.log(e.detail.value);
  },

  companyInput: function (e) {
    this.setData({
      company: e.detail.value
    })

    this.onInput();
  },

  contactInput: function (e) {
    this.setData({
      contact: e.detail.value
    })

    this.onInput();
  },

  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })

    this.onInput();
  },

  onInput: function () {
    if (this.data.company.length && this.data.contact.length && this.data.phone.length) {
      this.setData({
        submitBtnStatus: true
      })
    } else {
      this.setData({
        submitBtnStatus: false
      })
    }
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