<template>
  <view>
    <!-- 顶部 -->
    <view class="main-header">
      <view class="main-project uni-ellipsis">
        <view class="uni-font-32" @click="getNav('my-house')">
          <text v-show="hasLogin === false">请登录</text>
          <text v-show="hasLogin === true && hasBoundHouse === false"
            >请绑定房产</text
          >
          <view
            v-show="
              hasLogin === true &&
              hasBoundHouse === true &&
              myHouse.ownerInfo.villagename
            "
          >
            <image
              src="/static/images/my-car.png"
              mode="aspectFit"
              style="
                width: 30upx;
                height: 30upx;
                margin-right: 10upx;
                vertical-align: middle;
              "
            ></image>
            <text style="vertical-align: middle; font-weight: 600">{{
              myHouse.ownerInfo.villagename
            }}</text>
          </view>
        </view>
        <!-- <view>
				<text class="main-score">上月服务评分：5.0</text>
			</view> -->
      </view>
      <!-- #ifdef APP-PLUS -->
      <view class="uni-cell-10 main-message" @click="getNav('message')"
        ><image
          :src="message"
          mode="aspectFit"
          class="main-message-icon"
        ></image
      ></view>
      <!-- #endif -->
    </view>
    <s-pull-scroll
      ref="pullScroll"
      :pullDown="pullDown"
      :top="150"
      downLoadingText="正在刷新..."
      :enablePullUp="false"
    >
      <view class="main">
        <view class="main-content">
          <view style="margin: 0 20upx 20upx">
            <!-- 轮播图 -->
            <view class="main-banner">
              <swiper
                class="swiper"
                :indicator-dots="indicatorDots"
                :autoplay="autoplay"
                :interval="interval"
                :duration="duration"
              >
                <swiper-item v-for="(item, index) in banners" :key="index">
                  <image :src="item" mode="widthFix"></image>
                </swiper-item>
              </swiper>
            </view>
            <!-- 三个大按钮 -->
            <view class="main-btn">
              <view
                v-for="(item, index) in mainBtn"
                class="main-fct-btn uni-cell-30"
                :key="index"
              >
                <view class="uni-cell-100" @click="getNav(item.url)">
                  <image
                    class="btn-img"
                    :src="item.src"
                    mode="aspectFit"
                  ></image>
                  <view class="title">{{ item.text }}</view>
                </view>
              </view>
            </view>
            <!-- 菜单按钮 -->
            <view class="main-grad-8">
              <uni-grid :column="5" :highlight="true">
                <uni-grid-item
                  v-for="(item, index) in list"
                  :key="index"
                  style="height: 180upx"
                >
                  <view @click="getNav(item.url, item.id)">
                    <view class="uni-flex-center"
                      ><image :src="item.src" class="image" mode="aspectFill"
                    /></view>
                    <view class="text">{{ item.text }}</view>
                  </view>
                </uni-grid-item>
              </uni-grid>
            </view>
          </view>
        </view>
        <!-- 通知公告 -->
        <view class="notice-wrapper">
          <view class="notice-title"> 通知公告 </view>
          <view class="notice-content">
            <view class="notice-item">
              <text class="text" v-if="noticeList" @click="noticeDetail">{{
                noticeList.name
              }}</text>
              <text class="text" v-else>暂无通知公告</text>
            </view>
          </view>
        </view>
        <!-- 我的管家 -->
        <view
          class="uni-flex-center"
          style="margin-top: 20upx"
          v-if="housekeeper"
        >
          <view
            class="housekeeper uni-cell-90 uni-flex-btw"
            @click="toHousekeeper"
          >
            <view class="uni-cell-20 uni-flex-center"
              ><image
                :src="housekeeprImg"
                mode="aspectFit"
                class="housekeeper-header"
              ></image
            ></view>
            <view class="uni-cell-30 uni-flex-center" style="text-align: left">
              <view style="height: 100upx">
                <view
                  class="uni-font-36"
                  style="color: #333; font-weight: 500"
                  >{{ housekeeper.realname }}</view
                >
                <view class="uni-font-28" style="color: #ccc"
                  >您的专属管家</view
                >
              </view>
            </view>
            <view class="uni-cell-20"></view>
            <view class="uni-cell-30 uni-flex-center">
              <button class="housekeeper-btn" type="warn" plain>
                呼叫管家
              </button>
            </view>
          </view>
        </view>

        <view class="uni-flex-center">
          <view class="main-topic uni-cell-90"
            ><view class="title"></view
          ></view>
        </view>
        <!-- 更新modal -->
        <view @touchmove.stop.prevent="moveHandle">
          <yomol-upgrade
            :type="upgradeType"
            :url="upgradeUrl"
            title="发现新版本"
            :content="upgradeContent"
            ref="yomolUpgrade"
          ></yomol-upgrade>
        </view>
        <li-toast :showToast="showToast"></li-toast>
      </view>
    </s-pull-scroll>
  </view>
</template>
<script>
import uniGrid from "@/components/uni-grid/uni-grid.vue";
import uniGridItem from "@/components/uni-grid-item/uni-grid-item.vue";
import yomolUpgrade from "@/components/yomol-upgrade/yomol-upgrade.vue";
import liToast from "@/components/li-toast/li-toast.vue";
import sPullScroll from "@/components/s-pull-scroll";

