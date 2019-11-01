var Moment = require("../../utils/moment.js");
const app = getApp()
var DATE_YEAR = new Date().getFullYear();
var DATE_MONTH = new Date().getMonth() + 1;
var DATE_DAY = new Date().getDate();
Page({
  data: {
    year: '',
    month: '',
    day: '',
    btn:1,
    count:7,
    jifen2:0,
    days: {},
    systemInfo: {},
    weekStr: ['日', '一', '二', '三', '四', '五', '六'],
    checkDate: [],
    signVal: '点击签到',
    shareVal: '今天已签到',
    dispaly: false,
    dispaly1:false,
    nian:'',
    yue: '',
    ri: '',
  },

  submitOrder: function (e) {
    // try {
    //   wx.removeStorageSync('voucherInfo')
    //   wx.removeStorageSync('addressInfo')
    // } catch (e) {
    //   // Do something when catch error
    // }

      

    var that = this;
   
    // return false;
    var dataset = e.target.dataset;
    var double = e.target.dataset.double;
    var stock = e.target.dataset.stock;
    var exp = e.target.dataset.exp;
  //商品积分
    var jifen = parseInt(e.target.dataset.jifen);
    var now_jifen = parseInt(that.data.points)
    
    if (stock<=0) {
      wx.showModal({
        title: '信息提示',
        content: '库存不足',
        showCancel: false,
        success: function () {
          return false;
        }
      })

      console.log(11111111)

      console.log(22222222)
      return false;
    }



    console.log(jifen)
    console.log(now_jifen)
    if (now_jifen<jifen){
        wx.showModal({
          title: '信息提示',
          content: '签到天数不足',
          showCancel: false,
         success:function(){
           return false;
         }
        })

      
      return false;
    }
    console.log(exp)
    console.log(66666)
  
    if (that.data.m_exp < exp){

      wx.showModal({
        title: '信息提示',
        content: '所需积分不足',
        showCancel: false,
        success: function () {
          return false;
        }
      })

      return false;
    }
    

    console.log(dataset)
   
    // that.addGoodNum(dataset);


    var cartList = that.data.cartList;  //购物车中的商品
    var asaId = e.target.dataset.acid;

    var gwc = e.target.dataset.gwc;

    var data = {};
    data.map = 'applet_sequence_create_trade';
    data.asaId = asaId;
    if (that.data.groupId) {
      data.groupId = that.data.groupId;
    }
    var buys = [];



    var obj = {};
    obj.gid = e.currentTarget.dataset.id;
    obj.num = 1;
   
    buys.push(obj);

    data.jifen = 1;
    data.buys = buys;
    console.log(data);
    console.log(66666666)
    wx.request({
      url: app.globalData.requestUrl,
      data: data,
      success: function (res) {
        console.log(res.data);
        if (res.data.ec == 200) {
          wx.setStorage({
            key: "submitOrder",
            data: res.data.data,
            success: function (res) {
              console.log(res);

              wx.navigateTo({
                url: '/pages/waitBuyerPay/waitBuyerPay?jifen=1'
              })
            }
          })
        } else {
          app.errorTip(that, res.data.em, 2000);
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
  onLoad: function (options) {
    var _this = this;
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    // 页面初始化 options为页面跳转所带来的参数
    this.createDateListData();
    this.setData({
      year: year,
      month: month
    })
    
    _this.getTimelist()


    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          systemInfo: res,
        });
      }
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    var that = this;
   
    if (!app.globalData.plumSession) {
      app.wechatSq(that);
    } else {
      that.requestIndex();
      //that.requestActivitylist();
    };

    //获取日期
    that.getQiandaoGoods();

    // var year = that.data.nian
    // var month = that.data.yue
    // var day = that.data.ri
   
  },
  requestIndex: function () {
    var that = this;
    that.getSlient();
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
      var tuan_id = that.data.groupId;
      app.getuserInfo(that, userInfo, again, tuan_id);
    }
  },
  /**创建日历数据 */
  createDateListData: function (setYear, setMonth) {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let dateArr = []; //需要遍历的日历数组数据
    let arrLen = 0; //dateArr的数组长度
    let now = setYear ? new Date(setYear, setMonth) : new Date();
    let year = setYear || now.getFullYear();
    let nextYear = 0;
    let month = setMonth || now.getMonth();
    //没有+1方便后面计算当月总天数
    let nextMonth = (month + 1) > 11 ? 1 : (month + 1);
    console.log("当前选中月nextMonth：" + nextMonth);
    //目标月1号对应的星期
    let startWeek = this.getWeek(year, nextMonth, 1); //new Date(year + ',' + (month + 1) + ',' + 1).getDay(); 
    console.log("目标月1号对应的星期startWeek:" + startWeek);
    //获取目标月有多少天
    let dayNums = this.getTotalDayByMonth(year, nextMonth); //new Date(year, nextMonth, 0).getDate();   
    console.log("获取目标月有多少天dayNums:" + dayNums);
    let obj = {};
    let num = 0;
    if (month + 1 > 11) {
      nextYear = year + 1;
      dayNums = new Date(nextYear, nextMonth, 0).getDate();
    }
    for (var j = -startWeek + 1; j <= dayNums; j++) {
      var tempWeek = -1;
      if (j > 0) {
        tempWeek = this.getWeek(year, nextMonth, j);
        //console.log(year + "年" + month + "月" + j + "日" + "星期" + tempWeek);
      }
      var clazz = '';
      if (tempWeek == 0 || tempWeek == 6)
        clazz = 'week'
      if (j < DATE_DAY && year == DATE_YEAR && nextMonth == DATE_MONTH)
        //当天之前的日期不可用
        clazz = 'unavailable ' + clazz;
      else
        clazz = '' + clazz
      /**如果当前日期已经选中，则变色 */
      var date = year + "-" + nextMonth + "-" + j;
      var index = this.checkItemExist(this.data.checkDate, date);
      if (index != -1) {
        clazz = clazz + 'active';
      }
      dateArr.push({
        day: j,
        class: clazz,
        amount: '￥1.11'
      })
    }
    this.setData({
      days: dateArr
    })
  },
  /**
  * 上个月
  */
  lastMonthEvent: function () {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month - 2 < 0 ? this.data.year - 1 : this.data.year;
    let month = this.data.month - 2 < 0 ? 11 : this.data.month - 2;
    this.setData({
      year: year,
      month: (month + 1)
    })
    this.createDateListData(year, month);
  },
  /**
  * 下个月
  */
  nextMonthEvent: function () {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month > 11 ? this.data.year + 1 : this.data.year;
    let month = this.data.month > 11 ? 0 : this.data.month;
    this.setData({
      year: year,
      month: (month + 1)
    })
    this.createDateListData(year, month);
  },
  /*
  * 获取月的总天数
  */
  getTotalDayByMonth: function (year, month) {
    month = parseInt(month, 10);
    var d = new Date(year, month, 0);
    return d.getDate();
  },
  /*
  * 获取月的第一天是星期几
  */
  getWeek: function (year, month, day) {
    var d = new Date(year, month - 1, day);
    return d.getDay();
  },
  /**
  * 点击日期事件
  */
  onPressDateEvent: function (e) {
    console.log(e)
    var {
      year,
      month,
      day,
      amount
    } = e.currentTarget.dataset;
   let today =  year + "-" + month + "-" + day;
    // console.log('1111111',today)
    //当前选择的日期为同一个月并小于今天，或者点击了空白处（即day<0），不执行
    if ((day < DATE_DAY && month == DATE_MONTH) || day <= 0)
      return;

  


    this.renderPressStyle(year, month, day, amount);
  },
  renderPressStyle: function (year, month, day, amount) {
    var days = this.data.days;
    //渲染点击样式
    for (var j = 0; j < days.length; j++) {
      var tempDay = days[j].day;
      if (tempDay == day) {
        var date = year + "-" + month + "-" + day;
        var obj = {
          day: date,
          amount: amount
        };
        var checkDateJson = this.data.checkDate;
        var index = this.checkItemExist(checkDateJson, date);
        if (index == -1) {
          checkDateJson.push(obj);
          console.log(days[j]);
          
          days[j].class = days[j].class + ' active';
          let counts = this.data.count
          this.setData({
            count: counts + 1,
          })
          } else {
          // checkDateJson.splice(index, 1);
          let counts = this.data.count
          this.setData({
            count: counts + 0,
          })
        }

        this.setData({
          checkDate: checkDateJson
        })
        console.log(JSON.stringify(this.data.checkDate));
        break;
      }
    }
    this.setData({
      days: days
    });

  },
  /**检查数组中是否存在该元素 */
  checkItemExist: function (arr, value) {
    for (var i = 0; i < arr.length; i++) {
      if (value === arr[i].day) {
        return i;
      }
    }
    return -1;
  },
  convertBtn(){
    console.log('兑换成功')
  },
  qiandao(e){
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    //获取年份  
    var Y = date.getFullYear();
    //获取月份  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //获取当日日期 
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    console.log("当前时间：" + Y + '年' + M + '月' + D + '日');
   
    
      e.currentTarget.dataset.year = Y //年
      e.currentTarget.dataset.month = M //月
      e.currentTarget.dataset.day = D //日
    this.onPressDateEvent(e)
  },

getQiandaoGoods:function(){
  var that=this;
  var data = {};
  data.map = 'applet_sequence_qiandaog_list';

  wx.request({
    url: app.globalData.requestUrl,
    data: data,
    success: function (res) {

      if (res.data.qd==1){
         that.setData({
           dispaly: false,
           dispaly1: true,
          
        })
       
      }
      if (res.data.qd == 2) {
        that.setData({
          dispaly: true,
          dispaly1: false,
         
        })
      }

      

      // wx.setStorageSync('y', res.data.time_year)
      // wx.setStorageSync('m', res.data.time_m)
      // wx.setStorageSync('d', res.data.arr)

      that.setData({
          qd: res.data.qd,
          str: res.data.str,
          list:res.data.data,
          jifen2:res.data.jifen,
          points: res.data.qd_points,
           m_exp: res.data.m_exp
      })

    },
  })
  



},
  onShareAppMessage: function (res) {
    var that=this;
    // wx.request({
    //   url: app.globalData.requestUrl,
    //   data: {
    //     otid: 'time',
    //     map: 'applet_sequence_add_exp',
    //   },
    //   success: function (res) {
    //     console.log(res)
    //     that.setData({
    //       exp: res.data

    //     })

    //   }

    // })




        return {
          title: '分享签到',
          path: '/pages/index/index'
        }
      },

      qiandao1:function(){

        //签到

        var that = this;
        var data = {};
        data.map = 'applet_sequence_qiandao_list';

        wx.request({
          url: app.globalData.requestUrl,
          data: data,
          success: function (res) {
            console.log(res.data.data.status)
    
            if (res.data.data.status == 2) {
              wx.showModal({
                title: '信息提示',
                content: '签到成功',
                showCancel: false,
                success:function(){
                 
                //  wx.switchTab({
                //    url: '/pages/index/index',
                  
                //  })
                }
              })
            } else if (res.data.data.status == 1) {

              wx.showModal({
                title: '信息提示',
                content: '今天已经签到过了',
                showCancel: false,
              })

            }

            that.getQiandaoGoods();
            that.getTimelist()


          },
        })

  //签到结束
      },

  getTimelist:function(){
    
    var that = this;
    var data = {};
    data.map = 'applet_sequence_qiandaog_time';
    
    wx.request({
      url: app.globalData.requestUrl,
      data: data,
      success: function (res) {
      
        var year = res.data.data.nian
        var month = res.data.data.yue
        var day = res.data.data.arr
         var amount = 11;
    for (var i = 0; i < day.length; i++) {
      that.renderPressStyle(year, month, day[i], amount);
    }


        that.setData({
         
          nian: res.data.data.time_year,
          yue: res.data.data.time_m,
          ri: res.data.data.arr,
        })

      },
    })


  }

})