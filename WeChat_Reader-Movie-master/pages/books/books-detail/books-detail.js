
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: "",//输入框中，用户输入的内容
    score: 5, //评分的内容
    bookId: 0,
    detail: {},
    images: [],
    fileIDS: []  //上传成功保存fileID
  
  },
  mysubmit: function () {
    //功能，将选中的图片上传到云存储中
    //在data中添加属性fileIDS:[]
    //显示加载提示框”正在提交中“
    wx.showLoading({
      title: '正在提交中...',
    })
    //上传云存储
    //创建promise数组
    var promiseArr = [];
    //创建循环遍历选中图片
    for (var i = 0; i < this.data.images.length; i++) {
      //创建promise对象
      //promise负责完成上传一张图片任务
      //并且将图片 fileID保存数组中
      promiseArr.push(new Promise((resolve, reject) => {
        //获取当前图片
        var item = this.data.images[i];
        //创建正则表达式，来拆分文件后缀名
        var suffix = /\.\w+$/.exec(item)[0]
        //上传图片并且将fileID保存在数组中
        //新文件名  时间+随机数+后缀，可能存在一毫秒传了几张图片，防止名字相同
        var newFile = new Date().getTime() + Math.floor(Math.random() * 9999) + suffix;
        wx.cloud.uploadFile({
          //为图片创建新的文件名
          cloudPath: newFile,
          filePath: item,
          success: res => {
            //上传成功后拼接fileID
            var fid = res.fileID;
            //console.log(fid);
            var ids = this.data.fileIDS.concat(fid);
            this.setData({
              fileIDS: ids
            })
            //将当前的promise任务追加到任务列表中
            resolve()
          },
          fail: err => { console.log(err) }
        })
      })); //promise结束
    }//循环结束
    //将云存储中的fileId一次性保存在云数据库的集合中
    Promise.all(promiseArr).then(res => {
      //在云数据库中创建集合 comment 用于保存评论的内容和文件的id
      //等待数组中所有Promise任务执行结束
      //回调函数中
      //在程序的最顶端初始化数据库
      //将评论的内容和分数 电影id 上传图片所有id 添加到集合中
      db.collection("comment").add({
        data: {
          content: this.data.value, //评论内容
          score: this.data.score,  //分数
          movieid: this.data.movieid, //电影id
          fileIds: this.data.fileIDS //图片id
        }
      }).then(res => {
        //隐藏加载框
        wx.hideLoading();
        //显示提示框 发表成功
        wx.showToast({
          title: '发表成功',
        })
      }).catch(err => {
        //添加集合失败，隐藏加载提示框
        wx.hideLoading();
        //显示提示框，评论失败
        wx.showToast({
          title: '评论失败',
        })
      })
    })
  },
  selectImage: function () {
    //用户选择9张图片，保存在data中
    //在data中添加数组属性 images
    //调用wx.chooseImage选中图片
    //将选中的9张图片保存在images中
    wx.chooseImage({
      count: 9,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: (res) => {
        var list = res.tempFilePaths;
        this.setData({
          images: list
        })
      },
    })
  },
  onContentChange: function (e) {//e 事件对象
    //输入相应事件
    //用户输入内容
    console.log(e.detail)
    this.setData({
      value: e.detail
    })
  },
  onScoreChange: function (e) {
    //用户打分对应的时间处理函数
    console.log(e.detail)
    //将用户输入新分数赋值操作
    this.setData({
      score: e.detail
    })
  },
  loadmove(){
    wx.showLoading({
      title: '正在加载...',
    })
    var url ='https://api.douban.com/v2/book/' +this.data.bookId+'?apikey=0df993c66c0c636e29ecbb5344252a4a'
    wx.request({
      url: url,
      data:{},
      header: {
        "Content-Type": "json"
      },
      method: 'GET',
      success:(res)=>{
        console.log(res)
        this.setData({
          detail:res.data
        })
        wx.hideLoading();
      },
      fail: function () {
        console.log("失败")
      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      bookId:options.id
    })
    this.loadmove()
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