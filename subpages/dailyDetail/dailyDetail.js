const app = getApp();
Page({
  data: {
    page: 0,
    noMoretip: false,
    showLoading: true,
  },
  onLoad: function (e) {
    var that = this;
    if(e&&e.date){
      that.setData({
        date:e.date
      })
    };
    that.requesDataList();
  },
  //列表数据
  requesDataList: function () {
    var that = this;
    wx.showLoading({
      title: '正在加载',
      mask: true
    });
    var data = {};
    var page = that.data.page;
    // app.setVersion(that);
    data.map = 'applet_sequence_leader_day_detail';
    data.page = page;
    data.date = that.data.date;
    wx.request({
      url: app.globalData.requestUrl,
      data: data,
      success: function (res) {
        console.log(res.data);
        if (res.data.ec == 200) {
          var allArr = [];
          var initArr = that.data.DataList;
          var curArr = res.data.data;
          var lastPageLength = curArr.length;
          if (page > 0) {
            allArr = initArr.concat(curArr);
          } else {
            allArr = res.data.data;
          }
          that.setData({
            DataList: allArr
          })
          if (lastPageLength < 10) {
            that.setData({
              noMoretip: true,
              showLoading: false
            });
          }
          console.log(that.data.DataList);
        } else {
          console.log(res.data)
          if (page <= 0) {
            that.setData({
              DataList: [],
              noMoretip: false,
              showLoading: false
            })
          } else {
            that.setData({
              noMoretip: true,
              showLoading: false
            });
          }
        }
      },
      complete: function () {
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    });
  },
  onPullDownRefresh: function () {
    this.setData({
      page: 0,
      noMoretip: false,
      showLoading: true
    });
    this.requesDataList();
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
      that.requesDataList();
    }
  },
})