var app = getApp();
var util = require("../../untils/untils.js")
// pages/books/books.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value:'简爱',
    searchBooks:[],
    booksNub:''
  },
  onSearch:function(options){
    //console.log(options.detail)
    wx.showLoading({
      title: '正在加载...',
    })
    var url = app.globalData.doubanBase+"/v2/book/search?apikey=0df993c66c0c636e29ecbb5344252a4a&q="+options.detail
    //console.log(url)
    wx.request({
      url: url,
      data:{},
      header: {
        "Content-Type": "json"
      },
      method: 'GET',
      success:(res)=>{
        console.log(res)
        var rows=this.data.searchBooks.concat(res.data.books);
        this.setData({
          booksNub:res.data.total,
          searchBooks:rows
        })
        //console.log(this.data.searchBooks)
        wx.hideLoading();
      },
      fail:function(){
        console.log("失败")
      }
    })
  },
  goDetails(e){
   var id= e.target.id;
   wx.navigateTo({
     url:'books-detail/books-detail?id='+id,
   })
  },
  onFocus:function(options){
    //console.log(options)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
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