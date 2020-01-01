var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    circular: true,
    interval: 5000,
    duration: 300,
    productDetail: {},
    productDetailImgUrl: [],
    labelArr: [],
    shopCartNum: 0,
    comId: '',
    columnId: '',
    isLoginFlag: wx.getStorageSync('isLoginFlag') || false,
    runUionidComponent: false,
    isRx: null,
    requirementListQty: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    //this.isLoginFlagFunc();
    // options.src = 1;
    // options.token = '1569827639802a6ae27170e14ac29a6e';
    //if (options.src) {
      //getApp().loginRequest(function () {
        // that.setData({     //执行未关注同主体的公众号下没有获取到unionid
        //   runUionidComponent: true
        // });
        //getApp().lxjlogin(options.token);
      //})
    //}
    if (options.source && options.source == 'serviceConsult') {
      this.setData({
        source: 'serviceConsult'
      })
    }

    //getApp().watch(that.getUserId, 'userId')
    

    this.setData({
      comId: options.comId,
      columnId: options.columnId
    });
    this.commodityDetilRequest(options.comId, options.columnId);

    // if(options.isRx){
    //   this.setData({
    //     isRx: 1
    //   });
    // }
  },

  // getUserId(userId) {
  //   if (userId) {
  //     this.setData({
  //       isLoginFlag: true
  //     });
  //     wx.setStorageSync('isLoginFlag', true);
  //     wx.showToast({
  //       title: '登陆成功',
  //     })
  //   }
  //   this.isLoginFlagFunc();
  //   setTimeout(()=>{
  //     //this.getShopCarNumRequest();
  //   },100);
  // },

  //判断是否已经登录
  // isLoginFlagFunc() {
  //   setTimeout(() => {
  //     if (wx.getStorageSync('isLoginFlag') && wx.getStorageSync('userId') && wx.getStorageSync('openid') && wx.getStorageSync('token')) {
  //       this.setData({
  //         isLoginFlag: true
  //       })
  //       wx.setStorageSync('isLoginFlag', true);
  //     } else {
  //       this.setData({
  //         isLoginFlag: false
  //       });
  //       wx.setStorageSync('isLoginFlag', false);
  //     }
  //   }, 50)
  // },
  /**
   * 跳转我的
   */
  // jumpMy() {
  //   wx.reLaunch({
  //     url: '/pages/personalCenter/index/index'
  //   })
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

  /**
  * 商品详情数据获取
 */
  commodityDetilRequest(comId, columnId) {
    let that = this;
    let params = {
      header: {},
      body: {
        id: comId,
        columnId: columnId,
      }
    }
    wx.showLoading({
      title: '加载中',
    })
    getApp().API.commodityDetil(params).then((res) => {
      wx.hideLoading();
      if (res.code == 0) {
        let productDetailImgUrl = [];
        if (res.data.imgUrl && res.data.imgUrl.indexOf(';') == -1) {
          productDetailImgUrl = res.data.imgUrl.split(";"); //轮播图
        }
        if (res.data.imgUrl && res.data.imgUrl.indexOf(';') != -1) {
          productDetailImgUrl = res.data.imgUrl.split(";"); //轮播图
        }

        let labelArr = []
        if (res.data.label && res.data.label.indexOf('；') == -1) {
          labelArr = res.data.label.split("；");
        }
        if (res.data.label && res.data.label.indexOf('；') != -1) {
          labelArr = res.data.label.split("；");
        }

        let productDetail = res.data;
        productDetail.pricePre = parseInt(productDetail.price);
        productDetail.priceNext = '.' + String(parseFloat(productDetail.price).toFixed(2)).split('.')[1];

        if (productDetail.specialPrice != null) {  //原价
          productDetail.specialPricePre = parseInt(productDetail.specialPrice);
          productDetail.specialPriceNext = '.' + String(parseFloat(productDetail.specialPrice).toFixed(2)).split('.')[1];
        }

        if (productDetail.salePrice != null) {  //销售价
          productDetail.salePricePre = parseInt(productDetail.salePrice);
          productDetail.salePriceNext = '.' + String(parseFloat(productDetail.salePrice).toFixed(2)).split('.')[1];
        }

        //满减或包邮
        if (!productDetail.discountsInfo){
          productDetail.discountsInfo = '满99元包邮';
        }
        
        //解析富文本数据
        if (productDetail.details){
          WxParse.wxParse('details', 'html', productDetail.details, that, 0);
        } 
        let columnIdFlag = res.data.columnId == null ? false : true;
        that.setData({
          productDetail: res.data,
          isRx: res.data.isRx,
          columnIdFlag: columnIdFlag,
          productDetailImgUrl: productDetailImgUrl,
          labelArr: labelArr
        })

        //获取需求清单数据
        if(res.data.isRx == 1 && wx.getStorageSync('userId')){
          this.getRequirementListNum();
        }

        if (productDetailImgUrl.length <= 1) {
          that.setData({
            indicatorDots: false,
            autoplay: false,
            circular: false
          })
        }
      }
    });
  },

  /**
   * 添加到购物车
   */
  addShopCart(){
    
    let userId = wx.getStorageSync('userId');
    let token = wx.getStorageSync('token')
    if (!userId && !token) {
      wx.navigateTo({
        url: '/pages/authorization/authorization'
      })
      return false;
    }

    if (!this.falseReturnFunc()) {
      return false;
    }

    // if (this.data.productDetail.inventory == 0){
    //   wx:wx.showToast({
    //     title: '暂无商品',
    //     icon: 'none',
    //   })
    //   return false;
    // }
    this.saveComToCarRequest(this.data.comId,this.data.columnId)
  },
  saveComToCarRequest(commodityId, columnId) {
    let that = this;
    let params = {
      header: {},
      body: {
        columnId: columnId == -1 ? '' : columnId,
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
      } else if (res.code == -1){
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
      }
    })
  },


  /**
   * 预下单
   */
  jumpOrderConfirm(){
   
    let userId = wx.getStorageSync('userId');
    let token = wx.getStorageSync('token');
    if (!userId && !token) {
      wx.navigateTo({
        url: '/pages/authorization/authorization'
      })
      return false;
    }

    if (!this.falseReturnFunc()) {
      return false;
    }

    //if(this.data.productDetail.inventory == 0) return false;
    let comList = [{
      comId: this.data.comId,
      columnId: this.data.columnId == -1 ? '' : this.data.columnId,
      qty: 1
    }];
    wx.setStorage({
      key: "remark",
      data: ""
    })
    wx.setStorageSync('comList', comList)
    wx.navigateTo({
      url: '/pages/mall/orderConfirm/orderConfirm',
    })
  },

  /**
   * 获取需求清单数量
   */
  getRequirementListNum(){
    let that = this;
    let params = {
      header: {},
      body: {
        userId: wx.getStorageSync('userId'),
      }
    }

    getApp().API.getRequirementListNum(params).then(res => {
      console.log(res);
      if(res.code == 0){
        that.setData({
          requirementListQty: res.data.qty
        })
      }
    })
  },

  falseReturnFunc(){
    if (this.data.productDetail.inventory < 1) {
      wx.showToast({
        title: '亲，暂无库存哦',
        icon: 'none'
      })
      return false;
    } else if (this.data.productDetail.status != 0) {
      wx.showToast({
        title: '商品已下架',
        icon: 'none'
      })
      return false;
    }
    return true
  },

  /**
   * 加入需求清单
   */
  addRequirementList(){
    
    let userId = wx.getStorageSync('userId');
    let token = wx.getStorageSync('token')
    if (!userId && !token) {
      wx.navigateTo({
        url: '/pages/authorization/authorization'
      })
      return false;
    }

    if (!this.falseReturnFunc()) {
      return false;
    }

    let that = this;
    let params = {
      header: {},
      body: {
        userId: wx.getStorageSync('userId'),
        columnId: this.data.columnId == -1 ? '' : this.data.columnId,
        commodityId: this.data.comId,
        qty: 1,
        isSelect: 0,
      }
    }

    getApp().API.saveRequirementCom(params).then( res => {
      console.log(res);
      if(res.code == 0){
        that.setData({
          requirementListQty: res.data.qty
        });
        wx.showToast({
          title: '加入成功',
          icon: 'none'
        })
      }else{
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
      }
    })
  },

  /**
   * 跳转需求清单
   */
  jumpRequirementList(){
    let userId = wx.getStorageSync('userId');
    let token = wx.getStorageSync('token')
    if (!userId && !token) {
      wx.navigateTo({
        url: '/pages/authorization/authorization'
      })
      return false;
    }
    wx.navigateTo({
      url: '/pages/mall/requirementList/requirementList',
    })
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
    // if (wx.getStorageSync('userId')){
    //   this.setData({
    //     isLoginFlag: true
    //   })
    // }
    if (wx.getStorageSync('userId')){
      if (this.data.isRx == 1) {
        this.getRequirementListNum();
      } else {
        //this.getShopCarNumRequest();
      }
    }
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
  onShareAppMessage: function (res) {
    console.log(res);
    if (res.from === 'button') {}
    let columnId = this.data.columnId ? this.data.columnId : '-1';
    let comId = this.data.comId;
    let path = '/pages/mall/product/productDetail/productDetail?columnId=' + columnId + '&comId=' + comId + '&shareUserId=0';
    let productDetailImgUrlShare = this.data.productDetailImgUrl[0];

    console.log(path);
    return {
      title: this.data.productDetail.name,
      path: path,
      imageUrl: productDetailImgUrlShare
    }
  }
})