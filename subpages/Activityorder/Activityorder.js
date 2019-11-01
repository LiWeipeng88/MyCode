const app = getApp();
Page({
  data: {
    status: 'all',
    page: 0,
    noMoretip: false,
    showLoading: true,
    keyword: '',
  },
  onLoad: function (e) {
    var that = this;
    if (e && e.groupId) {
      that.setData({
        groupId: e.groupId
      })
    };
    that.requesDataList();
  },

  hexiao: function () {

    var c_id = wx.getStorageSync('c_id');
    var that = this;
    wx.request({
      url: app.globalData.requestUrl,
      data: {
        map: 'applet_sequence_hexiao_hexiao',
        xiaoqu_id: c_id
      },
      success: function (res) {


        if (res.data == 2) {
          wx.showToast({
            title: '核销完成',
          })
        } else {

          app.errorTip(that, "核销失败,暂无核销", 2000);
        }
      },

    });





  },
  //搜索的文字内容
  searchValue: function (e) {
    var that = this;
    that.setData({
      keyword: e.detail.value
    })
  },
  //搜索对应的内容
  searchOrder: function () {
    var that = this;
    that.requesDataList();
  },
  //tab切换
  toggleChange: function (e) {
    var that = this;
    var status = e.currentTarget.dataset.status;
    var id = e.currentTarget.dataset.id;
    that.setData({
      status: status,
      id:id,
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
    data.map = 'applet_sequence_leader_trade';
    data.page = page;
    data.status = that.data.status;
    if (that.data.id==1){
      data.zhuangtai=1;
    }else{
      data.zhuangtai=0;
    }
    if (that.data.groupId) {
      data.groupId = that.data.groupId;
    }
    if (that.data.keyword) {
      data.keyword = that.data.keyword;
    }
    console.log(data);
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
      showLoading: true,
      keyword: ''
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
                that.setData({
                  page: 0,
                  noMoretip: false,
                  showLoading: true,
                })
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
  //确认核销
  confirmVerify: function (e) {
    var that = this;
    var tid = e.currentTarget.dataset.tid;
    var status = e.currentTarget.dataset.status;
    if(status!=1){
      wx.showModal({
        title: '提示',
        content: '请等待送货人员送到',
        showCancel: false,

      })
      return false;
    }

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
                that.setData({
                  page: 0,
                  noMoretip: false,
                  showLoading: true,
                })
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
  //返回首页
  backIndex: function () {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
})