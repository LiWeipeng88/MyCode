const app = getApp();
Page({
  data: {
    codeShow:false,
    isShowModal:false,
    gid:0,
    num:0,
    xuanze:false,
  },
  onLoad: function (e) {
    var that = this;
    if(e&&e.tid){
      that.setData({
        tid:e.tid
      })
    };
    console.log(e)
    that.orderDetail();
   
  },
  
  is_show:function(e){
    var that = this;
    console.log(that.data.orderDetail.total)
    this.setData({
      tip_onshow:1
    })
    this.setData({
      price_total:that.data.orderDetail.total

    })
  
  },
  quxiao: function (e) {
    this.setData({
      tip_onshow: 2
    })

  },
  on_tip_onshow:function(){
    this.setData({
      tip_onshow: 2
    })

  },

  radiochange:function(e){
    
    this.setData({
      tkMoney:e.detail.value
      

    })
  },
  onShow:function(){
    var that = this;
  },


  confirmVerify: function (e) {
    var that = this;
    var tid = e.currentTarget.dataset.tid;
    wx.showModal({
      title: '',
      content: '确认收货？',
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


  changeprice:function(e){
    this.data.price_total = e.detail.value;
  },


  showwuliu:function(e){
    var wuliu_name=e.currentTarget.dataset.name;
    var wuliu_code = e.currentTarget.dataset.code;
    console.log(wuliu_name)
    console.log(wuliu_code)
    var that=this;
    wx.request({
      url: "https://www.kuaidi100.com/query?",
      method:"get",
      data: {
        type: wuliu_name,
        // suid: app.globalData.suid,
        postid: wuliu_code
      },
      success: function (res) {
        console.log(res)
          that.setData({

           wuliu_list:res.data.data
          })
         
        
      },
      complete: function () {
        wx.hideToast();
      }
    });
  },
  //拨打电话
  makePhone: function (e) {
    var that = this;
    var mobile = e.currentTarget.dataset.mobile;
    app.makeCallphone(mobile);
  },
  //订单详情
  orderDetail:function(){
    var that = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      mask: true,
      duration: 10000
    });
    wx.request({
      url: app.globalData.requestUrl,
      data: {
        map: 'applet_sequence_trade_detail',
        tid: that.data.tid
      },
      success: function (res) {
        if (res.data.ec == 200) {
          console.log(res.data.data);
          that.setData({
            orderDetail: res.data.data
          })

        } else {
          console.log(res.data);
          // wx.showModal({
          //   title: '提示',
          //   content: res.data.em,
          //   showCancel: false
          // });
        }
      },
      complete: function () {
        wx.hideToast();
      }
    });
  },
  //打开地址所对应的地图
  openLocation: function (e) {
    var that = this;
    var name = e.currentTarget.dataset.name;
    var lng = Number(e.currentTarget.dataset.lng);
    var lat = Number(e.currentTarget.dataset.lat);
    wx.openLocation({
      latitude: lat,
      longitude: lng,
      name: name,
      address: name,
      scale: 18
    });
  },
  //核销二维码显示
  codeModelShow: function () {
    var that = this;
    that.setData({
      codeShow: true
    })
  },
  //核销二维码弹窗关闭
  closeCodeModel: function () {
    var that = this;
    that.setData({
      codeShow: false
    })
  },
  //地址管理
  toAddressManage:function(){
    var that = this;
    wx.navigateTo({
      url: '/pages/addressManage/addressManage',
    })
  },
  //取消订单
  cancelOrder: function (e) {
    var that = this;
    var orderId = e.target.dataset.id;
    wx.showModal({
      title: '',
      cancelText: '再考虑下',
      confirmText: '取消订单',
      content: '订单还未付款，确认取消吗？',
      confirmColor: '#1AAD16',
      success: function (res) {
        if (res.confirm) {
          //发起请求，获取列表列表
          wx.showToast({
            title: '加载中',
            icon: 'loading',
            mask: true,
            duration: 10000
          });
          wx.request({
            url: app.globalData.requestUrl,
            data: {
              map: 'applet_cancel_order',
              // suid: app.globalData.suid,
              tid: orderId
            },
            success: function (res) {
              if (res.data.ec == 200) {
                console.log(res.data.data);
                app.errorTip(that, '订单已取消成功~', 2000);
                that.onPullDownRefresh();
              } else {
                wx.showModal({
                  title: '提示',
                  content: res.data.em,
                  showCancel: false
                });
              }
            },
            complete: function () {
              wx.hideToast();
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //删除订单
  delOrder: function (e) {
    var that = this;
    var orderId = e.target.dataset.id;
    wx.showModal({
      title: '删除提示',
      cancelText: '取消',
      confirmText: '确认',
      content: '确认删除该订单吗',
      confirmColor: '#1AAD16',
      success: function (res) {
        if (res.confirm) {
          //发起请求，获取列表列表
          wx.showToast({
            title: '加载中',
            icon: 'loading',
            mask: true,
            duration: 10000
          });
          wx.request({
            url: app.globalData.requestUrl,
            data: {
              map: 'applet_order_delete',
              // suid: app.globalData.suid,
              tid: orderId
            },
            success: function (res) {
              if (res.data.ec == 200) {
                console.log(res.data.data);
                app.errorTip(that, res.data.data.msg, 2000);
                that.onPullDownRefresh();
              } else {
                app.errorTip(that, res.data.em, 2000);
              }
            },
            complete: function () {
              wx.hideToast();
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //退款
  applyTuikuan: function (e) {
    var that = this;
    var orderId = that.data.orderDetail.tid;
   
    if (that.data.orderDetail.t_re_money != 0 && that.data.orderDetail.t_re_money!=null){
      var total = that.data.orderDetail.t_re_money;
      console.log(that.data.orderDetail.t_re_money)
    }else{
      var total = that.data.orderDetail.total;
    }
    


    that.setData({
      modalType: 'tuikuan',
      tkMoney: total,
      maxMoey:total,
      tkReason: "",
      tkContact: "",
      isShowModal: true,
      tkOrderid: orderId
    })
  },
  seeWeiquan: function () {
    var that = this;
    var orderId = that.data.orderDetail.tid;
    wx.navigateTo({
      url: '/subpages/feedbackRecord/feedbackRecord?orderid=' + orderId
    })
  },
  tkMoneyChange: function (e) {
    
    this.setData({
      tkMoney: e.detail.value
    })
  },
  tkReasonChange: function (e) {
    this.setData({
      tkReason: e.detail.value
    })
  },
  tkContactChange: function (e) {
    this.setData({
      tkContact: e.detail.value
    })
  },
  get_info:function(e){
    var price=e.target.dataset.price*e.target.dataset.num;
    this.setData({
      gid:e.target.dataset.id,
      price: price,
      num:e.target.dataset.num,
      maxnum:e.target.dataset.num,
      xuanze:true
    })
    console.log(e)
  },
  numChange:function(e){
    var maxnum= this.data.maxnum
    this.setData({
      num:e.detail.value
    })
  },
  quanbu:function(){
    var mprice=this.data.maxMoey;
    this.setData({

      tkMoney:mprice,
      gid:''
    })

  },
  submitTkapply: function () {
    var that = this;
    var data = {};
    data.map = 'applet_order_refund';
    data.tid = that.data.tkOrderid;
    data.money = that.data.tkMoney;
    data.reason = that.data.tkReason;
    data.contact = that.data.tkContact;
    console.log(that.data.gid)
    if (that.data.gid!=0){
      data.money = that.data.price;
      data.gid = that.data.gid;
    }

    if(data.money==that.data.maxMoey){

      data.gid=''
    }
   
    if (data.money == "") {
      app.errorTip(that, "请输入退款金额", 2000);
      return;
    }
    if (parseFloat(data.money) > that.data.orderDetail.total) {
      app.errorTip(that, "退款金额不能大于商品总金额", 2000);
      return;
    }
    
    // if(that.data.num>that.data.maxnum){
    //   app.errorTip(that,"数量错误",2000);
     
    // }else{
    //   data.num=that.data.num;
    // }

    if (data.reason == "") {
      app.errorTip(that, "请输入退款原因", 2000);
      return;
    }
    if (data.contact == "") {
      app.errorTip(that, "请输入您的联系方式", 2000);
      return;
    }
    console.log(data);
    //发起请求，获取列表列表
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      mask: true,
      duration: 10000
    });
   
    wx.request({
      url: app.globalData.requestUrl,
      data: data,
      success: function (res) {
        if (res.data.ec == 200) {
          console.log(res.data);
          app.errorTip(that, res.data.data.msg, 2000);
          that.onShow();
        } else {
          app.errorTip(that, res.data.em, 2000);
        }
      },
      complete: function () {
        that.setData({
          isShowModal: false
        })
        wx.hideToast();
      }
    });
  },
  hideModal: function () {
    this.setData({
      isShowModal: false
    })
  },
  cancelTk: function (e) {
    var that = this;
    var tid = e.target.dataset.tid;
    wx.showModal({
      title: '',
      cancelText: '再考虑下',
      confirmText: '确认',
      content: '确认撤销维权吗？',
      confirmColor: '#1AAD16',
      success: function (res) {
        if (res.confirm) {
          //发起请求，获取列表列表
          wx.showToast({
            title: '加载中',
            icon: 'loading',
            mask: true,
            duration: 10000
          });
          wx.request({
            url: app.globalData.requestUrl,
            data: {
              map: 'applet_order_refund_cancel',
              // suid: app.globalData.suid,
              tid: tid
            },
            success: function (res) {
              if (res.data.ec == 200) {
                console.log(res.data.data);
                app.errorTip(that, res.data.data.msg, 2000);
                that.onShow();
              } else {
                wx.showModal({
                  title: '提示',
                  content: res.data.em,
                  showCancel: false
                });
              }
            },
            complete: function () {
              wx.hideToast();
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  orderPay: function (e) {
    // wx.navigateTo({
    //   url: '/subpages/paySuccess/paySuccess?orderid=9373201812064880827484' 
    // })

    

    var that = this;
    var data = {};
    data.map = 'applet_order_pay';
    data.tid = that.data.orderDetail.tid;
    data.money = that.data.orderDetail.total;

    if (e.currentTarget.dataset.wuye_id==1) {
      var price = this.data.price_total;
      

      wx.request({
        url: app.globalData.requestUrl,
        method: "get",
        data: {
          map: "applet_sequence_editprice",
          // suid: app.globalData.suid,
          tid: data.tid,
          price: price
        },
        success: function (res) {
      
        },
        complete: function () {
         
        }
      });






    }



    wx.login({
      success: function (res) {
        if (res.code) {
          data.code = res.code;
          console.log(res);
          //发起请求，获取列表列表
          wx.showToast({
            title: '加载中',
            icon: 'loading',
            mask: true,
            duration: 10000
          });
          wx.request({
            url: app.globalData.requestUrl,
            data: data,
            success: function (res) {
              if (res.data.ec == 200) {
                console.log(res.data.data);
                
                wx.requestPayment({
                  'appId': res.data.data.appId,
                  'timeStamp': res.data.data.timeStamp,
                  'nonceStr': res.data.data.nonceStr,
                  'package': res.data.data.package,
                  'signType': 'MD5',
                  'paySign': res.data.data.paySign,
                  'success': function (res) {
                    wx.showLoading({
                      title: '加载中',
                    })
                    setTimeout(function () {
                      wx.hideLoading();
                      wx.setStorageSync("wuye_id_1",data.wuye_id)
                      wx.navigateTo({
                        url: '/subpages/paySuccess/paySuccess?tid=' + data.tid + '&id=' + data.asaId + '&groupId=' + data.groupId
                      })
                    }, 1000)
                  },
                  'fail': function (res) {
                    wx.showModal({
                      title: '',
                      content: '支付失败',
                      showCancel: false
                    });
                  }
                });
              } else {
                wx.showModal({
                  title: '提示',
                  content: res.data.em,
                  showCancel: false
                });
              }
            },
            complete: function () {
              wx.hideToast();
            }
          });
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },
})