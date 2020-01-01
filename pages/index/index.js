import agriknow from '../../apis/agriknow.js'
let API = new agriknow();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [{
      linkUrl: 'sd'
    }], // '',
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 300,
    circular: true,
    isLoadingOver: false,
    administrative: [{
        departmentName: ''
      },
      {
        departmentName: ''
      },
      {
        departmentName: ''
      },
      {
        departmentName: ''
      },
      {
        departmentName: ''
      },
      {
        departmentName: ''
      }
    ], //科室
    doctorList: [{
      avatarUrl: "",
      department: "",
      duty: "",
      employeeLevel: "",
      hospitalName: "",
      id: "",
      name: "",
      receiveCount: "",
      tagsFullName: "",
      title: "",
      userEvaluatedScore: ""
    }], //医生列表
    isLoadMore: true,
    pageNumber: 1, //医生列表页数
    departmentId: '', //科室id
    departmentIndex: 0,
    runUionidComponent: false,
    imgUrl1: 'http://yun-test.kinglian.net/xcx/doctor/dyf_menu_icon.png',
    imgUrl1name: '54',
    orderNum: 0,
    orderId: '',
    inquiryType: '', //6名医咨询 9 凭方开药
    showSkeleton: true //骨架屏显示隐藏
  },
  /**
   * 生命周期函数--监听页面加载 src: lxj联想家APP，dpj大屏机
   */
  onLoad: function(options) {
    let that = this;
    if (options.type != undefined) {
      wx.navigateTo({
        url: `/pages/doctorPage/index?doctorId=${options.doctorId}`,
      })
    }
    that.getInquiryList()
    that.appPic();
    that.getDepartmentInfo();

  },
  launchAppError(e) {
    if (e.detail.errMsg == 'invalid scene') {
      wx.navigateTo({
        url: '/pages/download/download',
      })
    }
  },

  jumpRecommend(e) {
    wx.navigateTo({
      url: '/pages/mall/recommend/index',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  getInquiryList() {
    let params = {
      header: {},
      body: {
        businessTypeId: [
          6, 9
        ],
        pageSize: 10,
        pageNumber: this.data.pageNumber,
        type: 0,
        status: ['2','3']
      }
    };
    getApp().API.myInquiryList(params).then(res => {
      if (res.code == 0) {
        let orderNum = res.data.total;
        this.setData({
          orderNum: orderNum,
        })
        if (orderNum == 1) {
          var result = res.data ; 
          let orderId = result.list[0].orderId;
          let inquiryType = result.list[0].inquiryType;
          this.setData({
            orderId: orderId,
            inquiryType: inquiryType
          })
        }


      }
    }).catch(err => {
      console.log(err)
    })
  },
  goToChatOrDoctor() {
    console.log(this.data.orderNum)
    if (this.data.orderNum == 1) {
      wx.redirectTo({
        url: "/pages/chat/index/index?orderId=" + this.data.orderId + "&inquiryType=" + this.data.inquiryType
      })
    } else {
      wx.navigateTo({
        url: '/pages/personalCenter/myInquiry/myInquiry',
      })
    }
  },
  /**
   * 获取banner数据
   */
  appPic() {
    let that = this;
    let params = {
      header: {},
      body: {
        picPositionCode: 6
      }
    }
    getApp().API.appPic(params).then((res) => {
      if (res.code == 0) {
        if (res.data.pics.length == 1) { //banner图为1张
          that.setData({
            imgUrls: res.data.pics,
            indicatorDots: false,
            autoplay: false,
          })
        } else if (res.data.pics.length > 1) { //banner图大于1张
          that.setData({
            imgUrls: res.data.pics,
            indicatorDots: true,
            autoplay: true,
          })
        } else { //banner默认
          let imgUrl = [{
            picUrl: 'https://nfys-static.kinglian.cn/xcx/mall/default_banner.jpg',
            linkUrl: ''
          }];
          that.setData({
            imgUrls: imgUrl,
            indicatorDots: false,
            autoplay: false
          })
        }
      }
    })
  },

  /**
   * banner跳转链接
   */
  jumpLink(e) {
    let link = e.target.dataset.linkurl;
    if (link) {
      wx.navigateTo({
        url: link,
      })
    }
  },


  /**
   * 跳转医生主页
   */
  jumpDoctorPage(e) {
    console.log(e);
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/doctorPage/index?doctorId=' + id,
    })
  },

  jumpFilloutInfo(e) {
    // return false;
    if (wx.getStorageSync("userId") && wx.getStorageSync("token")) {
      var expertId = e.currentTarget.dataset.id;
      console.log(expertId);
      wx.navigateTo({
        url: '/pages/patient/filloutInfo/filloutInfo?expertId=' + expertId,
      })
    } else {
      getApp().isLoginFlagFunc();
    }
  },

  /**
   * 名医堂科室列表
   */
  getDepartmentInfo() {
    let that = this;
    let params = {
      header: {},
      body: {}
    }

    getApp().API.getDepartmentInfo(params).then((res) => {
      wx.hideLoading();
      if (res.code == 0) {
        let administrativeTamp = res.data;
        administrativeTamp.length = 6;
        that.setData({
          administrative: administrativeTamp,
          departmentId: administrativeTamp[0].departmentId
        })
        that.getDoctorInfo(administrativeTamp[0].departmentId)
      }
    });
  },

  /**
   * 获取科室医生信息
   */
  getDoctorInfo(departmentId) {
    let that = this;
    let params = {
      header: {},
      body: {
        departmentId: departmentId,
        pageNumber: that.data.pageNumber,
        pageSize: 9,
        pageNumber: this.data.pageNumber
      }
    }
    wx.showLoading({
      title: '加载中',
    })
    getApp().API.getDoctorInfo(params).then((res) => {
      wx.hideLoading()
      if (this.data.pageNumber == 1) {
        that.setData({
          doctorList: []
        })
      }
      that.setData({
        showSkeleton: false
      })

      if (res.code == 0) {
        let resTamp = res.data;
        let doctorListTamp = that.data.doctorList;
        doctorListTamp = doctorListTamp.concat(resTamp);
        that.setData({
          doctorList: doctorListTamp
        });

        if (res.data.length < 9) {
          that.setData({
            isLoadMore: false
          });
        } else {
          let pageNumberTamp = that.data.pageNumber;

          pageNumberTamp += 1;
          that.setData({
            pageNumber: pageNumberTamp,
            isLoadMore: true,
            isLoadingOver: true
          })
        }
      }
    })
  },


  /**
   * 切换科室
   */
  changeDepartmentId(e) {
    this.setData({
      doctorList: [],
      pageNumber: 1,
      departmentId: e.target.dataset.id
    })
    this.getDoctorInfo(e.target.dataset.id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(options) {
    setTimeout(() => {
      this.setData({
        src: this.data.token
      })
    }, 200);
    if (wx.getStorageSync('userId')) {
      this.setData({
        isLoginFlag: true
      })
    }
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
    this.getDepartmentInfo();
    this.setData({
      doctorList: []
    });
    this.appPic();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.isLoadMore) {
      console.log(this.data.departmentId);
      this.getDoctorInfo(this.data.departmentId);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    if (res.from === 'button') {}
    let name = res.target.dataset.name;
    let id = res.target.dataset.id;
    let avatarUrl = res.target.dataset.avatarurl;
    return {
      title: '名医堂：' + name,
      path: `pages/index/index?doctorId=${id}&type=article`,
      imageUrl: avatarUrl
    }
  }
})