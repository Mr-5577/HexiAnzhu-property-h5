<template>
	<view class="my-car">
		<!-- 		<view class="empty" v-if="datas.cars.length == 0">
			<image src="/static/images/fa-mask.png" mode=""></image>
			<view class="tip">当前房产暂无车辆数据</view>
			<button class="btn" plain @click="toMyhouse">更换房产</button>
		</view> -->
		<view class="uni-empty" v-if="datas.cars.length == 0">暂无车辆数据</view>
		<view class="car-wrapper" v-else>
			<view class="car-item" v-for="(item, index) in datas.cars" :key="index">
				<view class="plate">{{ item.plates }}</view>
				<view class="item-wrapper">
					<text class="name">拥有者：</text>
					<text class="value">{{ item.non_owner_name }}</text>
				</view>
				<view class="item-wrapper">
					<text class="name">到期日期：</text>
					<text class="value">{{ item.endtime }}</text>
				</view>
				<view class="btn-wrapper"><view class="btn" @click="toPayment(item)">去缴费</view></view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			datas: ''
		};
	},
	methods: {
		getData() {
			this.$api.getDefult({}, res => {
				this.datas = res.data;
				this.$store.commit('setMyRoom', res.data);
			});
		},
		// 跳转车辆缴费页面
		toPayment(item) {
			if (item.endtime && item.starttime) {
				this.$store.commit('setChangeCar', item);
				uni.navigateTo({
					url: '/pages/main/car/car-pay'
				});
			} else {
				uni.showToast({
					icon: 'none',
					title: '请到物业中心办理首次登记！'
				});
			}
		},
		// 跳转我的房产页面
		toMyhouse() {
			this.$Router.push({ name: 'my-house' });
		}
	},
	onShow() {
		this.getData();
	}
};
</script>

<style lang="scss" scoped>
.my-car {
	min-height: 100vh;
	box-sizing: border-box;
	background-color: #fafafa;
	padding: 30upx 24upx;
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
	.car-wrapper {
		.car-item {
			padding: 30upx;
			background-color: #fff;
			box-shadow: 0 0 6upx rgba(0, 0, 0, 0.05);
			border-radius: 10upx;
			position: relative;
			margin-bottom: 30upx;
			.plate {
				font-size: 32upx;
				color: #333;
				line-height: 44upx;
			}
			.item-wrapper {
				margin-top: 10upx;
				.name,
				.value {
					display: inline-block;
					font-size: 28upx;
					color: #666;
					line-height: 40upx;
				}
			}
			.btn-wrapper {
				position: absolute;
				top: 50%;
				right: 30upx;
				transform: translateY(-50%);
				.btn {
					font-size: 28upx;
					line-height: 40upx;
					padding: 10upx 30upx;
					border-radius: 6upx;
					color: #ffcf5a;
					background-color: #fcf6e5;
					border: 1px solid #ffcf5a;
				}
				.btn:active {
					opacity: 0.7;
				}
			}
		}
		.car-item:last-child {
			margin-bottom: 0;
		}
	}
}
</style>
