// pages/doctor-page/articleNews.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '', // 文章id
    isLike: 0,
    isShare: 0,
    likeNum: 0, // 点赞
    show: false,
    dataSource: [], // 文章详情
    content: '', // 文章内容
    relationId: '', // 关联的文章id
    relationList: [], // 关联文章
    noDataFlag:false,//无数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({id:options.id})
    this.getArticle(options.id);
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  changeLike(e) { // 点赞
    if (!wx.getStorageSync("token") && !wx.getStorageSync("token")) {
      wx.navigateTo({
        url: '/pages/authorization/authorization'
      });
      return false;
    }
    const val = e.currentTarget.dataset.type;
    if(val == 0) { // 点赞
      this.updateNumber('plus')
    } else if (val == 1) { // 取消点赞
      this.updateNumber('subtract')
    }
  },
  changeShare(e) { // 收藏
    if (!wx.getStorageSync("token") && !wx.getStorageSync("token")) {
      wx.navigateTo({
        url: '/pages/authorization/authorization'
      });
      return false;
    }
    const val = e.currentTarget.dataset.type;
    if(val == 0) {
      this.updateCollect('plus')

    }else {
      this.updateCollect('subtract')
    }
  },
  updateNumber(val) { // 文章点赞/取消
    const that = this;
    let params = {
      header: {},
      body: {
        id: this.data.id,
        praise: val,
        accountId: wx.getStorageSync('userId')
      }
    };
    getApp().API.updateNumber(params).then( data => {
      if(data.code == 0) {
        if(val == 'plus') { // 点赞
          that.setData({isLike: 1});
          that.setData({likeNum: that.data.likeNum + 1});
    
        } else if (val == 'subtract') { // 取消点赞
          that.setData({isLike: 0});
          that.setData({likeNum: that.data.likeNum - 1});
        }
      }
    }).catch( err => {
     console.log(err)
    })
  },
  updateCollect(val) { // 文章收藏/取消收藏
    const that = this;
    let params = {
      header: {},
      body: {
        id: this.data.id,
        collect: val,
        accountId: wx.getStorageSync('userId')
      }
    };
    getApp().API.updateNumber(params).then( data => {
      if(data.code == 0) {
        if(val == 'plus') { // 收藏
          this.setData({isShare: 1});
        } else if (val == 'subtract') { // 取消收藏
      this.setData({isShare: 0});
    }
      }
    }).catch( err => {
     console.log(err)
    })
  },
  getArticle(val) { // 获取文章详情
    const that = this;
    that.setData({noDataFlag:false})
    let params = {
      header: {},
      body: {
        id: val,
        accountId: wx.getStorageSync('userId')
      }
    };
    getApp().API.getArticle(params).then( data => {
      if(data.code == 0) {
        that.setData({dataSource: data.data})
        if(!data.data.authorObject.isShow){
          wx.setNavigationBarTitle({
            title: `${data.data.authorObject.employeeName}医生专栏`
          })
        }else {
          wx.setNavigationBarTitle({
            title: data.data.title
          })

        }
        let article_content = data.data.content;
        article_content = article_content.replace(/<img/gi, '<img style="max-width:100%;height:auto;float:left;display:block" ');
        that.setData({content: article_content});
        that.setData({relationId: data.data.relationId});
        that.setData({likeNum: Number(data.data.praise)}); // 点赞数
        that.setData({isLike: Number(data.data.isPraised)}); // 赞数
        that.setData({isShare: Number(data.data.isCollected)}); // 收藏
        that.getRelationArticle();
      }
    }).catch( err => {
      that.setData({noDataFlag:true})
      console.log(err)
    })
  },
  getRelationArticle() { // 获取关联文章
    const that = this;
    let params = {
      header: {},
      body: {
        relationId: that.data.relationId,
      }
    };
    getApp().API.getRelationArticle(params).then( data => {
      if(data.code == 0) {
        that.setData({relationList: data.data})
      }
    }).catch( err => {
     console.log(err)
    })
  },
  tojumb(e) { // 跳转相关文章
    let id = e.currentTarget.dataset.id
    wx.redirectTo({
      url: `./articleNews?id=${id}`,
    })
  },
})