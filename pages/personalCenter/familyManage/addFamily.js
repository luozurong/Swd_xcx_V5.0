// pages/personalCenter/familyManage/addFamily.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    patientName: '',
    contractPhone: '',
    isSex: 0,
    idCard:'',
    isFamily: '',
    checked: false,
    infoChecked: false,
    seeChecked: false,
    dataInfo: {}, // 传递信息
    patientId: '', // 亲友id
    editType: '', // 编辑或提交0--添加；2--编辑
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.type == 0 ) { // 添加
        this.setData({isSex : 10});
        this.setData({isFamily : 10});
        this.setData({editType : 0});
      this.setData({patientId: ''});
    } else { // 编辑
      let data = JSON.parse(options.dataInfo)
      this.setData({dataInfo: data});
      this.setData({patientId: data.patientId});
      this.setData({editType : 2});
      this.setData({patientName: data.patientName})
      this.setData({contractPhone: data.contractPhone})
      this.setData({isSex: data.sex})
      this.setData({idCard: data.idCard})
      this.setData({isFamily: data.relation})
      this.setData({isEmergencyContact: data.isEmergencyContact == 1 ? true : false})
      this.setData({isAbnormalNotify: data.isAbnormalNotify == 1 ? true : false})
      this.setData({isPushData: data.isPushData == 1 ? true : false})
    }
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
  selectSex(e) {
    this.setData({isSex: e.target.dataset.type})
  },
  selectFamaily(e) {
    this.setData({isFamily: e.target.dataset.type})
  },
  onChange({ detail }) {
    // 需要手动对 checked 状态进行更新
    this.setData({ checked: detail });
  },
  onInfoChange({ detail }) {
    // 需要手动对 checked 状态进行更新
    this.setData({ infoChecked: detail });
  },
  onSeeChange({ detail }) {
    // 需要手动对 checked 状态进行更新
    this.setData({ seeChecked: detail });
  },
  addSave() { // 保存新增/修改
      const that = this;
      if (that.data.patientName.length < 1) {
        wx.showToast({
          title: '请输入姓名！',
          icon: 'none',
          duration: 1000
        })
        return false;
      }
      if ((!(/^1[3456789]\d{9}$/.test(that.data.contractPhone)))) {
        wx.showToast({
          title: '请输入正确手机号码！',
          icon: 'none',
          duration: 1000
        })
        return false;
      }
      let isEmergencyContact = this.data.checked ? 1 : 0;
      let isAbnormalNotify = this.data.infoChecked ? 1 : 0;
      let isPushData = this.data.seeChecked ? 1 : 0;
      let params = {
        header: {},
        body: {
          patientName : that.data.patientName,
          contractPhone: that.data.contractPhone,
          // roleId : 1541896,
          sex : that.data.isSex,
          editType : that.data.editType,
          idCard : that.data.idCard,
          relation : that.data.isFamily,
          isEmergencyContact : isEmergencyContact,
          isAbnormalNotify : isAbnormalNotify,
          isPushData : isPushData,
          patientId : that.data.patientId,
          roleId: wx.getStorageSync('userId')
        }
      };
      getApp().API.savePatientInfo(params).then( data => {
        if(data.code == 0) {
          wx.showToast({
            title: '保存成功！',
            icon: 'none',
            duration: 2000
          });
          setTimeout(() => {
            wx.redirectTo({
              url: './familyManage',
            });
              
          },2000)
        }else {
          wx.showToast({
            title: '保存失败！',
            icon: 'none',
            duration: 2000
          });
        }
      }) 
  },
  patientNameInput: function(e) {
    this.setData({
      patientName: e.detail.value
    })
  },
  contractPhoneInput: function(e) {
    this.setData({
      contractPhone: e.detail.value
    })
  },
  idCardInput: function(e) {
    this.setData({
      idCard: e.detail.value
    })
  },
})