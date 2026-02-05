<template>
    <view class="webview-container">
        <web-view v-if="webViewUrl" :src="webViewUrl"></web-view>
        <view v-else class="loading-container">
            <text>加载中...</text>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            webViewUrl: ''
        }
    },
    onLoad(options) {
        console.log('接收到的参数:', options)
        if (options && options.url) {
            this.webViewUrl = decodeURIComponent(options.url)
        }
    }
}
</script>

<style scoped>
.webview-container {
    width: 100%;
    height: 100vh;
}

.loading-container {
    display: flex;
    justify-content: center;
    height: 100vh;
    color: #999;
    font-size: 32upx;
}
</style>