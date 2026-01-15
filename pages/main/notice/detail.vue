<template>
	<view class="detail-wrapper">
		<view class="content" v-if="detail">
			<view class="title">{{detail.name}}</view>
			<rich-text class="text" :nodes="detail.content"></rich-text>
			<view class="time">{{detail.c_time}}</view>
		</view>
		<view v-else class="empty">内容不存在</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				detail: null,
			}
		},
		methods: {
			getCircularInfo(id) {
				this.$api.circularInfo({
					id: id
				}, res => {
					if (res.code === 1 && res.data) {
						this.detail = res.data
					}
				})
			}
		},
		onLoad(options) {
			const id = this.$Route.query.id;
			if (id) {
				this.getCircularInfo(id)
			} else {
				uni.showToast({
					title: '参数错误',
					icon: 'error'
				})
			}
		}
	}
</script>

<style>
	.detail-wrapper {
		min-height: 100vh;
		background-color: #FAFAFA;
		padding: 30upx 24upx;
		box-sizing: border-box;
	}

	.detail-wrapper .content {
		background-color: #fff;
		box-shadow: 0 0 6upx rgba(0, 0, 0, 0.05);
		padding: 0;
		border-radius: 10upx;
	}

	.detail-wrapper .content .title {
		font-size: 30upx;
		line-height: 44upx;
		font-weight: 600;
		color: #333;
		padding: 30upx;
		text-align: center;
		border-bottom: 1px solid #ebebeb;
	}

	.detail-wrapper .content .text {
		padding: 30upx 30upx 0 30upx;
		font-size: 30upx;
		line-height: 42upx;
		text-align: justify;
		color: #333;
	}

	.detail-wrapper .content .time {
		font-size: 26upx;
		color: #666;
		line-height: 36upx;
		padding: 30upx;
		text-align: right;
	}
	.detail-wrapper .empty {
		font-size: 28upx;
		color: #666;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>