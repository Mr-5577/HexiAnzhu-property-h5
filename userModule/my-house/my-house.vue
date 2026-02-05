<template>
	<view id="my-house">
		<view class="uni-empty" v-if="!hasBoundHouse">请先添加房产</view>
		<view class="house-list">
			<uni-swipe-action
				:class="['swipe-action', item.roomid === currentHouse.roomid ? 'active' : '']"
				:options="options2"
				v-for="(item, index) in lists"
				:key="index"
				@click.stop="bindClick(item)"
			>
				<view @click="selectRoom(item)" class="address-item">
					<view class="p-name">{{ item.villageaddr }}—{{ item.villagename }}</view>
					<view class="code">{{ item.roomnum }}</view>
					<view class="radio"><radio color="#ffcf5a" :value="item.id" :checked="item.roomid === currentHouse.roomid" /></view>
				</view>
			</uni-swipe-action>
		</view>

		<view class="btn-content">
			<button :disabled="btnForbidden" plain @click="changeRoom" class="my-btn1">切换房产</button>
			<button :disabled="btnForbidden" plain @click="toBindHouse" class="my-btn2">添加房产</button>
		</view>
	</view>
</template>

<script>
import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue';
export default {
	components: {
		uniSwipeAction
	},
	data() {
		return {
			options2: [
				{
					text: '解绑房产',
					style: {
						backgroundColor: '#ffcf5a'
					}
				}
			],
			// 页面进入时绑定的房产数据
			oldHouse: '',
			// 当前选中的房产数据
			currentHouse: '',
			// 按钮是否禁用
			btnForbidden: false
		};
	},
	onShow() {
		if (this.$store.state.login_token) {
			this.currentHouse = this.$store.state.myHouse.ownerInfo;
			this.oldHouse = this.$store.state.myHouse.ownerInfo;
		}
	},
	methods: {
		// 跳转添加房产页
		toBindHouse() {
			if (!this.$store.state.login_token) {
				uni.showModal({
					title: '提示',
					content: '此功能需要验证您的身份，登录后可查看房产具体信息。是否前往登录？',
					cancelColor: '#898989',
					cancelText: '取消',
					confirmColor: '#fe845e',
					confirmText: '去登录',
					success(res) {
						if (res.confirm) {
							uni.navigateTo({
								url: '/pages/login/login'
							})
						}
					}
				});
				return
			}
			uni.navigateTo({
				url: '/userModule/bound-house/bound-house'
			});
		},
		getData() {
			let data = {
				village_id: this.currentHouse.vid ? this.currentHouse.vid : this.currentHouse.vvid ? this.currentHouse.vvid : 0
			};
			this.$api.userCenter(data, res => {
				this.$store.commit('setMyHouse', res.data);
			});
		},

		// 房产解绑
		bindClick(item) {
			let _this = this;
			let data = {
				roomid: item.roomid,
				village_id: item.vid
			};
			// 解绑房产为当前登录房产
			if (item.roomid === this.oldHouse.roomid) {
				uni.showToast({
					icon: 'none',
					title: '解绑房产为当前登录房产，禁止解绑！'
				});
				return false;
			}
			//解绑房产
			this.$api.unbind(data, res => {
				uni.showToast({
					icon: 'none',
					title: '成功解绑房产',
					success() {
						if (_this.currentHouse.roomid === item.roomid) {
							_this.currentHouse = _this.oldHouse;
						}
						_this.getData();
					}
				});
			});
		},

		// 选择房产处理
		selectRoom(item) {
			if (item.roomid != this.currentHouse.roomid) {
				this.currentHouse = item;
			}
		},
		// 切换房源
		changeRoom() {
			if (!this.$store.state.login_token) {
				uni.showModal({
					title: '提示',
					content: '此功能需要验证您的身份，登录后可查看房产具体信息。是否前往登录？',
					cancelColor: '#898989',
					cancelText: '取消',
					confirmColor: '#fe845e',
					confirmText: '去登录',
					success(res) {
						if (res.confirm) {
							uni.navigateTo({
								url: '/pages/login/login'
							})
						}
					}
				});
				return
			}
			let _this = this;
			//如果当前房产和点击是同一个 不执行切换操作
			if (this.currentHouse.roomid === this.oldHouse.roomid) {
				uni.navigateBack({
					delta: 1
				});
				return;
			}
			this.btnForbidden = true;
			let data = {
				roomid: this.currentHouse.roomid,
				village_id: this.currentHouse.vid
			};
			//切换房产
			this.$api.changeRoom(data, res => {
				uni.showToast({
					icon: 'none',
					title: '房产切换成功',
					success() {
						// 设置当前房产
						_this.getData();
						setTimeout(() => {
							_this.btnForbidden = true;
							// 返回上一页
							uni.navigateBack({
								delta: 1
							});
						}, 600);
					}
				});
			});
		}
	},
	computed: {
		lists() {
			return this.$store.state.myHouse.allRooms;
		},
		myHouse() {
			return this.$store.state.myHouse;
		},
		hasBoundHouse() {
			return this.$store.state.hasBoundHouse;
		}
	},
	// #ifdef APP-PLUS
	onNavigationBarButtonTap(res) {
		uni.navigateTo({
			url: '/userModule/bound-house/bound-house'
		});
	}
	// #endif
};
</script>

<style>
#my-house {
	font-family: 'PingFang SC';
	min-height: 100vh;
	/* #ifdef H5 */
	min-height: calc(100vh - 88rpx);
	/* #endif */
	background-color: #fafafa;
	padding: 0 24rpx 240rpx;
	box-sizing: border-box;
	overflow: hidden;
}

.uni-swipe_content {
	margin-top: 30upx;
	box-shadow: 0 0 rgba(0, 0, 0, 0.05);
	border-radius: 10rpx;
}
.swipe-action.active .address-item {
	background-color: #fcf6e5;
	border: 1px solid #ffcf5a;
}
.swipe-action.active .p-name,
.swipe-action.active .code {
	color: #ffcf5a;
}
.address-item {
	padding: 28rpx;
	position: relative;
	border: 1px solid #fff;
	background-color: #fff;
	border-radius: 10upx;
	overflow: hidden;
}
.address-item .p-name {
	font-size: 32rpx;
	line-height: 44rpx;
	color: #333;
	font-weight: 600;
	margin-bottom: 10rpx;
}
.address-item .code {
	font-size: 28rpx;
	line-height: 40rpx;
	color: #666;
}
.address-item .radio {
	position: absolute;
	top: 50%;
	right: 30rpx;
	transform: translateY(-50%);
}
/* #ifdef MP-WEIXIN */
.address-item .radio > radio {
	transform: scale(0.8);
}
/* #endif */

.uni-radio-input {
	width: 36rpx;
	height: 36rpx;
	margin-right: 0;
}
.btn-content {
	position: fixed;
	bottom: 0;
	left: 0;
	z-index: 1000;
	width: 100%;
	box-sizing: border-box;
	padding: 40rpx 24rpx 100rpx;
	background-color: #fafafa;
	display: flex;
}
.my-btn1,
.my-btn2 {
	flex: 1;
	background-color: #ffcf5a !important;
	color: #fff !important;
	font-size: 28rpx;
	line-height: 40rpx;
	padding: 24rpx 0;
	border-radius: 6rpx;
	border: none !important;
}
.my-btn2 {
	margin-left: 30upx;
	background-color: #fff !important;
	color: #ffcf5a !important;
	border: 1px solid #ffcf5a !important;
}
.my-btn1:after,
.my-btn2:after {
	display: none;
}
.my-btn1:active,
.my-btn2:active {
	opacity: 0.8;
}
</style>
