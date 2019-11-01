//获取应用实例
var app = getApp()
Page({
  data: {
    type: 2,
    showLoading: true,
    noMoretip: false,
    page: 0,
    curNewsId: ''
  },
  onLoad: function (e) {
    var that = this;
    app.setNavColor(that);
    if (e && e.title) {
      app.setNavtitle(e.title);
      that.setData({
        title: e.title
      })
    } else {
      app.setNavtitle('资讯列表');
    }
    if (e && e.id) {
      that.setData({
        id: e.id
      })
    }
    setTimeout(function () {
      if (that.data.id) {
        that.requestServiceList(that.data.id);
      } else {
        that.requestServiceFl();
        app.requestAd(that)
      }
    }, 1)
  },
  onShow: function () {
    var that = this;
    // app.setNavtitle('资讯列表');
    that.setData({
      customerService: app.globalData.customerService ? app.globalData.customerService:'',
      sessionForm: app.globalData.sessionForm ? app.globalData.sessionForm:''
    })
    app.contactData(that);
  },
  getPhoneNumber: function (e) {
    app.getPhoneNumber(e, this)
  },
  contactRecord: function () {
    app.contactRecord(this);
  },
  requestServiceFl: function () {
    var that = this;
    wx.request({
      url: app.globalData.requestUrl,
      data: {
        map: 'applet_applet_information_category'
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.ec == 200) {
          var newsTab = res.data.data;
          var isMaxlength = false;
          for (var i = 0; i < newsTab.length; i++) {
            if (i < 4) {
              if (newsTab[i].name.length >= 6) {
                isMaxlength = true;
              }
            }
          }
          var showStyle = 1;
          if (isMaxlength) {
            console.log("大于6");
            var threeLength = 0;
            for (var i = 0; i < newsTab.length; i++) {
              if (i < 3) {
                threeLength += newsTab[i].name.length;
              }
            }
            console.log(threeLength);
            if (newsTab.length > 3 || threeLength > 20) {
              console.log("大于6自由分");
              showStyle = 2;
            }
          } else {
            console.log("小于6");
            if (newsTab.length > 4) {
              console.log("小于6自由分");
              showStyle = 2;
            }
          }
          console.log(showStyle);
          that.setData({
            newsTab: newsTab,
            showStyle: showStyle
          })
          if (!that.data.curNewsId) {
            that.setData({
              curNewsId: res.data.data && res.data.data.length > 0 ? res.data.data[0].id : '',
              goIntoView: res.data.data && res.data.data.length > 0 ? 'newsfl' + res.data.data[0].id : '',
            })
          }
          var cid = that.data.curNewsId;
          that.requestServiceList(cid);
        } else {
          that.setData({
            newsTab: []
          })
          that.requestServiceList(0);
        }
      },
      complete: function () {
        wx.hideToast();
        wx.stopPullDownRefresh();
      }
    });
  },
  requestServiceList: function (cid) {
    var that = this;
    var data = {};
    var page = that.data.page;
    var type = that.data.type;
    var sortType = that.data.sortType;
    data.map = 'applet_applet_information_list';
    data.categoryId = cid;
    data.page = page;
    app.setVersion(that);
    wx.request({
      url: app.globalData.requestUrl,
      data: data,
      success: function (res) {
        console.log(page);
        console.log(res.data);
        if (res.data.ec == 200) {
          var allArr = [];
          var initArr = that.data.newsList ? that.data.newsList : [];
          var curArr = res.data.data.list;
          var lastPageLength = curArr.length;
          if (page > 0) {
            allArr = initArr.concat(curArr);
          } else {
            allArr = res.data.data.list;
          }
          that.setData({
            slideImgs: res.data.data.newSlide,
            newsList: allArr,
            liststyle: res.data.data.style
          })
          if (lastPageLength < 10) {
            that.setData({
              noMoretip: true,
              showLoading: false
            });
          }
          console.log(that.data.newsList);
        } else {
          if (page <= 0) {
            console.log(page + '---');
            that.setData({
              newsList: [],
              noMoretip: false,
              showLoading: false
            })
          } else {
            console.log(page + '1111');
            that.setData({
              noMoretip: true,
              showLoading: false
            });
          }
        }
      },
      complete: function () {
        wx.hideToast();
        wx.stopPullDownRefresh();
      }
    });
  },
  newsToggle: function (e) {
    var that = this;
    var id = e.target.dataset.id;
    that.setData({
      page: 0,
      curNewsId: id,
      goIntoView: 'newsfl' + id,
      noMoretip: false,
      showLoading: true,
      slideImgs: []
    })
    if (that.data.newsList.length <= 0) {
      that.setData({
        newsList: null
      })
    }
    that.requestServiceList(id);
  },
  onPullDownRefresh: function () {
    var that = this;
    var cid = that.data.curNewsId ? that.data.curNewsId:that.data.id;
    that.setData({
      page: 0,
      noMoretip: false,
      showLoading: true
    });
    if (that.data.newsList.length <= 0) {
      that.setData({
        newsList: null
      })
    }
    if (that.data.id) {
      that.requestServiceList(that.data.id);
    } else {
      that.requestServiceFl();
      that.requestServiceList(cid);
    }
    console.log("下拉刷新");
  },
  onReachBottom: function () {
    var that = this;
    console.log("到达页面底部")
    var isMore = that.data.noMoretip;
    var page = that.data.page;
    var cid = that.data.curNewsId ? that.data.curNewsId:that.data.id;
    page++;
    that.setData({
      page: page
    });
    if (isMore) {
      console.log("已完成或正在加载");
    } else {
      that.requestServiceList(cid);
    }
  },
  seeDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    var title = e.currentTarget.dataset.title;
    if (e.currentTarget.dataset.index) {
      var index = e.currentTarget.dataset.index;
      var newsList = this.data.newsList;
      if (newsList[index].showNum < 9999) {
        newsList[index].showNum++;
      }
      this.setData({
        newsList: newsList
      })
    }
    wx.navigateTo({
      url: '/pages/informationDetail/informationDetail?id=' + id + '&title=' + title
    })
  },
  makeCall: function () {
    app.makeCall();
  },
  onShareAppMessage: function () {
    var that = this;
    var shareInfo = app.globalData.shareInfo;
    var title = shareInfo.shareTitle ? shareInfo.shareTitle : '资讯';
    var cover = shareInfo.shareCover ? shareInfo.shareCover : '';
    return {
      title: title,
      imageUrl: cover,
      path: 'pages/information/information',
      success: function () {
        wx.request({
          url: app.globalData.requestUrl,
          data: {
            map: 'applet_share_get_point'
          },
          success: function (res) {
            console.log(res.data);
            if (res.data.ec == 200) {
              if (res.data.data.msg) {
                console.log(res.data.data.msg);
                app.errorTip(that, res.data.data.msg, 2000);
              }
            } else {
              if (res.data.em) {
                app.errorTip(that, res.data.em, 2000);
              }
            }
          },
          complete: function () {
          }
        });
      }
    }
  }
})
