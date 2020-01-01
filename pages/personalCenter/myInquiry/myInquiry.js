// pages/personalCenter/myInquiry/myInquiry.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noDataFlag: false, //无数据
    inquiryArr: [],
    pageNumber: 1,
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
        status: ['0']
      }
    };
    app.API.myInquiryList(params).then(res => {
      if (res.code == 0) {
        var resObj = res.data;
        console.log(resObj)
        if (resObj.list.length > 0) {
          var tmpList = resObj.list
          for (var i = 0; i < tmpList.length; i++) {
            var tempRes = tmpList[i];
            var tmpDate = tempRes.orderCreateTime.substring(5, 16);
            console.log(tmpDate)
            tempRes.orderShowTime = tmpDate
            this.setData({
              inquiryArr: tmpList
            })
          }
        } else {
          this.setData({
            noDataFlag: true
          })
        }
      }
    }).catch(err => {
      console.log(err)
    })
  },
  dateFormate(dateStr) {
    if (dateStr) {
      var showStr = dateStr.subString(5);
      return showStr
    }
  },
  getMoreList() {
    this.data.pageNumber++
      let params = {
        header: {},
        body: {
          pageSize: 10,
          pageNumber: this.data.pageNumber,
          type: 0,
          isWeXin: "1"
        }
      };
    app.API.getInquiryList(params).then(res => {
      var list = this.data.inquiryArr;
      if (res.code == 0) {
        var resObj = res.data;
        if (resObj.length > 0) {
          for (var i = 0; i < resObj.length; i++) {
            var tmpList = resObj[i];
            list.push(tmpList);
          }
          this.setData({
            inquiryArr: list
          })
        } else if (resObj.length == 0 && this.data.inquiryArr.length == 0) {
          this.setData({
            noDataFlag: true
          })
        }
      }
      console.log(this.data.inquiryArr)
    }).catch(err => {
      console.log(err)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getInquiryList()
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    console.log("加载数据");
    this.getMoreList()
  },
  goToChat(chatItem) {
    var inquiryObj = chatItem.currentTarget.dataset.item
    if (inquiryObj.inquiryType == 6 || inquiryObj.inquiryType == 9) {
      wx.navigateTo({
        url: "/pages/chat/index/index?orderId=" + inquiryObj.orderId + '&inquiryType=' + inquiryObj.inquiryType
      })
    }else{
      wx.showToast({
        title: '',
      })
    }
  }
})