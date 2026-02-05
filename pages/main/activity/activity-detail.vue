<template>
	<view class="detail-wrapper">
		<view class="content" v-if="detail">
			<view class="title">{{ detail.title }}</view>
			<view class="time">幸福和喜 发布日期：{{ detail.publish_time }}</view>
			<rich-text class="text" :nodes="detail.content"></rich-text>
		</view>
		<view v-else class="empty">暂无内容~</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				detail: null,
			};
		},
		computed: {},
		methods: {
			fetchActivityData(id) {
				this.$api.getActivityList({}, (res) => {
					if (res.code === 1) {
						const dataList = res.data || [];
						const targetData = dataList.filter((item) => item.id === id);
						if (targetData) {
							this.detail = targetData;
						}
					}
				});
			},
		},
		onLoad(options) {
			// console.log("options", this.$Route);
            const id = this.$Route.query.id;
			// 从本地存储获取数据
			const detailData = uni.getStorageSync("activityData");
			// 验证数据
			if (detailData && detailData.id == id) {
                this.detail = {...detailData};
			} else {
				// 如果本地数据无效，则重新请求
				this.fetchActivityData(id);
			}
		},
		onUnload() {
			// 离开页面时清理存储
			uni.removeStorageSync("activityData");
		},
	};
</script>

<style>
	.detail-wrapper {
		min-height: 100vh;
		background-color: #fafafa;
		padding: 0 24upx 30upx;
		box-sizing: border-box;
	}

	.detail-wrapper .content {
		background-color: #fff;
		box-shadow: 0 0 6upx rgba(0, 0, 0, 0.05);
		padding: 0 20upx;
		border-radius: 10upx;
		box-sizing: border-box;
	}

	.detail-wrapper .content .title {
		font-size: 30upx;
		line-height: 44upx;
		color: #333;
        margin: 20upx 0;
        font-weight: bold;
	}
    .detail-wrapper .content .time {
        font-size: 28upx;
        color: #666;
        line-height: 36upx;
        margin: 20upx 0;
    }

	.detail-wrapper .content .text {
		font-size: 30upx;
		line-height: 42upx;
		color: #333;
        margin: 20upx 0;
	}


	.detail-wrapper .empty {
		font-size: 28upx;
		color: #666;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>