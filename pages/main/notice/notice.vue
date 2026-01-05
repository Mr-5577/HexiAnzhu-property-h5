<template>
	<view id="notice">
		<view class="notice-item" v-for="(item, index) in list" :key="index" @click="detail(item)">
			<image src="/static/images/message.png" mode="aspectFit"></image>
			<view class="title">{{ item.name }}</view>
			<view class="content">
				<rich-text class="text" :nodes="item.content"></rich-text>
			</view>
			<view class="bot">
				<!-- <text class="jituan">和喜安筑物业有限公司</text> -->
				<text class="time">{{ item.ctime }}</text>
			</view>
		</view>
		<view class="uni-empty" v-if="list.length === 0">暂无通知公告数据</view>
	</view>
</template>
<script>
export default {
	data() {
		return {
			list: [],
			page: 1,
			limit: 10000
		};
	},
	onReachBottom: function() {
		// console.log('我触底了要加载数据了: ' + JSON.stringify('我触底了要加载数据了'));
	},
	methods: {
		detail(item) {
			this.$Router.push({ name: 'notice-detail', params: { id: item.id } });
		},
		getList() {
			let data = {
				page: this.page,
				limit: this.limit
			};
			this.$api.circularList(data, res => {
				this.list = res.data;
				this.list.forEach(res => {
					if (res.content.length > 300) {
						res.content = res.content.substring(0, 300);
					}
				});
			});
		}
	},
	onLoad() {
		this.getList();
	}
};
</script>

<style>
#notice {
	min-height: 100vh;
	background-color: #fafafa;
	padding: 30upx 24upx;
	box-sizing: border-box;
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
	width: 70upx;
	height: 64upx;
	position: absolute;
	top: 28upx;
	left: 20upx;
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
	overflow:hidden; 
	text-overflow:ellipsis;
	display:-webkit-box;
	-webkit-box-orient:vertical;
	-webkit-line-clamp:4;
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
.uni-empty {
}
</style>
