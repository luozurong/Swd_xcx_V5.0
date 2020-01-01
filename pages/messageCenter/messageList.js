// pages/message-center/messageList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noDataFlag:false, //无数据
    Connecting: [], // 健管师
    physician: [], // 医师
    pharmacist: [], // 药师
    logistics: [], // 物流
    mall: [], // 商城
    friend: [], // 亲友
    service: [], // 客服
    ConnectingContent: [], // 健管师显示内容
    physicianContent: [], // 医师显示内容
    pharmacistContent: [], // 药师显示内容
    logisticsContent: [], // 物流显示内容
    mallContent: [], // 商城显示内容
    friendContent: [], // 亲友显示内容
    serviceContent: [], // 客服显示内容
    ConnectingRead: 0, // 健管未读
    physicianRead: 0, // 医师未读
    pharmacistRead: 0, // 药师未读
    logisticsRead: 0, // 物流未读
    mallRead: 0, // 商城未读
    friendRead: 0, // 亲友未读
    serviceRead: 0, // 客服未读
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMessage();
  },
  /***
   * 健管师: Connecting
   * 医师: physician
   * 药师: pharmacist
   * 物流: logistics
   * 商城: mall
   * 亲友: friend
   * 客服: service
   */
  getMessage() {
    const that = this;
    let params = {
      header: {},
      body: {
        userId: wx.getStorageSync('userId'),
        pushMethod: ''
        // userId: 'user1',
      }
    };
    getApp().API.getMessage(params).then( data => {
      if(!data) {
        that.setData({noDataFlag:true})
      }
      if(data.code == 0) {
        if(data.data.length > 0) {
          that.setData({noDataFlag:false})
        }else {
          that.setData({noDataFlag:true})
        }
        let Connecting = []; // 健管师
        let physician = []; // 医师
        let pharmacist = []; // 药师
        let logistics = []; // 物流
        let mall = []; // 商城
        let friend = []; // 亲友
        let service = []; // 客服
        let ConnectingRead = 0; // 健管未读
        let physicianRead = 0; // 医师未读
        let pharmacistRead = 0; // 药师未读
        let logisticsRead = 0; // 物流未读
        let mallRead = 0; // 商城未读
        let friendRead = 0; // 亲友未读
        let serviceRead = 0; // 客服未读
        let dataSource = data.data;
        for(let i=0; i < dataSource.length; i++) {
          switch(dataSource[i].roleName) {
            case '健管师': 
              Connecting.push(dataSource[i]);
              if(dataSource[i].readedStatus == 0) {
                ConnectingRead += 1;
              }
              break;
            case '医师': 
              physician.push(dataSource[i]);
              if(dataSource[i].readedStatus == 0) {
                physicianRead += 1;
              }
              break;
            case '药师': 
            pharmacist.push(dataSource[i]);
              if(dataSource[i].readedStatus == 0) {
                pharmacistRead += 1;
              }
              break;
            case '物流': 
              logistics.push(dataSource[i]);
              if(dataSource[i].readedStatus == 0) {
                logisticsRead += 1;
              }
              break;
            case '商城': 
              mall.push(dataSource[i]);
              if(dataSource[i].readedStatus == 0) {
                mallRead += 1;
              }
              break;
            case '亲友': 
              friend.push(dataSource[i]);
              if(dataSource[i].readedStatus == 0) {
                friendRead += 1;
              }
              break;
            case '客服': 
              service.push(dataSource[i]);
              if(dataSource[i].readedStatus == 0) {
                serviceRead += 1;
              }
              break;
          }
        }
        that.setData({Connecting: Connecting});
        that.setData({physician: physician});
        that.setData({pharmacist: pharmacist});
        that.setData({logistics: logistics});
        that.setData({mall: mall});
        that.setData({friend: friend});
        that.setData({service: service});
        that.setData({ConnectingContent: Connecting[Connecting.length-1]});
        that.setData({physicianContent: physician[physician.length-1]});
        that.setData({pharmacistContent: pharmacist[pharmacist.length-1]});
        that.setData({logisticsContent: logistics[logistics.length-1]});
        that.setData({mallContent: mall[mall.length-1]});
        that.setData({friendContent: friend[friend.length-1]});
        that.setData({serviceContent: service[service.length-1]});
        that.setData({ConnectingRead: ConnectingRead});
        that.setData({physicianRead: physicianRead});
        that.setData({pharmacistRead: pharmacistRead});
        that.setData({logisticsRead: logisticsRead});
        that.setData({mallRead: mallRead});
        that.setData({friendRead: friendRead});
        that.setData({serviceRead: serviceRead});
      } else {
      that.setData({noDataFlag:true})
      }
    }).catch( err => {
      console.log(err);
      that.setData({noDataFlag:true})
    })
  },
  jumpDetail(e) {
    wx.navigateTo({
      url: './messageDetail?type='+e.currentTarget.dataset.type
    });
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
    this.getMessage();
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