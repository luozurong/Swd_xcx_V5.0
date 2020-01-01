// pages/compnent/noData/noData.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // options: {
    //   multipleSlots: false //在组件定义时的选项中启用多slot支持
    // },
    scene: {
      type: String,
      default: "noData"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrl: "",
    tips: ""
  },
  attached() {
    let imgurl = "";
    let tips = "";
    console.log(this.properties.scene)
    switch (this.properties.scene) {
      case "noNet":
        imgurl = "http://yun-test.kinglian.net/xcx/systerm/noNet.png";
        tips = "网络连接失败";
        break;
      case "noData":
        imgurl = "http://yun-test.kinglian.net/xcx/systerm/noData.png";
        tips = "这里空空的,什么也没有...";
        break;
      case "noRight":
        imgurl = "http://yun-test.kinglian.net/xcx/systerm/noRight.png";
        tips = "这里空空的,什么也没有...";
        break;
      case "noOrder":
        imgurl = "http://yun-test.kinglian.net/xcx/systerm/noOrder.png";
        tips = "还没有订单...";
        break;
      case "shopCartEmpty":
        imgurl = "http://yun-test.kinglian.net/xcx/systerm/shopCartEmpty.png";
        tips = "购物车还是空空的~";
        break;
      case "drugEmpty":
        imgurl = "http://yun-test.kinglian.net/xcx/systerm/drugEmpty.png";
        tips = "即将上架，敬请期待";
        break;
      default:
        imgurl = "http://yun-test.kinglian.net/xcx/systerm/noNet.png";
        tips = "无搜索结果，换个词试试吧...";
        break;
    }
    this.setData({
      imgUrl: imgurl
    })
    this.setData({
      tips: tips
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
