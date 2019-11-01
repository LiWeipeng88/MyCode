//获取应用实例
// 组件数据
const app = getApp()
const bgMusicAudioContext = wx.getBackgroundAudioManager();
Component({
  properties: {
    musicUrl:{
      type: String,
      observer:'_initMusic'
    },
    musicTitle: {
      type: String,
      observer: '_initMusic'
    },
    isPlay:{
      type: Boolean
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    // "isPlay":false
  },

  /**
   * 组件的方法列表
   */
  ready:function(){
    var that = this;
    that._initMusic();
  },
  methods: {
    _initMusic:function(){
      var that = this;
      console.log(that.data);
      console.log(that.properties.musicUrl);
      if (that.data.musicUrl == '') {
        app.globalData.hasMusic = false;
      } else {
        app.globalData.musicUrl = that.data.musicUrl;
        console.log(app.globalData.musicUrl);
        app.globalData.hasMusic = true;
        app.globalData.musicName = that.data.musicTitle;
        console.log(app.globalData.musicName);
        that._playMusic();
      }
      that.setData({
        hasMusic: app.globalData.hasMusic
      })
    },
    _playMusic: function () {
      var that = this;
      var isPlay = that.data.isPlay;
      console.log(bgMusicAudioContext.paused);
      console.log(isPlay);
      console.log(app.globalData.isPlaynew);
      if (app.globalData.isPlay == true) {
        if (app.globalData.isPlaynew == 'new') {
          console.log("播放中音乐");
          bgMusicAudioContext.src = app.globalData.musicUrl;
          bgMusicAudioContext.title = app.globalData.musicName;
          bgMusicAudioContext.play();
          that._musicOpera();
          that.setData({
            isPlay: true
          })
          app.globalData.isPlay = true;
          app.globalData.isPlaynew = '';
        } else {
          console.log("重新播放音乐");
          that.setData({
            isPlay: true
          })
          app.globalData.isPlay = true;
        }
      } else {
        console.log("播放音乐");
        bgMusicAudioContext.src = app.globalData.musicUrl;
        bgMusicAudioContext.title = app.globalData.musicName;
        bgMusicAudioContext.play();
        that._musicOpera();
        that.setData({
          isPlay: true
        })
        app.globalData.isPlay = true;
      }
      console.log("当前音乐按钮状态" + app.globalData.isPlay)
    },
    _musicOpera:function(){
      var that = this;
      bgMusicAudioContext.onPlay(function () {
        console.log("音乐播放事件监听");
        that.setData({
          isPlay: true
        })
        app.globalData.isPlay = true;
      });
      bgMusicAudioContext.onPause(function () {
        console.log("音乐暂停事件执行");
        that.setData({
          isPlay: false
        })
        app.globalData.isPlay = false;
      });
      bgMusicAudioContext.onStop(function () {
        console.log("音乐停止事件执行");
        that.setData({
          isPlay: false
        })
        app.globalData.isPlay = false;
      });
      bgMusicAudioContext.onEnded(function () {
        console.log("播放自然结束");
        bgMusicAudioContext.src = app.globalData.musicUrl;
        bgMusicAudioContext.title = app.globalData.musicName;
        bgMusicAudioContext.play();
      });
      bgMusicAudioContext.onError(function () {
        console.log("播放错误")
        that.setData({
          isPlay: false
        })
        app.globalData.isPlay = false;
        app.globalData.curInfoMusicid = '';
      })
    },
    // 切换暂停播放背景音乐
    _togglePlay: function () {
      var that = this;
      var isPlay = app.globalData.isPlay;
      console.log(bgMusicAudioContext.paused);
      console.log(isPlay);
      if (isPlay) {
        bgMusicAudioContext.pause();
        isPlay = false;
        if (app.globalData.curInfoMusicid){
          app.globalData.curInfoMusicid = '';
          app.globalData.musicUrl = that.data.musicUrl;
          app.globalData.musicName = that.data.musicTitle;
          app.globalData.isPlaynew = 'new';
        }
      } else {
        console.log(app.globalData.isPlaynew);
        if (app.globalData.isPlaynew == 'new') {
          bgMusicAudioContext.stop();
          bgMusicAudioContext.src = app.globalData.musicUrl;
          bgMusicAudioContext.title = app.globalData.musicName;
          bgMusicAudioContext.play();
          app.globalData.isPlaynew = '';
        } else {
          bgMusicAudioContext.play();
        }
        isPlay = true;
      }
      that.setData({
        isPlay: isPlay
      })
      app.globalData.isPlay = isPlay;
    },
  }
})