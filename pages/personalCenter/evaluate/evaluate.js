// pages/personalCenter/evaluate/evaluate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',                      //订单id
    value: 5,                    //星评
    message: '',
    tempFilePaths: [],           //图片列表
    evaluateImg: [],             //提交地址
    comList: [],                 //商品列表
    id: '',                      //订单id
    evaluateDetail: '',
    picNum: 0,                   //上传第几张图片
    source: ''
  },

  /**
   * 星评
   */
  onChange(e){
    this.setData({
      value: e.detail
    })
  },

  /**
   * 评价描述
   */
  bindTextAreaBlur(e){
    this.setData({
      evaluateDetail: e.detail.value
    })
  },

  /**
   * 选择图片
   */
  addPic(){
    let that = this;
    wx.chooseImage({
      count: 3 - that.data.tempFilePaths.length, 
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        let tempFilePathsTamp = that.data.tempFilePaths;
        let tempFilePathsTamps = tempFilePathsTamp.concat(res.tempFilePaths)
        that.setData({
          tempFilePaths: tempFilePathsTamps
        });
        console.log(that.data.tempFilePaths);
      }
    })
  },

  /**
   * 图片预览
   */
  imgPreViewImage(e) {
    let that = this;
    let index = e.target.dataset.index;
    wx.previewImage({
      current: that.data.tempFilePaths[index],
      urls: that.data.tempFilePaths,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  /**
   * 删除图片
   */
  deleteImag(e){
    let index = e.target.dataset.index;
    let tempFilePathsTamp = this.data.tempFilePaths;
    tempFilePathsTamp.splice(index,1);
    this.setData({
      tempFilePaths: tempFilePathsTamp
    });

    console.log(this.data.tempFilePaths);
  },

  /**
   * 获取订单详情
   */
  getOrderDetail(){
    let that = this;
    let params = {
      header: {},
      body: {
        orderNo: this.data.id 
      },
    }

    getApp().API.getOrderDetail(params).then((res) => {
      console.log(res);
      if(res.code == 0){
        that.setData({
          comList: res.data.comList,
        })
      }
    })
  },
  /**
   * 提交评论
   */
  evealuateSubmit(){
    let that = this;
    wx.showLoading({
      title: '数据提交中',
    })
    if (that.data.tempFilePaths.length == 0){
      that.evaluate();
    }else{
      that.setData({   //兼容上传失败重置
        picNum: 0
      })
      that.uploadFile(that.data.tempFilePaths[that.data.picNum])
    }
  },
  /**
   * 上传图片
   */
  uploadFile(uploadFileParams) {
    let that = this;
    console.log(uploadFileParams);
    wx.uploadFile({
      url: 'https://nfys-test.kinglian.cn/oss/oss/upload', //仅为示例，非真实的接口地址
      filePath: uploadFileParams,
      name: 'file',
      formData: {
        'user': 'test'
      },
      success(data) {
        let res = JSON.parse(data.data);
        if(res.code == 0){
          let resData = res.data.uploadFilePath;
          let evaluateImgTamp = that.data.evaluateImg;
          evaluateImgTamp.push(resData);
          console.log(evaluateImgTamp);
          that.setData({
            evaluateImg: evaluateImgTamp,
            picNum: Number(that.data.picNum) + 1
          });
          if (that.data.picNum < that.data.tempFilePaths.length){
            that.uploadFile(that.data.tempFilePaths[that.data.picNum], that.data.picNum)
          }else{
            that.evaluate();
          }
        }
      },
      fail: function (res) { }
    })
  },

  /**
   * 提交评论请求
   */
  evaluate(){
    let that = this;
    let params = {
      header: {},
      body: {
        id: this.data.id,
        evaluateScour: this.data.value,
        evaluate: this.data.evaluateDetail,
        evaluateImg: this.data.evaluateImg.join(";")
      }
    }
    getApp().API.evaluate(params).then((res)=>{
      wx.hideLoading();
      if(res.code == 0){
        wx.showToast({
          title: '评价成功',
        })
        setTimeout(()=>{
          if(that.data.source == 'orderList'){            //确认收货跳转评价中间页
            wx.redirectTo({
              url: '/pages/personalCenter/order/mallOrderDetail?orderId=' + this.data.id
            });
          } else if (that.data.source == 'evaluateList'){  //待评价列表
            wx.navigateBack();
          }else{                                           //其他跳转（如：订单详情）
            wx.navigateBack();
          }
        },1500)
       
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      source: options.source
    })
    this.getOrderDetail();
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