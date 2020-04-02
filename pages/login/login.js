// pages/login/login.js
let app = getApp();
// 获取云数据库引用
const db = wx.cloud.database();
const admin = db.collection('user');//注意，这里就是刚才的集合的名字——user
let name = null;//变量，用于存放用户输入的账号
let password = null;//变量，用于存放用户输入的密码

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  register: function () {
    wx.redirectTo({
      url: '/pages/register/register'
    })
  },
  //输入用户名
  inputName: function (event) {
    name = event.detail.value//将用户输入的账号放到变量里面
  },
  //输入密码
  inputPassword(event) {
    password = event.detail.value//将用户输入的密码放到变量里面
  },
  //登陆函数
  login() {
    let that = this;
    //登陆获取用户信息
    admin.get({
      success: (res) => {
        let user = res.data;
         console.log(res.data);
        for (let i = 0; i < user.length; i++) {  //遍历数据库对象集合
          if (name === user[i].account) { //用户名存在
            if (password !== user[i].password) {  //判断密码是否正确
              wx.showToast({
                title: '密码错误！！',
                icon: 'none',
                duration: 2500
              })
            } else {
              console.log('登陆成功！')
              wx.showToast({
                title: '登陆成功！！',
                icon: 'success',
                duration: 2500
              })

              wx.switchTab({
                url: '/pages/index/index',//这里是成功登录后跳转的页面
              })
            }
          } else {   //不存在
            wx.showToast({
              title: '无此用户名,请注册或重新登录',
              icon: 'none',
              duration: 2500
            })
            // wx.switchTab({
            //   url: '/pages/index/index',//这里是成功登录后跳转的页面
            // })
          }
        }
      }
    })
  },
   /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   * 页面初次渲染完成时触发。一个页面只会调用一次，代表页面已经准备妥当，可以和视图层进行交互
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   * 页面显示/切入前台时触发
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})


