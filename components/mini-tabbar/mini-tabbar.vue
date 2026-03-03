<!-- 自定义tabbar -->
<template>
  <view class="mini-tabbar" :style="tabbarStyle">
    <view v-for="(item, index) in computedTabList" :key="index" class="tab-item"
      :class="{ active: currentIndex === index }" @tap="handleTabClick(index, item)">
      <!-- 图标 -->
      <image :src="currentIndex === index ? item.selectedIcon : item.icon" class="tab-icon" />

      <!-- 徽章 -->
      <!-- <view v-if="item.badge > 0" class="tab-badge">
        <text class="badge-text">{{
          item.badge > 99 ? "99+" : item.badge
        }}</text>
      </view> -->

      <text class="tab-text">{{ item.text }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: "MiniTabbar",
  props: {
    // 当前激活的索引
    activeIndex: {
      type: Number,
      default: 0,
    },
    // 自定义列表（可选）
    list: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      currentIndex: this.activeIndex,
      defaultTabList: [
        {
          pagePath: "/pages/main/index/index",
          text: "首页",
          icon: "/static/img/tabBar/home.png",
          selectedIcon: "/static/img/tabBar/home-active.png",
          badge: 0,
        },
        {
          pagePath: "/pages/user/center/center",
          text: "我的",
          icon: "/static/img/tabBar/mine.png",
          selectedIcon: "/static/img/tabBar/mine-active.png",
          badge: 0,
        },
      ]
    };
  },
  computed: {
    computedTabList() {
      return this.list && this.list.length > 0 ? this.list : this.defaultTabList;
    },
    // 安全区域适配
    tabbarStyle() {
      let style = {};
      // 判断是否是iPhone X及以上机型，需要底部安全区域
      const systemInfo = uni.getSystemInfoSync();
      if (systemInfo.model && systemInfo.model.indexOf("iPhone X") !== -1) {
        style.paddingBottom = "env(safe-area-inset-bottom)";
      }
      return style;
    },
  },
  watch: {
    // 监听activeIndex变化
    activeIndex(newVal) {
      this.currentIndex = newVal;
    },
  },
  methods: {
    // 点击处理函数（内部完成路由跳转）
    handleTabClick(index, item) {
      if (this.currentIndex === index) return; // 已经是当前页，不处理

      // 使用 uni.switchTab 跳转，保持tab页栈
      uni.switchTab({
        url: item.pagePath
      });
    },
  },
  // 生命周期
  created() { },
};
</script>

<style scoped>
.mini-tabbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100upx;
  display: flex;
  flex-direction: row;
  z-index: 999;
  background: linear-gradient(to bottom, #fedbd5, #fff5f3);
  box-shadow: 0 -4upx 20upx rgba(254, 219, 213, 0.3);
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  padding: 10upx 0;
}

/* 图标 */
.tab-icon {
  width: 44upx;
  height: 44upx;
  display: block;
  margin-bottom: 6upx;
  transition: transform 0.2s ease;
}

/* 激活状态图标动画 */
.tab-item.active .tab-icon {
  transform: translateY(-4upx);
}

/* 文字 */
.tab-text {
  font-size: 22upx;
  color: #666;
  line-height: 1.2;
  font-weight: 400;
}

/* 激活状态文字 */
.tab-item.active .tab-text {
  color: #ff6b6b;
  font-weight: 500;
}

/* 徽章样式 */
.tab-badge {
  position: absolute;
  top: 6upx;
  right: calc(50% - 40upx);
  min-width: 32upx;
  height: 32upx;
  background: #ff4444;
  border-radius: 16upx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8upx;
  border: 2upx solid #fff;
  animation: badgeBounce 0.3s ease;
  z-index: 2;
}

@keyframes badgeBounce {
  0% {
    transform: scale(0);
  }

  70% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}

.badge-text {
  color: white;
  font-size: 20upx;
  font-weight: bold;
  line-height: 1;
}

/* 点击反馈效果 */
.tab-item:active {
  opacity: 0.7;
  transform: scale(0.98);
}

/* 安全区域适配 */
.mini-tabbar {
  padding-bottom: 0;
}

/* 适配iPhone X及以上机型的底部安全区域 */
/* @supports (padding-bottom: env(safe-area-inset-bottom)) {
  .mini-tabbar {
    padding-bottom: env(safe-area-inset-bottom);
  }
} */
</style>
