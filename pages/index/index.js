//index.js
//获取应用实例
var util = require("../../utils/timer.js")
const app = getApp()
Page({
  data: {
    navList: ['全部', '时令瓜果', '酒水饮料', '新鲜蔬菜', '绿植鲜花', '调味粮油', '农家原产', '进口产品', '日用百货'],
    showLoading: true,
    noMoretip: false,
    page: 0,
    isShowMoreimg: false,
    indexInfo: '',
    cartModelShow: false,
    show_carts: 1,
    showModalStatus: false,
    animationData: 'xlistNavxlistNavxlistNav',
    hd_id: 0,
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 500,
    countDownHour: 0, //倒计时 -时
    countDownMinute: 0, //倒计时 -分
    countDownSecond: 0, //倒计时-秒
  },

  onLoad: function (e) {
   

    var that = this;
    that.checkAndUpdate();
    // that.getLocation();
    if (e) {
      console.log(99999999)
      this.setData({
        tuan_g_id: e.tuan_id,
      })

    }

  
    // wx.redirectTo({
    //   url: '/subpages/paySuccess/paySuccess?tid=9373201901013795003529' + '&id=' + 180 + '&groupId=' + 100
    // })

   if (wx.getStorageSync("time_line") != 9) {
      wx.setStorageSync("time_line", 9);
    } else {

      console.log(7777777777)
    }
    //var len = that.data.activityList.length;  //获取长度
  
  },

  indexgoto:function(e){
    console.log(e)
   var page=e.currentTarget.dataset.indexpage
    wx.navigateTo({
      url: page,
    })

  },
  checkAndUpdate: function () {
    const updateManager = wx.getUpdateManager();
    console.log(updateManager)
   
    updateManager.onCheckForUpdate(function () { });
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function () { })
  },
  sqtz: function (e) {
    var that = this;
    var status = e.currentTarget.dataset.status;
    wx.navigateTo({
      url: '/pages/applyTuan/applyTuan?status=' + status,
    })
  },
  sqgys: function () {

    wx.navigateTo({
      url: '../../subpages/supplierApply/supplierApply',
    })
  },
  callphone: function (e) {
    var phone = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phone,
    })

  },
  callphone1: function (e) {
    var phone = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phone,
    })

  },
  getSearchVal: function (e) {

    this.setData({

      searchVal: e.detail.value
    })

  },
  search: function () {
    var that = this;
    var val = that.data.searchVal ? that.data.searchVal : '';
    // if(val==''){

    //   app.errorTip(that,"搜索框不能为空", 2000);
    //   return false;
    // }
    var data = {};
    data.val = val;
    data.map = 'applet_sequence_searchval';
    wx.request({
      url: app.globalData.requestUrl,
      data: data,
      success: function (res) {

        console.log(res.data);


        // that.setData({
        //   // goods: res.data,
        // })


      },

    })

    wx.navigateTo({
      url: '../search/search?val=' + val,
    })

  },

  startConnect:function(){
     //本地测试使用 ws协议 ,正式上线使用 wss 协议
    url="";
    wx.connectSocket({
      url: url,
      method: 'GET',
     
    }) 
    wx.onSocketOpen(res=>{


    })
  },
  qiandao: function (e) {
    var that = this;

    wx.navigateTo({
      url: '/pages/rili/rili',
    })
    // wx.showModal({
    //   title: '提示',
    //   content: '签到功能移动到首页底部',
    //   showCancel: false,
    // })
  },
  ///商品+
  goodNumCount: function (e) {
    var that = this;
    var dataset = e.target.dataset;
    var type = dataset.type;
    console.log(type);
    if (type == 'add') {
      that.addGoodNum(dataset);
      return;
    }
    if (type == 'sub') {
      console.log("减少商品");
      that.minusGoodNum(dataset);
      return;
    }

  },
  clearCart: function () {
    var that = this;
    var goodsList = that.data.goodsList;
    var cartList = that.data.cartList;
    wx.showModal({
      title: '提示',
      content: '确定要清空购物车吗？',
      success: function (res) {
        if (res.confirm) {
          //操作商品中的商品购买数量为0
          for (var i = 0; i < goodsList.length; i++) {
            if (goodsList[i].num > 0) {
              goodsList[i].num = 0;
            }
          }
          //操作购物车中的商品购买数量为0
          for (var i = 0; i < cartList.length; i++) {
            if (cartList[i].num > 0) {
              cartList[i].num = 0;
            }
          }
          that.deleteRequestCart();
          that.setData({
            goodsList: goodsList,
            cartList: [],
            cartSumNum: 0,
            cartModelShow: false,
            show_carts: 1
          })
        }
      }
    })
  },
  deleteRequestCart: function () {
    var that = this;
    var data = {};
    data.map = 'applet_sequence_empty_cart';
    data.aid = that.data.id;
    // wx.showLoading({
    //   title: '加载中',
    //   mask: true
    // })
    wx.request({
      url: app.globalData.requestUrl,
      data: data,
      success: function (res) {
        console.log("删除购物车");
        console.log(res.data);
        if (res.data.ec == 200) {
          // app.errorTip(that, res.data.data.msg, 2000);
        } else {
          // that.setData({
          //   cartList: []
          // })
          app.errorTip(that, res.data.em, 2000);
        }
      },
      complete: function () {
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    })
  },
  addGoodNum: function (dataset) {
    var that = this;
    console.log(dataset);
    // return false;
    var id = dataset.id;
    that.addGoodNumOpera(id);
  },
  addGoodNumOpera: function (id) {
    var that = this;
    var type = 1;//此时是增加操作
    var gid = id;//商品id
    var goodIndex;
    var goodsList = that.data.goodsList;
    console.log(goodsList)
    for (var i = 0; i < goodsList.length; i++) {

      if (goodsList[i].id == id) {
        console.log('对其商品的购买数量进行加1');
        if (goodsList[i].stock > goodsList[i].num) {
          goodsList[i].num = goodsList[i].num++;
        } else {
          app.errorTip(that, '超出库存量', 2000);
          return;
        }
        goodIndex = i;
      }
    }
    goodsList[goodIndex].num++;//根据id找到的脚标，对其购买数量进行加1
    var cartList = that.data.cartList;
    console.log(cartList)
    var isCartHas = false;
    if (cartList.length > 0) {
      for (var i = 0; i < cartList.length; i++) {
        if (cartList[i].gid == id) {
          console.log('购物车中有此商品');
          cartList[i].num++;
          isCartHas = true;
        }
      }
    }
    var obj = {};
    obj.gid = gid;
    obj.name = goodsList[goodIndex].name;
    obj.price = goodsList[goodIndex].price;
    obj.num = goodsList[goodIndex].num;
    if (!isCartHas) {
      cartList.push(obj);
      console.log('购物车中新增商品');
    }
    that.addRequestCart(gid, type);//调取购物车增减接口操作
    that.setData({
      goodsList: goodsList,
      cartList: cartList
    })
    that.getCartGoodNum();
  },
  addRequestCart: function (gid, number) {
    var that = this;
    var data = {};
    data.map = 'applet_sequence_edit_cart';
    data.gid = gid;
    data.aid = 154;
    data.num = number;
    console.log(data);
    // wx.showLoading({
    //   title: '加载中',
    //   mask: true
    // })
    wx.request({
      url: app.globalData.requestUrl,
      data: data,
      success: function (res) {
        console.log("修改购物车数量");
        console.log(res.data);
        if (res.data.ec == 200) {
          // app.errorTip(that, res.data.data.msg, 2000);
        } else {
          // that.setData({
          //   cartList: []
          // })
          app.errorTip(that, res.data.em, 2000);
        }
      },
      complete: function () {
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    })
  },

  //购物车里的商品
  cartModelShow: function () {
    var that = this;
    var cartList = that.data.cartList;
    if (cartList.length > 0) {
      that.setData({
        cartModelShow: true,
        show_carts: 0
      })
    } else {
      app.errorTip(that, '请添加商品~', 2000);
    }
  },

  getCartGoodNum: function () {
    var that = this;
    var cartList = that.data.cartList;
    console.log('购物车');
    console.log(cartList);
    var sumNum = 0;
    for (var key in cartList) {
      sumNum += parseInt(cartList[key].num);
    }
    that.setData({
      cartSumNum: sumNum,
    })
  },

  minusGoodNum: function (dataset) {
    var that = this;
    console.log(dataset);
    var id = dataset.id;
    that.minusGoodNumOpera(id);
  },

  minusGoodNumOpera: function (id) {
    var that = this;
    var type = -1;//此时是减少操作
    var gid = id;//商品id
    var goodIndex;
    var goodsList = that.data.goodsList;
    console.log(goodsList);
    for (var i = 0; i < goodsList.length; i++) {
      if (goodsList[i].id == id) {
        console.log('对其商品的购买数量进行减1');
        goodsList[i].num = goodsList[i].num--;
        goodIndex = i;
        if (goodsList[i].num <= 0) {
          goodsList[i].num = 0;
        }
      }
    }
    if (goodsList[goodIndex].num > 0) {
      goodsList[goodIndex].num--;//根据id找到的脚标，对其购买数量进行减1
    } else {
      goodsList[goodIndex].num = 0;
      return;
    }
    var cartList = that.data.cartList;
    var isCartHas = false;
    if (cartList.length > 0) {
      for (var i = 0; i < cartList.length; i++) {
        if (cartList[i].gid == id) {
          if (cartList[i].num > 1) {
            cartList[i].num--;
          } else if (cartList[i].num <= 1) {
            cartList[i].num = 0;
            cartList.splice(i, 1);
            console.log(cartList);
            console.log("删除购物车中此中商品");
          }
          isCartHas = true;
          console.log("购物车中已存在");
        }
      }
    }
    that.addRequestCart(gid, type);//调取购物车增减接口操作
    that.setData({
      goodsList: goodsList,
      cartList: cartList
    })
    if (cartList.length <= 0) {
      that.setData({
        cartModelShow: false,
        show_carts: 1
      })
    }
    that.getCartGoodNum();
  },
  cartModelHide: function () {
    var that = this;
    that.setData({
      cartModelShow: false,
      show_carts: 1
    })
  },
  submitOrder: function (e) {
    // try {
    //   wx.removeStorageSync('voucherInfo')
    //   wx.removeStorageSync('addressInfo')
    // } catch (e) {
    //   // Do something when catch error
    // }



    var that = this;
    console.log(that.data.cartList);
    // return false;
    var dataset = e.target.dataset;
    
    if (e.currentTarget.dataset.sy_time==1){
      wx.showModal({
        title: '提示',
        content: '秒杀未开始',
        showCancel: false,
     
      })
       return false;
    } else if (e.currentTarget.dataset.sy_time == -5) {
      wx.showModal({
        title: '提示',
        content: '秒杀已结束',
        showCancel: false,

      })
      return false;
    }
    var double = e.target.dataset.double;
    console.log(e)
    if (double != 1) { //判断是不是购物车购买
      that.addGoodNum(dataset);
    }


    var cartList = that.data.cartList;  //购物车中的商品
    var asaId = e.target.dataset.acid;

    if (double == 1) {

      asaId = that.data.hd_id;
    }
    var gwc = e.target.dataset.gwc;

    var data = {};
    if (gwc == 1) {
      wx.showToast({
        title: '已加入购物车',
      })
      return false;
    }
    data.map = 'applet_sequence_create_trade';
    data.asaId = asaId;
    if (that.data.groupId) {
      data.groupId = that.data.groupId;
    }
    var buys = [];
    if (double == 1) { //判断是不是购物车购买

      for (var key in cartList) {
        var obj = {};
        obj.gid = cartList[key].gid;
        obj.num = cartList[key].num;
        buys.push(obj);
      }
    } else {


      var obj = {};
      obj.gid = e.currentTarget.dataset.id;
      obj.num = 1;
      buys.push(obj);
    }

    data.buys = buys;
  
   
    wx.request({
      url: app.globalData.requestUrl,
      data: data,
      success: function (res) {
        
        if (res.data.ec == 200) {
          wx.setStorage({
            key: "submitOrder",
            data: res.data.data,
            success: function (res) {
             
              wx.navigateTo({
                url: '/pages/waitBuyerPay/waitBuyerPay'
              })
            }
          })
        } else {
         
          wx.showModal({
            title: '提示',
            content: res.data.em,
            showCancel: false,
           
            success: function(res) {
              return false;
            },
           
          })

        }
      },
      complete: function () {
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    })
    // wx.navigateTo({
    //   url: '/pages/waitBuyerPay/waitBuyerPay'
    // })
    // wx.setStorage({
    //   key: 'cartOrder',
    //   data: data,
    //   success: function () {
    //     wx.navigateTo({
    //       url: '/pages/waitBuyerPay/waitBuyerPay',
    //     })
    //   }
    // })
  },

  onShow: function () {
    var that = this;
    if (!app.globalData.plumSession) {
      app.wechatSq(that);
    } else {
      that.requestIndex();
      that.requestActivitylist();
     
    };

    wx.setStorageSync("jishi","1")


    if (app.globalData.comInfor) {
      ///9999
      that.setData({
        comInfor: app.globalData.comInfor
      })
    }
  },
  hideGetuser: function () {
    var that = this;
    that.setData({
      isShowgetuser: false
    })
  },
  nowbuy1:function(){

    return false;
  },
  // 获取用户信息
  getuserInfo: function (e) {
    var that = this;
    if (e.detail.userInfo) {
      var userInfo = e.detail.userInfo;
      console.log(userInfo);
      var slient = that.data.slient;
      var again = false;
      if (slient == 0) {
        again = true;
      }

      app.getuserInfo(that, userInfo, again);

      // that.onPullDownRefresh()
    }
  },

  nowTime: function () {
    var that = this;


    var len = that.data.activityList.length;  //获取长度
    console.log(that.data.activityList[0])
    var dd = that.data.activityList[0];

    for (var i = 0; i < len; i++) {
      var intDiff = that.data.activityList[i].fix_time;//获取数据中的时间戳
      var day = 0, hour = 0, minute = 0, second = 0;
      if (intDiff > 0) {//转换时间

        day = Math.floor(intDiff / (60 * 60 * 24));
        hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
        minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
        second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);

        if (hour <= 9) hour = '0' + hour;
        if (minute <= 9) minute = '0' + minute;
        if (second <= 9) second = '0' + second;

        that.data.activityList[i].fix_time--;

        var str = hour + ':' + minute + ':' + second


      } else {
        var str = -1
        //clearInterval(timer);
      }



      that.data.activityList[i].difftime = str;//在数据中添加difftime参数名，把时间放进去


    }

    that.setData({
      activityList: that.data.activityList
    })


  },
  getSlient: function () {
    var that = this;
    var slient = app.globalData.slient ? app.globalData.slient : '';
    that.setData({
      slient: slient
    })
    if (slient == 1) {
      that.setData({
        isShowgetuser: true
      })
    }
  },
  getLocation: function () {
    var that = this;
    wx.getLocation({
      success: (res) => {
        console.log(res);
        that.setData({
          lat: res.latitude,
          lng: res.longitude
        })
        var location = {
          lat: res.latitude,
          lng: res.longitude
        }
        app.globalData.location = location;
        console.log('经纬度');
        console.log(app.globalData.location);
        // app.getCurAddress(res.latitude, res.longitude, that);
      },
      fail: (res) => {
        wx.getSetting({
          success: (res) => {
            if (res.authSetting['scope.userLocation']) {
              app.errorTip(that, "无法获取您的当前定位地址，请打开定位权限", 2000);
            } else {
              wx.openSetting({
                success: (res) => {
                  res.authSetting = {
                    "scope.userLocation": true
                  }
                  console.log(res.authSetting);
                }
              })
            }
          }
        })
      }
    })
  },
  requestIndex: function () {
    var that = this;
    that.getSlient();
    // wx.showLoading({
    //   title: '加载中',
    //   mask: true,
    //   time: 100000
    // })
    console.log('首页' + app.globalData.requestUrl);
    // var tuan_id=that.data.tuan_g_id;
    var tuan_id = '';
    var mid_ = app.globalData.userInfo.mid;
    wx.request({
      url: app.globalData.requestUrl,
      data: {
        map: 'applet_sequence_index',
        tuan_id: tuan_id,
        mid_: mid_
      },
      success: function (res) {
        console.log("首页数据");
        console.log(res.data);
        that.setData({
          tuan_g_id: '',
        })
        if (res.data.ec == 200) {
          console.log(res.data.data.community)
          that.setData({
            com_info: res.data.data.community

          })
          //判断是否为空
          if (res.data.data.community == "") {
            wx.navigateTo({
              url: '../../subpages/selectArea/selectArea',
            })
          }

          that.setData({
            indexInfo: res.data.data,
            title: res.data.data.name
          });
          if (res.data.data.name) {
            wx.setNavigationBarTitle({
              title: res.data.data.name
            })
          }
          if (!app.globalData.comInfor) {
            if (res.data.data.community) {
              that.setData({
                comInfor: res.data.data.community
              });
              app.globalData.comInfor = res.data.data.community;
            }
          }

          app.globalData.watermark = res.data.data.watermark;
          app.globalData.openWatermark = res.data.data.openWatermark;
          app.globalData.supportOpen = res.data.data.supportOpen;
          app.globalData.watermarkLogo = res.data.data.watermarkImg;
          app.globalData.telphone = res.data.data.mobile;
          var shareInfo = {
            shareCover: res.data.data.shareCover,
            shareTitle: res.data.data.shareTitle
          }
          app.globalData.shareInfo = shareInfo;
        } else {
          console.log(res.data)
          that.setData({
            indexInfo: "",
            noticeList: "",
            categoryList: ""
          })
          app.errorTip(that, res.data.em, 2000);
        }
      },
      complete: function () {
        // wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    });
  },
  requestActivitylist: function () {
    var that = this;
    var mid_ = app.globalData.userInfo.mid;
    wx.showLoading({
      title: '加载中',
      mask: true,
      time: 100000
    })



    var data = {};
    var page = that.data.page;
    data.map = 'applet_sequence_activity_list';
    data.page = page;
    data.mid_ = mid_;
    console.log(data);
    console.log('链接地址' + app.globalData.requestUrl);

    wx.request({
      url: app.globalData.requestUrl,
      data: data,
      success: function (res) {
        console.log("当前请求分页为" + page);
        console.log(res.data);
        if (res.data.ec == 200) {
          var allArr = [];
          var goodsRow = [];
          var cartList = [];
          var notice = '';
          var initArr = that.data.activityList ? that.data.activityList : [];
          var curArr = res.data.data;
          var cate = res.data.cate;
          var cate_open = res.data.cate_open;
          var lastPageLength = curArr.length;
          if (page > 0) {
            allArr = initArr.concat(curArr);
          } else {
            allArr = res.data.data;
            if (res.data.goods_row) {
              goodsRow = res.data.goods_row.goods;
              cartList = res.data.goods_row.cartList;
            }


            notice = res.data.notice;
          }
          page++;
          for (var i = 0; i < allArr.length; i++) {
            allArr[i].isShowMoreimg = false;

            if (allArr[i]['asa_is_buy'] == 1) {
              that.setData({

                hd_id: allArr[i]['id']
              })
            }

          }


          // that.setData({
          //   activityList: allArr,
          // })


          that.setData({
            activityList: allArr,
            goodsList: goodsRow,
            cartList: cartList,
            cate: cate,
            qiandao:res.data.qiandao,
            cate_open: cate_open,
            notice: notice,
            page: page
          })

          var list=that.data.activityList
      
          // var interval = setInterval(function () {
            for (var i = 0; i < that.data.activityList.length; i++) {
             
              if (that.data.activityList[i]['asa_is_buy'] == 1) {
                for (var j = 0; j < that.data.activityList[i]['goods_one']['goods'].length; j++) {

                  
                  var intDiff = that.data.activityList[i]['goods_one']['goods'][j]['sy_time'];
                  var day = 0, hour = 0, minute = 0, second = 0;
                  if (intDiff > 0) {//转换时间

                    day = Math.floor(intDiff / (60 * 60 * 24));
                  
                    hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
                    console.log(hour)
                    minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
                    second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);

                    if (hour <= 9) hour = '0' + hour;
                    if (minute <= 9) minute = '0' + minute;
                    if (second <= 9) second = '0' + second;
                    

                      that.data.activityList[i]['goods_one']['goods'][j]['sy_time']--;

                   
                    var str = hour + ':' + minute + ':' + second

                  } else {
                    var str = -1
                    //clearInterval(timer);
                  }
                  that.data.activityList[i]['goods_one']['goods'][j]['H'] = hour;//在数据中添加difftime参数名，把时间放进去
                  that.data.activityList[i]['goods_one']['goods'][j]['i'] = minute;//在数据中添加difftime参数名，把时间放进去
                  that.data.activityList[i]['goods_one']['goods'][j]['s'] = second;//在数据中添加difftime参数名，把时间放进去
                 
                }
              
              }
          
              that.setData({
                activityList: that.data.activityList
              })
           
              
            }

          
      
          // }.bind(this), 10000);
          
          if (wx.getStorageSync("time_line") == 9) {
            that.nowTime();
          }

          // var timer = setInterval(that.nowTime, 1000);
          if (lastPageLength < 10) {
            that.setData({
              noMoretip: true,
              showLoading: false
            });
          }

        } else {
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
        that.setData({
          hasData: true
        })
        wx.stopPullDownRefresh();
      }
    });
  },

  goodDetail: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var aid = e.currentTarget.dataset.acid;
    if (that.data.groupId) {
      wx.navigateTo({
        url: '/pages/goodDetail/goodDetail?aid=' + aid + '&id=' + id + '&groupId=' + that.data.groupId,
      })
    } else {
      wx.navigateTo({
        url: '/pages/goodDetail/goodDetail?aid=' + aid + '&id=' + id,
      })
    }
  },
  onPullDownRefresh: function () {
    var that = this;
    that.setData({
      page: 0,
      noMoretip: false,
      showLoading: true,
    });

    that.onReady();
    that.onLoad();
    that.onShow();
    console.log("下拉刷新");
  },
  onReachBottom: function () {
    var that = this;
    console.log("到达页面底部")
    var isMore = that.data.noMoretip;
    var page = that.data.page;
    if (isMore) {
      console.log("已完成或正在加载");
    } else {
      that.requestActivitylist();
    }
  },
  showMoreimg: function (e) {//显示更多图片
    var that = this;
    var id = e.target.dataset.id;
    var activityList = that.data.activityList;
    for (var i = 0; i < activityList.length; i++) {
      if (activityList[i].id == id) {
        activityList[i].isShowMoreimg = true;
      }
    }
    that.setData({
      activityList: activityList
    })
    console.log(that.data.activityList);

  },
  // 预览图片
  peiviewImg: function (e) {
    var curimg = e.currentTarget.dataset.curimg;
    var imgs = e.currentTarget.dataset.imgs;
    wx.previewImage({
      current: curimg, // 当前显示图片的http链接
      urls: imgs // 需要预览的图片http链接列表
    })
  },
  //选择小区
  selectArea: function () {
    var that = this;
    wx.navigateTo({
      url: "/subpages/selectArea/selectArea",
    })
  },
  //打开活动详情
  activityDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/activityDetail/activityDetail?id=' + id,
    })
  },
  //打开优惠券大厅
  openCoupon: function () {
    wx.navigateTo({
      url: '/subpages/couponList/couponList',
    })
  },
  toCuslink: function (e) {
    var that = this;
    var url = e.currentTarget.dataset.link;
    if (url) {
      wx.navigateTo({
        url: url,
      })
    }
  },
  onShareAppMessage: function () {
    var tuan_id = app.globalData.comInfor.id;
    var that = this;
    var title = that.data.title ? that.data.title : '柒個秋天';
    var shareInfo = app.globalData.shareInfo;
    title = shareInfo.shareTitle ? shareInfo.shareTitle : title;
    var cover = shareInfo.shareCover ? shareInfo.shareCover : ''


    var imgurl = "https://ww.cry7.cn/getgoods/5.jpg";

    return {
      title: title,
      imageUrl: imgurl,
      path: '/pages/index/index?tuan_id=' + tuan_id,
      success: function () {

      }
    }
  },
  cate_info: function (e) {

    var cate = e.currentTarget.dataset.cate_id;

    wx.navigateTo({

      url: '/pages/goodsList/goodsList?cate_id=' + cate,
    })

  },
  showModal: function () {
    // 显示遮罩层
    var that = this;
    var data = {};
    data.map = 'applet_setting_cfg';
    wx.request({
      url: app.globalData.requestUrl,
      data: data,
      success: function (res) {

        console.log(res.data);


        that.setData({
          phone: res.data,
        })


      },

    })


    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "ease-in-out",
      delay: 0
    })
    this.animation = animation
    animation.translateY(500).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  hideModal: function () {
    this.setData({
      showModalStatus: false,
    })

  }
})
