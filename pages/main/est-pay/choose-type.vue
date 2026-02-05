<template>
	<view class="wy-car-pay">
		<view class="wy-wrapper">
			<view class="title">物业费用</view>
			<view class="uni-empty" v-if="!datas.room">暂无物业信息！</view>
			<view class="content" v-else>
				<view class="code">房号：{{ datas.room.roomnum ? datas.room.roomnum : '' }}</view>
				<view class="area">面积：{{ datas.room.buildareas ? datas.room.buildareas : '' }}㎡</view>
				<button class="btn" @click="estPay" plain>缴费</button>
			</view>
		</view>
		<view class="car-wrapper">
			<view class="title">车辆费用</view>
			<view class="uni-empty" v-if="!datas.cars || datas.cars.length == 0">暂无车辆信息！</view>
			<view v-else>
				<view class="content" v-for="(item, index) in datas.cars" :key="index">
					<view class="code">车位编号：{{ item.plates ? item.plates : '' }}</view>
					<view class="area">面积：{{ item.area ? item.area : '' }}㎡</view>
					<button class="btn" @click="carPay(item)" plain>缴费</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				datas: {}
			};
		},
		onShow() {
			if (this.$store.state.login_token) {
				this.getData();
			}
		},
		methods: {
			getData() {
				this.$api.userCenter({}, res => {
					this.$store.commit('setMyHouse', res.data);
					this.$api.getDefult({}, res => {
						if (res.code === 1) {
							this.datas = res.data;
							this.$store.commit('setMyRoom', res.data);
						}
					});
				});
			},
			estPay() {
				uni.navigateTo({
					url: '/pages/main/est-pay/est-pay'
				});
			},
			carPay(item) {
				let _this = this;
				let y = item.endtime.slice(0, 4)
				let m = item.endtime.slice(4, 6)
				let d = item.endtime.slice(6, 8)
				let edate = new Date(y + '-' + m + '-' + d + ' 23:59:59').getTime()
				let ndate = new Date().getTime()
				if (!item.openwx) {
					uni.showToast({
						icon: 'none',
						title: '车位紧张，请到物业前台缴费！'
					});
					return
				}
				if (item.resourcesmodel_type == 'carmonth' && (ndate > edate)) {
					uni.showToast({
						icon: 'none',
						title: '月租车辆已过期，请到物业前台缴费！'
					});
					return
				}
				
				if (item.endtime && item.starttime) {
					_this.$store.commit('setChangeCar', item);
					uni.navigateTo({
						url: '/pages/main/car/car-pay'
					});
				} else {
					uni.showToast({
						icon: 'none',
						title: '请到物业中心办理首次登记！'
					});
				}

			}
		}
	};
</script>

<style>
	.wy-car-pay {
		background-color: #fff;
		min-height: 100vh;
	}

	.wy-wrapper {
		padding: 0 24upx;
		border-bottom: 30upx solid #fafafa;
	}

	.car-wrapper {
		padding: 0 24upx;
	}

	.title {
		font-size: 32upx;
		color: #333;
		line-height: 44upx;
		font-weight: 600;
		padding: 30upx 0;
	}

	.content {
		padding: 30upx;
		background-color: #fafafa;
		position: relative;
		margin-bottom: 30upx;
	}

	.code {
		font-size: 30upx;
		line-height: 42upx;
		color: #666;
		margin-bottom: 30upx;
	}

	.area {
		font-size: 30upx;
		line-height: 42upx;
		color: #666;
	}

	.btn {
		position: absolute;
		top: 50%;
		right: 30upx;
		transform: translateY(-50%);
		border-radius: 8upx;
		padding: 10upx 44upx;
		font-size: 28upx;
		line-height: 40upx;
		color: #ffcf5a !important;
		border: 1px solid #ffcf5a !important;
	}

	.btn:active {
		opacity: 0.6;
	}
</style>
