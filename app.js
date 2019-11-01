
//app.js  fieipckkqx  wx33ec7fea91491757
var rqcfg = require('./utils/constant.js');
//var aldstat = require('./utils/san.js');
const bgMusicAudioContext = wx.getBackgroundAudioManager();
const EARTH_RADIUS = 6378137.0;//单位m
var navigateTo = wx.navigateTo;
Object.defineProperty(wx, 'navigateTo', {
  configurable: true,
  enumerable: true,
  writable: true,
})

wx.navigateTo = function (data) {
  setTimeout(function () {
    navigateTo(data)
  }, 100)
}
App({
  data: {

  },
  onLaunch: function () {
    var that = this;
    if (rqcfg.rqcfg.suid) {
      that.globalData.requestUrl = rqcfg.rqcfg.rqurl + 'suid=' + rqcfg.rqcfg.suid;
      rqcfg.rqcfg.rqurl = rqcfg.rqcfg.rqurl + 'suid=' + rqcfg.rqcfg.suid + '&appid=' + rqcfg.rqcfg.appid;
      that.globalData.suid = rqcfg.rqcfg.suid;
      that.globalData.version = rqcfg.rqcfg.version;
      that.wechatSq();
    } else {
      let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {}
      if (extConfig) {
        console.log(extConfig);
        var suid = extConfig.suid;
        var version = extConfig.version;
        var base = extConfig.base;
        var appid = extConfig.appid ? extConfig.appid : '';
        var navBgcolor = extConfig.navigationBarBackgroundColor ? extConfig.navigationBarBackgroundColor:'';
        that.globalData.menuTitle = extConfig.menu;
        rqcfg.rqcfg.rqurl = rqcfg.rqcfg.rqurl + 'suid=' + suid + '&appid=' + appid;;
        that.globalData.requestUrl = rqcfg.rqcfg.rqurl;
        that.globalData.suid = suid;
        that.globalData.version = version;
        that.globalData.base = base;
        that.globalData.appid = appid;
        that.globalData.navBgcolor = extConfig.navigationBarBackgroundColor;
        that.globalData.navTextStyle = extConfig.navigationBarTextStyle;
        that.wechatSq();
      }
    }
  },
  globalData: {
    requestUrl: rqcfg.rqcfg.rqurl,
    domin: rqcfg.rqcfg.domin,
    suid: rqcfg.rqcfg.suid,
    isnewPlay:false
  },
  wechatSq: function (obj) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.login({
      success: function (res) {
        var code = res.code;
        console.log(code);
        console.log(res);
        wx.setStorageSync("code_code",code)
        if (res.code) {
          var data = {
            map: 'applet_member_info',
            code: code,
            slient:1,
          }
          console.log(data);
          wx.request({
            url: rqcfg.rqcfg.rqurl,
            data: data,
            success: function (res) {
              if (res.data.ec == 200) {
                console.log("获取用户信息成功");
                that.globalData.requestUrl = rqcfg.rqcfg.rqurl + '&plum_session_applet=' + res.data.data.plum_session_applet;
                that.globalData.commonUrl = rqcfg.rqcfg.rqurl + '&plum_session_applet=' + res.data.data.plum_session_applet;
                that.globalData.shuju = res.data.data.plum_session_applet;
                console.log(that.globalData.requestUrl);
                wx.setStorage({
                  key: "plumSession",
                  data: res.data.data.plum_session_applet,
                  success: function () {
                    that.globalData.plumSession = res.data.data.plum_session_applet;
                  }
                })
                that.globalData.slient = res.data.data.slient;
                if (that.globalData.userInfo) {
                  typeof cb == "function" && cb(this.globalData.userInfo)
                } else {
                  var defaultAvatar = 'http://tiandiantong.oss-cn-beijing.aliyuncs.com/images/icon_photo.png';
                  res.data.data.avatar = res.data.data.avatar ? res.data.data.avatar : defaultAvatar;
                  res.data.data.nickname = res.data.data.nickname ? res.data.data.nickname:'用户昵称';
                  that.globalData.userInfo = res.data.data;

                  typeof cb == "function" && cb(that.globalData.userInfo)
                }
                
                console.log(that.globalData.userInfo);
                if (obj) {
                  obj.onShow();
                  obj.onLoad();
                };
              } else {
                console.log(res.data);
                console.log("获取用户信息失败");
              }
            },
            complete: function () {
              
              console.log("执行完成");
              wx.hideLoading();
            }
          });
        } else {
          wx.showToast({
            title: '获取用户登录态失败！' + res.errMsg,
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function (res){
        wx.showToast({
          title: '用户code获取失败！' + res.errMsg,
          icon: 'none',
          duration: 2000
        })
      }
    });
  },
  getuserInfo: function (obj, userInfo, again,tuan_id=0) {
    var that = this;
    var info = that.globalData.userInfo;
    var sex = userInfo.gender == 2 ? '女' : '男';
    //发起请求，获取列表列表
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: that.globalData.requestUrl,
      data: {
        map: 'applet_update_member_info',
        avatar: userInfo.avatarUrl,
        nickname: userInfo.nickName,
        sex: sex,
        tuan_id: tuan_id,
        city: userInfo.city,
        province: userInfo.province
      },
      success: function (res) {
        if (res.data.ec == 200) {
          that.globalData.slient = 0;
          info.avatar = userInfo.avatarUrl;
          info.nickname = userInfo.nickName;
          info.sex = sex;
          console.log(info.sex);
          that.globalData.userInfo = info;
          obj.setData({
            userInfo: info,
            slient: that.globalData.slient
          })
          if (again) {
            wx.showToast({
              title: '同步成功',
              icon: 'success',
              duration: 2000
            })
          } else {
            wx.hideLoading();
          }
        } else {
          app.errorTip(that, res.data.em, 2000);
        }
      },
      fail: function () {
        wx.hideLoading();
      }
    });
  },
  onHide: function () {
    var _this = this;
    if (_this.globalData.formIds && _this.globalData.formIds.length) {
      var formIds = _this.globalData.formIds;
      _this.globalData.formIds = [];
      wx.request({
        url: _this.globalData.requestUrl,
        data: {
          map: 'applet_save_form_id',
          formIds: formIds
        },
        success: function (res) {
        },
      });
    }
  },
  makeCall: function (mobile) {
    wx.showModal({
      title: '',
      content: '拨打电话 ' +mobile,
      confirmText: '拨打',
      confirmColor: '#48C23D',
      success: function (res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: mobile,
            success: function () {
              console.log("拨打电话成功！")
            },
            fail: function () {
              console.log("拨打电话失败！")

            }
          })
        }
      }
    })
  },
  errorTip: function (that, text, timer) {
    that.setData({
      errorTip: {
        text: text,
        isShow: true
      }
    })
    setTimeout(function () {
      that.setData({
        errorTip: {
          text: '',
          isShow: false
        }
      })
    }, timer)
  },
  setVersion: function (obj) {
    var that = this;
    obj.setData({
      curVersion: that.globalData.version,
      watermark: that.globalData.watermark,
      supportOpen: that.globalData.supportOpen,
      openWatermark: that.globalData.openWatermark,
      watermarkLogo: that.globalData.watermarkLogo ? that.globalData.watermarkLogo : ''
    })
  },
  setNavtitle: function (name) {
    var that = this;
    var path = getCurrentPages()[getCurrentPages().length - 1].__route__;
    var menu = that.globalData.menuTitle;
    var title = name;
    if (!menu) {
      title = name;
    } else {
      if (!menu[path]) {
        title = name;
      } else {
        title = menu[path];
      }
    }
    console.log(title);
    wx.setNavigationBarTitle({
      title: title
    })
  },
  // 设置导航菜单
  setWebviewLink: function (obj, link) {
    var that = this;
    var path = getCurrentPages()[getCurrentPages().length - 1].__route__;
    var menu = that.globalData.webviewLink;
    var webviewLink = link;
    if (!menu) {
      webviewLink = link;
    } else {
      if (!menu[path]) {
        webviewLink = link;
      } else {
        webviewLink = menu[path];
      }
    }
    console.log(webviewLink);
    if (!webviewLink) {
      wx.showModal({
        title: '提示',
        content: '后台暂未配置页面链接',
        showCancel: false
      })
    }
    obj.setData({
      linksrc: webviewLink
    })
  },
  //跳转设置页面授权
  openSetting: function (again) {
    var that = this;
    if (wx.openSetting) {
      wx.openSetting({
        success: function (res) {
          res.authSetting = {
            "scope.userInfo": true,
            "scope.userLocation": true,
            "scope.address": true
          }
          // that.wechatSq();
          // //尝试再次登录
          if(again){
           wx.navigateBack({
             delta:1
           })
          }else{
            wx.reLaunch({
              url: '/pages/singlePage/singlePage',
            })
          }
        }
      })
    } else {
      wx.showModal({
        title: '授权提示',
        content: '小程序需要您的微信授权才能使用哦~ 错过授权页面的处理方法：1、请10分钟后再次点击授权。 2、删除小程序->重新搜索进入->点击授权按钮。'
      })
    }
  },
  showComment: function (that) {
    that.setData({
      isShowComment: true
    })
  },
  hideComment: function (that) {
    that.setData({
      isShowComment: false
    })
  },
  splitArrData: function (arr, pageNum) {
    var i = 0;
    var page = Math.ceil(arr.length / pageNum);
    var newArr = [];
    for (var i = 0; i < page; i++) {
      var curarr = [];
      curarr = arr.slice(i * pageNum, (i * pageNum + pageNum));
      console.log(page);
      newArr.push(curarr);
    }
    console.log(newArr);
    return newArr;
  },
  setNavtitle: function (name) {
    var that = this;
    var path = getCurrentPages()[getCurrentPages().length - 1].__route__;
    var menu = that.globalData.menuTitle;
    var title = name;
    if (!menu) {
      title = name;
    } else {
      if (!menu[path]) {
        title = name;
      } else {
        title = menu[path];
      }
    }
    console.log(title);
    wx.setNavigationBarTitle({
      title: title
    })
    return title;
  },
  // 设置导航菜单
  setWebviewLink: function (obj, link) {
    var that = this;
    var path = getCurrentPages()[getCurrentPages().length - 1].__route__;
    var menu = that.globalData.webviewLink;
    var webviewLink = link;
    if (!menu) {
      webviewLink = link;
    } else {
      if (!menu[path]) {
        webviewLink = link;
      } else {
        webviewLink = menu[path];
      }
    }
    console.log(webviewLink);
    if (!webviewLink) {
      wx.showModal({
        title: '提示',
        content: '后台暂未配置页面链接',
        showCancel: false
      })
    }
    obj.setData({
      linksrc: webviewLink
    })
  },
  makeCallphone: function (mobile) {
    console.log(mobile);
    wx.showModal({
      title: '',
      content: '拨打电话 '+mobile,
      confirmText: '拨打',
      confirmColor: '#48C23D',
      success: function (res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: mobile,
            success: function () {
              console.log("拨打电话成功！")
            },
            fail: function () {
              console.log("拨打电话失败！")

            }
          })
        }
      }
    })
  },
  // 上传图片选择
  chooseImageTap: function (that, length, index) {
    console.log(index + '////////22222222');
    let _this = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#333",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            _this.chooseWxImage('album', that, length, index)
          } else if (res.tapIndex == 1) {
            _this.chooseWxImage('camera', that, length, index)
          }
        }
      }
    })
  },
  chooseWxImage: function (type, that, length, index) {
    console.log(index+'////////3333333');
    var _this = this;
    wx.chooseImage({
      count: length,
      sizeType: ['compressed'],
      sourceType: [type],
      success: function (res) {
        console.log(res);
        var temPath = res.tempFilePaths[0];
        var temPaths = res.tempFilePaths;
        that.setData({
          temPaths: temPaths
        });
        console.log(temPaths);
        that.uploadImage(index);
      }
    })
  },
  // 播放音乐
  playMusic: function (that) {
    var _this = this;
    console.log(_this.globalData.isPlay);
    if (_this.globalData.isPlay === false || _this.globalData.isPlay === true) {
      if (_this.globalData.isPlaynew == 'new' && _this.globalData.isPlay === true) {
        console.log("播放中音乐");
        bgMusicAudioContext.src = _this.globalData.musicUrl;
        bgMusicAudioContext.title = _this.globalData.musicName;
        bgMusicAudioContext.play();
        _this.globalData.isPlaynew = '';
      }
    } else {
      console.log("播放音乐");
      bgMusicAudioContext.src = _this.globalData.musicUrl;
      bgMusicAudioContext.title = _this.globalData.musicName;
      bgMusicAudioContext.play();
      that.setData({
        isPlay: true
      })
      _this.globalData.isPlay = true;
      bgMusicAudioContext.onError(function () {
        console.log("播放错误")
        that.setData({
          isPlay: false
        })
        _this.globalData.isPlay = false;
      })
    }
  },
  // 暂停播放背景音乐
  togglePlay: function (that) {
    var _this = this;
    console.log(bgMusicAudioContext);
    var isPlay = that.data.isPlay;
    if (isPlay) {
      bgMusicAudioContext.pause();
      isPlay = false;
    } else {
      console.log(_this.globalData.isPlaynew);
      if (_this.globalData.isPlaynew == 'new') {
        bgMusicAudioContext.src = _this.globalData.musicUrl;
        bgMusicAudioContext.title = _this.globalData.musicName;
        bgMusicAudioContext.play();
        _this.globalData.isPlaynew = '';
      } else {
        bgMusicAudioContext.play();
      }
      isPlay = true;
    }
    that.setData({
      isPlay: isPlay
    })
    _this.globalData.isPlay = isPlay;
    bgMusicAudioContext.onError(function () {
      console.log("播放错误")
      that.setData({
        isPlay: false
      })
      _this.globalData.isPlay = false;
    })
  },
  // 暂停播放背景音乐
  toggleInfoPlay: function (that) {
    var _this = this;
    var isPlay = that.data.isPlay;
    console.log("切换资讯背景音乐");
    console.log(isPlay);
    if (isPlay) {
      bgMusicAudioContext.pause();
      isPlay = false;
      _this.globalData.musicPlay = false;
    } else {
      if (_this.globalData.isPlaynew == 'new') {
        console.log("新音乐播放");
        bgMusicAudioContext.stop();
        bgMusicAudioContext.src = _this.globalData.musicUrl;
        bgMusicAudioContext.coverImgUrl = _this.globalData.playMusicCover;
        bgMusicAudioContext.title = _this.globalData.musicName;

        _this.globalData.curInfoMusicid = _this.globalData.playMusicid;
        _this.musicProgress(bgMusicAudioContext, that);
        _this.globalData.isPlaynew = '';
      } else {
        bgMusicAudioContext.play();
        _this.musicProgress(bgMusicAudioContext, that);
      }
      isPlay = true;
      _this.globalData.musicPlay = true;
    }
    that.setData({
      isPlay: isPlay
    })
    _this.globalData.isPlay = isPlay;
    that.musicOpera();
  },
  // 音乐播放进度
  musicProgress: function (bgMusicAudioContext, that) {
    var _this = this;
    bgMusicAudioContext.onTimeUpdate(function () {
      var curTime = Math.ceil(bgMusicAudioContext.currentTime);
      var sumTime = Math.ceil(bgMusicAudioContext.duration);
      var curPlaytime = _this.formatPlayTime(curTime);
      var durationTime = _this.formatPlayTime(sumTime);
      that.setData({
        curTimeStep: curTime,
        curPlaytime: curPlaytime,
        sumPlayTime: sumTime,
        durationTime: durationTime,
        playProgressDis: false
      })
      _this.globalData.isReplay = '';
    });
    bgMusicAudioContext.onError(function () {
      console.log("播放错误")
      that.setData({
        isPlay: false
      })
      that.globalData.isPlay = false;
      that.globalData.curInfoMusicid = '';
    });
    bgMusicAudioContext.onEnded(function () {
      console.log("播放自然结束");
      var sumTime = Math.ceil(bgMusicAudioContext.duration);
      var durationTime = _this.formatPlayTime(sumTime);
      that.setData({
        curTimeStep: 0,
        isPlay: false,
        curPlaytime: '0:00',
        sumPlayTime: 100,
        durationTime: durationTime,
        playProgressDis: true
      })
      console.log(that.data);
      _this.globalData.isPlay = false;
      _this.globalData.isReplay = 'reply';
      _this.globalData.isPlaynew = 'new'
    })
  },
  // 格式化音乐进度显示时间
  formatPlayTime: function (time) {
    var minute = parseInt(time / 60);
    var second = parseInt((time % 60));
    second = second < 10 ? '0' + second : second;
    var showTime = minute + ':' + second;
    return showTime;
  },
  // 计算两点之间距离
  getFlatternDistance: function (lat1, lng1, lat2, lng2) {
    var that = this;
    var f = that.getRad((lat1 + lat2) / 2);
    var g = that.getRad((lat1 - lat2) / 2);
    var l = that.getRad((lng1 - lng2) / 2);
    var sg = Math.sin(g);
    var sl = Math.sin(l);
    var sf = Math.sin(f);
    var s, c, w, r, d, h1, h2;
    var a = EARTH_RADIUS;
    var fl = 1 / 298.257;
    sg = sg * sg;
    sl = sl * sl;
    sf = sf * sf;
    s = sg * (1 - sl) + (1 - sf) * sl;
    c = (1 - sg) * (1 - sl) + sf * sl;
    w = Math.atan(Math.sqrt(s / c));
    r = Math.sqrt(s * c) / w;
    d = 2 * w * a;
    h1 = (3 * r - 1) / 2 / c;
    h2 = (3 * r + 1) / 2 / s;
    return d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg)) / 1000;
  },
  getRad: function (d) {
    return d * Math.PI / 180.0;//经纬度转换成三角函数中度分表形式。
  },
  // 根据距离给列表排序
  sortArr: function (property) {
    return function (a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value1 - value2;
    }
  },
  // 获取当前定位地址
  getCurAddress: function (lat, lng, obj,type) {
    var that = this;
    console.log('获取地址');
    wx.request({
      url: that.globalData.requestUrl,
      data: {
        map: 'applet_get_address',
        lat: lat,
        lng: lng
      },
      success: function (res) {
        if (res.data.ec == 200) {
          console.log(res);
          obj.setData({
            curLocation: res.data.data.address
          })
          var city = res.data.data.city;
          that.globalData.weatherCity = city;
          if (type =="weather"){
            wx.getStorage({
              key: 'weatherInfo',
              success: function(res) {
                console.log(res.data)
                var weatherInfo = res.data;
                var saveCity = weatherInfo.cityName;
                var curTime = parseInt((new Date()).getTime()/1000);
                var saveTime = parseInt(weatherInfo.time+1800);
                console.log(curTime);
                if (saveTime < curTime || saveCity != city){
                  console.log("重新请求天气数据");
                  obj.requestWeather(city);
                }else{
                  console.log("获取缓存天气数据");
                  obj.setData({
                    weatherInfo: weatherInfo
                  })
                }
              },
              fail:function(){
                obj.requestWeather(city);
              }
            })
          }
        } else {
          if (type == "weather") {
            wx.getStorage({
              key: 'weatherInfo',
              success: function (res) {
                console.log(res.data)
                var weatherInfo = res.data;
                var saveCity = weatherInfo.cityName;
                var curTime = parseFloat((new Date()).getTime() / 1000);
                var saveTime = parseInt(weatherInfo.time + 1800);
                console.log(curTime);
                if (saveTime > curTime || saveCity != city) {
                  obj.requestWeather(city);
                } else {
                  console.log("获取缓存天气数据");
                }
              },
              fail: function () {
                obj.requestWeather(city);
              }
            })
          }
        }
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
  setNavColor:function(obj){
    var that = this;
    var navColor = '#0898fa';
    if (that.globalData.navBgcolor&&that.globalData.navTextStyle=='white'){
      navColor = that.globalData.navBgcolor;
    }
    obj.setData({
      navColor: navColor
    })
    console.log("导航颜色" + obj.data.navColor);
  },
  commonIndex: function (obj) {
    var that = this;
    wx.request({
      url: that.globalData.requestUrl,
      data: {
        map: 'applet_city_index',
        lng: 0,
        lat: 0
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.ec == 200) {
          // 入驻店铺信息
          that.globalData.shopStatus = res.data.data.status;
          that.globalData.shopMsg = res.data.data.msg;
          that.globalData.postType = res.data.data.template.postType;
          that.globalData.location = res.data.data.location;
          var namelogo = {
            name: res.data.data.name,
            logo: res.data.data.logo
          };
          that.globalData.namelogo = namelogo;
          that.globalData.watermark = res.data.data.watermark;
          that.globalData.supportOpen = res.data.data.supportOpen;
          that.globalData.telphone = res.data.data.mobile;
          that.globalData.mustMobile = res.data.data.template.mustMobile;
          that.globalData.mustAddress = res.data.data.template.mustAddress;
          that.globalData.submitPrompt = res.data.data.template.submitPrompt;
          that.globalData.entry = res.data.data.template.entry;
          that.globalData.redPacket = res.data.data.template.redPacket;
          // 入驻协议
          that.globalData.settledAgreement = res.data.data.template.settledAgreement;
          var sharedata = {
            shareOpen: res.data.data.shareOpen,
            shareUrl: res.data.data.shareUrl,
            shareTitle: res.data.data.template.title
          }
          that.globalData.sharedata = sharedata;
          var shareInfo = {
            shareCover: res.data.data.shareCover,
            shareTitle: res.data.data.shareTitle
          }
          that.globalData.shareInfo = shareInfo;
          // 存储是否开启客服
          that.globalData.customerService = res.data.data.customerService;
          if (res.data.data.customerService == 1) {
            var sessionForm = {
              "nickName": that.globalData.userInfo.nickname,
              "city": that.globalData.userInfo.city
            }
            that.globalData.sessionForm = JSON.stringify(sessionForm);
            obj.setData({
              sessionForm: that.globalData.sessionForm
            })
            console.log(that.globalData.sessionForm);
          }

          var redbagInfo = {
            regbagMin: res.data.data.template.regbagMin,
            singleMin: res.data.data.template.singleMin,
            serviceRate: res.data.data.template.serviceRate,
          }
          that.globalData.redbagInfo = redbagInfo;
          obj.onLoad();
        } else {
          console.log(res.data)
        }
      },
      complete: function () {
      }
    });
  },
  showToast: function (text, timer, func) {
    wx.showToast({
      title: text ? text : '',
      icon: 'none',
      duration: timer,
      success: function () {
        if (func) {
          func;
        }
      }
    })
  },
  // 广告数据
  requestAd: function (obj) { 
    var _this = this;
    var that = obj;
    wx.request({
      url: _this.globalData.requestUrl,
      data: {
        map: 'applet_city_advertisement_cfg'
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.ec == 200) {
          var randomIndex = Math.round(Math.random() * (10 - 1) + 1) - 1;
          that.setData({
            adInfo: res.data.data,
            randomIndex: randomIndex
          })
        } else {
          console.log(res.data)
        }
      },
      complete: function () {
      }
    });
  },
  // 宣传海报
  requestShareinfo: function (obj) {
    var _this = this; 
    var that = obj;
    //发起请求，获取列表列表
    var groupId = that.data.groupId;
    var data = {
      map: 'applet_sequence_group_share_page',
      groupId: groupId
    }
    console.log(data);
    wx.showLoading({
      title: '海报生成中...',
    })
    wx.request({
      url: _this.globalData.requestUrl,
      data: data,
      success: function (res) {
        if (res.data.ec == 200) {
          console.log(res.data.data);
          var shareInfo = res.data.data;
          that.setData({
            shareInfo: shareInfo,
            shareImg: shareInfo.img,
            shareDesc: shareInfo.activityDesc
          });
          console.log(shareInfo);
          _this.downImage(shareInfo, that);
        } else {
          _this.errorTip(that, res.data.em, 2000);
        }
      },
      complete: function () {
        // wx.hideLoading();
      }
    });
  },
  downImage: function (shareInfo, obj) {
    var that = obj;
    var _this = this;
    wx.downloadFile({
      url: shareInfo.img,
      success: function (res1) {
        if (res1.statusCode == 200) {
          console.log(res1);
          shareInfo.img = res1.tempFilePath;
          wx.downloadFile({
            url: shareInfo.qrcode,
            success: function (res2) {
              if (res2.statusCode == 200) {
                console.log(res2.tempFilePath);
                shareInfo.qrcode = res2.tempFilePath;
                wx.downloadFile({
                  url: shareInfo.leaderAvatar,
                  success: function (res3) {
                    console.log(res3);
                    if (res3.statusCode == 200) {
                      console.log(res3.tempFilePath);
                      shareInfo.leaderAvatar = res3.tempFilePath;
                      that.setData({
                        shareInfo: shareInfo
                      });
                      console.log(that.data.shareInfo);
                      _this.createCanvas(that);
                    } else {
                      console.log("Logo不存在");
                      that.setData({
                        isDrawfinish: false,
                        tips: "Logo不存在"
                      })
                      wx.hideLoading();
                    }
                  },
                  fail: function () {
                    console.log("第三张图片下载失败");
                    that.setData({
                      isDrawfinish: false,
                      tips: "logo下载失败"
                    })
                    wx.hideLoading();
                  }
                })
              } else {
                console.log("小程序码不存在");
                that.setData({
                  isDrawfinish: false,
                  tips: "小程序码不存在"
                })
                wx.hideLoading();
              }
            },
            fail: function () {
              console.log("第二张图片下载失败");
              that.setData({
                isDrawfinish: false,
                tips: "小程序码下载失败"
              })
              wx.hideLoading();
            }
          })
        } else {
          console.log("封面不存在");
          that.setData({
            isDrawfinish: false,
            tips: "封面不存在"
          })
          wx.hideLoading();
        }
      },
      fail: function () {
        console.log("第一张图片下载失败");
        that.setData({
          isDrawfinish: false,
          tips: "封面下载失败"
        })
        wx.hideLoading();
      }
    })
  },
  createCanvas: function (obj) {
    var that = obj;
    var shareInfo = that.data.shareInfo;
    console.log(shareInfo);
    const ctx = wx.createCanvasContext('myCanvas');
    var winW = that.data.winW;
    var canvasW = winW * 0.8;

    var tsY = canvasW * 0.15 +30;  //头像加上下间距的高（画布中上下左右间距为15）
    var canvasH = winW * 0.8 + tsY + canvasW * 0.3 + 20;  // winW * 0.8 相当于中间封面图的宽加上上下间距的高即是画布的宽
    that.setData({ 
      canvasW: canvasW,
      canvasH: canvasH
    })
    //填充画布为白色
    ctx.rect(0, 0, canvasW, canvasH);
    ctx.setFillStyle('#ffffff');
    ctx.fill();
    //画一圆形头像
    ctx.save();
    ctx.beginPath();
    ctx.arc(canvasW * 0.15 / 2 + 15, canvasW * 0.15 / 2 + 15, canvasW * 0.15/2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(shareInfo.leaderAvatar, 15, 15, canvasW * 0.15, canvasW * 0.15);
    ctx.restore();
    //画昵称
    ctx.setTextAlign('left');
    ctx.setFontSize(14);
    ctx.setFillStyle('#999999');
    ctx.fillText(shareInfo.leaderName, canvasW * 0.15 + 25, canvasW * 0.15/2+10);
    //画昵称下的提示文字
    ctx.setFontSize(14);
    ctx.setFillStyle('#333');
    ctx.fillText('发起了限时团购活动快来参与吧', canvasW * 0.15 + 25, canvasW * 0.15 / 2 + 30, canvasW - canvasW * 0.15-40);
    //画正方形封面图
    ctx.drawImage(shareInfo.img, 15, tsY, winW * 0.8 - 30, winW * 0.8 - 30);
    //画标题（可折行）
    var lineY = tsY + winW * 0.8 - 20; //上半部分的高（头像加封面图加间距）
    var Txtnum1 = Math.floor((canvasW - 30) * 0.5 / 16); //一行可以画多少个字（(canvasW - 30) * 0.5一行的宽  16字的大小）
    console.log(Txtnum1);
    var shareTitleArr = [];  //存放计算出的文字的内容
    var title = shareInfo.activityName;  //需要计算的内容
    var titleLinenum = Math.ceil(title.length / Txtnum1) <= 2 ? Math.ceil(title.length / Txtnum1) : 2;  //计算出的行数（最多取两行）
    for (var i = 0; i < titleLinenum; i++) {  //循环截出每行的文字内容
      var length = shareTitleArr.length;
      var txtObj = title.substring(length * Txtnum1, length * Txtnum1 + Txtnum1);
      shareTitleArr.push(txtObj);  //追加到shareTitleArr数组上
    }
    console.log(shareTitleArr);
    var line2Y;  // 存放画出的标题后的上半部分的高
    for (var i = 0; i < shareTitleArr.length; i++) {  // 画标题
      var textY = lineY+25 + i * 16 * 1.2;
      line2Y = textY;
      ctx.setFontSize(16);
      ctx.setFillStyle('#333');
      ctx.fillText(shareTitleArr[i], 15, textY);
    }
    //画简介（方法同上）
    var Txtnum2 = Math.floor((canvasW -30)*0.5 / 14);
    console.log(Txtnum2);
    var shareInforArr = [];
    var infor = shareInfo.activityDesc;
    var inforLinenum = Math.ceil(infor.length / Txtnum2) <= 2 ? Math.ceil(infor.length / Txtnum2) : 2;
    for (var i = 0; i < inforLinenum; i++) {
      var length = shareInforArr.length;
      var txtObj = infor.substring(length * Txtnum2, length * Txtnum2 + Txtnum2);
      shareInforArr.push(txtObj);
    }
    console.log(shareInforArr);
    for (var i = 0; i < shareInforArr.length; i++) {
      var textY = line2Y + 25 + i * 14 * 1.2;
      ctx.setFontSize(14);
      ctx.setFillStyle('#666');
      ctx.fillText(shareInforArr[i], 15, textY);
    }

    //画二维码
    ctx.drawImage(shareInfo.qrcode, (canvasW - 30) * 0.5 + canvasW * 0.3/2, lineY, canvasW * 0.3, canvasW * 0.3);
    //画二维码下的提示文字
    ctx.setFontSize(12);
    ctx.setFillStyle('#666');
    ctx.setTextAlign('center');  //使文本居中
    ctx.fillText('长按识别小程序码', (canvasW - 30) * 0.5 + canvasW * 0.3, lineY + canvasW * 0.3 + 15); // (canvasW - 30) * 0.5 + canvasW * 0.3 文本的中心点坐标

    ctx.draw();
    wx.hideLoading();
    that.setData({
      isDrawfinish: true
    })
  },
  saveImage: function (obj) {
    var _this = this;
    var that = obj;
    var canvasW = that.data.canvasW;
    var canvasH = that.data.canvasH;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: canvasW,
      height: canvasH,
      canvasId: 'myCanvas',
      fileType: 'jpg',
      success: function (res) {
        console.log(res.tempFilePath)
        var tempFilePathShow = res.tempFilePath;
        wx.showLoading({
          title: '正在保存',
          mask: true,
          time: 100000
        })
        wx.saveImageToPhotosAlbum({
          filePath: tempFilePathShow,
          success(res) {
            console.log(res);
            _this.errorTip(that, "图片保存成功", 2000);
          },
          fail(f) {
            _this.errorTip(that, "图片保存失败", 2000);
          },
          complete() {
            wx.hideLoading();
          }
        })
      } 
    })
  },
  contactRecord: function () {
    console.log("客服记录")
    var _this = this;
    wx.request({
      url: _this.globalData.requestUrl,
      data: {
        map: 'applet_kefu_click'
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.ec == 200) {
          console.log(res.data.data);
        } else {
          _this.errorTip(that, res.data.em, 2000);
        }
      },
      complete: function () {
        wx.stopPullDownRefresh();
      }
    });
  },
  //客服验证绑定手机号
  contactData: function (that) {
    var _this = this;
    wx.request({
      url: _this.globalData.requestUrl,
      data: {
        map: 'applet_kefu_cfg'
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.ec == 200) {
          console.log(res.data.data);
          _this.globalData.contactPhone = res.data.data.mobile;
          _this.globalData.customerService = res.data.data.customerService;
          _this.globalData.customerMobile = res.data.data.customerMobile;
          that.setData({
            contactPhone: res.data.data.mobile,
            customerMobile: res.data.data.customerMobile,
            customerService: res.data.data.customerService
          })
        } else {
          // _this.errorTip(that, res.data.em, 2000);
        }
      },
      complete: function () {
        wx.hideToast();
        wx.stopPullDownRefresh();
      }
    });
  }, 
  contactRecord: function () {
    console.log("客服记录")
    var _this = this;
    wx.request({
      url: _this.globalData.requestUrl,
      data: {
        map: 'applet_kefu_click'
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.ec == 200) {
          console.log(res.data.data);
        } else {
          // _this.errorTip(that, res.data.em, 2000);
        }
      },
      complete: function () {
        wx.stopPullDownRefresh();
      }
    });
  },
  getPhone: function (e, that,issue) {
    var _this = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          var data = {
            map: 'applet_bind_member_mobile',
            code: res.code,
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv
          };
          if (data.encryptedData && data.iv) {
            _this.requestMobile(that, data,issue);
          }
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },
  requestMobile: function (that, data,issue) {
    console.log(data);
    var _this = this;
    //发起请求，获取列表列表
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      mask: true,
      duration: 10000
    });
    console.log(_this.globalData.requestUrl);
    console.log(data);
    wx.request({
      url: _this.globalData.requestUrl,
      data: data,
      success: function (res) {
        console.log(res.data);
        if (res.data.ec == 200) {
          console.log(res.data.data);
          _this.globalData.contactPhone = res.data.data;
          that.setData({
            contactPhone: res.data.data
          });
          if(issue){
            that.requestCitycfg();
          }
        } else {
          _this.errorTip(that, res.data.em, 2000);
        }
      },
      complete: function () {
        wx.hideToast();
        wx.stopPullDownRefresh();
      }
    });
  },
})