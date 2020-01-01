// pages/mall/home/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    records: [],
    current: 1,
    classifyId: '-1',
    isLoadMoreData: true,
    shopCartNum: 0,
    classifyId: '',
    isEmpty: false,
    runUionidComponent: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options.classifyId)
    

    //联享家跳转登录
    //options.src = 1;
    //options.token = '_1569827639802a6ae27170e14ac29a6e';
    // if (options.src) {
    //   getApp().loginRequest(function () {
    //     that.setData({     //执行未关注同主体的公众号下没有获取到unionid
    //       runUionidComponent: true
    //     });
    //     getApp().lxjlogin(options.token);
    //   })
    // }
    let that = this;
    this.setData({
      classifyId: options.classifyId
    })
    this.classiCommodityListRequest(1, options.classifyId);
    wx.setNavigationBarTitle({
      title: decodeURIComponent(options.title)
    })

    //this.isLoginFlagFunc();
    //getApp().watch(that.getUserId, 'userId');

   
  },

  /**
   * 跳转我的
   */
  jumpMy() {
    wx.reLaunch({
      url: '/pages/personalCenter/index/index'
    })
  },
  
  // getUserId(userId) {
  //   if (userId) {
  //     this.setData({
  //       isLoginFlag: true
  //     });
  //     wx.setStorageSync('isLoginFlag', true);
  //     this.isLoginFlagFunc();
  //     setTimeout(() => {
  //       this.getShopCarNumRequest();
  //     }, 100);
  //   }
  // },

  //判断是否已经登录
  // isLoginFlagFunc() {
  //   setTimeout(() => {
  //     if (wx.getStorageSync('userId') && wx.getStorageSync('openid') && wx.getStorageSync('token')) {
  //       this.setData({
  //         isLoginFlag: true
  //       });
  //       wx.setStorageSync('isLoginFlag', true);
  //     } else {
  //       this.setData({
  //         isLoginFlag: false
  //       })
  //       wx.setStorageSync('isLoginFlag', false);
  //     }
  //   }, 50)
  // },

  /**
  * 获取手机号
  */
  // getPhoneNumber(e) {
  //   if (e.detail.errMsg == "getPhoneNumber:fail user deny") return false;
  //   let iv = e.detail.iv;
  //   let encryptedData = e.detail.encryptedData;
  //   if (!iv) return false;
  //   wx.showLoading({
  //     title: '加载中',
  //     mask: true
  //   })
  //   wx.checkSession({
  //     success() {
  //       let sessionKey = wx.getStorageSync("session_key");
  //       let opendId = wx.getStorageInfo('openid');
  //       if (opendId && sessionKey) {
  //         getApp().getPhoneRequest(encryptedData, iv, sessionKey);
  //       } else {
  //         getApp().loginRequest(function () {  //兼容sessionKey、opendId不存在
  //           getApp().getPhoneRequest(encryptedData, iv, sessionKey);
  //         })
  //       }
  //     },
  //     fail() {
  //       wx.showToast({
  //         title: '重新验证'
  //       });
  //       getApp().loginRequest(function () {
  //         let sessionKey = wx.getStorageSync("session_key");
  //         getApp().getPhoneRequest(encryptedData, iv, sessionKey);
  //       })
  //     }
  //   })
  // },

  jumpIndex() {
    wx.reLaunch({
      url: '/pages/index/index?src=lxj&token=15664379742085267d9688cb4d49bdb0',
    })
  },

  // onMyEvent() {

  // },
  /**
   * 跳转到商品首页
   */
  jumpProductDetail(e) {
    let id = e.currentTarget.dataset.id;
    let isRx = e.currentTarget.dataset.isrx;
    let url = '';
    if(isRx == 1){
      url = `/pages/mall/product/productDetail/productDetail?comId=${id}&columnId=&shareUserId=0&source=1&isRx=1`;
    }else{
      url= `/pages/mall/product/productDetail/productDetail?comId=${id}&columnId=&shareUserId=0&source=1`;
    }
    wx.navigateTo({
      url: url
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 商品列表
   */
  classiCommodityListRequest(current, id) {
    let that = this;
    let params = {
      header: {},
      body: {
        size: 10,
        current: current,
        id: id
      }
    }
    wx.showLoading({
      title: '加载中',
    })
    getApp().API.classiCommodityList(params).then((res) => {
      wx.hideLoading();
      if (res.code == 0) {
        let recordTamp = that.data.records;
        recordTamp = recordTamp.concat(res.data.records);

        //标签兼容
        for (let i in recordTamp) {
          if (recordTamp[i].label && recordTamp[i].label.indexOf("；") != -1) {
            recordTamp[i].labelArr = recordTamp[i].label.split("；");
          } else {
            let label = [];
            if (recordTamp[i].label){
              label.push(recordTamp[i].label)
              recordTamp[i].labelArr = label;
            }
          }

          //价格过滤
          recordTamp[i].pricePre = parseInt(recordTamp[i].price);
          recordTamp[i].priceNext = '.' + String(parseFloat(recordTamp[i].price).toFixed(2)).split('.')[1];

          //销售价格
          recordTamp[i].salePricePre = parseInt(recordTamp[i].salePrice);
          recordTamp[i].salePriceNext = '.' + String(parseFloat(recordTamp[i].salePrice).toFixed(2)).split('.')[1];
        }
        that.setData({
          records: recordTamp
        })

        if (res.data.records.length < 10) {
          that.setData({
            isLoadMoreData: false
          })
        } else {
          let current = that.data.current;
          ++current;
          that.setData({
            current: current,
            isLoadMoreData: true
          })
        }

        if(that.data.records.length == 0){
          that.setData({
            isEmpty: true
          })
        }else{
          that.setData({
            isEmpty: false
          })
        }
      }
    });
  },

  /**
   * 添加到购物车
   */
  addToCart(event) {
    let userId = wx.getStorageSync('userId');
    let token = wx.getStorageSync('token')
    if (!userId && !token) {
      wx.navigateTo({
        url: '/pages/authorization/authorization'
      })
      return false;
    }
    let id = event.target.dataset.id;
    let columnId = '';
    if (this.data.columnId == '') {
      columnId = ''
    } else {
      columnId = parseInt(this.data.columnId)
    }
    this.saveComToCarRequest(id, columnId)
  },

  /**
   * 添加到购物车请求
   */
  saveComToCarRequest(commodityId, columnId) {
    let that = this;
    let params = {
      header: {},
      body: {
        columnId: columnId,
        commodityId: commodityId,
        qty: 1,
        userId: wx.getStorageSync('userId'),
        isSelect: 0
      }
    }

    getApp().API.saveComToCar(params).then((res) => {
      if (res.code == 0) {
        let qty = res.data.qty;
        if (qty > 99) qty = '99+';
        that.setData({
          shopCartNum: qty
        });
        wx.showToast({
          title: '添加成功',
        })
      } else if (res.code == -1) {
        wx.showToast({
          title: res.message
        })
      }
    })
  },

  /**
   * 获取购物车数量
   */
  // getShopCarNumRequest() {
  //   let that = this;
  //   let params = {
  //     header: {},
  //     body: {
  //       userId: wx.getStorageSync('userId')
  //     }
  //   }
  //   getApp().API.getShopCarNum(params).then((res) => {
  //     if (res.code == 0) {
  //       let qty = res.data.qty;
  //       if (qty > 99) qty = '99+';
  //       that.setData({
  //         shopCartNum: qty
  //       });
  //     }
  //   });
  // },

  jumpOrderConfirm() {
    wx.navigateTo({
      url: 'page/mall/orderConfirm/orderConfirm',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // if (wx.getStorageSync('userId')) {
    //   this.setData({
    //     isLoginFlag: true
    //   })
    // }

    //this.getShopCarNumRequest();
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
    if (this.data.isLoadMoreData) {
     // console.log(1);
      this.classiCommodityListRequest(this.data.current, this.data.classifyId)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})