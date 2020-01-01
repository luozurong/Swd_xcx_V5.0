
Component({
  properties: {
    shopCartNum: null
  },
  data: {
    shopCartNum: 0
  },
  attached() {         //组件加载时
    getApp().watch(this.getUserId, 'token')
  },
  pageLifetimes: {
    show: function () { // 页面显示
      this.getShopCarNumRequest();
    
    },
    hide: function () { // 页面隐藏
      
    }
  },
  methods: {
    /**
     * 监听token变化
     */
    getUserId(){
     
      setTimeout(()=>{
        console.log(1111);
        this.getShopCarNumRequest();
      },1000)
      
    },
    /**
     * 获取购物车数量
     */
    getShopCarNumRequest() {
      if(!wx.getStorageSync("userId")) return false
      let that = this;
      let params = {
        header: {},
        body: {
          userId: wx.getStorageSync('userId')
        }
      }

      getApp().API.getShopCarNum(params).then((res) => {
        if (res.code == 0) {
          let qty = res.data.qty;
          if (qty > 99) qty = '99+'
          that.setData({
            shopCartNum: qty
          });
        } else if (res.code == -1) {
          wx.showToast({
            title: res.message
          })
        }
      })
    },

    /**
    * 跳转我的
    */
    jumpMy() {
      wx.switchTab({
        url: '/pages/personalCenter/index/index'
      })
    },

    /**
     * 跳转到购物车
     */
    jumpShopCart() {
      let userId = wx.getStorageSync('userId');
      let token = wx.getStorageSync('token')
      if (!userId && !token){
        wx.navigateTo({
          url: '/pages/authorization/authorization'
        })
        return false;
      }
      wx.navigateTo({
        url: '/pages/mall/shopCart/shopCart',
      })
    },
  }
})