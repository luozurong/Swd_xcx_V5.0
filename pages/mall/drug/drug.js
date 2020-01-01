Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 300,
    records: [],
    current: 1,
    classifyId: '-1',
    isLoadMoreData: true,
    shopCartNum: 0,
    columnId: '',
    prev: 0,
    paramsIndex: 0,
    next: 2,
    isEmpty: false,
    scrollerTop:[],
    scrollStatus: 'up',
    chooseAttr: [], 
    parentId: '',    //药品分类id
    runUionidComponent: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //this.isLoginFlagFunc();
    
    //getApp().watch(that.getUserId, 'userId');
     //options.src = 1;
     //options.token = '_1569827639802a6ae27170e14ac29a6e';
    //if (options.src) {
      //getApp().loginRequest(function(){
        //getApp().lxjlogin(options.token);
     // })
    //}
    //console.log(options.paramsIndex);
    // this.setData({
    //   parentId: options.parentId,
    // })
    let that = this;
    if (!options.paramsIndex){
      options.paramsIndex = 1;
    }
    this.setData({
      parentId: options.parentId,
      columnId: options.columnId,
      paramsIndex: options.paramsIndex - 1
    })
    this.appPic();
    this.getColumnList();

   

    //let isLoginFlagTamp = wx.getStorageSync('isLoginFlag') ? true : false;
    //this.setData({
     // isLoginFlag: isLoginFlagTamp
    //});
    //getApp().watch(that.getUserId, 'token');
  },
  //getApp().watch(that.getUserId, 'token');
  //监听用户已经登录
  getUserId(token) {
    if (token) {
      setTimeout(()=>{
        this.appPic();
        this.getColumnList();
      },1000)
    }
  },
  
  /**
   * 监听userId的变化
   */
  // getUserId(userId) {
  //   if (userId) {
  //     this.setData({
  //       isLoginFlag: true,
  //       userId: userId
  //     });
  //     wx.setStorageSync('isLoginFlag', true);
  //     setTimeout(()=>{
  //       //this.getShopCarNumRequest();
  //       this.isLoginFlagFunc();
  //     },100);
  //   }
  // },

  //判断是否已经登录
  // isLoginFlagFunc() {
  //   setTimeout(() => {
  //     if (wx.getStorageSync('userId') && wx.getStorageSync('openid') && wx.getStorageSync('token')) {
  //       this.setData({
  //         isLoginFlag: true
  //       })
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
   * 广告跳转
   */
  bannerJump(e){
    let jumpUrl = e.target.dataset.index;
    if (e.target.dataset.index){
      wx.navigateTo({
        url: jumpUrl,
      })
    }
  },

  /**
   * 广告位
   */
  appPic(){
    let that = this;
    let params = {
      body: { picPositionCode: 5},
      header: {}
    }
    getApp().API.appPic(params).then((res) => {
      if(res.code == 0){
        let indicatorDots =  false;
        let autoplay = true;
        if (res.data.pics.length > 0){
          if (res.data.pics.length > 1){
            indicatorDots = true;
            autoplay = true;
          }else{
            indicatorDots = false;
            autoplay = false;
          }
          that.setData({
            imgUrls: res.data.pics,
            indicatorDots: indicatorDots,
            autoplay: autoplay
          });
        }
      }
    })
  },

  /**
   * 获取不同栏目
   */
  getColumnList(){
    let that = this;
    let params = {
      header: {},
      body: {
        displayPosition: 3   //小程序
      }
    }
    wx.showLoading({
      title: '加载中',
    })
    getApp().API.getColumnList(params).then((res) => {
      wx.hideLoading();
      if (res.code == 0) {
        let homeClassificationTamp = res.data;
        homeClassificationTamp.length = 10;
        for (let i in homeClassificationTamp){
          homeClassificationTamp[i].name =homeClassificationTamp[i].name.substring(0,4);
        }
        that.setData({
          chooseAttr: homeClassificationTamp
        });

        that.getColumnCommodity(1, that.data.chooseAttr[that.data.paramsIndex].id);
      }
    });
  },

  /**
   * 获取不同分类的数据
   */
  homeClassificationRequest() {
    let that = this;
    let params = {
      header: {},
      body: {}
    }
    getApp().API.homeClassification(params).then((res) => {
      if(res.code == 0){
        let homeClassificationTamp = res.data;
        homeClassificationTamp.length = 6;
        that.setData({
          chooseAttr: homeClassificationTamp
        });

        that.getColumnCommodity(1, that.data.chooseAttr[0].id);
      }
    })
  },

  /**
   * 选择的分类
   */
  chooseClassify(e){
    let index = e.currentTarget.dataset.index
    this.setData({
      paramsIndex: index,
      records: []
    });
    this.getColumnCommodity(1, this.data.chooseAttr[index].id);
  },

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

  /**
   * 跳转到商品
   */
  jumpProductDetail(e) {
    let id = e.currentTarget.dataset.id; //栏目id
    let commodityId = e.currentTarget.dataset.commodityid;
    let isRx = e.currentTarget.dataset.isrx;
    let url = '';
    if(isRx == 1){
      url = `/pages/mall/product/productDetail/productDetail?comId=${commodityId}&columnId=${id}&shareUserId=0&isRx=1`;
    }else{
      url = `/pages/mall/product/productDetail/productDetail?comId=${commodityId}&columnId=${id}&shareUserId=0`;
    }
    wx.navigateTo({
      url: url,
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
  getColumnCommodity(current, id) {
    let that = this;
    let params = {
      header: {},
      body: {
        size: 10,
        current: current,
        id: id
      }
    }
    getApp().API.getColumnCommodity(params).then(res => {
        if (res.code == 0) {
        let recordTamp = that.data.records;
        recordTamp = recordTamp.concat(res.data.records);
        for (let i in recordTamp) {
          if (recordTamp[i].label && recordTamp[i].label.indexOf("；") != -1) {
            recordTamp[i].labelArr = recordTamp[i].label.split("；")
          } else {
            let label = [];
            if (recordTamp[i].label) {
              label.push(recordTamp[i].label)
              recordTamp[i].labelArr = label;
            }
          }
          recordTamp[i].pricePre = parseInt(recordTamp[i].price);//价格过滤
          recordTamp[i].priceNext = '.' + String(parseFloat(recordTamp[i].price).toFixed(2)).split('.')[1];
          if (recordTamp[i].specialPrice){
            recordTamp[i].specialPricePre = parseInt(recordTamp[i].specialPrice);//价格过滤
            recordTamp[i].specialPriceNext = '.' + String(parseFloat(recordTamp[i].specialPrice).toFixed(2)).split('.')[1];
          }
        }
        that.setData({
          records: recordTamp
        });

        if (res.data.records.length < 10) {
          let paramsIndex = that.data.paramsIndex;
            that.setData({
              isLoadMoreData: false,
              current: 1,
              paramsIndex: paramsIndex
            })      
        } else {
          let current = that.data.current;
          ++current;
          that.setData({
            current: current,
            isLoadMoreData: true
          })
        }

        if (that.data.records.length == 0){
          that.setData({
            isEmpty: true
          });
        }else{
          that.setData({
            isEmpty: false
          });
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
    let commodityId = event.target.dataset.commodityid;
    this.saveComToCarRequest(id, commodityId)
  },

  /**
   * 添加到购物车请求
   */
  saveComToCarRequest(columnId, commodityId) {
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
        if(qty > 99) qty = '99+'
        that.setData({
          shopCartNum: qty
        });
        wx.showToast({
          title: '添加成功',
        })
      } else if(res.code == -1) {
        let message = res.message;
        wx.showToast({
          title: message
        })
      }
    });
  },

  jumpOrderConfirm() {
    wx.navigateTo({
      url: 'page/mall/orderConfirm/orderConfirm',
    });
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (wx.getStorageSync('userId')) {
      this.setData({
        isLoginFlag: true
      })
    }
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
  onPullDownRefresh: function (e) {
   
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.isLoadMoreData) {
      this.getColumnCommodity(this.data.current, this.data.chooseAttr[this.data.paramsIndex].id);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})