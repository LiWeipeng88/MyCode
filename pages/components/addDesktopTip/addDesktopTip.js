//获取应用实例
// 组件数据
const app = getApp()
const postfix = '_deadtime';
Component({
  properties: {
    
  },
  /**
   * 组件的初始数据
   */
  data: {
    "isAddtipshow":false
  },

  /**
   * 组件的方法列表
   */
  ready:function(){
    var that = this;
    var mobileInfo = wx.getSystemInfoSync();
    console.log(mobileInfo);
    if (mobileInfo.platform=='android'){
      if (get('firstAddTip', 'empty') == 'empty') {
        that.setData({
          "isAddtipshow": true
        })
        that._hideTip();
        var deadTime = parseInt(7 * 24 * 60 * 60);//缓存过期时间
        put('firstAddTip', 'no', deadTime)
      }
    }
  },
  methods: {
    _hideTip:function(){
      var that = this;
      setTimeout(function(){
        that.setData({
          "isAddtipshow": false
        })
      },5000)
    },
  }
})
function put(k, v, t) {
  console.log(k + '---' + v + '----' + t);
  wx.setStorageSync(k, v)
  var seconds = parseInt(t);
  if (seconds > 0) {
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000 + seconds;
    wx.setStorageSync(k + postfix, timestamp + "")
  } else {
    wx.removeStorageSync(k + postfix)
  }
}

function get(k, def) {
  var deadtime = parseInt(wx.getStorageSync(k + postfix))
  if (deadtime) {
    if (parseInt(deadtime) < Date.parse(new Date()) / 1000) {
      if (def) { return def; } else { return; }
    }
  }
  var res = wx.getStorageSync(k);
  if (res) {
    return res;
  } else {
    return def;
  }
}

function remove(k) {
  wx.removeStorageSync(k);
  wx.removeStorageSync(k + postfix);
}

function clear() {
  wx.clearStorageSync();
}