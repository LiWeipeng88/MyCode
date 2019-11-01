const app = getApp();
Page({
  data: {
    showLoading: true,
    noMoretip: false,
    page: 0,
  },
  onLoad: function (e) {
    var that = this;
    if(e&&e.code){
      that.setData({
        code:e.code
      })
    };
    that.verifyDetail();
  },
  //订单详情
  verifyDetail: function () {
    var that = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      mask: true,
      duration: 10000
    });
    wx.request({
      url: app.globalData.requestUrl,
      data: {
        map: 'applet_sequence_get_trade_verify',
        code: that.data.code
      },
      success: function (res) {
        if (res.data.ec == 200) {
          console.log(res.data.data);
          that.setData({
            orderDetail: res.data.data
          })

        } else {
          that.setData({
            activityList:[]
          })
          console.log(res.data);
        }
      },
      complete: function () {
        wx.hideToast();
      }
    });
  },
  //退款
  refundMoney: function (e) {
    var that = this;
    var tid = e.currentTarget.dataset.tid;
    wx.showModal({
      title: '',
      cancelText: '再考虑下',
      confirmText: '确认',
      content: '确认退款吗？',
      confirmColor: '#1AAD16',
      success: function (res) {
        if (res.confirm) {
          //发起请求，获取列表列表
          wx.request({
            url: app.globalData.requestUrl,
            data: {
              map: 'applet_sequence_active_refund',
              tid: tid
            },
            success: function (res) {
              console.log(res.data);
              if (res.data.ec == 200) {
                app.errorTip(that, res.data.data.msg, 2000);
                that.onLoad();
              } else {
                console.log(res.data);
                app.errorTip(that, res.data.em, 2000);
              }
            },
            complete: function () {
              wx.hideLoading();
              wx.stopPullDownRefresh();
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // requestOrderList: function (type) {
  //   var that = this;
  //   var data = {};
  //   var page = that.data.page;
  //   data.map = 'applet_city_post_list';
  //   data.page = page;
  //   data.type = type;
  //   wx.request({
  //     url: app.globalData.requestUrl,
  //     data: data,
  //     success: function (res) {
  //       console.log(page);
  //       console.log(res.data);
  //       if (res.data.ec == 200) {
  //         var allArr = [];
  //         var initArr = that.data.orderList ? that.data.orderList : [];
  //         var curArr = res.data.data;
  //         var lastPageLength = curArr.length;
  //         if (page > 0) {
  //           allArr = initArr.concat(curArr);
  //         } else {
  //           allArr = res.data.data;
  //         }
  //         for (var i = 0; i < allArr.length; i++) {
  //           allArr[i].shortContent = (allArr[i].content).substring(0, 50);
  //           allArr[i].isShowAll = false;
  //         }
  //         that.setData({
  //           orderList: allArr
  //         })
  //         if (lastPageLength < 10) {
  //           that.setData({
  //             noMoretip: true,
  //             showLoading: false
  //           });
  //         }
  //         console.log(that.data.orderList);
  //       } else {
  //         if (page <= 0) {
  //           that.setData({
  //             orderList: [],
  //             noMoretip: false,
  //             showLoading: false
  //           })
  //         } else {
  //           that.setData({
  //             noMoretip: true,
  //             showLoading: false
  //           });
  //         }
  //       }
  //     },
  //     complete: function () {
  //       wx.hideToast();
  //       wx.stopPullDownRefresh();
  //     }
  //   });
  // },
  // onPullDownRefresh: function () {
  //   var that = this;
  //   that.setData({
  //     page: 0,
  //     noMoretip: false,
  //     showLoading: true
  //   });
  //   var type = that.data.type;
  //   that.requestOrderList(type);
  //   console.log("下拉刷新");
  // },
  // onReachBottom: function () {
  //   var that = this;
  //   console.log("到达页面底部")
  //   var isMore = that.data.noMoretip;
  //   var page = that.data.page;
  //   var sortType = that.data.curSort;
  //   var curLng = that.data.curLng;
  //   var curLat = that.data.curLat;
  //   page++;
  //   that.setData({
  //     page: page
  //   });
  //   if (isMore) {
  //     console.log("已完成或正在加载");
  //   } else {
  //     var type = that.data.type;
  //     that.requestOrderList(type);
  //   }
  // },
  //退款
  //确认核销
  confirmVerify: function (e) {
    var that = this;
    var tid = e.currentTarget.dataset.tid;
    wx.showModal({
      title: '',
      content: '确定核销？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.requestUrl,
            data: {
              map: 'applet_sequence_verify_trade',
              tid: tid
            },
            success: function (res) {
              if (res.data.ec == 200) {
                console.log(res.data.data);
                app.errorTip(that, res.data.data.msg, 2000);
                that.onLoad();
              } else {
                console.log(res.data);
                app.errorTip(that, res.data.em, 2000);
              }
            },
            complete: function () {
              wx.hideToast();
            }
          });
        }
      }
    })
  },
})