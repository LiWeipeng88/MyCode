!function(n,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):n.Ald=t()}(this,function(){function n(){this.concurrency=4,this.queue=[],this.tasks=[],this.activeCount=0;var n=this;this.push=function(t){this.tasks.push(new Promise(function(o,e){var a=function(){n.activeCount++,t().then(function(n){o(n)}).then(function(){n.next()})};n.activeCount<n.concurrency?a():n.queue.push(a)}))},this.all=function(){return Promise.all(this.tasks)},this.next=function(){n.activeCount--,n.queue.length>0&&n.queue.shift()()}}function t(n){this.app=n}function o(n){A=""+Date.now()+Math.floor(1e7*Math.random()),N=n,this.aldstat=new t(this)}function e(n){var t;if(t=n.scene!=en,en=n.scene,O=0,N=n,J=n.query.ald_share_src,Q=n.query.aldsrc||"",G=n.query.ald_share_src,L=Date.now(),k=Date.now(),on||(q=""+Date.now()+Math.floor(1e7*Math.random())),!tn){B=!1;try{wx.setStorageSync("ald_ifo",!1)}catch(n){}}tn=!1,t?U=""+Date.now()+Math.floor(1e7*Math.random()):0!==b&&Date.now()-b>3e4&&(U=""+Date.now()+Math.floor(1e7*Math.random()),k=Date.now()),n.query.ald_share_src&&"1044"==n.scene&&n.shareTicket?wx.getShareInfo({shareTicket:n.shareTicket,success:function(n){V=n,x("event","ald_share_click",JSON.stringify(n))}}):n.query.ald_share_src&&x("event","ald_share_click",1),""===W&&wx.getSetting({withCredentials:!0,success:function(n){if(n.authSetting["scope.userInfo"]){wx.getUserInfo({withCredentials:!0,success:function(n){var t=g();W=n,t.ufo=v(n),C=w(n.userInfo.avatarUrl.split("/")),p(t)}})}}}),S("app","show")}function a(){b=Date.now(),""===W&&wx.getSetting({success:function(n){n.authSetting["scope.userInfo"]&&wx.getUserInfo({withCredentials:!0,success:function(n){W=n,C=w(n.userInfo.avatarUrl.split("/"));var t=g();t.ufo=v(n),p(t)}})}}),S("app","hide")}function i(n){K++,x("event","ald_error_message",n)}function r(n){$=n}function s(){Y=this.route,_("page","show")}function c(){Z=this.route}function u(){Z=this.route}function l(){x("event","ald_pulldownrefresh",1)}function f(){x("event","ald_reachbottom",1)}function h(n){on=!0;var t=y(n.path),o={};for(var e in N.query)"ald_share_src"===e&&(o[e]=N.query[e]);var a="";if(a=n.path.indexOf("?")==-1?n.path+"?":n.path.substr(0,n.path.indexOf("?"))+"?",""!==t)for(var e in t)o[e]=t[e];o.ald_share_src?o.ald_share_src.indexOf(F)==-1&&o.ald_share_src.length<200&&(o.ald_share_src=o.ald_share_src+","+F):o.ald_share_src=F;for(var i in o)i.indexOf("ald")==-1&&(a+=i+"="+o[i]+"&");return n.path=a+"ald_share_src="+o.ald_share_src,x("event","ald_share_status",n),n}function d(){function n(){return Math.floor(65536*(1+Math.random())).toString(16).substring(1)}return n()+n()+n()+n()+n()+n()+n()+n()}function p(n){function t(){return new Promise(function(t,o){wx.request({url:"https://"+T+".aldwx.com/d.html",data:n,header:{AldStat:"MiniApp-Stat",se:E||"",op:H||"",img:C},method:"GET",success:function(n){t(200==n.statusCode?"":"status error")},fail:function(){t("fail")}})})}O++,n.at=q,n.et=Date.now(),n.uu=F,n.v=I,n.ak=R.app_key,n.wsr=N,n.oifo=B,n.rq_c=O,n.ls=A,wx.Queue.push(t)}function g(){var n={};for(var t in z)n[t]=z[t];return n}function w(n){for(var t="",o=0;o<n.length;o++)n[o].length>t.length&&(t=n[o]);return t}function v(n){var t={};for(var o in n)"rawData"!=o&&"errMsg"!=o&&(t[o]=n[o]);return t}function y(n){if(n.indexOf("?")==-1)return"";var t={};return n.split("?")[1].split("&").forEach(function(n){var o=n.split("=")[1];t[n.split("=")[0]]=o}),t}function S(n,t){var o=g();o.ev=n,o.life=t,o.ec=K,o.st=Date.now(),o.ahs=U,Q&&(o.qr=Q,o.sr=Q),J&&(o.usr=J),"hide"===t&&(o.hdr=Date.now()-k,o.dr=Date.now()-L,o.ifo=!!B),p(o)}function _(n,t){var o=g();o.ev=n,o.st=Date.now(),o.life=t,o.pp=Y,o.pc=Z,o.dr=Date.now()-L,o.ahs=U,on&&(o.so=!0),on=!1,$&&"{}"!=JSON.stringify($)&&(o.ag=$),Q&&(o.qr=Q,o.sr=Q),J&&(o.usr=J),X||(nn=Y,X=!0,o.ifp=X,o.fp=Y),p(o)}function x(n,t,o){var e=g();e.ev=n,e.tp=t,e.st=j,o&&(e.ct=o),p(e)}function m(n,t,o){if(n[t]){var e=n[t];n[t]=function(n){o.call(this,n,t),e.call(this,n)}}else n[t]=function(n){o.call(this,n,t)}}function D(n){var t={};for(var r in n)"onLaunch"!==r&&"onShow"!==r&&"onHide"!==r&&"onError"!==r&&"onPageNotFound"!==r&&"onUnlaunch"!==r&&(t[r]=n[r]);t.onLaunch=function(t){o.call(this,t),"function"==typeof n.onLaunch&&n.onLaunch.call(this,t)},t.onShow=function(t){e.call(this,t),n.onShow&&"function"==typeof n.onShow&&n.onShow.call(this,t)},t.onHide=function(){a.call(this),n.onHide&&"function"==typeof n.onHide&&n.onHide.call(this)},t.onError=function(t){i.call(this,t),n.onError&&"function"==typeof n.onError&&n.onError.call(this,t)},t.onUnlaunch=function(){n.onUnlaunch&&"function"==typeof n.onUnlaunch&&n.onUnlaunch.call(this)},t.onPageNotFound=function(t){n.onPageNotFound&&"function"==typeof n.onPageNotFound&&n.onPageNotFound.call(this,t)},App(t)}function P(n){var t={};for(var o in n)"onLoad"!==o&&"onReady"!==o&&"onShow"!==o&&"onHide"!==o&&"onUnload"!==o&&"onPullDownRefresh"!==o&&"onReachBottom"!==o&&"onShareAppMessage"!==o&&"onPageScroll"!==o&&"onTabItemTap"!==o&&(t[o]=n[o]);t.onLoad=function(t){r.call(this,t),"function"==typeof n.onLoad&&n.onLoad.call(this,t)},t.onShow=function(t){s.call(this),"function"==typeof n.onShow&&n.onShow.call(this,t)},t.onHide=function(t){c.call(this),"function"==typeof n.onHide&&n.onHide.call(this,t)},t.onUnload=function(t){u.call(this),"function"==typeof n.onUnload&&n.onUnload.call(this,t)},t.onReady=function(t){n.onReady&&"function"==typeof n.onReady&&n.onReady.call(this,t)},t.onReachBottom=function(t){f(),n.onReachBottom&&"function"==typeof n.onReachBottom&&n.onReachBottom.call(this,t)},t.onPullDownRefresh=function(t){l(),n.onPullDownRefresh&&"function"==typeof n.onPullDownRefresh&&n.onPullDownRefresh.call(this,t)},t.onPageScroll=function(t){n.onPageScroll&&"function"==typeof n.onPageScroll&&n.onPageScroll.call(this,t)},t.onTabItemTap=function(t){n.onTabItemTap&&"function"==typeof n.onTabItemTap&&n.onTabItemTap.call(this,t)},n.onShareAppMessage&&"function"==typeof n.onShareAppMessage&&(t.onShareAppMessage=function(t){var o=n.onShareAppMessage.call(this,t);return void 0===o?(o={},o.path=this.route):void 0===o.path&&(o.path=this.route),h.call(this,o)}),Page(t)}var M=wx.getExtConfigSync?wx.getExtConfigSync():{},R={};void 0===M.ald_config?(R.appd_key="",R.plugin=!1,R.getLocation=!1):R=M.ald_config,void 0===wx.Queue&&(wx.Queue=new n,wx.Queue.all());var I="7.0.1",T="log",q="",A="",U=Date.now(),k="",L=0,b=0,E="",H="",C="",O=0,N="",B="",F=function(){var n="";try{n=wx.getStorageSync("aldstat_uuid")}catch(t){n="uuid_getstoragesync"}if(n)B=!1;else{n=d(),B=!0;try{wx.setStorageSync("aldstat_uuid",n),wx.setStorageSync("ald_ifo",!0)}catch(n){wx.setStorageSync("aldstat_uuid","uuid_getstoragesync")}}return n}(),j=Date.now(),J="",Q="",G="",K=0,V="",W="",z={},X=!1,Y="",Z="",$="",nn="",tn=!0,on=!1,en="";!function(){wx.request({url:"https://"+T+".aldwx.com/config/app.json",header:{AldStat:"MiniApp-Stat"},method:"GET",success:function(n){200===n.statusCode&&(I<n.data.sanversion&&console.warn("您的SDK不是最新版本，请尽快升级！"),n.data.warn&&console.warn(n.data.warn),n.data.error&&console.error(n.data.error))}})}();try{var an=wx.getSystemInfoSync();z.br=an.brand,z.pm=an.model,z.pr=an.pixelRatio,z.ww=an.windowWidth,z.wh=an.windowHeight,z.lang=an.language,z.wv=an.version,z.wvv=an.platform,z.wsdk=an.SDKVersion,z.sv=an.system}catch(n){}wx.getNetworkType({success:function(n){z.nt=n.networkType}}),wx.getSetting({success:function(n){n.authSetting["scope.userLocation"]?wx.getLocation({type:"wgs84",success:function(n){z.lat=n.latitude,z.lng=n.longitude,z.spd=n.speed}}):R.getLocation&&wx.getLocation({type:"wgs84",success:function(n){z.lat=n.latitude,z.lng=n.longitude,z.spd=n.speed}})}}),t.prototype.sendEvent=function(n,t){if(""!==n&&"string"==typeof n&&n.length<=255)if("string"==typeof t&&t.length<=255)x("event",n,t);else if("object"==typeof t){if(JSON.stringify(t).length>=255)return void console.error("自定义事件参数不能超过255个字符");x("event",n,JSON.stringify(t))}else void 0===t?x("event",n,!1):console.error("事件参数必须为String,Object类型,且参数长度不能超过255个字符");else console.error("事件名称必须为String类型且不能超过255个字符")},t.prototype.sendSession=function(n){if(""===n||!n)return void console.error("请传入从后台获取的session_key");E=n;var t=g();t.st=Date.now(),t.tp="session",t.ct="session",t.ev="event",""===W?wx.getSetting({success:function(n){n.authSetting["scope.userInfo"]?wx.getUserInfo({success:function(n){t.ufo=v(n),C=w(n.userInfo.avatarUrl.split("/")),""!==V&&(t.gid=V),p(t)}}):""!==V&&(t.gid=V,p(t))}}):(t.ufo=W,""!==V&&(t.gid=V),p(t))},t.prototype.sendOpenid=function(n){if(""===n||!n)return void console.error("openID不能为空");H=n;var t=g();t.st=Date.now(),t.tp="openid",t.ev="event",t.ct="openid",p(t)};return R.plugin?{App:D,Page:P}:function(n){!function(){var n=App,t=Page;App=function(t){m(t,"onLaunch",o),m(t,"onShow",e),m(t,"onHide",a),m(t,"onError",i),n(t)},Page=function(n){var o=n.onShareAppMessage;m(n,"onLoad",r),m(n,"onUnload",u),m(n,"onShow",s),m(n,"onHide",c),m(n,"onReachBottom",f),m(n,"onPullDownRefresh",l),void 0!==o&&null!==o&&(n.onShareAppMessage=function(n){if(void 0!==o){var t=o.call(this,n);return void 0===t?(t={},t.path=this.route):void 0===t.path&&(t.path=this.route),h(t)}}),t(n)}}()}()});