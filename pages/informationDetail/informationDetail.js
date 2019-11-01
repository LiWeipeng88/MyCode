var WxParse = require('../../wxParse/wxParse.js');
var app = getApp()
const bgMusicAudioContext = wx.getBackgroundAudioManager()
Page({
  data: {
    title: '',
    commentTxt: '',
    showLoading: true,
    noMoretip: false,
    page: 0,
    curPlaytime: '0:00',
    durationTime: '0:00',
    playProgressDis:false,
    isPlay:false,
    payWay:1,
    isShowadmire:false,
    admireCount:0,
    awardPage:0,
    awardIsmore:true,
    isShowadmireList:false,
    isShowcommentmodal:false,
    isShowshare: false,
    isShowposter: false,
    goodType: 'news',
    fixedShow: false
  },
  onLoad: function (e) {
    var that = this;
    if (e) {
      if (e.scene) {
        var scene = decodeURIComponent(e.scene).split('&');
        console.log(scene);
        var secneObj = {};
        for (var i = 0; i < scene.length; i++) {
          var arr = scene[i].split('=');
          var key = arr[0];
          secneObj[key] = arr[1];
        }
        e = secneObj;
      }
      if (e.id) {
        that.setData({
          id: e.id
        })
      }
    }
    var res = wx.getSystemInfoSync();
    that.setData({
      winW: res.windowWidth,
      winH: res.windowHeight
    })
  },
  onShow:function(){
    var that = this;
    if (!app.globalData.plumSession) {
      console.log("暂未获取到session");
      app.wechatSq(that);
    }else{
      wx.pageScrollTo({
        scrollTop: 0
      })
      that.setData({
        page: 0,
        awardPage: 0,
        noMoretip: false,
        showLoading: true
      });
      that.requestPostType();
      that.requestDetail();
      that.requestCommentList();
      app.requestAd(that)
    }
  },
  requestDetail: function () {
    var that = this;
    var id = that.data.id;
    //发起请求，获取列表列表
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.requestUrl,
      data: {
        map: 'applet_applet_information_details',
        id: id
      },
      success: function (res) {
        if (res.data.ec == 200) {
          console.log(res.data.data)
          var articleInfo = res.data.data;
          var isPay = 0;
          if (articleInfo.price>0){
            isPay = 1;
          }
          var goodStyle = 1;
          if (articleInfo.goodsInfo.length == 2) {
            goodStyle = 2;
          }
          if (articleInfo.goodsInfo.length > 2) {
            goodStyle = 3;
          }
          that.setData({
            articleInfo: articleInfo,
            isPay: isPay,
            goodStyle: goodStyle,
            likeAvatars: articleInfo.likeAvatars
          })
          
          app.globalData.watermark = res.data.data.watermark;
          app.globalData.openWatermark = res.data.data.openWatermark;
          app.globalData.supportOpen = res.data.data.supportOpen;
          app.setVersion(that);
          if (articleInfo.openReward==1){
            that.requestAdmirelist();
          }
          // 音乐播放
          var musicUrl = articleInfo.musicUrl;
          var playMusicTitle = articleInfo.title;
          var playMusicCover = articleInfo.cover;
          if (musicUrl != '') {
            app.globalData.playMusicid = articleInfo.id;
            if (app.globalData.curInfoMusicid == articleInfo.id){
              console.log("是当前播放的音乐");
              app.globalData.isPlaynew = '';
              console.log(app.globalData.isPlay);
              if (app.globalData.isPlay){
                 app.globalData.musicUrl = musicUrl;
                app.globalData.musicName = playMusicTitle;
                app.toggleInfoPlay(that);
              }else{
                that.setData({
                  isPlay:false
                })
                if (app.globalData.isReplay == 'reply') {
                  app.globalData.isPlay = false;
                  app.globalData.isPlaynew = 'new';
                }
                console.log("重新播放");
              }
            }else{
              console.log("不是当前播放的音乐");
              app.globalData.isPlaynew = 'new';
              app.globalData.musicUrl = musicUrl;
              app.globalData.musicName = playMusicTitle;
            }
          }
          console.log(app.globalData.isPlaynew);
          var article = articleInfo.content;
          // 富文本解析
          WxParse.wxParse('article', 'html', article, that, 5);
          that.setData({
            title: articleInfo.title
          })
          if (articleInfo.title) {
            wx.setNavigationBarTitle({
              title: articleInfo.title
            })
          }
        } else {
          console.log(res.data)
          app.errorTip(that, res.data.em, 2000);
          that.setData({
            articleInfo: ""
          })
        }
      },
      complete: function () {
        wx.hideLoading();
      }
    });
  },
  musicOpera: function () {
    var that = this;
    bgMusicAudioContext.onPlay(function () {
      console.log("音乐播放事件监听");
      that.setData({
        isPlay: true
      })
      app.globalData.isPlay = true;
    });
    bgMusicAudioContext.onPause(function () {
      console.log("音乐暂停事件执行");
      that.setData({
        isPlay: false
      })
      app.globalData.isPlay = false;
    });
    bgMusicAudioContext.onStop(function () {
      console.log("音乐停止事件执行");
      that.setData({
        isPlay: false
      })
      app.globalData.isPlay = false;
    });
    bgMusicAudioContext.onError(function () {
      console.log("播放错误")
      that.setData({
        isPlay: false
      })
      app.globalData.isPlay = false;
    })
  },
  requestCommentList: function () {
    var that = this;
    var id = that.data.id;
    var page = that.data.page;
    var data = {
      map: 'applet_comment_list',
      page: page,
      aid:id
    };
    wx.request({
      url: app.globalData.requestUrl,
      data: data,
      success: function (res) {
        console.log(page);
        console.log(res.data);
        if (res.data.ec == 200) {
          var allArr = [];
          var initArr = that.data.commentList ? that.data.commentList : [];
          var curArr = res.data.data;
          var lastPageLength = curArr.length;
          if (page > 0) {
            allArr = initArr.concat(curArr);
          } else {
            allArr = res.data.data;
          }
          that.setData({
            commentList: allArr
          })
          if (lastPageLength < 10) {
            that.setData({
              noMoretip: true,
              showLoading: false
            });
          }
          console.log(that.data.commentList);
        } else {
          if (page <= 0) {
            that.setData({
              commentList: [],
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
        wx.stopPullDownRefresh();
      }
    });
  },
  onPullDownRefresh: function () {
    var that = this;
    that.setData({
      page: 0,
      awardPage: 0,
      noMoretip: false,
      showLoading: true
    });
    that.requestDetail();
    that.requestCommentList();
    that.requestPostType();
    app.globalData.isPlaynew=='new';
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
      that.requestCommentList();
    }
  },
  backIndex:function(){
    wx.reLaunch({
      url: '/pages/singlePage/singlePage'
    })
  },
  playVideo:function(){
    if (bgMusicAudioContext.paused===false){
      bgMusicAudioContext.stop();
      app.globalData.curInfoMusicid = '';
      app.globalData.isPlay = false;
      app.globalData.isPlaynew = 'new';
    }
  },
  // 音乐播放切换
  togglePlay: function () {
    app.toggleInfoPlay(this);
  },
  // 音乐进度
  musicTimeChange:function(e){
    console.log(e.detail.value);
    if (e.detail.value>0){
      this.setData({
        lide: e.detail.value
      })
      wx.seekBackgroundAudio({
        position: e.detail.value
      })
    }
  },
  toComment: function () {
    this.setData({
      intoview: 'comment'
    })
  },
  commentChange: function (e) {
    this.setData({
      commentTxt: e.detail.value
    })
  },
  // 显示评论框
  showCommentmodal: function (e) {
    var mid = e.currentTarget.dataset.mid;
    var cid = e.currentTarget.dataset.cid;
    mid = mid ? mid : '';
    cid = cid ? cid : '';
    this.setData({
      isShowcommentmodal: true,
      mid: mid,
      cid: cid
    })
  },
  hideCommentmodal: function () {
    this.setData({
      isShowcommentmodal: false
    })
  },
  submitComment: function () {
    if (!app.globalData.plumSession) {
      app.wechatSq();
      return;
    }
    var that = this;
    var id = that.data.id;
    var commentTxt = that.data.commentTxt;
    var data = {
      map: 'applet_information_comment',
      aid: id,
      content: commentTxt
    }
    if(that.data.mid){
      data.cmid = that.data.mid;
      data.cid = that.data.cid;
    }
    console.log(data);
    //发起请求，获取列表列表
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.requestUrl,
      data: data,
      success: function (res) {
        console.log(res.data);
        if (res.data.ec == 200) {
          var commentList = that.data.commentList;
          var articleInfo = that.data.articleInfo;
          if (data.cid){
            var curCommentindex = 0;
            for (var i in commentList) {
              if (data.cid == commentList[i].id){
                curCommentindex = i;
              }
            }
            commentList[curCommentindex].replyList.push(res.data.data.comment)
          }else{
            articleInfo.commentNum++;
            commentList.unshift(res.data.data.comment);
            that.pageScrolltop();
          }
          app.errorTip(that, res.data.data.msg, 2000);
          that.setData({
            commentList: commentList,
            articleInfo: articleInfo,
            commentTxt: ''
          })
          that.hideCommentmodal();
          
        } else {
          console.log(res.data)
          app.errorTip(that, res.data.em, 2000);
        }
      },
      complete: function () {
        wx.hideLoading();
      }
    });
  },
  pageScrolltop: function () {
    wx.createSelectorQuery().select('#topPart').boundingClientRect(function (rect) {
      console.log(rect.height);
      wx.pageScrollTo({
        scrollTop: rect.height,
        duration: 300
      })
    }).exec()
  },
  submitLike: function () {
    if (!app.globalData.plumSession) {
      app.wechatSq(this);
      return;
    }
    var that = this;
    var id = that.data.id;
    //发起请求，获取列表列表
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.requestUrl,
      data: {
        map: 'applet_information_like',
        aid: id
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.ec == 200) {
          var articleInfo = that.data.articleInfo;
          articleInfo.likeNum = res.data.data.likeNum;
          articleInfo.isLike = res.data.data.isLike;
          that.setData({
            articleInfo: articleInfo,
            likeAvatars: res.data.data.likeAvatars
          })
        } else {
          console.log(res.data)
          app.errorTip(that, res.data.em, 2000);
        }
      },
      complete: function () {
        wx.hideLoading();
      }
    });
  },
  submitCollection: function () {
    if (!app.globalData.plumSession) {
      app.wechatSq(this);
      return;
    }
    var that = this;
    var id = that.data.id;
    //发起请求，获取列表列表
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.requestUrl,
      data: {
        map: 'applet_information_collection',
        id: id
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.ec == 200) {
          var articleInfo = that.data.articleInfo;
          articleInfo.isCollection = res.data.data.isCollection;
          that.setData({
            articleInfo: articleInfo
          })
        } else {
          console.log(res.data)
          app.errorTip(that, res.data.em, 2000);
        }
      },
      complete: function () {
        wx.hideLoading();
      }
    });
  },
  openPayread:function(){
    wx.navigateTo({
      url: '/subpages/payRead/payRead'
    })
  },
  // 单次阅读付费
  paySingleread:function(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    var type = e.currentTarget.dataset.type;
    var data = {
      map: 'applet_information_pay',
      id: id,
      type: type
    };
    console.log(data);
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.requestUrl,
      data: data,
      success: function (res) {
        if (res.data.ec == 200) {
          console.log(res.data.data);
          that.moneyPay(res.data.data);
        } else {
          console.log(res.data)
          app.errorTip(that, res.data.em, 2000);
        }
      },
      complete: function () {
        wx.hideLoading();
      }
    });
  },
  moneyPay: function (params,type) {
    var that = this;
    wx.requestPayment({
      'appId': params.appId,
      'timeStamp': params.timeStamp,
      'nonceStr': params.nonceStr,
      'package': params.package,
      'signType': 'MD5',
      'paySign': params.paySign,
      'success': function (res) {
        wx.showLoading({
          title: '加载中',
        })
        var msg = '支付成功';
        if (type == 'admire'){
          msg = '打赏成功';
        }
        that.setData({
          admireVal: '',
          isShowadmire: false,
          payWay: 1
        })
        setTimeout(function () {
          wx.hideLoading();
          wx.showModal({
            title: '',
            content: msg,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                if (type=='admire'){
                  console.log("赞赏成功");
                  that.refreshAdmirelist();
                }else{
                  that.requestDetail();
                }
              }
            }
          })
        }, 1000)
      },
      'fail': function (res) {
        console.log(res);
        wx.showModal({
          title: '',
          content: '支付失败',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {

            }
          }
        })
      }
    });
  },
  showAdmireModal:function(){
    this.setData({
      isShowadmire: true
    })
  },
  showAdmireListModal: function () {
    this.setData({
      isShowadmireList: true
    })
  },
  hideModal: function () {
    this.setData({
      isShowadmire: false,
      isShowadmireList:false
    })
  },
  // 付款方式配置
  requestPostType: function () {
    var that = this;
    wx.request({
      url: app.globalData.requestUrl,
      data: {
        map: 'applet_pay_cfg'
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.ec == 200) {
          that.setData({
            payType: res.data.data,
            payWay: res.data.data[0].type
          })
        } else {
          // app.errorTip(that, res.data.em, 2000);
          that.setData({
            payType: [],
            payWay: 1
          })
        }
      },
      complete: function () {
      }
    });
  },
  payRadioChange: function (e) {
    this.setData({
      payWay: e.detail.value
    })
    console.log(this.data.payWay);
  },
  admireValChange:function(e){
    this.setData({
      admireVal: e.detail.value
    })
  },
  confirmAdmire: function () {
    var that = this;
    var id = that.data.id;
    var money = that.data.admireVal ? that.data.admireVal:0;
    if (money<=0){
      return;
    }
    var data = {
      map: 'applet_information_post_reward',
      aid: id,
      type: 1,
      money: money,
      payWay: that.data.payWay
    }
    //发起请求，获取列表列表
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.requestUrl,
      data: data,
      success: function (res) {
        if (res.data.ec == 200) {
          console.log(res.data.data)
          if (data.payWay==1){
            var params = res.data.data;
            that.moneyPay(params,'admire');
          }else{
            app.errorTip(that, res.data.data.msg, 2000);
            that.setData({
              admireVal:'',
              isShowadmire: false,
              payWay:1
            })
            that.refreshAdmirelist();
          }
        } else {
          console.log(res.data)
          app.errorTip(that, res.data.em, 2000);
        }
      },
      complete: function () {
        wx.hideLoading();
      }
    });
  },
  requestAdmirelist: function () {
    var that = this;
    var page = that.data.awardPage;
    var data = {
      map : 'applet_reward_list',
      page : page,
      currId : that.data.articleInfo.id,
      type : 1
    };
    console.log(data);
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.requestUrl,
      data: data,
      success: function (res) {
        console.log("当前请求分页为" + page);
        console.log(res.data);
        if (res.data.ec == 200) {
          var allArr = [];
          var initArr = that.data.admireList ? that.data.admireList : [];
          var curArr = res.data.data.list;
          var lastPageLength = curArr.length;
          if (page > 0) {
            allArr = initArr.concat(curArr);
          } else {
            allArr = res.data.data.list;
          }
          page++;
          that.setData({
            admireCount: res.data.data.count,
            admireList: allArr,
            awardPage: page
          })
          if (lastPageLength < 10) {
            that.setData({
              awardIsmore: false
            });
          }
          console.log(that.data.admireList);

        } else {
          if (page <= 0) {
            that.setData({
              admireList: [],
              awardIsmore:false
            })
          } else {
            that.setData({
              awardIsmore: false
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
  refreshAdmirelist:function(){
    var that = this;
    that.setData({
      awardPage:0,
      awardIsmore: true
    })
    that.requestAdmirelist();
  },
  toInfodetail:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/informationDetailtwo/informationDetailtwo?id='+id
    })
  },
  goodDetail: function (e) {
    var goodId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goodDetail/goodDetail?id=' + goodId
    })
  },
  toTechnicalPage: function (e) {
    var onoff = e.currentTarget.dataset.onoff;
    if (onoff) {
      wx.navigateTo({
        url: '/pages/technicalPage/technicalPage'
      })
    }
  },
  showSharemodal: function () {
    this.setData({
      isShowshare: true
    })
  },
  hideSharemodal: function () {
    this.setData({
      isShowshare: false
    })
  },
  showPoster: function () {
    var that = this;
    that.setData({
      isShowposter: true,
      fixedShow: true
    })
    var isDrawfinish = that.data.isDrawfinish;
    if (isDrawfinish) { return; }
    app.requestShareinfo(that);
  },
  hidePoster: function () {
    var that = this;
    that.setData({
      isShowposter: false,
      fixedShow: false
    })
  },
  saveImage: function () {
    app.saveImage(this)
  },
  onShareAppMessage: function () {
    var that = this;
    var id = that.data.id;
    var title = that.data.title;
    var shareInfo = app.globalData.shareInfo;
    title = shareInfo.shareTitle ? shareInfo.shareTitle : title;
    var cover = shareInfo.shareCover ? shareInfo.shareCover : '';
    return {
      title: title,
      imageUrl: cover,
      path: '/pages/informationDetail/informationDetail?id=' + id,
      success: function () {
        wx.request({
          url: app.globalData.requestUrl,
          data: {
            map: 'applet_information_share_statistics',
            aid: id
          },
          success: function (res) {
            console.log(res.data);
            if (res.data.ec == 200) {
              console.log(res.data.data);
              var articleInfo = that.data.articleInfo;
              articleInfo.shareNum++;
              that.setData({
                articleInfo: articleInfo
              })
            } else {
              console.log(res.data)
            }
          },
          fail: function () {
            wx.hideLoading();
          }
        });
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
  },
})