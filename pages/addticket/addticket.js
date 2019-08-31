// pages/addticket/addticket.js

const api = require('../../utils/api.js');
let dateUtil = require('../../utils/util.js');
var urlSafeBase64 = require('../../utils/safebase64.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addBtnStatus: false,
    limitstartdate: 'N/A',
    limitenddate: 'N/A',
    desc1: '',
    desc2: '',
    desc3: '',
    desc3: '',
    netbakeid: '',
    numbers: '',
    totalcount: 0,
    addcount: 0,
    cover: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //  请求卡券总数 查出最后一条申请卡券的记录
    var expectAuthRequest = new Promise(function (resolve, reject) {
      var that = this,
        expectauthUrl = api.expectauthUrl,
        sqlParams = ['wxopenid', 'authstatus'],
        sqlValues = [wx.getStorageSync('wxopenid'), 1],
        condition = 'expectdate';
      wx.request({
        url: expectauthUrl,
        method: 'POST',
        data: {
          sqlParams: sqlParams,
          sqlValues: sqlValues,
          condition: condition
        },
        success: (res) => {
          let expectticket = res.data.result.recordsets[0][0];
          if (expectticket) {
            resolve(expectticket);
          } else {
            wx.showToast({
              title: '请等待审核...',
              image: '../../assets/warning.png',
              duration: 2000
            })
          }
        }
      })
    });

    //  请求已添加的卡券数
    var addCountRequest = function (repectdate, success, fail) {
      var ticketaddcountUrl = api.ticketaddcountUrl,
        sqlParams = ['wxopenid', 'expectdate'],
        sqlValues = [wx.getStorageSync('wxopenid'), repectdate];
      wx.request({
        url: ticketaddcountUrl,
        method: 'POST',
        data: {
          sqlParams: sqlParams,
          sqlValues: sqlValues
        },
        success: function (res) {
          if (res.data.code == 1) {
            success(res.data.result.recordsets[0][0]);
          } else {
            wx.showToast({
              title: '加载失败...',
              image: '../../assets/fail.png',
              duration: 2000
            })
          }
        },
        fail: function (err) {
          fail(err);
        }
      })
    };

    wx.showLoading({
      title: '页面加载...',
    })
    var that = this;
    // promise异步线程保证数据同步完成
    expectAuthRequest.then((res) => {

      that.setData({
        totalcount: res.expectnumbers,
        expectdate: dateUtil.formatLocal(res.expectdate),
        netbakeid: res.netbakeid,
        limitstartdate: dateUtil.formatLocalDate(res.limitstartdate),
        limitenddate: dateUtil.formatLocalDate(res.limitenddate),
        desc1: res.desc1,
        desc2: res.desc2,
        desc3: res.desc3,
        desc4: res.desc4
      })

      // 总数存入本地存储
      wx.setStorageSync('totalcount', res.expectnumbers);
      addCountRequest(res.expectdate, function (res) {
        wx.hideLoading();
        that.setData({
          addcount: res.addcount
        })

        // 总数存入本地存储
        wx.setStorageSync('addcount', res.addcount);

      }, (err) => {
        wx.showToast({
          title: '加载失败...',
          image: '../../assets/fail.png',
          duration: 2000
        })
      })
    })
  },

  /**
   * 点击数量加号
   */
  onPlus: function (e) {
    var numbers = this.data.numbers;
    numbers++;
    if (numbers > 999 || numbers <= 0) {
      numbers = 1;
      this.setData({
        numbers: numbers,
        addBtnStatus: false,
      })
    }
    this.setData({
      numbers: numbers,
      addBtnStatus: true
    })
  },

  /**
   * 点击数量减号
   */
  onMinus: function (e) {
    var numbers = this.data.numbers;
    numbers--;
    if (numbers > 999 || numbers <= 0) {
      numbers = 1;
      this.setData({
        numbers: numbers,
        addBtnStatus: false,
      })
    }
    this.setData({
      numbers: numbers,
      addBtnStatus: true
    })
  },

  /**
   * 数量输入监听
   */
  onCountInput: function (e) {
    var numbers = e.detail.value;
    if (isNaN(numbers) || numbers <= 0 || numbers == null) {
      this.setData({
        addBtnStatus: false
      })
    } else {
      this.setData({
        numbers: numbers,
        addBtnStatus: true
      })
    }
  },

  /**
   * 生成券码请求  'productid': 1014519
   */
  ticketgenRequest: function (success, fail) {
    var now = dateUtil.formatTime(new Date());
    var regInfo = wx.getStorageSync('regInfo');
    var wxopenid = wx.getStorageSync('wxopenid');
    var content = {
      'productid': this.data.netbakeid,
      'startdate': dateUtil.formatLocal(this.data.limitstartdate),
      'enddate': dateUtil.formatLocal(this.data.limitenddate),
      'datasource': 11,
      'timestamp': now,
      'wxopenid': wxopenid
    };

    var ticketGenUrl = api.ticketGenUrl;
    var encContent = urlSafeBase64.encode(api.encryptContent(content));
    var sign = api.sign(content);
    var token = api.token;

    wx.request({
      url: ticketGenUrl,
      method: 'POST',
      data: {
        token: token,
        sign: sign,
        content: encContent
      },
      success: function (res) {
        var data = JSON.parse(res.data);
        var ticket = api.decryptContent(data.content);
        success(ticket);
      },
      fail: function (err) {
        fail(err);
      }
    })
  },

  /**
   * 券卡插入数据库请求
   */
  addToDBRequest: function (ticket, success, fail) {
    var addticketUrl = api.addticketUrl;
    var wxopenid = wx.getStorageSync('wxopenid');
    var company = wx.getStorageSync('regInfo').company;
    wx.request({
      url: addticketUrl,
      method: 'POST',
      data: {
        wxopenid: wxopenid,
        company: company,
        ticketcode: ticket.ticketcode,
        ticketno: ticket.ticketno,
        productname: ticket.productname,
        price: ticket.price,
        distributestatus: 0, // 状态0为未分发 1为已分发
        distributedate: dateUtil.formatTime(new Date()),
        expectdate: this.data.expectdate,
        desc1: this.data.desc1,
        desc2: this.data.desc2,
        desc3: this.data.desc3,
        desc4: this.data.desc4
      },
 
      success: function (res) {
        console.log(res);
        success(res);
      },
      fail: function (err) {
        fail(err);
      }
    })
  },

  /**
   * 统一处理添加卡券
   */
  addtickets: function () {
    // 客户无法超越申请数量的券总数
    var totalcount = this.data.totalcount,
      addcount = Number(this.data.addcount) + Number(this.data.numbers);
    if (addcount > totalcount) {
      wx.showToast({
        title: '超出总券数！',
        image: '../../assets/warning.png',
        mask: true,
        duration: 2000
      })
      return;
    }

    //  日期比较
    function compareDate(date1, date2) {
      var result = false;
      if (date1.getFullYear() > date2.getFullYear()) {
        result = true;
      } else if (date1.getFullYear() == date2.getFullYear()) {
        if (date1.getMonth() > date2.getMonth()) {
          result = true;
        } else if (date1.getMonth() == date2.getMonth()) {
          if (date1.getDate() > date2.getDate()) {
            result = true;
          }
        }
      }
      return result;
    }

    // 当前时间
    let now = dateUtil.formatDate(new Date());

    //  如果当前时间大于添加期限截止时间 弹框逾期 直接返回
    if (compareDate(new Date(now), new Date(this.data.limitenddate))) {
      wx.showToast({
        title: '时间逾期，无法添加...',
        image: '../../assets/warning.png',
        duration: 2000
      })
      return;
    }


    var addcount = this.data.addcount,
      numbers = this.data.numbers;
    wx.showLoading({
      title: '添加中...',
      mask: true
    })

    numbers--;
    this.setData({
      numbers: numbers
    })

    if (numbers <= -1) {
      wx.hideLoading();
      this.setData({
        numbers: 0,
        addBtnStatus: false
      })
      return;
    }

    this.ticketgenRequest((ticket) => {
      this.addToDBRequest(ticket, (res) => {
        addcount++;
        this.setData({
          addcount: addcount
        })
        wx.setStorageSync('addcount', addcount);
        this.addtickets();
      })
    }, (err) => {
      wx.showToast({
        title: '添加失败！',
        image: '../../assets/fail.png',
        mask: true,
        duration: 2000
      })
    })
  },

})