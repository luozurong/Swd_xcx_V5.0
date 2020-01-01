// pages/personalCenter/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataSource: {
      balance: '0.00',
      doctorConsultTimes: 0,
      pharmacistConsultTimes: 0,
      insurance: 0,
      healthBonus: '0.00'
    }, //用户信息
    name: '',
    memberList: [], //亲友管理列表信息
    orderNum: {
      "waitPayAmount": null,
      "waitSendAmount": null,
      "waitDeliveryAmount": null,
      "waitEvaluateAmount": null,
      "inAfterSaleAmount": null
    },
    runUionidComponent: false,
    showSkeleton: true   //骨架屏显示隐藏
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //options.src="lxj";
    //options.token = '157050573774dbb52207a6e94ce1bb35';
    //兼容联享家跳转进入
    let that = this;
    if (options.src) {
      getApp().loginRequest(function(){
        that.setData({     //执行未关注同主体的公众号下没有获取到unionid
          runUionidComponent: true
        });
        getApp().lxjlogin(options.token);
      });
    }else{
      that.setData({     
        runUionidComponent: true
      });
    }
  },

  //监听用户已经登录
  getUserId(userId) {
    if (userId) {
      wx.setStorageSync('isLoginFlag', true);
      setTimeout(()=>{
        this.getUserAccountInfo(); // 获取用户信息
        this.getPatientList(); //获取亲友管理
        this.orderPreviewAmount(); //获取我的订单数
      },50);
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  getUserId(){
    console.log(111);
    this.init();
  },
  init(){
    var isHaveToken = wx.getStorageSync('token') || false;
    var isHaveUserId = wx.getStorageSync('userId') || false;
    var isHaveOpenid = wx.getStorageSync('openid') || false;
    if (isHaveToken && isHaveUserId && isHaveOpenid) {
      console.log('已登录授权')
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      this.getUserAccountInfo(); // 获取用户信息
      this.getPatientList(); //获取亲友管理
      this.orderPreviewAmount(); //获取我的订单数l
      //wx.hideLoading()
      this.setData({
        showSkeleton: false
      })
    } else {
      console.log('未登录授权')
      var tempObj = {
        balance: 0,
        doctorConsultTimes: 0,
        pharmacistConsultTimes: 0,
        insurance: 0,
        healthBonus: 0,
      }
      tempObj.balance = tempObj.balance.toFixed(2);
      tempObj.healthBonus = tempObj.healthBonus.toFixed(2);
      this.setData({
        name: '未登录',
        dataSource: tempObj,
      })
      this.setData({
        showSkeleton: false
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    getApp().watch(this.getUserId, 'userId');
    this.init();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /**
   * 获取我的订单数
   */
  orderPreviewAmount() {
    const that = this;
    let params = {
      header: {},
      body: {}
    };
    getApp().API.orderPreviewAmount(params).then(data => {
      wx.hideLoading()
      if (data.code == 0) {
        var resData = data.data;
        that.setData({
          orderNum: data.data
        })
      }
    }).catch(err => {})
  },

  /**
   * 获取亲友管理信息
   */
  getPatientList() {
    const that = this;
    var userId = wx.getStorageSync('userId');
    let params = {
      header: {},
      body: {
        pageNumber: 1,
        pageSize: 20,
      }
    };
    getApp().API.getPatientList(params).then(data => {
      wx.hideLoading()
      if (data.code == 0) {
        if (data.data.memberList.length > 0) {
          that.setData({
            memberList: data.data.memberList,
          })
        }
      }
    }).catch(err => {})
  },

  /**
   * 获取用户信息
   */
  getUserAccountInfo() {
    const that = this;
    var userId = wx.getStorageSync('userId');
    let params = {
      header: {},
      body: {}
    };
    getApp().API.getUserAccountInfo(params).then(data => {
      that.setData({
        showSkeleton: false
      })     
      wx.hideLoading(); 
      if (data.code == 0) {
        var resData = data.data;
        var name = '';
        resData.balance = resData.balance.toFixed(2);
        resData.healthBonus = resData.healthBonus.toFixed(2);
        if (resData.personOtherName) {
          name = resData.personOtherName;
        } else if (resData.personName){
          name = resData.personName;
        } else if (resData.account){
          name = resData.account;
        }else{
          name = '已登录'
        }
        that.setData({
          dataSource: data.data,
          name: name,
        })
      }
    }).catch(err => {})
  },

  /**
   * 跳转授权登录页
   */
  gotoAuthorization: function() {
    wx.navigateTo({
      url: '/pages/authorization/authorization'
    })
  },

  /**
   * 跳转个人资料页
   */
  gotoPersonalInfo: function() {
    var isHaveToken = wx.getStorageSync('token') || false;
    var isHaveUserId = wx.getStorageSync('userId') || false;
    var isHaveOpenid = wx.getStorageSync('openid') || false;
    if (!isHaveToken || !isHaveUserId || !isHaveOpenid) {
      this.gotoAuthorization();
      return
    }
    wx.navigateTo({
      url: '/pages/personalCenter/personalInfo/personalInfo'
    })
  },

  /**
   * 跳转个人设置页
   */
  gotoSetting: function() {
    var isHaveToken = wx.getStorageSync('token') || false;
    var isHaveUserId = wx.getStorageSync('userId') || false;
    var isHaveOpenid = wx.getStorageSync('openid') || false;
    if (!isHaveToken || !isHaveUserId || !isHaveOpenid) {
      this.gotoAuthorization();
      return
    }
    wx.navigateTo({
      url: '/pages/personalCenter/setting/setting'
    })
  },

  /**
   * 跳转客服页面
   */
  gotoservice: function() {
    var isHaveToken = wx.getStorageSync('token') || false;
    var isHaveUserId = wx.getStorageSync('userId') || false;
    var isHaveOpenid = wx.getStorageSync('openid') || false;
    if (!isHaveToken || !isHaveUserId || !isHaveOpenid) {
      this.gotoAuthorization();
      return
    }
    wx.navigateTo({
      url: '/pages/personalCenter/customerService/customerService'
    })
  },

  /**
   * 跳转我的余额
   */
  gotoBalance: function() {
    var isHaveToken = wx.getStorageSync('token') || false;
    var isHaveUserId = wx.getStorageSync('userId') || false;
    var isHaveOpenid = wx.getStorageSync('openid') || false;
    if (!isHaveToken || !isHaveUserId || !isHaveOpenid) {
      this.gotoAuthorization();
      return
    }
    wx.navigateTo({
      url: '/pages/personalCenter/balance/balance'
    })
  },

  /**
   * 跳转名医咨询/药师咨询
   */
  gotoConsultNum: function(e) {
    var isHaveToken = wx.getStorageSync('token') || false;
    var isHaveUserId = wx.getStorageSync('userId') || false;
    var isHaveOpenid = wx.getStorageSync('openid') || false;
    if (!isHaveToken || !isHaveUserId || !isHaveOpenid) {
      this.gotoAuthorization();
      return
    }
    var index = e.currentTarget.dataset['index'];
    wx.navigateTo({
      url: '/pages/personalCenter/consultNum/consultNum?consultType=' + index
    })
  },

  /**
   * 跳转我的保险
   */
  gotoInsurance: function() {
    var isHaveToken = wx.getStorageSync('token') || false;
    var isHaveUserId = wx.getStorageSync('userId') || false;
    var isHaveOpenid = wx.getStorageSync('openid') || false;
    if (!isHaveToken || !isHaveUserId || !isHaveOpenid) {
      this.gotoAuthorization();
      return
    }
    wx.navigateTo({
      url: '/pages/personalCenter/insurance/insurance'
    })
  },

  /**
   * 跳转健康奖金
   */
  gotoHealthBonus: function() {
    var isHaveToken = wx.getStorageSync('token') || false;
    var isHaveUserId = wx.getStorageSync('userId') || false;
    var isHaveOpenid = wx.getStorageSync('openid') || false;
    if (!isHaveToken || !isHaveUserId || !isHaveOpenid) {
      this.gotoAuthorization();
      return
    }
    wx.navigateTo({
      url: '/pages/personalCenter/healthBonus/healthBonus'
    })
  },

  /**
   * 跳转我的订单
   */
  gotoOrder: function(e) {
    var isHaveToken = wx.getStorageSync('token') || false;
    var isHaveUserId = wx.getStorageSync('userId') || false;
    var isHaveOpenid = wx.getStorageSync('openid') || false;
    if (!isHaveToken || !isHaveUserId || !isHaveOpenid) {
      this.gotoAuthorization();
      return
    }
    var index = e.currentTarget.dataset['index'];
    wx.navigateTo({
      url: '/pages/personalCenter/order/order?active=' + index
    })
  },

  /**
   * 跳转售后页面
   */
  gotoAfterSale: function () {
    var isHaveToken = wx.getStorageSync('token') || false;
    var isHaveUserId = wx.getStorageSync('userId') || false;
    var isHaveOpenid = wx.getStorageSync('openid') || false;
    if (!isHaveToken || !isHaveUserId || !isHaveOpenid) {
      this.gotoAuthorization();
      return
    }
    wx.navigateTo({
      url: '/pages/personalCenter/afterSaleList/afterSaleList'
    })
  },

  /**
   * 跳转待评价页面
   */
  gotoEvaluate: function() {
    var isHaveToken = wx.getStorageSync('token') || false;
    var isHaveUserId = wx.getStorageSync('userId') || false;
    var isHaveOpenid = wx.getStorageSync('openid') || false;
    if (!isHaveToken || !isHaveUserId || !isHaveOpenid) {
      this.gotoAuthorization();
      return
    }
    wx.navigateTo({
      url: '/pages/personalCenter/evaluateList/evaluateList'
    })
  },

  /**
   * 跳转我的问诊
   */
  gotoWenzhen: function() {
    var isHaveToken = wx.getStorageSync('token') || false;
    var isHaveUserId = wx.getStorageSync('userId') || false;
    var isHaveOpenid = wx.getStorageSync('openid') || false;
    if (!isHaveToken || !isHaveUserId || !isHaveOpenid) {
      this.gotoAuthorization();
      return
    }
    wx.navigateTo({
      url: '/pages/personalCenter/myInquiry/myInquiry'
    })
  },

  /**
   * 跳转我的病例
   */
  gotoBingli: function() {
    var isHaveToken = wx.getStorageSync('token') || false;
    var isHaveUserId = wx.getStorageSync('userId') || false;
    var isHaveOpenid = wx.getStorageSync('openid') || false;
    if (!isHaveToken || !isHaveUserId || !isHaveOpenid) {
      this.gotoAuthorization();
      return
    }
    wx.navigateTo({
      url: '/pages/personalCenter/myRecord/myrecord'
    })
  },

  /**
   * 跳转我的医生
   */
  gotoMydoctor: function() {
    var isHaveToken = wx.getStorageSync('token') || false;
    var isHaveUserId = wx.getStorageSync('userId') || false;
    var isHaveOpenid = wx.getStorageSync('openid') || false;
    if (!isHaveToken || !isHaveUserId || !isHaveOpenid) {
      this.gotoAuthorization();
      return
    }
    wx.navigateTo({
      url: '/pages/personalCenter/mydoctor/mydoctor'
    })
  },

  /**
   * 跳转健康档案
   */
  gotoHealthRecord: function() {
    var isHaveToken = wx.getStorageSync('token') || false;
    var isHaveUserId = wx.getStorageSync('userId') || false;
    var isHaveOpenid = wx.getStorageSync('openid') || false;
    if (!isHaveToken || !isHaveUserId || !isHaveOpenid) {
      this.gotoAuthorization();
      return
    }
    // wx.navigateTo({
    //   url: '/pages/personalCenter/healthRecord/healthRecord'
    // })
    wx.showToast({
      title: '当前功能尚未开放，敬请期待',
      icon: 'none',
      duration: 1000
    })
  },

  /**
   * 跳转我的收藏
   */
  gotoCollection: function() {
    var isHaveToken = wx.getStorageSync('token') || false;
    var isHaveUserId = wx.getStorageSync('userId') || false;
    var isHaveOpenid = wx.getStorageSync('openid') || false;
    if (!isHaveToken || !isHaveUserId || !isHaveOpenid) {
      this.gotoAuthorization();
      return
    }
    wx.navigateTo({
      url: '/pages/personalCenter/collection/collection'
    })
  },

  /**
   * 跳转我的亲友管理
   */
  gotoFamilyManage: function() {
    var isHaveToken = wx.getStorageSync('token') || false;
    var isHaveUserId = wx.getStorageSync('userId') || false;
    var isHaveOpenid = wx.getStorageSync('openid') || false;
    if (!isHaveToken || !isHaveUserId || !isHaveOpenid) {
      this.gotoAuthorization();
      return
    }
    wx.navigateTo({
      url: '/pages/personalCenter/familyManage/familyManage'
    })
  },

  /**
   * 跳转添加亲友
   */
  gotoAddFamilyManage: function(e) {
    var isHaveToken = wx.getStorageSync('token') || false;
    var isHaveUserId = wx.getStorageSync('userId') || false;
    var isHaveOpenid = wx.getStorageSync('openid') || false;
    if (!isHaveToken || !isHaveUserId || !isHaveOpenid) {
      this.gotoAuthorization();
      return
    }
    var dataInfo = JSON.stringify(e.currentTarget.dataset['info']);
    if (dataInfo) {
      wx.navigateTo({
        url: '/pages/personalCenter/familyManage/addFamily?dataInfo=' + dataInfo + '&type=' + 1
      })
    } else {
      wx.navigateTo({
        url: '/pages/personalCenter/familyManage/addFamily?dataInfo=' + dataInfo + '&type=' + 0
      })
    }
  },
})