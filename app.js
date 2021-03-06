//app.js
App({
  onLaunch: function() {
    wx.cloud.init({
      env: 'yunhj-c0253b',
      traceUser: true
    })
  },
  globalData: {
    userInfo:null,
    defaultCity: '',
    defaultCounty: '',
    weatherData: '',
    air: '',
    day: '',
    g_isPlayingMusic: false,
    g_currentMusicPostId: null,
    doubanBase: "https://douban.uieee.com",
    heWeatherBase: "https://free-api.heweather.com",
    juhetoutiaoBase: "https://v.juhe.cn/toutiao/index",
    kuaidiBase:"https://www.kuaidi100.com/query",
    kuaidiKey:"",
    dictBase:"https://api.shanbay.com/bdc/search/",
    dictExamBase:"https://api.shanbay.com/bdc/example/",
    tencentMapKey: "ZC3BZ-IZVCU-WTYVD-4I3AF-KABPK-G5BKP",
    heWeatherKey: "4a817b4338e04cc59bdb92da7771411e",
    juhetoutiaoKey: "6a743f540dd541c3ac766fa93f12197a",
    curBook: "",
  },
})