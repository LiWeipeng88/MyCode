const app = getApp();
Page({
  data: {
    status: 'on',
    page: 0,
    noMoretip: false,
    showLoading: true,
  },
  onLoad: function (e) {
    var that = this;
    that.requesDataList();
  },
  //tab切换
  toggleChange: function (e) {
    var that = this;
    var status = e.currentTarget.dataset.status;
    that.setData({
      status: status,
      activityList: null,
      page: 0,
      noMoretip: false,
      showLoading: true,
    });
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
    data.map = 'applet_sequence_leader_group';
    data.page = page;
    data.status = that.data.status;
    wx.request({
      url: app.globalData.requestUrl,
      data: data,
      success: function (res) {
        console.log(res.data);
        if (res.data.ec == 200) {
          var allArr = [];
          var initArr = that.data.activityList;
          var curArr = res.data.data;
          var lastPageLength = curArr.length;
          if (page > 0) {
            allArr = initArr.concat(curArr);
          } else {
            allArr = res.data.data;
          }
          that.setData({
            activityList: allArr
          })
          if (lastPageLength < 10) {
            that.setData({
              noMoretip: true,
              showLoading: false
            });
          }
          console.log(that.data.activityList);
        } else {
          console.log(res.data)
          if (page <= 0) {
            that.setData({
              activityList: [],
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
  //打开活动详情
  activityDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    var groupId = e.currentTarget.dataset.groupid;
    wx.navigateTo({
      url: '/pages/activityDetail/activityDetail?id=' + id + '&groupId=' + groupId,
    })
  },
  //订单明细
  toActivityorder:function(e){
    var that = this;
    var groupId = e.currentTarget.dataset.groupid
    wx.navigateTo({
      url: '/subpages/Activityorder/Activityorder?groupId=' + groupId,
    })
  },
  //活动统计
  toActivitycount:function(e){
    var that = this;
    var groupId = e.currentTarget.dataset.groupid
    wx.navigateTo({
      url: '/subpages/Activitycount/Activitycount?groupId=' + groupId,
    })
  },
  //商品统计
  toGoodcount: function (e) {
    var that = this;
    var groupId = e.currentTarget.dataset.groupid;
    console.log(groupId);
    wx.navigateTo({
      url: '/subpages/Goodcount/Goodcount?groupId=' + groupId,
    })
  },
  //回到首页
  backIndex:function(){
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  hidePoster: function () {
    var that = this;
    that.setData({
      isShowposter: false
    })
  },
  //生成海报
  creatPost:function(e){
    var that = this;
    var groupId = e.currentTarget.dataset.groupid;
    wx.navigateTo({
      url: '/subpages/createrPoster/createrPoster?groupId=' + groupId,
    })
  },
  // onShareAppMessage: function () {
  //   var that = this;
  //   var id = that.data.id;
  //   var groupId = that.data.groupId;
  //   console.log(id);
  //   console.log(groupId);
  //   var title = '活动';
  //   var shareInfo = app.globalData.shareInfo;
  //   title = shareInfo.shareTitle ? shareInfo.shareTitle : title;
  //   var cover = shareInfo.shareCover?shareInfo.shareCover:''
  //   return {
  //     title: title,
  //     imageUrl: cover,
  //     path: '/pages/activityDetail/activityDetail?id=' + id + '&groupId=' + groupId,
  //     success: function () {

  //     }
  //   }
  // }
})