export default {
  components: {
    uniGrid,
    uniGridItem,
    yomolUpgrade,
    liToast,
    sPullScroll,
  },
  data() {
    return {
      showToast: false,
      /*图片轮播*/
      indicatorDots: true,
      autoplay: true,
      interval: 5000,
      duration: 500,
      noticeList: "",
      mainBtn: [
        //三个便捷按钮
        {
          text: "访客预约",
          mark: "车位预约超方便",
          colors: "colorOrange",
          url: "appointment",
          src: "/static/images/appointment.png",
        },
        {
          text: "报事报修",
          mark: "足不出户享服务",
          colors: "colorRed",
          url: "maintenance",
          src: "/static/images/maintain.png",
        },
        {
          text: "我要缴费",
          mark: "线上缴费超便捷",
          colors: "colorBlue",
          url: "choose-type",
          src: "/static/images/pay-money.png",
        },
      ],
      banners: [
        "/static/images/banner1.jpg",
        "/static/images/banner2.jpg",
        "/static/images/banner3.jpg",
      ],
      service: [
        {
          img: "/static/img/main/78761498124328542.png",
          title: "电子礼品卡",
          mark: "家乐福9折",
        },
        {
          img: "/static/img/main/78761498124328542.png",
          title: "手机维修",
          mark: "手机维修",
        },
        {
          img: "/static/img/main/72581498124372327.png",
          title: "滴滴出行",
          mark: "滴滴出行3.0",
        },
      ],
      list: [
        {
          url: "notice",
          text: "通知公告",
          src: "/static/images/notification.png",
          id: 1,
        },
        {
          url: "maintenance",
          text: "报事报修",
          src: "/static/images/repair.png",
          id: 2,
        },
        {
          url: "complaint",
          text: "业主投诉",
          src: "/static/images/complaint.png",
          id: 3,
        },
        {
          url: "call",
          text: "联系物业",
          src: "/static/images/tenement.png",
          id: 4,
        },
        {
          url: "choose-type",
          text: "物业缴费",
          src: "/static/images/payment.png",
          id: 5,
        },
      ],
      upgradeType: "pkg", //pkg 整包 wgt 升级包
      upgradeContent: "", //更新内容
      upgradeUrl: "", //更新地址
      housekeeprImg: "/static/images/avatar.png",
      housekeeper: "",
      myHouse: {
        ownerInfo: {
          villagename: "",
        },
      },
    };
  },
  methods: {
    // 刷新
    refresh() {
      this.$nextTick(() => {
        this.$refs.pullScroll.refresh();
      });
    },

    // 下拉刷新
    pullDown(pullScroll) {
      this.getData(pullScroll);
    },
    moveHandle() {},
    getNav(url, id) {
      if (url == "appointment") {
        uni.showToast({
          icon: "none",
          title: "功能暂未开放！",
        });
        return;
      }
      if (!url) {
        uni.showToast({
          icon: "none",
          title: "暂无数据...",
        });
        return;
      }
      let data = 0; //报事报修
      if (id === 3) {
        data = 1; //投诉建议
      }
      this.$Router.push({ name: url, params: { id: data } });
    },
    noticeDetail() {
      if (this.noticeList.id) {
        this.$Router.push({
          name: "notice-detail",
          params: { id: this.noticeList.id },
        });
      }
    },
    toHousekeeper() {
      this.$Router.push({
        name: "housekeeper",
        params: { id: this.housekeeper.uid },
      });
    },
    getData(pullScroll) {
      let data = {};
      this.$api.userCenter(data, (res) => {
        this.myHouse = res.data;
        this.$store.commit("setMyHouse", res.data);
        pullScroll.success();
      });
    },
    /*
     * 检测版本升级
     */
    checkVersionClick() {
      // 获取版本信息
      plus.runtime.getProperty(plus.runtime.appid, (widgetInfo) => {
        var platform = uni.getSystemInfoSync().platform;
        let versionCode = widgetInfo.versionCode;
        let data = {
          type: 2,
        };
        if (platform == "android") {
          data.type = 1;
          this.$api.downLoadApp(data, (res) => {
            if (versionCode < res.data.bb_code) {
              this.upgradeType = "pkg";
              this.upgradeContent = "更新了新版本";
              this.upgradeUrl = res.data.download_url;
              this.$refs.yomolUpgrade.show();
            }
          });
        } else {
          this.$api.downLoadApp(data, (res) => {
            if (versionCode < res.data.bb_code) {
              this.upgradeType = "ios";
              this.upgradeContent = "更新了新版本";
              this.upgradeUrl = res.data.download_url;
            }
          });
        }
      });
    },
    getIndex() {
      let data = {};
      this.$api.homeIndex(data, (res) => {
        this.housekeeper = res.data.stewards[0];
        this.noticeList = res.data.circular;
      });
    },
  },
  onShow() {
    if (this.$store.state.login_token) {
      this.$api.userCenter({}, (res) => {
        this.myHouse = res.data;
        this.$store.commit("setMyHouse", res.data);
        this.getIndex();
        //检测更新
      });
    }
    // #ifdef APP-PLUS
    this.checkVersionClick();
    // #endif
  },
  onLoad() {
    //检测是否有登录token
    try {
      const loginToken = uni.getStorageSync("loginToken");
      if (loginToken) {
        this.$store.commit("loginToken", loginToken);
        //首页数据
        // this.getIndex();
      }
      const userInfo = uni.getStorageSync("userInfo");
      if (userInfo) {
        this.$store.commit("setHasLogin", true);
      }
    } catch (e) {
      // error
    }
  },
  computed: {
    // myHouse() {
    // 	return this.$store.state.myHouse;
    // },
    hasBoundHouse() {
      return this.$store.state.hasBoundHouse;
    },
    hasLogin() {
      return this.$store.state.hasLogin;
    },
    message() {
      //接收到推送消息
      if (this.$store.state.pushMessage) {
        //消息提示
        this.showToast = true;
        setTimeout((res) => {
          this.showToast = false;
        }, 5000);

        return "/static/img/message-active.png";
      } else {
        return "/static/img/message.png";
      }
    },
  },
};
</script>

<style>
@import "./index.css";
</style>
