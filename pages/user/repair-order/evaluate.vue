<template>
	<view class="evaluate">
		<view class="uni-flex-center"><text class="uni-font-36 uni-font-bold">报事已完成</text></view>
		<view class="uni-flex-center tip"><text class="color-font-gray">请评价一下为您服务的员工吧</text></view>
		<view class="uni-flex-center">
			<view class="cleanfloat uni-cell-50">
				<i class="iconfont iconsolid-star" v-for="(item, index) in star" :key="index" :class="{ 'iconsolid-star-active': item.active == 1 }" @tap="activeStar(index)"></i>
			</view>
		</view>
		<view class="uni-flex-center">
			<textarea
				placeholder-style="padding:20px;line-height:40upx"
				v-model="content"
				placeholder="请输入您对本次服务的评价或者建议"
				maxlength="140"
				class="text-input-area"
			></textarea>
		</view>
		<view class="btn-wrapper">
			<button type="warn" class="my-btn" @click="sub">提交评价</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			key: '',
			star: [
				{
					active: 1
				},
				{
					active: 1
				},
				{
					active: 1
				},
				{
					active: 1
				},
				{
					active: 1
				}
			],
			content: '',
			id: '',
			label:''
		};
	},
	methods: {
		activeStar(index) {
			for (let i = 0; i < this.star.length; i++) {
				this.star[i].active = 0;
			}
			for (let i = 0; i < index + 1; i++) {
				this.star[i].active = 1;
			}
		},
		sub() {
			let actives = [];
			this.star.forEach(res => {
				if (res.active === 1) {
					actives.push(res);
				}
			});
			let stars = actives.length;
			let text = '感谢您的支持！';
			if (stars <= 3) {
				text = '您确定要给我打这么低的分吗？';
			}
			uni.showModal({
				title: '确定要提交吗？',
				content: text,
				success: res => {
					if (res.confirm) {
						let data = {
							point: stars,
							id: this.id,
							content: this.content,
							label:this.label
						};
						this.$api.evaluate(data, res => {
							this.$Router.back(1)
						});
					}
				}
			});
		}
	},
	onLoad() {
		this.id = this.$Route.query.id;
		this.label = this.$Route.query.label;
	}
};
</script>

<style>
.evaluate {
	min-height: 100vh;
	box-sizing: border-box;
	padding-bottom: 180upx;
}
.tip {
	margin-top: 20upx;
}
.uni-flex-center {
	padding: 0 24upx;
}
.iconfont {
	font-size: 26px;
	margin: 10upx;
}
page {
	background: #ffffff;
}
.cleanfloat {
	display: flex;
	padding: 40upx;
}
.text-input-area {
	width: 100%;
	border: 1upx solid #eeeeee;
	border-radius: 10upx;
	padding: 20upx;
	line-height: 40upx;
	box-sizing: border-box;
}
.btn-wrapper {
	position: fixed;
	bottom: 0;
	left: 0;
	padding: 30upx 24upx 60upx;
	width: 100%;
	box-sizing: border-box;
}
.my-btn {
	color: #fff;
	font-size: 28upx;
	line-height: 40upx;
	padding: 24upx 0;
	background-color: #ec4040;
}
</style>
