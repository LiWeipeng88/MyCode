var app = getApp()
Page({
  data: {
    isHasAddress: true,
    isShowModal:false,
    shopname: '',
    orderInfo: {},
    note: "",
    curCouponId:'',
    curPromotionId:'',
    ordersource:'',
    expressWayId: 0,
    orderstatus:'',
    value: [0, 0, 0],
    multiIndex: [0, 0, 0],
    multiArray: [],
    tip_onshow:1,
    dingwei:0,
    exp_num:0
  },
  onLoad: function (e) {
    var that = this;
    //物业
    var wuye_id=e.wuye;
    var jifen=e.jifen?e.jifen:0;
    console.log("**********");
    console.log(wuye_id);
  
    that.setData({
      jifen:jifen,
      wuye_id:wuye_id
    })
   
    if (wx.getStorageSync('receiverUser')){
      var reciver = wx.getStorageSync('receiverUser');
      that.setData({
        takeUser: reciver.name,
        takeUsertel: reciver.tel
      })
    }
    // if (e.ordersource){
    //   var ordersource = e.ordersource;
    //   that.setData({
    //     ordersource: ordersource
    //   })
    // }
    // app.setVersion(that);
  },
  onShow: function () {
    
    var that=this;
    this.getexp()
    var uid = app.globalData.userInfo.mid;
    console.log(uid)
    console.log(10101010)
    wx.request({
      url: app.globalData.requestUrl,
      data: {
        map: 'applet_sequence_goods_detail',
        uid: uid,
        qq_list:5
      },
      success: function (res) {
        console.log(res)
        console.log("ddddddddd")
        if (res.data.asc_name == null || typeof (res.data.asc_name) == "undefined" ) {
          wx.navigateTo({
            url: '../../subpages/selectArea/selectArea',
          })
        }
        
        that.setData({

          xq_info: res.data
        })
        
        wx.setStorageSync('xq_idds',res.data.asc_id);

        if(res.data.asc_id!=146){
          that.setData({
            expressWayId:2
          })
        }else{
          that.setData({
            expressWayId:1
          })
        }

     
      }
    })

    var that = this;
    console.log(app.globalData.comInfor);
    console.log("康否ID")
  
    if (app.globalData.comInfor) {
      that.setData({
        comInfor: app.globalData.comInfor
      });
      console.log(that.data.comInfor)
      console.log("--结束--")
    }
    
   

    that.requestpayType();
    wx.getStorage({
      key: 'submitOrder',
      success: function (res) {
        console.log(res.data);
        // if (wx.getStorageSync('comid')!=''){
        //   console.log(wx.getStorageSync('comid'));
        //   console.log("xxxxx")
        //   if (wx.getStorageSync('comid') == 146) {
        //     a = 0;

            
           
        //     res.data.expressWay.splice(1, 1);
        //     //console.log(that.data)

        //   }
        //   console.log(wx.getStorageSync('comid'));
        //   console.log("这是IDDDDD")
        // }else{

        //   console.log(that.data.comInfor.id);
        //   console.log("这是ID")
        // if (that.data.comInfor.id == 146) {
        //   a = 0;
        //   res.data.expressWay.splice(1, 1);
        //   //console.log(that.data)

        // }
        // }
        console.log("asasfasf");
        var orderInfo = res.data;
        var payWay = 1;
        if (orderInfo.wxpayPayment == 0 && orderInfo.cashPayment == 1) {
          payWay = 2;
        }
        if (orderInfo.wxpayPayment == 1 || (orderInfo.wxpayPayment == 0 && orderInfo.cashPayment == 0)) {
          payWay = 1;
        }
        var expressWayId='',expressWayname='';

        
        if (that.data.expressWayId == '') {
         // console.log(that.data.comInfor.id)
          console.log(99999999999999999)
          var a=0;
          
          // if (wx.getStorageSync('comid')!=''){
          //   if (wx.getStorageSync('comid') == 146) {
          //     a = 0;
          //     res.data.expressWay.splice(1, 1);
          //     //console.log(that.data)

          //   }else{

          //     a = 1;
          //   }


          
          // }else{

         
          // if (that.data.comInfor.id==146){
          //   a=0;
          //   res.data.expressWay.splice(1,1);
          //  //console.log(that.data)
          
          // }else{
          //   a=1;
          // }
          // }
          // that.setData({

          //   bs:a
          // })
          
          expressWayId = res.data.expressWay ? res.data.expressWay[a].id : '';
          expressWayname = res.data.expressWay ? res.data.expressWay[a].name : '';
        } else {
          expressWayId = that.data.expressWayId;
          expressWayname = that.data.expressWayname;
        }
        console.log(expressWayname+"3333")
        if (!that.data.remarkExtra){
          var remarkExtra = res.data.remarkExtra;
          if (remarkExtra) {
            for (var i = 0; i < remarkExtra.length; i++) {
              remarkExtra[i].id = i;
              remarkExtra[i].value = '';
            }
            that.setData({
              remarkExtra: remarkExtra
            })
          }else{
            that.setData({
              remarkExtra: []
            })
          }
        }
      
       
         
        that.setData({
          orderInfo: res.data,
          satisfySend: parseFloat(res.data.satisfySend),
          expressWayId: expressWayId,
          expressWayname: expressWayname,
          addressInfo: res.data.address,
          // cardNum: res.data.idcard,
          sumTotal: res.data.total,
          nowp: res.data.total,
          payWay: payWay,
          postTotal: res.data.postTotal,
          goodPostTotal: res.data.total,
          curCouponId: res.data.coupon[0].id,
          curCouponInfo: res.data.coupon[0]
        })
        if (expressWayId == 2) {
          console.log("门店自取");
          that.getLocation();
        }
        if (that.data.curPromotionInfo) {
          that.confirmChoosePromotion();
        }
        if (expressWayId == 1) {
          console.log("商家配送");
          that.requestDelivery();
        } else {
          that.getTotalprice();
        }
        // 默认选择优惠券
        var coupon = orderInfo.coupon ? orderInfo.coupon : [];
        if (coupon.length > 0) {
          for (var i = 1; i < coupon.length; i++) {
            coupon[i].value = parseFloat(coupon[i].value);
            var remainTime = (new Date(coupon[i].end).getTime() - new Date(coupon[i].start).getTime()) / 1000;
            coupon[i].remainTime = parseInt(remainTime);
          }
          console.log(coupon);
          var newCoupon = coupon.concat();
          newCoupon = newCoupon.sort(sortValue('value', 'remainTime'));
          console.log(newCoupon)
          that.setData({
            curCouponId: newCoupon[0].id,
            curCouponInfo: newCoupon[0]
          })
        }
        if (that.data.curCouponInfo) {
          that.confirmChooseCoupon();
        }
        // 默认选中满减促销
        var fullAct = orderInfo.fullAct ? orderInfo.fullAct : [];
        if (fullAct.length > 0) {
          for (var i = 0; i < fullAct.length; i++) {
            if (fullAct[i].type == 4) {
              fullAct[i].value = orderInfo.postTotal;
            }
            fullAct[i].value = parseFloat(fullAct[i].value);
          }
          fullAct = fullAct.sort(sortValue('value'));
          that.setData({
            curPromotionId: fullAct[0].id,
            curPromotionInfo: fullAct[0]
          })
          console.log(fullAct);
        }
        if (that.data.curPromotionInfo) {
          that.confirmChoosePromotion();
        }
      }
    })
    wx.getStorage({
      key: 'delCart',
      success: function (res) {
        that.setData({
          cartids: res.data
        })
      }
    })

    
    


  },
  getPhoneNumber(e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    var data = {};
    var that=this;
    data.iv = e.detail.iv;
    data.code = wx.getStorageSync("code_code");
    data.map = "applet_decode_phone"
    data.encryptedData =e.detail.encryptedData;
    wx.request({
      url: app.globalData.requestUrl,
      data: data,
      success: function (res) {
       if(res.data==1){
         return;
       }else{
        
         that.setData({

           takeUsertel: res.data.phoneNumber

         })
       }
        
      }

    })


  },

  //获得商家配送的运费数据
  requestDelivery:function(){
    var that = this;
    var comId;
    /////110
    if (wx.getStorageSync('comid') != '') {

      comId = wx.getStorageSync('comid');
    }

    if (wx.getStorageSync('comid') != ''){
      if (comId!="") {
        comId = wx.getStorageSync('comid');
      } else {
        comId = '';
      }

    }else{
      if (that.data.comInfor) {
        comId = that.data.comInfor.id;
      } else {
        comId = '';
      }


    }



    
    var orderInfo = that.data.orderInfo;
    wx.request({
      url: app.globalData.requestUrl,
      data: {
        map: 'applet_sequence_send_price',
        tid: orderInfo.tid,
        addrid: orderInfo.address.id,
        comId: comId
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.ec == 200) {
          that.setData({
            needSum: res.data.data.needSum,
            deliveryMoney: res.data.data.price,
          });
          console.log(res.data.data.price)
        
          that.getTotalprice();
        } else {
          console.log(res.data)
          that.setData({
            payType: []
          })
          // app.errorTip(that, res.data.em, 2000);
        }
      },
      complete: function () {
        wx.hideLoading();
      }
    });
  },
  requestpayType: function () {
    var that = this;
    wx.showLoading({
      title: '正在加载',
      mask: true,
      time: 100000
    })
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
            payWay: res.data.data ? res.data.data[0].type : 1
          })
        } else {
          console.log(res.data)
          that.setData({
            payType: []
          })
          // app.errorTip(that, res.data.em, 2000);
        }
      },
      complete: function () {
        wx.hideLoading();
      }
    });
  },
  payRadioChange: function (e) {
    this.setData({
      payWay: e.detail.value
    })
    console.log(this.data.payWay);
  },
  bindStoreChange:function(e){
    this.setData({
      storeIndex: e.detail.value
    })
    console.log(this.data.storeIndex);
  },
  toRecharge: function () {
    wx.navigateTo({
      url: '/subpages/walletRecharge/walletRecharge',
    })
  },
  switchChange: function (e) {
    console.log('switch 发生 change 事件，携带值为', e.detail.value)
  },
  chooseAddress: function (e) {
    var that = this;
    var type = e.currentTarget.dataset.type;
    var orderStatus = that.data.orderstatus;
    console.log(orderStatus);
    if (!orderStatus){}else{return;}
    console.log(type);
    wx.navigateTo({
      url: '../addressManage/addressManage?type=' + type
    })
  },
  noteChange: function (e) {
    this.setData({
      note: e.detail.value
    })
  },
  cardChange:function(e){
    this.setData({
      cardNum: e.detail.value
    })
  },
  payRadioChange: function (e) {
    this.setData({
      payWay: e.detail.value
    })
    console.log(this.data.payWay);
  },
  takeUserChange: function (e) {
    this.setData({
      takeUser: e.detail.value
    })
  },
  takeUsertelChange: function (e) {
    
    this.setData({
      takeUsertel: e.detail.value
    })
  },
  expressWayChange: function (e) {
    console.log(e.detail.value);
    var that = this;
    var expressWay = that.data.orderInfo.expressWay;
    var xiaoqu_id=that.data.xq_info.asc_id
    var id = e.detail.value;
    if(id==1 && xiaoqu_id!=146){
    wx.showModal({
      title: '提示',
      content: '请选择外地邮寄专区',
      showCancel: true,
     
      success: function(res) {

        if(res.confirm){
        that.selectArea();
        
        if(xiaoqu_id!=146){
        that.setData({
          expressWayId:2
        })
        }else{
          that.setData({
            expressWayId:1
          })

        }
        return false;
        }else{

          that.setData({
            expressWayId:2,
            //sumTotal: parseFloat(that.data.sumTotal)- parseFloat(that.data.deliveryMoney)
          })
        
        }
      },
      
     
    })
    }
  if(id==2 && xiaoqu_id==146){

      wx.showModal({
        title: '提示',
        content: '请选择您所在的小区',
        showCancel: true,
       
        success: function(res) {
          
          if(res.confirm){
            that.selectArea()
          }else{
            // var sumTotal= parseFloat(that.data.sumTotal)+parseFloat(that.data.deliveryMoney)
            // console.log(sumTotal);
            that.setData({
             // sumTotal:sumTotal,
              expressWayId:1
            })
            return false;
          }

        },
       
      })

  }

    

    var expressWayname = '';
    for (var i = 0; i < expressWay.length; i++) {
      if (expressWay[i].id == id) {
        expressWayname = expressWay[i].name;
      }
    }
    var a=0;
    if (id == 1) {
      var a=0;
      // app.errorTip(that, "请点击蓝字查看配送范围及价格", 2000);
    } else if (id == 2) {
      if (!that.data.storeArr){
        that.getLocation();
      }
      a=1;
    }
    //判断
    that.setData({
      expressWayId: id,
      expressWayname: expressWayname,
      bs:a
    });
    console.log(that.data.expressWayname);
    if (id == 1) {
      console.log("6+商家配送");
      
      that.requestDelivery();
    }else{
      that.getTotalprice();
    }
    // that.getSumprice();
  },
  getLocation: function (e) {
    

    var that = this;
    if (app.globalData.location){
      that.setData(app.globalData.location)
      that.requestStore();
      that.setData({
        dingwei:1
      })
    }else{
      
      wx.showLoading({
        title: '正在获取您的位置',
      })
      console.log("获取位置123")
      wx.getLocation({
        success: function (res) {
          console.log(res);
          that.setData({
            lat: res.latitude,
            lng: res.longitude
          })
          that.setData({
            dingwei: 2
          })
          var location = {
            lat: res.latitude,
            lng: res.longitude
          }
          console.log("获取位置123" + location)
          app.globalData.location = location;
          that.requestStore();
        },
        fail: function () {
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
                    that.requestStore();
                  }
                })
              }
            }
          })
        },
        complete: function () {
          wx.hideLoading();
        }
      })
    }

    
  },
  requestStore:function(){
    var that = this;
    var data = {
      map: 'applet_get_receive_store_new',
      lat: that.data.lat,
      lng: that.data.lng,
      tid: that.data.orderInfo.tid
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
          if(res.data.data.data.length>1){
            var Data = res.data.data;
            var value = that.data.value;
            var multiIndex = that.data.multiIndex;
            for(var i=0;i<Data.data.length;i++){
              if (Data.oneId == Data.data[i].id ){
                  value[0] = i;
                  multiIndex[0] = i;
                  for (var j = 0; j < Data.data[i].submenu.length;j++){
                    if (Data.twoId == Data.data[i].submenu[j].id){
                      value[1] = j;
                      multiIndex[1] = j; 
                      for (var h = 0; h < Data.data[i].submenu[j].submenu.length; h++) {
                        if (Data.threeId == Data.data[i].submenu[j].submenu[h].id) {
                          value[2] = h;
                          multiIndex[2] = h; 
                        }
                      }
                    }
                  }
              }
            }
            that.setData({
              value : value,
              receiveStore: Data.threeId,
              multiIndex: multiIndex
            });
            that.defalueData(Data.data);
          }else{
            that.setData({
              storeArr: res.data.data.data,
              storeIndex: 0,
              receiveStore: res.data.data.data[0].id
            })
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
  defalueData: function (data) {
    var that = this;
    var value = that.data.value;
    var multiIndex = that.data.multiIndex;
    var allData = data;
    var multiArray = that.data.multiArray;
    var first = [], second = [], third = [];
    for (var i = 0; i < allData.length; i++) {
      first[i]={
        id: allData[i].id,
        name: allData[i].name
      } 
    };
    for (var i = 0; i < allData[multiIndex[0]].submenu.length; i++) {
      second[i] = {
        id: allData[multiIndex[0]].submenu[i].id,
        name: allData[multiIndex[0]].submenu[i].name
      } 
      console.log(allData[multiIndex[0]].submenu[i].id);
    };
    for (var i = 0; i < allData[multiIndex[0]].submenu[multiIndex[1]].submenu.length; i++) {
      third[i] = {
        id: allData[multiIndex[0]].submenu[multiIndex[1]].submenu[i].id,
        name: allData[multiIndex[0]].submenu[multiIndex[1]].submenu[i].name
      } 
    };
    multiArray.push(first);
    multiArray.push(second);
    multiArray.push(third);
    console.log(multiArray);
    that.setData({
      storeArr:data,
      multiArray: multiArray
    })
  },
  bindMultiPickerChange: function (e) {
    var that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value);
    var multiArray = that.data.multiArray;
    that.setData({
      value: e.detail.value,
      receiveStore: multiArray[2][e.detail.value[2]].id
    });
    console.log(that.data.value);
    console.log(that.data.receiveStore);
  },
  bindMultiPickerColumnChange: function (e) {
    var that = this;
    console.log(e.detail);
    var value = that.data.value;
    var multiIndex = that.data.multiIndex;
    var allData = that.data.storeArr;
    var multiArray = that.data.multiArray;
    if (e.detail.column == 0) {
      var index = e.detail.value;
      that.setData({
        multiIndex: [index, 0, 0],
        value: [index, 0, 0]
      });
      console.log(that.data.multiArray);
      var second = [], third = [];
      for (var i = 0; i < allData[index].submenu.length; i++) {
        second[i] = {
          id: allData[index].submenu[i].id,
          name: allData[index].submenu[i].name
        } 
      };
      for (var i = 0; i < allData[index].submenu[0].submenu.length; i++) {
        third[i] = {
          id: allData[index].submenu[0].submenu[i].id,
          name: allData[index].submenu[0].submenu[i].name
        } 
      };
      multiArray[1] = second;
      multiArray[2] = third;
      that.setData({
        multiArray: multiArray
      })
    }
    if (e.detail.column == 1) {
      var index = e.detail.value;
      var multiIndex = that.data.multiIndex;
      console.log(multiIndex);
      value[1] = index;
      value[2] = 0;
      that.setData({
        value: value
      });
      console.log(that.data.value);
      var third = [];
      for (var i = 0; i < allData[multiIndex[0]].submenu[index].submenu.length; i++) {
        third[i] = {
          id: allData[multiIndex[0]].submenu[index].submenu[i].id,
          name: allData[multiIndex[0]].submenu[index].submenu[i].name
        } 
      };
      multiArray[2] = third;
      that.setData({
        multiArray: multiArray
      })
    }
    if (e.detail.column == 2) {
      value[2] = e.detail.value;
      that.setData({
        value: value
      });
    }
  },
  submitOrder: function () {
    var that = this;
    var tradetype = that.data.orderInfo.tradeType;
    var data = {};
    data.map = 'applet_sequence_submit_trade';
    data.asaId = that.data.orderInfo.asaId;
    data.groupId = that.data.orderInfo.groupId ? that.data.orderInfo.groupId:0;
    data.jifen=that.data.jifen;
    // if (wx.getStorageSync('comid') != '') {
    //   that.data.comInfor = wx.getStorageSync('comid')

    // }

    // if (wx.getStorageSync('comid') != '') {
    //   data.comId = wx.getStorageSync('comid')

    // }else{
     

    // }
    if (that.data.takeUsertel.length!=11){

      wx.showModal({
        title: '信息提示',
        content: '手机号格式错误',
        showCancel: false,
       
      })
      return false;
    }
    
    var num = parseInt(that.data.exp_num);
    console.log(num)
   
    var exp = parseInt(that.data.exp);
    console.log(exp)
    if (num > exp) {
      app.errorTip(that, "您的积分不足", 2000);
      return false;
    }

  console.log("小区康否");
    if (that.data.comInfor) {
      data.comId = that.data.comInfor.id ;
    }else{

      data.comId=that.data.xq_info.asc_id;

    }

    data.wuye_id=that.data.wuye_id;
    data.tid = that.data.orderInfo.tid;
    data.postType = parseInt(that.data.expressWayId);
    data.payType = that.data.payWay;
    data.exp = num;
    //积分
    data.wuye_id = that.data.wuye_id;
    // data.postFee = that.data.orderInfo.postTotal;
    data.note = that.data.note;
    if (data.postType == 2) {
      var storeIndex = that.data.storeIndex;
      var storeArr = that.data.storeArr;
      data.receiverName = that.data.takeUser ? that.data.takeUser : '';
      data.receiverPhone = that.data.takeUsertel ? that.data.takeUsertel : '';
      console.log(data.receiverPhone);
      if (data.receiverName == '') {
        app.errorTip(that, "请输入取货人姓名", 2000);
        return;
      }
      if (!data.receiverPhone) {
        app.errorTip(that, "请输入电话或手机号", 2000);
        return;
      }
      var receiverUser = {
        name: data.receiverName,
        tel:data.receiverPhone
      }
      wx.setStorageSync('receiverUser', receiverUser)
    } else {
      if (that.data.addressInfo.id) {
        data.addrid = that.data.addressInfo.id;
      } else {
        data.addrid = "";
      }
      if (!data.addrid) {
        app.errorTip(that, "请选择收货地址", 2000);
        return;
      }
    }
    // if (that.data.orderInfo.global > 0) {
    //   data.idcard = that.data.cardNum;
    //   if (data.idcard) {
    //     console.log("全球购");
    //   } else {
    //     app.errorTip(that, "身份证号不能为空", 2000);
    //     return false;
    //   }
    // }
    if (that.data.chooseCoupon){
      data.yhqid = that.data.chooseCoupon.id;
    }
    if (that.data.choosePromotion) {
      data.cxid = that.data.choosePromotion.id;
    }
    var remarkExtra = that.data.remarkExtra;
    for (var i = 0; i < remarkExtra.length; i++) {
      if (remarkExtra[i].require) {
        if (!remarkExtra[i].value) {
          if (remarkExtra[i].type == 'time' && remarkExtra[i].date){
            remarkExtra[i].value = remarkExtra[i].dateval + ' ' + remarkExtra[i].timeval;
          }
          if (remarkExtra[i].type == 'time'){
            if (!remarkExtra[i].dateval){
              app.errorTip(that, '请选择' + remarkExtra[i].name + '的日期', 2000);
              return;
            }
            if (!remarkExtra[i].timeval){
              app.errorTip(that, '请选择' + remarkExtra[i].name + '的时间', 2000);
              return;
            }
          }else{
            app.errorTip(that, remarkExtra[i].name + '为必填项', 2000);
            return;
          }
        }
      }
    }
    data.remarkExtra = that.data.remarkExtra;
    console.log(data.remarkExtra);
    console.log(data);
    //发起请求，获取列表列表
    wx.showLoading({
      title: '加载中',
    })
    
    wx.request({
      url: app.globalData.requestUrl,
      data: data,
      success: function (res) {
        if (res.data.ec == 200) {
          console.log(data);
          console.log(res.data.data);
          that.setData({
            orderstatus: res.data.data.status
          })
          console.log(data.payType);

          wx.setStorageSync("wuye_id_1", data.wuye_id)
          if (res.data.data.status == 'dzf') {
            console.log(data.payType);
            if (data.payType == 1) {
              that.orderPay();
            } else {
              wx.redirectTo({
                url: '/subpages/paySuccess/paySuccess?tid=' + data.tid + '&id=' + data.asaId + '&groupId=' + data.groupId
              })
              // if (tradetype == 2) {
              //   wx.redirectTo({
              //     url: '../groupResult/groupResult?tid=' + data.tid
              //   })
              // } else {
              //   wx.redirectTo({
              //     url: '/subpages/paySuccess/paySuccess?orderid=' + data.tid
              //   })
              // }
            }
          } else {
            console.log(that.data.jifen)
           
            if(that.data.jifen){
              wx.redirectTo({
                url: '/subpages/paySuccess/paySuccess?tid=' + data.tid + '&jifen=1'
              })
            }else{
              wx.redirectTo({
                url: '/subpages/paySuccess/paySuccess?tid=' + data.tid + '&jifen=2' 
              })
            }
           
            // if (tradetype == 2) {
            //   wx.redirectTo({
            //     url: '../groupResult/groupResult?tid=' + data.tid
            //   })
            // } else {
            //   wx.redirectTo({
            //     url: '/subpages/paySuccess/paySuccess?orderid=' + data.tid
            //   })
            // }
          }
        } else {
          console.log(res.data);
          console.log(res.data.em);
          app.errorTip(that, res.data.em, 2000);
        }
      },
      complete: function () {
        wx.hideLoading();
      }
    });
  },
  orderPay: function (e) {
    //物业

    // wx.redirectTo({
    //   url: '/subpages/paySuccess/paySuccess?tid=9373201904187804754591' + '&id=' + 180 + '&groupId=' + 211 + '&url=0' 
    // })



    if (this.data.wuye_id==1){
     this.setData({

       pay_onshow:1
     })
      return false;
    }
    var that = this;
    var asaId = that.data.orderInfo.asaId;
    var groupId = that.data.orderInfo.groupId;
    var tradetype = that.data.orderInfo.tradeType;
    var data = {};
    data.map = 'applet_order_pay';
    data.tid = that.data.orderInfo.tid;

    
    wx.hideLoading();
    //发起请求，获取列表列表
    wx.showLoading({
      title: '加载中',
    })
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
              wx.showModal({
                title: '提示',
                content: '支付成功',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    wx.showLoading({
                      title: '加载中',
                    })
                    setTimeout(function(){
                      wx.hideLoading();
                      wx.redirectTo({
                      url: '/subpages/paySuccess/paySuccess?tid=' + data.tid + '&id=' + asaId + '&groupId=' + groupId + "&url=0" + "&true_id=1"
                      })
                    },1000)
                  }
                }
              })
            },
            'fail': function (res) {
              console.log(res);
             
            }
          });
        } else {
          app.errorTip(that, res.data.em, 2000);
        }
      },
      complete: function () {
        wx.hideLoading();
      }
    });
  },
  showModal:function(e){
    var that = this;
    var type = e.currentTarget.dataset.type;
    var orderInfo = that.data.orderInfo;
    var couponLen = orderInfo.coupon.length;
    // var fullActLen = orderInfo.fullAct.length;
    var orderStatus = that.data.orderstatus;
    if (!orderStatus) { } else { return; }
    if (type == 'coupon' && couponLen>0){
      that.setData({
        curChooseType:'coupon',
        isShowModal:true
      })
    }
    if (type == 'promotion' && fullActLen > 0) {
      that.setData({
        curChooseType: 'promotion',
        isShowModal: true
      })
    }
  },
  hideModal:function(){
    var that = this;
    that.setData({
      isShowModal:false
    })
  },
  toggleCoupon: function (e) {
    var that = this;
    var coupon = e.currentTarget.dataset.coupon;
    that.setData({
      curCouponId: coupon.id,
      curCouponInfo: coupon
    })
  },
  confirmChooseCoupon: function () {
    var that = this;
    that.setData({
      chooseCoupon: that.data.curCouponInfo,
    })
    that.hideModal();
    that.getTotalprice();
  },
  togglePromotion: function (e) {
    var that = this;
    var promotion = e.currentTarget.dataset.promotion;
    that.setData({
      curPromotionId: promotion.id,
      curPromotionInfo: promotion
    })
  },
  confirmChoosePromotion: function () {
    var that = this;
    if (!that.data.curPromotionInfo) {
      app.errorTip(that, "请选择一个优惠", 2000);
      return;
    }
    that.setData({
      choosePromotion: that.data.curPromotionInfo,
    })
    that.hideModal();
    that.getTotalprice();
  },
  getTotalprice: function () {

    

    var that = this;
    var orderInfo = that.data.orderInfo;
    console.log(orderInfo);
    var curTotal = that.data.orderInfo.total;
    var expressWayId = that.data.expressWayId;
    var total = parseFloat(orderInfo.goodsTotal), goodPostTotal = parseFloat(orderInfo.goodsTotal), postTotal = parseFloat(orderInfo.postTotal);
    var curPromotionInfo = that.data.curPromotionInfo;
    var curCouponInfo = that.data.curCouponInfo;
    var choosePromotion = that.data.choosePromotion;
    console.log("配送方式" + expressWayId);
    console.log(curCouponInfo);
    console.log(curPromotionInfo);
    if (expressWayId == 1) {
      console.log('商家配送')
      var deliveryMoney = parseFloat(that.data.deliveryMoney);
      // var needSum = that.data.needSum;
      // if (needSum) {
      //   total = total + deliveryMoney;
      // }
      console.log(total);



      if (curCouponInfo) {
        var curCouponVal = curCouponInfo.value;
        console.log(curCouponVal);
        total = total - curCouponVal;
      }
      if (curPromotionInfo) {
        var curType = curPromotionInfo.type;
        var curPromotionVal = 0;
        if (curType == 4) {
          if (needSum) {
            choosePromotion.value = deliveryMoney;
            curPromotionVal = deliveryMoney;
            that.setData({
              choosePromotion: choosePromotion
            })
            console.log('商家配送费免------------' + that.data.postTotal)
            console.log(that.data.choosePromotion)
          } else {
            choosePromotion.value = 0;
            curPromotionVal = 0;
            that.setData({
              choosePromotion: choosePromotion
            })
          }
        } else {
          curPromotionVal = curPromotionInfo.value;
        }
        total = total - curPromotionVal;
      }
    }
    if (expressWayId == 2) {
      console.log('门店自取')
      if (curCouponInfo) {
        var curCouponVal = curCouponInfo.value;
        console.log(curCouponVal);
        total = total - curCouponVal;
      }
      


      if (curPromotionInfo) {
        var curType = curPromotionInfo.type;
        var curPromotionVal = 0;
        if (curType == 4) {
          choosePromotion.value = 0;
          curPromotionVal = 0;
          that.setData({
            choosePromotion: choosePromotion,
            postTotal: 0
          })
        } else {
          curPromotionVal = curPromotionInfo.value;
        }
        total = total - curPromotionVal;
      }
    }
    if (expressWayId == 3) {
      console.log('快递发货')
      total = goodPostTotal + postTotal;
      if (curCouponInfo) {
        var curCouponVal = curCouponInfo.value;
        console.log(curCouponVal);
        total = total - curCouponVal;
      }
      if (curPromotionInfo) {
        var curType = curPromotionInfo.type;
        var curPromotionVal = 0;
        if (curType == 4) {
          choosePromotion.value = postTotal;
          curPromotionVal = postTotal;
          that.setData({
            choosePromotion: choosePromotion
          })
        } else {
          curPromotionVal = curPromotionInfo.value;
        }
        total = total - curPromotionVal;
      }
    }
    if (total <= 0) {
      total = 0;
    }
    console.log(total)
    console.log("总金额")
    console.log(wx.getStorageSync('xq_idds'));
    if(wx.getStorageSync('xq_idds')==146){
      console.log(that.data.deliveryMoney)
      console.log(88888)
      total=total+parseInt(that.data.deliveryMoney)
    }


    that.setData({
      sumTotal: total.toFixed(2),
      nowp: total.toFixed(2)
    })
  },
  // 查看配送范围
  todeliveryArea: function () {
    var postScope = this.data.orderInfo.postScope;
    wx.setStorageSync('postScope', postScope)
    wx.navigateTo({
      url: '/subpages/deliveryArea/deliveryArea',
    })
  },
  toTechnicalPage: function (e) {
    var onoff = e.currentTarget.dataset.onoff;
    if (onoff) {
      wx.navigateTo({
        url: '/pages/technicalPage/technicalPage',
      })
    }
  },
  seemap: function (e) {
    var latitude = e.currentTarget.dataset.lat;
    var longitude = e.currentTarget.dataset.lng;
    var address = e.currentTarget.dataset.address;
    var name = e.currentTarget.dataset.name;
    wx.openLocation({
      latitude: Number(latitude),
      longitude: Number(longitude),
      name: name,
      address: address,
      scale: 18
    })
  },
  // 监控数据改变
  dataChange: function (e) {
    var that = this;
    var remarkExtra = that.data.remarkExtra;
    var id = e.currentTarget.dataset.id;
    var type = e.currentTarget.dataset.type;
    var curVal = e.detail.value;
    for (var i = 0; i < remarkExtra.length; i++) {
      if (remarkExtra[i].id == id) {
        if (remarkExtra[i].type == 'time' && remarkExtra[i].date){
          console.log("日期时间必填");
          remarkExtra[i][type] = curVal;
          if (remarkExtra[i].dateval && remarkExtra[i].timeval){
            remarkExtra[i].value = remarkExtra[i].dateval + ' ' + remarkExtra[i].timeval;
          }
        }else{
          remarkExtra[i].value = curVal;
        }
      }
    }
    that.setData({
      remarkExtra: remarkExtra
    })
    console.log(that.data.remarkExtra);
  },
  // 上传图片
  chooseSingleImage: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#333",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage('album', id)
          } else if (res.tapIndex == 1) {
            that.chooseWxImage('camera', id)
          }
        }
      }
    })
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
  //选择单图
  chooseWxImage: function (type, id) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: [type],
      success: function (res) {
        console.log(res);
        var temPath = res.tempFilePaths[0];
        that.upload_file(temPath, id);
      }
    })
  },
  // 上传单图到服务器
  upload_file: function (temPath, id) {
    var that = this;
    var remarkExtra = that.data.remarkExtra;
    wx.showLoading({
      title: '上传中',
    })
    wx.uploadFile({
      url: app.globalData.requestUrl + '?&map=applet_img_upload',
      filePath: temPath,
      name: 'image',
      success: function (res) {
        var data = JSON.parse(res.data);
        var realpath = app.globalData.domin + data.data.path;
        if (data.ec == 200) {
          for (var i = 0; i < remarkExtra.length; i++) {
            if (remarkExtra[i].id == id) {
              remarkExtra[i].img = realpath;
              remarkExtra[i].value = data.data.path;
            }
          }
          that.setData({
            remarkExtra: remarkExtra
          })
          console.log(that.data.remarkExtra);
        } else {
          wx.showModal({
            title: '提示',
            content: data.em,
            showCancel: false
          });
        }
      },
      complete: function () {
        wx.hideLoading();
      }
    });
  },
  on_tip_onshow:function(){
    this.setData({

      tip_onshow:2,

    })

  },
  getexp: function () {

    var that=this;
    wx.request({
      url: app.globalData.requestUrl,
      data: {
        map: 'applet_sequence_get_exp',
      },
      success: function (res) {
        
        that.setData({
          exp: res.data.exp,
          m_bn: res.data.m_bn
        })
        
      }

    })
  },
  isNumber:function(val) {

        var regPos = /^\d+(\.\d+)?$/; //非负浮点数

        var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数

        if(regPos.test(val) || regNeg.test(val)) {

          return  true;

        } else  {

          return  false;

        }

    },
  clickExp:function(e){
    var m_bn = this.data.m_bn;
    var nowp = this.data.nowp;
    var num=e.detail.value;
    if (this.isNumber(num)){
     
    }else{
      wx.showModal({
        title: '提示',
        content: '请输入正确数量',
        showCancel: false,
        success:function(){
          return false;
        }
      })
    }
    var sumTotal = nowp - (num * m_bn);
    console.log(num)
    console.log(m_bn)
    console.log(sumTotal)
    sumTotal = sumTotal.toFixed(2)
    if (sumTotal < 0) {
      sumTotal = 0
    }
    this.setData({
      exp_num:num,
      sumTotal: sumTotal
    })

  },
  on_pay_onshow: function () {
    wx.switchTab({
      url: '../index/index',
    })
  },
  //选择小区
  selectArea: function () {
    var that = this;
    var orderInfo = that.data.orderInfo;
    var comLimit = that.data.orderInfo.comLimit;
    console.log(comLimit); 
    var orderStatus = that.data.orderstatus;
    console.log(orderStatus);
    if (!orderStatus) { } else { return; }
    if (comLimit==1){
      wx.setStorageSync('comList', orderInfo.comList);
    };
    wx.navigateTo({
      url: "/subpages/selectArea/selectArea?comLimit=" + comLimit,
    })
  },
  toPay:function(){
    wx.navigateTo({
      url: '/subpages/paySuccess/paySuccess',
    })
  },
})
// 根据数组某个字段排序
function sortValue(property, secprop) {
  return function (a, b) {
    var value1 = a[property];
    var value2 = b[property];
    var val = value2 - value1
    if (val == 0) {
      val = a[secprop] - b[secprop];
    }
    return val;
  }

}
