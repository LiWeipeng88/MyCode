var app = getApp()
Page({
  data: {
		isShowtip:true,
		showLoading: true,
		noMoretip: false,
		page: 0
  },
  onLoad: function (options) {
		var that = this;
		that.requestWithdrawlist();
  },
	onShow:function(){
	
	},
	closeShowtip:function(){
		this.setData({
			isShowtip:false
		})
	},
	requestWithdrawlist: function () {
		var that = this;
		var data = {};
		var page = that.data.page;
		var level = that.data.level;
    data.map = 'applet_city_tx_record';
		data.page = page;
		wx.request({
			url: app.globalData.requestUrl,
			data: data,
			success: function (res) {
				console.log(page);
				console.log(res.data);
				if (res.data.ec == 200) {
					var allArr = [];
					var initArr = that.data.withdrawList ? that.data.withdrawList : [];
					var curArr = res.data.data;
					var lastPageLength = curArr.length;
					if (page > 0) {
						allArr = initArr.concat(curArr);
					} else {
						allArr = res.data.data;
					}
					that.setData({
						withdrawList: allArr
					})
					if (lastPageLength < 10) {
						that.setData({
							noMoretip: true,
							showLoading: false
						});
					}
					console.log(that.data.withdrawList);
				} else {
					if (page <= 0) {
						that.setData({
							withdrawList: [],
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
				wx.hideToast();
				wx.stopPullDownRefresh();
			}
		});
	},
	onPullDownRefresh: function () {
		var that = this;
		that.setData({
			page: 0,
			noMoretip: false,
			showLoading: true
		});
		that.requestWithdrawlist();
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
			that.requestWithdrawlist();
		}
	},
})