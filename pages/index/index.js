var app = getApp();
var util = require('../../utils/cityutil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      '../../images/bg/bg-003.jpg',
      '../../images/bg/bg-011.jpg',
      '../../images/bg/bg-016.jpg',
      '../../images/bg/bg-017.jpg'
    ],
    inTheaters: {},
    location: '',
    county: '',
    today: '',
    weatherData: '',
    air: '',
    totalweatherData: '',
    isSunnyDay: '',
    dress: '',
  },

  onLoad: function (options) {
    var that = this;
    var inTheatersUrl = app.globalData.doubanBase +"/v2/movie/in_theaters" + "?start=0&count=6";
    wx.showLoading({
      title: '加载中',
    }),
    //更新当前日期
    app.globalData.day = util.formatTime(new Date()).split(' ')[0];
    this.setData({
      today: app.globalData.day
    });
    //定位当前城市
    that.getLocation();
  
    this.getMovieListData(inTheatersUrl, "inTheaters", "正在热映");
  },
  onMoreTap: function (event) {
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: "../movies/more-movie/more-movie?category=" + category
    })
  },
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: "../movies/movie-detail/movie-detail?id=" + movieId
    })
  },
 
  getMovieListData: function (url, settedKey, categoryTitle) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        wx.hideLoading();
        that.processDoubanData(res.data, settedKey, categoryTitle)
      },
      fail: function (error) {
        console.log(error)
      }
    })
  },

  processDoubanData: function (moviesDouban, settedKey, categoryTitle) {
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var score = subject.rating.average + "";
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: score.length == 1 ? subject.rating.average + '.0' : subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp)
    }
    var readyData = {};
    readyData[settedKey] = {
      categoryTitle: categoryTitle,
      movies: movies
    }
    this.setData(readyData);
    wx.hideNavigationBarLoading();
  },
  //定位到当前城市
  getLocation: function () {
    let that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        let latitude = res.latitude;
        let longitude = res.longitude;
        wx.request({
          url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=${app.globalData.tencentMapKey}`,
          success: res => {
            app.globalData.defaultCity = app.globalData.defaultCity ? app.globalData.defaultCity : res.data.result.ad_info.city;
            app.globalData.defaultCounty = app.globalData.defaultCounty ? app.globalData.defaultCounty : res.data.result.ad_info.district;
            that.setData({
              location: app.globalData.defaultCity,
              county: app.globalData.defaultCounty
            });
            that.getWeather();
            that.getAir();
          }
        })
      },
    })
  },

  //获取天气
  getWeather: function () {
    let length = this.data.location.length;
    let city = this.data.location.slice(0, length - 1);
    let that = this;
    let param = {
      key: app.globalData.heWeatherKey,
      location: city
    };
    wx.request({
      url: app.globalData.heWeatherBase + "/s6/weather",
      data: param,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        //console.log(res);
        if (res.data.HeWeather6[0].status == "no more requests"){
          app.globalData.weatherData = "";
          wx.showToast({
            title: "天气加载失败",
            duration: 1000,
            icon: "none"
          })
          return;
        }
        app.globalData.weatherData = res.data.HeWeather6[0].status == "unknown city" ? "" : res.data.HeWeather6[0];
        app.globalData.dress = res.data.HeWeather6[0].lifestyle[1];
        let weatherData = app.globalData.weatherData ? app.globalData.weatherData.now : "暂无该城市天气信息";
        let totalweatherData = app.globalData.weatherData ? app.globalData.weatherData.daily_forecast[0] : "暂无该城市天气信息";
        let isSunnyDay = '';
        let dress = app.globalData.weatherData ? res.data.HeWeather6[0].lifestyle[1] : { txt: "暂无该城市天气信息" };

        if (weatherData.cond_txt != '晴' && weatherData.cond_txt != '多云') {
          isSunnyDay = false;
        } else {
          isSunnyDay = true;
        }
        that.setData({
          weatherData: weatherData,//今天天气情况数组 
          totalweatherData: totalweatherData,//总共天气情况
          dress: dress,//穿衣指数等建议
          isSunnyDay: isSunnyDay//控制天气图片标志位
        });
      }
    })

  },

  //获取当前空气质量情况
  getAir: function () {
    let length = this.data.location.length;
    let city = this.data.location.slice(0, length - 1);
    let that = this;
    let param = {
      key: app.globalData.heWeatherKey,
      location: city
    };
    wx.request({
      url: app.globalData.heWeatherBase + "/s6/air/now",
      data: param,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        app.globalData.air = res.data.HeWeather6[0].status == "unknown city" ? "" : res.data.HeWeather6[0].air_now_city;
        that.setData({
          air: app.globalData.air
        });
      }
    })
  },
  //点击切换定位
  jumpChangeCity: function () {
    wx.reLaunch({
      url: '../switchcity/switchcity'
    })
  },
  //点击查看天气详情
  jumpFutureWeather: function () {
    wx.navigateTo({
      url: '../weather/weather',
    })

  },

  // 用户点击右上角分享
  onShareAppMessage: function () {
    return {
      title: '',
      desc: '',
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: "分享成功",
          duration: 1000,
          icon: "success"
        })
      }
    }
  }
})