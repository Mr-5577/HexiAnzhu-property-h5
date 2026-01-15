<template>
	<view id="notice">
		<view class="notice-item" v-for="(item, index) in list" :key="index" @click="detail(item)">
			<image src="/static/images/message.png" mode="aspectFit"></image>
			<view class="title">{{ item.name }}</view>
			<view class="content">
				<rich-text class="text" :nodes="getPreview(item.content)"></rich-text>
			</view>
			<view class="bot">
				<!-- <text class="jituan">阳光大地物业集团</text> -->
				<text class="time">{{ item.ctime }}</text>
			</view>
		</view>
		<!-- <view class="empty" v-if="list.length == 0">
			<image src="/static/images/inform-mask.png" mode=""></image>
			<view class="tip">当前社区暂无公告通知</view>
			<button class="btn" plain @click="toMyhouse">更换社区</button>
		</view> -->
		<view class="uni-empty" v-if="list.length === 0">暂无通知公告数据</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				list: [],
			};
		},
		onReachBottom: function() {
			// console.log('我触底了要加载数据了: ' + JSON.stringify('我触底了要加载数据了'));
		},
		methods: {
			detail(item) {
				this.$Router.push({
					name: 'notice-detail',
					params: {
						id: item.id
					}
				});
			},
			getList() {
				this.$api.circularList({}, res => {
					if (res.code === 1) {
						this.list = res.data || [];
					}
				});
			},
			// 跳转我的房产页面
			toMyhouse() {
				this.$Router.push({
					name: 'my-house'
				});
			},
			// 获取预览内容
			getPreview(html) {
				if (!html) return ''
				try {
					const text = html
						.replace(/<\/?[^>]+(>|$)/g, ' ') // 清除所有标签（含不完整）
						.replace(/\s+/g, ' ') // 合并多余空格
						.trim() // 去除首尾空格

					return text.length > 300 ? text.substring(0, 300) + '...' : text
				} catch (e) {
					console.error('解析富文本失败:', e)
					return ''
				}
			}
		},
		onLoad() {
			this.getList();
		}
	};
</script>

<style lang="scss">
	#notice {
		min-height: 100vh;
		background-color: #fafafa;
		padding: 30upx 24upx;
		box-sizing: border-box;
	}

	.empty {
		text-align: center;

		image {
			width: 250upx;
			height: 220upx;
			margin-top: 250upx;
		}

		.tip {
			font-size: 32upx;
			line-height: 44upx;
			color: #ccc;
			margin-top: 20upx;
			text-align: center;
		}

		.btn {
			font-size: 28upx;
			color: #fff;
			line-height: 40upx;
			padding: 10upx 44upx !important;
			background-color: #ffcf5a;
			border-radius: 4upx;
			margin-top: 60upx;
			display: inline-block;
			border: none !important;
		}

		.btn:active {
			opacity: 0.8;
		}
	}

	.notice-item {
		background-color: #fff;
		box-shadow: 0 0 8upx rgba(0, 0, 0, 0.05);
		padding: 0 30upx;
		position: relative;
		border-radius: 10upx;
		margin-bottom: 30upx;
	}

	.notice-item image {
		width: 40upx;
		height: 34upx;
		position: absolute;
		top: 36upx;
		left: 32upx;
	}

	.notice-item .title {
		font-size: 30upx;
		color: #333;
		line-height: 44upx;
		padding: 30upx 0 30upx 60upx;
		font-weight: 600;
	}

	.notice-item .content {
		background-color: #fafafa;
		padding: 30upx;
	}

	.notice-item .content .text {
		font-size: 28upx;
		line-height: 40upx;
		color: #999;
		text-align: justify;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 4;
		word-wrap: break-word;
	}

	.notice-item .bot {
		padding: 30upx 0;
		overflow: hidden;
	}

	.notice-item .jituan,
	.notice-item .time {
		font-size: 26upx;
		line-height: 36upx;
		color: #666;
	}

	.notice-item .time {
		float: right;
	}

	.uni-empty {}
</style>