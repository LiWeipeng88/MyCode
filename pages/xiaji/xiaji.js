// subpages/fxCenter/fxCenter.js
const app = getApp();
Page({
  data: {
    detailsType: 3,
    page: 0,
    noMoretip: false,
    showLoading: true,
  },
  onLoad: function (e) {
    var that = this;
    that.requestDetail();
    
    that.getInfo();
  },
  //活动统计内容

  getInfo:function(){
    var that = this;
    var data = {};
    data.map = 'applet_setting_shouyi';
    wx.request({
      url: app.globalData.requestUrl,
      data: data,
      success: function (res) {

        console.log(res.data.data);

        if (res.data.data==1){
            wx.showModal({
              title: '信息提示',
              content: '没有记录',
              showCancel: false,

              success:function(){
                wx.navigateBack({
                  delta: 1,
                })
              }

            })
            
           
        }

        that.setData({
          list: res.data.data,
          alist: res.data.list,
        })


      },

    })

    




  },

  requestDetail: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.requestUrl,
      data: {
        map: 'applet_sequence_leader_center',
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.ec == 200) {
          that.setData({
            detailData: res.data.data
          })
        } else {
          // app.errorTip(that, res.data.em, 2000);
        }
      },
      complete: function () {
        wx.hideLoading();
      }
    });
  },
  //打开更多记录
  openMoreRecord:function(){
    var that = this;
    wx.navigateTo({
      url: '/subpages/fxRecord/fxRecord',
    })
  },
  // toggleDetailstype: function (e) {
  //   var that = this;
  //   var type = e.currentTarget.dataset.type;
  //   that.setData({
  //     detailsType: type,
  //     detailsList: null,
  //     page: 0,
  //     noMoretip: false,
  //     showLoading: true
  //   })
  //   that.onLoad();
  // },
  // requestList: function () {
  //   var that = this;
  //   var data = {};
  //   var page = that.data.page;
  //   if (that.data.detailsType == 3) {
  //     data.map = 'applet_city_inout_history';
  //     data.type = that.data.detailsType;
  //   }
  //   if (that.data.detailsType == 1) {
  //     data.map = 'applet_sequence_deduct_list';
  //   }
  //   wx.request({
  //     url: app.globalData.requestUrl,
  //     data: data,
  //     success: function (res) {
  //       console.log(res.data);
  //       if (res.data.ec == 200) {
  //         var allArr = [];
  //         var initArr = that.data.detailsList;
  //         var curArr = res.data.data;
  //         var lastPageLength = curArr.length;
  //         if (page > 0) {
  //           allArr = initArr.concat(curArr);
  //         } else {
  //           allArr = res.data.data;
  //         }
  //         that.setData({
  //           detailsList: allArr
  //         })
  //         if (lastPageLength < 10) {
  //           that.setData({
  //             noMoretip: true,
  //             showLoading: false
  //           });
  //         }
  //         console.log(that.data.detailsList);
  //       } else {
  //         if (page <= 0) {
  //           that.setData({
  //             detailsList: [],
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
  //       wx.hideLoading();
  //       wx.stopPullDownRefresh();
  //     }
  //   });
  // },
  onPullDownRefresh: function () {
    var that = this;
    that.setData({
      page: 0,
      noMoretip: false,
      showLoading: true
    });
    that.onLoad();
    console.log("下拉刷新");
  },
  onReachBottom: function () {
    var that = this;
    console.log("到达页面底部")
    var isMore = that.data.noMoretip;
    var page = that.data.page;
    page++;
    that.setData({
      page: page
    });
    if (isMore) {
      console.log("已完成或正在加载");
    } else {
      that.onLoad();
    }
  },
  //去提现
  toTx:function(){
    var that = this;
    wx.navigateTo({
      url: '/subpages/incomeWithdraw/incomeWithdraw',
    })
  }
})