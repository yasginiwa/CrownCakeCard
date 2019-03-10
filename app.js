//app.js
const api = require('utils/api.js');

App({
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    //  获取openid
    var getcrowncakecardwxopenidUrl = api.getcrowncakecardwxopenidUrl;
    wx.login({
      success: function (res) {
        wx.request({
          url: getcrowncakecardwxopenidUrl,
          method: 'POST',
          data: {
            js_code: res.code
          },
          success: function (result) {
            wx.hideLoading();
            wx.setStorageSync('wxopenid', result.data.result.wxopenid)

            //  判断是否是第一次登录 如果是就去注册界面 如不是 则弹出欢迎界面 并请求公司数据存储到本地 
            
             var wxopenid = wx.getStorageSync('wxopenid'),
              querywxopenidsUrl = api.querywxopenidsUrl,
              cols = ['wxopenid', 'company', 'contact', 'phone', 'regdate', 'authstatus'];
            // 返回是否存在此wxopenid的注册过的公司
            hasCompany = function (wxopenid, companys) {
              for (var i in companys) {
                companyObj = companys[i];
                if (wxopenid == companyObj.wxopenid) {
                  return companyObj;
                }
              }
              return null;
            };

            var regInfo = wx.getStorageSync('regInfo');
            if (!regInfo) {
              wx.setStorageSync('isReLogin', true);
              wx.request({
                url: querywxopenidsUrl,
                method: 'POST',
                data: {
                  cols: cols
                },
                success: function (res) {
                  if (res.code = 1) {
                    var companys = res.data.result.recordsets[0];
                    var companyObj = hasCompany(wxopenid, companys);
                    if (companyObj) {
                      wx.setStorageSync('regInfo', companyObj)
                      wx.showToast({
                        title: `欢迎回来！${companyObj.company}`,
                        icon: 'none',
                        duration: 2000
                      })
                    }
                  }
                }
              })
            }

          }
        })
      }
    })
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {

  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {

  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {

  }
})
