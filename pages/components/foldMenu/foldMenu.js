//获取应用实例
// 组件数据
const app = getApp()
Component({
  properties: {
    
  },
  /**
   * 组件的初始数据
   */
  data: {
    'isShowmenu': false
  },

  /**
   * 组件的方法列表
   */
  attached:function(){
    var that = this;
    app.setNavColor(that);
    app.contactData(that); 
    that._moremenu_show();
  },
  methods: {
    getPhoneNumber: function (e) {
      var that = this;
      app.getPhone(e, that);
    },
    contactRecord: function () {
      app.contactRecord();
    },
    _moremenu_show: function () {
      var that = this;
      var isHasdata = app.globalData.isHasdata;
      console.log('是否请求过菜单' + !isHasdata)
      if (!isHasdata) {
        wx.request({
          url: app.globalData.requestUrl,
          data: {
            map: 'applet_applet_suspension_menu'
          },
          success: function (res) {
            if (res.data.ec == 200) {
              console.log("请求折叠菜单数据成功");
              console.log(res.data.data)
              app.globalData.suspensionMenu = res.data.data.suspensionMenu;
              app.globalData.menuAllShow = res.data.data.suspensionMenuShow;
              //app.globalData.telphone = res.data.data.mobile ? res.data.data.mobile:'';
              var sessionForm = {};
              if (res.data.data.sessionForm){
                sessionForm= {
                  "nickName": app.globalData.userInfo.nickname,
                  "city": app.globalData.userInfo.city
                }
              } 
              app.globalData.sessionForm = JSON.stringify(sessionForm);
              app.globalData.isHasdata = true;
              app.globalData.indexUrl = res.data.data.indexUrl;
              app.globalData.telphone = app.globalData.telphone ? app.globalData.telphone:res.data.data.mobile;
              that._moremenu_setMenudata();
              that._moremenu_isIndex();
            } else {
              setTimeout(function () {
                that._moremenu_isIndex();
              }, 2000)
            }
          },
          complete: function () {
            
          }
        });
      } else {
        that._moremenu_isIndex();
        that._moremenu_setMenudata();
      }
    },
    _moremenu_setMenudata: function () {
      this.setData({
        'suspensionMenu': app.globalData.suspensionMenu,
        'menuAllShow': app.globalData.menuAllShow,
        'mobile': app.globalData.telphone ? app.globalData.telphone:'',
        'sessionForm': app.globalData.sessionForm,
        'indexUrl': app.globalData.indexUrl
      })
      console.log("当前菜单数据")
      console.log(this.data.suspensionMenu);
    },
    _moremenu_isIndex: function () {
      var path = "/"+getCurrentPages()[getCurrentPages().length - 1].__route__;
      var indexUrl = this.data.indexUrl ? this.data.indexUrl : '/pages/index/index';
      var isIndex = 1;
      if (path == indexUrl) {
        isIndex = 1;
      } else {
        isIndex = 0;
      }
      this.setData({
        'isIndex': isIndex
      })
      console.log(path + '--'+indexUrl+"是否首页" + isIndex);
    },
    // 显示更多菜单
    _moremenu_toggleMenu: function () {
      var that = this;
      console.log(that.data);
      var isShowmenu = that.data.isShowmenu;
      if (isShowmenu) {
        isShowmenu = false;
      } else {
        isShowmenu = true;
      }
      that.setData({
        'isShowmenu': isShowmenu
      })
    },
    // 禁止滑动页面
    _catchtouchstart: function () {
      console.log("触摸屏幕阻止冒泡");
    },
    // 菜单操作
    _moremenu_menuOpera: function (e) {
      var that = this;
      var indexUrl = that.data.indexUrl ? that.data.indexUrl:'/pages/index/index';
      console.log(that.data);
      var type = e.currentTarget.dataset.type;
      console.log(type);
      if (type == 'index') {
        wx.reLaunch({
          url: indexUrl
        })
      }
      if (type == '102') {
        var mobile = e.currentTarget.dataset.mobile;
        if (mobile) {
          app.makeCallphone(mobile);
        } else {
          app.errorTip(that, "暂未获取到电话", 2000);
        }
      } else if (type == '103') {
        wx.navigateTo({
          url: '/pages/sharepage/sharepage'
        })
      } else if (type == '105') {
        that._requestSign();
      } else if (type == '104' || type == '1' || type == '2') {
        var url = e.currentTarget.dataset.url;
        console.log(url);
        wx.navigateTo({
          url: url
        })
      }
    },
    _requestSign: function () {
      var that = this;
      wx.request({
        url: app.globalData.requestUrl,
        data: {
          map: 'applet_sign_get_point'
        },
        success: function (res) {
          console.log(res.data);
          if (res.data.ec == 200) {
            app.errorTip(that, res.data.data.msg, 2000);
          } else {
            app.errorTip(that, res.data.em, 2000);
          }
        },
        complete: function () {
        }
      });
    },
    // _touchmove: function (e) {
    //   var that = this;
    //   console.log('触摸开始');
    //   console.log(e.touches[0].clientX);
    //   console.log(e.touches[0].clientY);
    //   var winH = that.data.winH;
    //   var winW = that.data.winW;
    //   var maxLeft = winW - 40;
    //   var maxTop = winH - 40;
    //   var x = e.touches[0].clientX - 20;
    //   x = x<0?0:x;
    //   x = x > maxLeft ?maxLeft:x;
    //   var y = e.touches[0].clientY - 20;
    //   y = y < 0 ? 0 : y;
    //   y = y > maxTop ? maxTop : y;
    //   that.setData({
    //     left: x,
    //     top: y
    //   });
    // },
  }
})