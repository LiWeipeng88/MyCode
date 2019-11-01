var WxParse = require('../../wxParse/wxParse.js');

export { base64src } from '../../utils/base64src.js';
const app = getApp();
Page({
  data: {
    cartModelShow:false,
    isShowModal:false,
    buy_list_d:2,
   
  },
  onLoad: function (e) {
  

    
    var that = this;
  //获取accesstoken
    // wx.request({
    //   url: app.globalData.requestUrl,
    //   data: {
    //     map: 'applet_sequence_get_code',

    //   },
    //   success: function (res) {
    //     that.setData({
    //       access_token: res.data.data.access_token
    //     })
    //   }

    // })
    


    // if (e.scene) {
    //   let scene = decodeURIComponent(e.scene);
    //   let aid = scene.split("&")[0];
    //   let id = scene.split("&")[1];
    //   let tuan_id = scene.split('&')[2];
    //   console.log(tuan_id)    
    //   that.setData({
    //     aid: aid,
    //     id: id,
    //     tuan_id: tuan_id,
    //   })
     
    // }
  
      
    
    console.log("获取参数")
  //物业
    if(!e){

    
    if (wx.getStorageSync('w_id')==1){
     
      that.setData({
        wuye_id: 1
      })

    }else{

      
      that.setData({
        wuye_id: 0
      })
    }
    }else{

      if (e.wuye_id == 1) {

        that.setData({
          wuye_id: 1
        })

      } else {


        that.setData({
          wuye_id: 0
        })
      }

    }
   
  

    if (app.globalData.comInfor) {
      console.log(app.globalData.comInfor)
      
      that.setData({
        comInfor: app.globalData.comInfor
      })
    }

    if (e){
     
    wx.setStorageSync("eee", e);
    }
   
    if (wx.getStorageSync("eee")!=''){
      var ee = wx.getStorageSync("eee");
      that.setData({
        aid: ee.aid,
        id: ee.id
      });
      
      if (ee.groupId) {
       
        that.setData({
          tuan_id: ee.groupId
        })

      }
      wx.setStorageSync("comid", ee.groupId);
      }else{
     
      if (e) {
        that.setData({
          aid: e.aid,
          id: e.id
        })
      };

      if (e.groupId) {

        that.setData({
          tuan_id: e.groupId
        })

      }
      wx.setStorageSync("comid", e.groupId);
      }

 


   
    var that = this;
    console.log(app.globalData.plumSession);
    if (wx.getStorageSync('notsession') =='notsession'){
      app.globalData.plumSession='';
      console.log(app.globalData.plumSession);
      console.log("enter");
      wx.setStorageSync("notsession", '1');
  }


    console.log("SESSIONID");
    if (!app.globalData.plumSession) {
      app.wechatSq(that);
      wx.setStorageSync('w_id', e.wuye_id)
      //that.onLoad();
    }else{
      
      that.requestIndex();
      
    } 
      
      //that.requestActivitylist();
    
   
    // if (e&&e.groupId) {
    //   that.setData({
    //     groupId: e.groupId
    //   })
    // };


  // if (detailInfor.xq == "") {
  //           wx.navigateTo({
  //             url: '../../subpages/selectArea/selectArea',
  //           })
  //         }

    
    if (!app.globalData.plumSession) {
      app.wechatSq(that);
    } else {
      app.contactData(that);
      that.requestDetail();
      // that.cartData();
    };
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

  changeinfo:function(e){
    
    this.setData({
      buy_list_d:2

    })
  },
  changeinfo1: function (e) {

    this.setData({
      buy_list_d: 1

    })
  },
  onUnload:function(){
    var that = this;
    clearInterval(that.data.intervarID);
  },
  getPhoneNumber: function (e) {
    var that = this;
    app.getPhone(e, that);
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
      app.getuserInfo(that, userInfo, again);
    }
  },
  hideGetuser: function () {
    var that = this;
    that.setData({
      isShowgetuser: false
    })
  },
  contactRecord: function () {
    app.contactRecord()
  },
  //单张图片预览
  singlePeiviewImg: function (e) {
    var curimg = e.currentTarget.dataset.curimg;
    var imgs = [e.currentTarget.dataset.imgs];
    wx.previewImage({
      current: curimg, // 当前显示图片的http链接
      urls: imgs // 需要预览的图片http链接列表
    })
  },
  //商品详情
  requestDetail: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    var mid_ = app.globalData.userInfo.mid;
    that.setData({

      tuan_id:''
    })
    wx.request({
      url: app.globalData.requestUrl,
      data: {
        map: 'applet_sequence_goods_detail',
        id: that.data.id,
        aid: that.data.aid,
        mid_:mid_,
        tuan_id: that.data.tuan_id
      },
      success: function (res) {
       
        
        if (res.data.ec == 200) {
          var detailInfor = res.data.data;
          if (detailInfor.cartNum==0){
            detailInfor.cartNum = 1;
          }
          //判断有没有小区
          console.log(detailInfor)
          console.log("wwwwwww")
          // if (detailInfor.xq.asc_name == null || typeof (detailInfor.asc_name) =="undefined"){
            
          //   that.setData({
          //     xiaoqu_info:404

          //   })
          // }
          
          
          wx.setStorageSync("comid", detailInfor.xq.asc_id);
          console.log(detailInfor.xq);
          console.log(99999)
          that.setData({
            detailInfor: detailInfor,
            xiaoqu: detailInfor.xq,
            goods_: detailInfor
          });
          var article = res.data.data.detail;
          // 富文本解析
          WxParse.wxParse('article', 'html', article, that, 5);
          that.countDjs();
          that.daojishi();

          // app.errorTip(that, res.data.data.msg, 2000);
        } else {
          // app.errorTip(that, res.data.em, 2000);
        }
      },
      complete: function () {
        wx.hideLoading();
      }
    });
  },
  countDjs: function () {
    var that = this;
    // console.log(that.data.goodDetail.limit);
    var startTime = that.data.detailInfor.groupStart*1000;
    var endTime = that.data.detailInfor.groupEnd*1000;
    // var startTime = new Date('2018-10-08 15:00:00');
    // var endTime = new Date('2018-10-13 18:30:00');
    var curtime = new Date(); //避免页面渲染倒计时的时候出现一秒的延迟。
    console.log(curtime);
    var startSpan1 = startTime - curtime;
    var endSpan2 = endTime - curtime;
    if (startSpan1 > 0) {
      that.setData({
        start: '开始',
      })
      that.djs(startSpan1);
    } else {
      that.setData({
        start: '结束',
      })
      that.djs(endSpan2);
    }
    that.data.intervarID = setInterval(function () {
      var nowTime = new Date();
      var startSpan = startTime - nowTime;
      var endSpan = endTime - nowTime;
      if (startSpan > 0) {
        that.setData({
          start: '开始',
        })
        that.djs(startSpan);
      } else {
        that.setData({
          start: '结束',
        });
        // console.log(endSpan);
        that.djs(endSpan);
      }
    }, 1000)
    // }

  },
  djs: function (time) {
    var that = this;
    var leftTime = time;
    that.setData({
      leftTime: leftTime
    });
    // console.log(leftTime);
    if (leftTime > 0) {
      var days = parseInt(leftTime/1000 / 60 / 60 / 24, 10); //计算剩余的天数 
      var hours = parseInt(leftTime / 1000  / 60 / 60 % 24, 10); //计算剩余的小时 
      var minutes = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟 
      var seconds = parseInt(leftTime / 1000  % 60, 10);//计算剩余的秒数 
      days = days < 10 ? '0' + days : days;
      // console.log(days);
      hours = hours < 10 ? '0' + hours : hours;
      minutes = minutes < 10 ? '0' + minutes : minutes;
      seconds = seconds < 10 ? '0' + seconds : seconds;
      that.setData({
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds
      })
      if (days == '00' && hours == '00' && minutes == '00' && seconds == '00') {
        clearInterval(that.data.intervarID);
      }
    } else {
      that.setData({
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00',
      })
    }
  },
  //购物车商品
  cartData:function(){
    var that = this;
    wx.request({
      url: app.globalData.requestUrl,
      data: {
        map: 'applet_sequence_cart_list',
        aid: that.data.aid
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.ec == 200) {
          that.setData({
            cartList: res.data.data
          });
          that.getCartGoodNum();//计算购物车中的商品数量
        } else {
          // app.errorTip(that, res.data.em, 2000);
        }
      },
      complete: function () {
      }
    });
  },
  addcart: function (e) {
    var that = this;
    if (!app.globalData.plumSession) {
      wx.showModal({
        title: '操作提示',
        content: '允许授权后才可进行其它操作哦',
        showCancel: false,
        confirmText: '确定',
        confirmColor: '#1AAD16',
        success: function (res) {
          if (res.confirm) {
            wx.reLaunch({
              url: '/pages/singlePage/singlePage'
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      that.setData({
        isShowModal: true,
        modalOperaType: "addcart"
      })
    }
  },
  nowbuy: function () {
    
    var that = this;
    var that = this;
    if (!app.globalData.plumSession) {
      wx.showModal({
        title: '操作提示',
        content: '允许授权后才可进行其它操作哦',
        showCancel: false,
        confirmText: '确定',
        confirmColor: '#1AAD16',
        success: function (res) {
          if (res.confirm) {
            wx.reLaunch({
              url: '/pages/singlePage/singlePage'
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      console.log("暂未获取到信息");
    } else {
      that.setData({
        isShowModal: true,
        modalOperaType: "buy"
      })
    }
  },
  hideModal: function () {
    var that = this;
    that.setData({
      isShowModal: false
    })
  },
  //添加到购物车
  addRequestCart: function (gid, number,confirm) {
    var that = this;
    var data = {};
    data.map = 'applet_sequence_edit_cart';
    data.gid = gid;//商品id
    data.aid = that.data.aid;
    console.log(number);
    data.num = number;
    if (confirm){
      data.confirm = 1;
    }
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
          if (confirm) {
            app.errorTip(that, '加入购物车成功', 2000);
            that.setData({
              isShowModal:false
            });
            that.onLoad();
          }
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

  //立即购买和加入购物车中的数量加减操作
  goodChange:function(e){
    var that = this;
    var dataset = e.target.dataset;
    var type = dataset.type;
    console.log(type);
    var detailInfor = that.data.detailInfor;
    if (type == 'add') {
      detailInfor.cartNum++
    }
    if (type == 'sub') {
      console.log("减少商品");
      if (detailInfor.cartNum>1){
        detailInfor.cartNum--;
      }
    }
    that.setData({
      detailInfor: detailInfor
    })
  },
  //加入购物车操作
  confirmAddcart:function(e){
    var that = this;
    var gid = e.currentTarget.dataset.gid;
    var num = that.data.detailInfor.cartNum;
    var confirm = 1;
    that.addRequestCart(gid,num,confirm);
  },
  // 获取购物车商品总数
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
  // 清空购物车
  clearCart: function () {
    var that = this;
    var detailInfor = that.data.detailInfor;
    var cartList = that.data.cartList;
    wx.showModal({
      title: '提示',
      content: '确定要清空购物车吗？',
      success: function (res) {
        if (res.confirm) {
          detailInfor.cartNum = 1;
          //操作购物车中的商品购买数量为0
          for (var i = 0; i < cartList.length; i++) {
            if (cartList[i].num > 0) {
              cartList[i].num = 0;
            }
          }
          that.deleteRequestCart();
          that.setData({
            detailInfor: detailInfor,
            cartList: [],
            cartSumNum: 0,
            cartModelShow: false
          })
        }
      }
    })
  },
  deleteRequestCart: function () {
    var that = this;
    var data = {};
    data.map = 'applet_sequence_empty_cart';
    data.aid = that.data.aid;
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
  cartModelShow: function () {
    var that = this;
    var cartList = that.data.cartList;
    if (cartList.length > 0) {
      that.setData({
        cartModelShow: true
      })
    } else {
      app.errorTip(that, '请添加商品~', 2000);
    }
  },
  cartModelHide: function () {
    var that = this;
    that.setData({
      cartModelShow: false
    })
  },
  // 去结算  提交订单跳转
  submitOrder: function (e) {
    // try {
    //   wx.removeStorageSync('voucherInfo')
    //   wx.removeStorageSync('addressInfo')
    // } catch (e) {
    //   // Do something when catch error
    // }
    
    
    var that = this;

    //物业

   var wuye=e.currentTarget.dataset.wuye;

    var xiaoqu_info = that.data.xiaoqu_info;
   console.log(xiaoqu_info)
  //  console.log("dddddddd")
  //   if (xiaoqu_info ==404) {
  //     wx.navigateTo({
  //       url: '../../subpages/selectArea/selectArea',
  //     })
  //   }
 
   
    console.log("99999999999")
    
    
    // var cartList = that.data.cartList;  //购物车中的商品
    var detailInfor = that.data.detailInfor;
    var data = {};
    data.map = 'applet_sequence_create_trade';
    data.asaId = that.data.aid;
    if (that.data.groupId) {
      data.groupId = that.data.groupId;
    }
    var buys = [];
    var obj = {};
    obj.gid = detailInfor.id;
    obj.num = detailInfor.cartNum;
  //  obj.wuye_id=wuye;
    buys.push(obj);
    console.log(buys);
    
    data.buys = buys;
    console.log(data);
    
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
                url: '/pages/waitBuyerPay/waitBuyerPay?wuye='+wuye
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
  },
  //返回首页
  backIndex: function () {
    var that = this;
    wx.reLaunch({
      url: '/pages/singlePage/singlePage',
    })
  },
  haibao:function(){
    var that=this;
    var detailInfor = that.data.detailInfor
    console.log(detailInfor);
  
    var context = wx.createCanvasContext('firstCanvas')
    var conver = this.data.detailInfor.img1
   
    wx.request({
      url: app.globalData.requestUrl,
      data: {
        scene: that.data.aid + '&' + that.data.id + '&' + that.data.tuan_id,
        map: 'applet_sequence_get_code',
         page: "pages/goodDetail/goodDetail",
       // page: "pages/goodDetail/goodDetail",
        access_token: that.data.access_token
      },
      method: "GET",
      // responseType: 'arraybuffer',  //设置响应类型
      success(res) {
        console.log(res.data)
        var src2 = res.data.data;  //对数据进行转换操作
        console.log(detailInfor.stock)
        context.setFontSize(14)
      //  context.drawImage(conver, 45, 20, 125, 125)
        context.fillText(detailInfor.name, 30, 165, 300, 30)
        context.fillText(detailInfor.brief, 30, 185, 300, 30)
        context.fillStyle = "#000000";
        context.fillText("售价：" + detailInfor.price + "元", 55, 205, 300, 30)
        context.fillText("剩余：" + detailInfor.stock + "件", 55, 225, 300, 30)
        context.fillText("长按扫描识别小程序", 35, 250, 300, 30)
       // context.drawImage(src2, 55, 260, 75, 75)
        wx.getImageInfo({
          src: conver,//服务器返回的图片地址
          success: function (res) {
            //res.path是网络图片的本地地址
            let Path = res.path;
             console.log(Path);
            
            //context.drawImage(Path, 55, 260, 75, 75)
            context.drawImage(Path, 45, 20, 125, 125)
            /// 临时图片路径
            const filePath = `${wx.env.USER_DATA_PATH}/temp_image.jpeg`;
            /// 将base64转为二进制数据
            const buffer = wx.base64ToArrayBuffer(src2);
            /// 绘制成图片
            wx.getFileSystemManager().writeFile({
              filePath,
              data: buffer,
              encoding: 'binary',
              success() {
                console.log(filePath)/// 这个filePath就是canvas能绘制的路径
                console.log("这是二维码");
                context.drawImage(filePath,55,260,75,75)
                context.stroke()
                context.draw()
              },
              fail() {
              }
            });
           /* context.drawImage(fileName, 55, 260, 75, 75)
            context.stroke()
            context.draw()
            */

           
          },
          fail: function (res) {
            //失败回调
          }
        });

       
        
       
        that.setData({
          src2: src2
        })
      },
      fail(e) {
        console.log(e)
      }
    })


    
  },
  daojishi:function(){
    var that=this;
   
    if (that.data.detailInfor.ys_time==1){

   
    var interval = setInterval(function () {
      var intDiff = that.data.detailInfor.start > 0 ? that.data.detailInfor.start : that.data.detailInfor.end;//获取数据中的时间戳
      console.log(that.data.detailInfor)
      var day = 0, hour = 0, minute = 0, second = 0;
      if (intDiff > 0) {//转换时间

        day = Math.floor(intDiff / (60 * 60 * 24));
        hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
        minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
        second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);

        if (hour <= 9) hour = '0' + hour;
        if (minute <= 9) minute = '0' + minute;
        if (second <= 9) second = '0' + second;

        if (that.data.detailInfor.start>0){
          that.data.detailInfor.start--;
        }else{
          that.data.detailInfor.end--
        }
        

        var str = hour + ':' + minute + ':' + second


      } else {
        var str = -1
        //clearInterval(timer);
      }
      
      if(that.data.detailInfor.start>0){
          var ms_time="开始"
      }else{
        var ms_time = "结束"
      }
     
      if (that.data.detailInfor.start>0){
      
    }else{

        

        if (hour == 0 && minute == 0 && second == 0) {
          that.data.detailInfor.start = -1;
          that.data.detailInfor.end = -1;
          clearInterval(interval)
        }else{
          that.data.detailInfor.start = -1;
          that.data.detailInfor.end = that.data.detailInfor.end;
        }
        that.setData({
          detailInfor: that.data.detailInfor

        });
    }
       

      that.setData({
        hour: hour,
        ms_time:ms_time,
        minute: minute,
        second: second,
        
      });
    }.bind(this), 1000)
    }
  },
  onShareAppMessage: function () {
    var that = this;
    var id = that.data.id;
    var aid = that.data.aid;
    var wuye_id=that.data.wuye_id
   // var tuan_id = app.globalData.comInfor.id;
    var path;
    // console.log(tuan_id)
    // if (tuan_id != '') {
    //   groupId = that.data.groupId;
    //   path = '/pages/goodDetail/goodDetail?id=' + id + '&aid=' + aid + '&groupId=' + tuan_id;
    // } else {
      path = '/pages/goodDetail/goodDetail?id=' + id + '&aid=' + aid+'&wuye_id='+wuye_id
     //}
     console.log(path)
    var title = that.data.detailInfor.name +"抢购价"+ that.data.detailInfor.price+"元";
    var cover = that.data.detailInfor.img1 ? that.data.detailInfor.img1 : '';
    // console.log(title);
    var shareInfo = app.globalData.shareInfo;
    //title = shareInfo.shareTitle ? shareInfo.shareTitle : title;
    return {
      title: title,
      imageUrl: cover,
      path: path,
      success: function () {
        
      }
    }
  },

  saveShareImg: function () {
    var that = this;
    wx.showLoading({
      title: '正在保存',
      mask: true,
    })
    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'firstCanvas',
        fileType: 'jpg',
        success: function (res) {
          wx.hideLoading();
          var tempFilePath = res.tempFilePath;
          wx.saveImageToPhotosAlbum({
            filePath: tempFilePath,
            success(res) {
              wx.showModal({
                content: '图片已保存到相册，赶紧晒一下吧~',
                showCancel: false,
                confirmText: '好的',
                confirmColor: '#333',
                success: function (res) {
                  if (res.confirm) { }
                },
                fail: function (res) { }
              })
            },
            fail: function (res) {
              wx.showToast({
                title: res.errMsg,
                icon: 'none',
                duration: 2000
              })
            }
          })
        }
      });
    }, 1000);
  },
})