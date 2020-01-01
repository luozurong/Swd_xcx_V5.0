import areaList from '../../../utils/area';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    siteId: '', // 购物车id
    areaList: areaList,
    isDelete: false,
    name:'',
    phone:'',
    address:'', // 省市区
    detail:'', // 地址详情
    checked: false,
    show: false,
    region: '' ,// 地址
    allRegion: [],
    active: true, // 保存按钮
    nameStatus: false,
    phoneStatus: false,
    detailStatus: false,
    type: '', // 进来类型
    source: '',
    nameTime: null, // 姓名
    phoneTime: null, // 手机
    detailTime: null, // 详情
    isSubmitFlag: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    const that = this;
    this.setData({type: options.type})
    if(options.way === 'edit'){
      wx.setNavigationBarTitle({
        title: '编辑地址'
      });
      that.getAddressDetail(options.siteId);
      this.setData({siteId: options.siteId});
      this.setData({isDelete: true})
    }else {
      wx.setNavigationBarTitle({
        title: '新增收货地址'
      });
      this.setData({isDelete: false})
    }

    if(options.source){
      this.setData({
        source: options.source
      })
    }
  },
  getAddressDetail(val) { // 获取详情
  console.log(val);
    const that = this;
    let params = {
      header: {},
      body: {
        siteId: val,
      }
    };
    getApp().API.getAddressDetail(params).then( data => {
      if(data.code == 0) {
        const re = data.data;
        let address = `${re.provinceName}/${re.cityName}/${re.districtName}`;
        that.setData({name: re.receivingName});
        that.setData({phone: re.phone});
        that.setData({address: address});
        that.setData({detail: re.address});
        that.setData({checked: re.isSelect == 0 ? false : true});
        that.setData({region: re.district.toString()});
        that.setData({nameStatus: true});
        that.setData({phoneStatus: true});
        that.setData({detailStatus: true});
        this.validate();
        let allRegion = [
          {name: data.provinceName, code: data.province},
          {name: data.cityName, code: data.city},
          {name: data.districtName, code: data.district},
          ];
        that.setData({allRegion: allRegion});
        this.checkStatus();
      }
    })
  },
  ok(val) { // 选择省市区
    let localtion = [];
    const arr = val.detail.values;
    this.setData({allRegion: arr});
    arr.forEach(element => {
      localtion.push(element.name)
    });
    this.setData({address: localtion.join('/')})
    this.setData({show: false});
    this.checkStatus();
  },
  validate(val) { // 判断规则
    const that = this;
    let type = '';
    // let nameTime = null;
    // let phoneTime = null;
    // let detailTime = null;
    if(val) {
      type = val.target.dataset.type;
    }else {
      type = '';
    }
    if(type === 'name') {
      // 清理掉正在执行的函数，并重新执行
      clearTimeout(that.data.nameTime);
      let nameTime = setTimeout(function() {
        that.setData({name: val.detail});
        if( that.data.name.length > 25 || that.data.name.length < 1) {
          that.setData({nameStatus: false});
        } else {
          that.setData({nameStatus: true});
        }
        that.checkStatus();
      }, 1000);
      that.setData({nameTime: nameTime})
    }
    if(type === 'phone') {
       // 清理掉正在执行的函数，并重新执行
       clearTimeout(that.data.phoneTime);
       let phoneTime = setTimeout(function() {
        that.setData({phone: val.detail});
         if ((!(/^1[3456789]\d{9}$/.test(that.data.phone)))) {
          that.setData({phoneStatus: false});
        } else {
          that.setData({phoneStatus: true});
        }
         that.checkStatus();
       }, 1000);
       that.setData({phoneTime: phoneTime})
    }
    if(type === 'detail') {
         // 清理掉正在执行的函数，并重新执行
         clearTimeout(that.data.detailTime);
         let detailTime = setTimeout(function() {
          that.setData({detail: val.detail});
          if(that.data.detail.length < 1) {
            that.setData({detailStatus: false});
          } else {
            that.setData({detailStatus: true});
          }
           that.checkStatus();
         }, 1000);
         that.setData({detailTime: detailTime})
    }
    // this.checkStatus();
  },
  checkPhone(val) {
    if ((!(/^1[3456789]\d{9}$/.test(val.detail.value)))) {
      wx.showToast({
        title: '请输入正确手机号码！',
        icon: 'none',
        duration: 2000
      })
    }
  },
  checkStatus() {
    const addressStatus = this.data.address.length > 0 ? true : false;
    if(this.data.nameStatus && this.data.phoneStatus && addressStatus && this.data.detailStatus) {
      this.setData({active: false})
    }else {
      this.setData({active: true})
    }
    console.log(this.data.nameStatus,this.data.phoneStatus,addressStatus,this.data.detailStatus);

  },
  addSave() { // 保存新增
    if(!this.data.active) {
      const that = this;
      if(!that.data.isSubmitFlag) return false;
      that.setData({
        isSubmitFlag: false
      })
      let status = this.data.checked ? 1 : 0;
      that.setData({active: true})
      let params = {
        header: {},
        body: {
          receivingName: this.data.name,
          phone: this.data.phone,
          province: this.data.allRegion[0].code,
          city: this.data.allRegion[1].code,
          district: this.data.allRegion[2].code,
          provinceName: this.data.allRegion[0].name,
          cityName: this.data.allRegion[1].name,
          districtName: this.data.allRegion[2].name,
          address: this.data.detail,
          isSelect: status,
          userId: wx.getStorageSync('userId')
        }
      };
      getApp().API.getSaveAddress(params).then( data => {
        that.setData({
          isSubmitFlag: true
        })
        if(data.code == 0) {
          wx.showToast({
            title: '保存成功！',
            icon: 'none',
            duration: 2000
          });
          if(that.data.type == 'pay') {
            //let addressChooseData = params.body;
            //wx.setStorageSync('addressInfo', addressChooseData);
            setTimeout( () => {
              if (that.data.source == 'orderConfirm'){
                wx.redirectTo({
                  url: './addressList',
                })
                return false;
              }
              wx.navigateBack()
              //console.log(222)
            },2000)
            } else {
              setTimeout( () => {
                wx.redirectTo({
                  url: './addressList'
                })
              },2000)
            }
        }else {
          that.setData({active: false})
          wx.showToast({
            title: '保存失败！',
            icon: 'none',
            duration: 2000
          });
        }
      }) 
    }
  },
  editSave() { // 保存更新
    if(!this.data.active) {
      const that = this;
      let status = this.data.checked ? 1 : 0;
      that.setData({active: true})
      let params = {
        header: {},
        body: {
          id: this.data.siteId,
          receivingName: this.data.name,
          phone: this.data.phone,
          province: this.data.allRegion[0].code,
          city: this.data.allRegion[1].code,
          district: this.data.allRegion[2].code,
          provinceName: this.data.allRegion[0].name,
          cityName: this.data.allRegion[1].name,
          districtName: this.data.allRegion[2].name,
          address: this.data.detail,
          isSelect: status,
          userId: wx.getStorageSync('userId')
        }
      };
      getApp().API.getUpdateAddress(params).then( data => {
        if(data.code == 0) {
          wx.showToast({
            title: '修改成功！',
            icon: 'none',
            duration: 2000
          });
          if(that.data.type == 'pay') {
            let addressChooseData = params.body;
            wx.setStorageSync('addressInfo', addressChooseData);
            setTimeout( () => {
              wx.navigateBack({
                delta: 1
              })
            },2000)
            } else {
              setTimeout( () => {
                wx.navigateTo({
                  url: './addressList'
                })
              },2000)
            }
        }else {
          that.setData({active: false})
          wx.showToast({
            title: '修改失败！',
            icon: 'none',
            duration: 2000
          });
        }
      }) 
    }
  },
  delete() { // 删除地址
    const that = this;
    let params = {
      header: {},
      body: {
        siteId: that.data.siteId
      }
    };
    getApp().API.getDeleteAddress(params).then( data => {
      if(data.code == 0) {
        wx.showToast({
          title: '删除成功！',
          icon: 'none',
          duration: 3000
        });
        let addressInfoWx = wx.getStorageSync('addressInfo')
        let addressInfo = JSON.parse(JSON.stringify(addressInfoWx));
        if (addressInfo.siteId == that.data.siteId){
          wx.removeStorageSync('addressInfo');
        }

        setTimeout(() => wx.navigateBack(),3000);
      }else {
        wx.showToast({
          title: '删除失败！',
          icon: 'none',
          duration: 3000
        });
      }
    }) 
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onChange({ detail }) {
    // 需要手动对 checked 状态进行更新
    this.setData({ checked: detail });
  },
  // 打开地址选择弹框
  showPopup() {
    this.setData({show: true});
  },
  cancel() {
    this.setData({show: false});
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