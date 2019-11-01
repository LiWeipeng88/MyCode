var app = getApp()
Page({
  data: {
		isUnfold:true,
    isBankUnfold: false,
		money:'',
		name:'',
		phone:'',
		account:'',
    bankmoney: '', 
    username: '', 
    userphone:'',
    cardnum: ''
  },
  onLoad: function (options) {
		var that = this;
		that.requestmemberInfo();
    that.requestcfgInfo();
  },
  
  onShow: function () {
		
  },
	requestmemberInfo: function () {
		var that = this;
		var data = {};
    data.map = 'applet_member_info';
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
					var memberInfo = res.data.data;
					app.globalData.memberInfo = memberInfo;
					that.setData({
						memberInfo: app.globalData.memberInfo
					})
				} else {
					app.errorTip(that, res.data.em, 2000);
				}
			},
			complete: function () {
				wx.hideLoading();
				wx.stopPullDownRefresh();
			}
		});
	},
  requestcfgInfo: function () {
    var that = this;
    var data = {};
    data.map = 'applet_city_withdraw_cfg';
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
          var bankList = res.data.data.supportBank;
          that.setData({
            cfgInfo: res.data.data,
            bankList: bankList
          })
          var wxHistory = res.data.data.wxHistory;
          if (wxHistory.length != 0){
            that.setData({
              money: wxHistory.money,
              name: wxHistory.realname,
              phone: wxHistory.mobile,
              account: wxHistory.account
            })
          }
          var bankHistory = res.data.data.bankHistory;
          if (bankHistory.length != 0) {
            var bankId = bankHistory.bank;
            var bankIndex = '';
            for (var i = 0; i < bankList.length;i++){
              if (bankId == bankList[i].code){
                bankIndex = i;
                console.log(bankIndex);
              }
            }
            that.setData({
              bankmoney: bankHistory.money,
              username: bankHistory.realname,
              userphone: bankHistory.mobile,
              cardnum: bankHistory.account,
              bankIndex: bankIndex
            })
          }
        } else {
          app.errorTip(that, res.data.em, 2000);
        }
      },
      complete: function () {
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    });
  },
	clickUnfold: function (e) { // 展开折叠我的会员
		var that = this;
    var type = e.currentTarget.dataset.type;
    if(type=='wechat'){
      that.setData({
        isUnfold: !that.data.isUnfold
      })
      if (that.data.isBankUnfold){
        that.setData({
          isBankUnfold: false
        })
      }
    } else if (type == 'bank'){
      that.setData({
        isBankUnfold: !that.data.isBankUnfold
      })
      if (that.data.isUnfold) {
        that.setData({
          isUnfold: false
        })
      }
    }
	},
	towithdrawRecord: function (e) {// 提现记录
		wx.navigateTo({
			url: '/subpages/withdrawRecord/withdrawRecord'
		})
	},
	moneyChange:function(e){
		var that = this;
		that.setData({
			money:e.detail.value
		})
	},
	nameChange: function (e) {
		var that = this;
		that.setData({
			name: e.detail.value
		})
	},
	phoneChange: function (e) {
		var that = this;
		that.setData({
			phone: e.detail.value
		})
	},
	accountChange: function (e) {
		var that = this;
		that.setData({
			account: e.detail.value
		})
	},
	confirmSubmit:function(){
		var that = this;
    var mintxMoney = that.data.cfgInfo.min;
		var data={
      map: 'applet_city_apply_tx',
			money: that.data.money,
			name: that.data.name,
      type: 'wx'
		}
    if (isNaN(data.money) || data.money == "" || parseFloat(data.money) < parseFloat(mintxMoney)){
      app.errorTip(that, '提现金额提为大于等于' + mintxMoney +'的整数', 2000);
			return;
		}
    if (parseFloat(data.money) > parseFloat(that.data.memberInfo.deduct_ktx)){
			app.errorTip(that, '提现金额大于可提现金额', 2000);
			return;
		}
		if (data.name == "") {
			app.errorTip(that, '姓名不能为空', 2000);
			return;
		}
    if (that.data.cfgInfo.mobileOpen == 1){
      data.phone = that.data.phone;
      if (data.phone == "") {
        app.errorTip(that, '手机号不能为空', 2000);
        return;
      }
    }
    if (that.data.cfgInfo.accountOpen == 1) {
      data.account = that.data.account;
      if (data.account == "") {
        app.errorTip(that, '请输入账号信息', 2000);
        return;
      }
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
					app.errorTip(that, res.data.data.msg, 2000);
					that.requestmemberInfo();
					that.setData({
						money: '',
						name: '',
						phone: '',
						account: ''
					})
				} else {
					app.errorTip(that, res.data.em, 2000);
				}
			},
			complete: function () {
				wx.hideLoading();
				wx.stopPullDownRefresh();
			}
		});
	},
  bankmoneyChange: function (e) {
    var that = this;
    that.setData({
      bankmoney: e.detail.value
    })
  },
  usernameChange: function (e) {
    var that = this;
    that.setData({
      username: e.detail.value
    })
  },
  userphoneChange: function (e) {
    var that = this;
    that.setData({
      userphone: e.detail.value
    })
  },
  cardnumChange: function (e) {
    var that = this;
    that.setData({
      cardnum: e.detail.value
    })
  },
  bindBankChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      bankIndex: e.detail.value
    })
  },
  khbankChange: function (e) {
    var that = this;
    that.setData({
      khbank: e.detail.value
    })
  },
  confirmBankSubmit:function(){
    var that = this;
    var mintxMoney = that.data.cfgInfo.min;
    var bankList = that.data.bankList;
    var bankIndex = that.data.bankIndex;
    var data = {
      map: 'applet_city_apply_tx',
      money: that.data.bankmoney,
      name: that.data.username,
      account: that.data.cardnum,
      type:'bank'
    }
    if (isNaN(data.money) || data.money == "" || parseFloat(data.money) < parseFloat(mintxMoney)) {
      app.errorTip(that, '提现金额为大于等于' + mintxMoney + '的整数', 2000);
      return;
    }
    if (parseFloat(data.money) > parseFloat(that.data.memberInfo.deduct_ktx)) {
      app.errorTip(that, '提现金额大于可提现金额', 2000);
      return;
    }
    if (!data.name) {
      app.errorTip(that, '姓名不能为空', 2000);
      return;
    }
    if (that.data.cfgInfo.bankMobileOpen == 1){
      data.phone = that.data.userphone;
      if (!data.phone) {
        app.errorTip(that, '手机号不能为空', 2000);
        return;
      }
    }
    if (!bankIndex) {
      app.errorTip(that, '请选择提现银行名称', 2000);
      return;
    }else{
      data.bankCode = bankList[bankIndex].code;
    }
    if (data.account == "") {
      app.errorTip(that, '银行卡号不能为空', 2000);
      return;
    }
    console.log(data);
    //发起请求，获取列表列表
    wx.showLoading({
      title: '加载中'
    })
    wx.request({
      url: app.globalData.requestUrl,
      data: data,
      success: function (res) {
        console.log(res.data);
        if (res.data.ec == 200) {
          app.errorTip(that, res.data.data.msg, 2000);
          that.requestmemberInfo();
          that.setData({
            bankmoney: '',
            username: '',
            userphone:'',
            cardnum: '',
            bankIndex:''
          })
        } else {
          app.errorTip(that, res.data.em, 2000);
        }
      },
      complete: function () {
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    });
  }
})