<template>
	<view id="my-house">
		<view class="uni-empty" v-if="!hasBoundHouse">请先添加房产</view>
		<view class="house-list">
			<uni-swipe-action class="swipe-action" :options="options2" v-for="(item, index) in lists" :key="index" @click.stop="bindClick(item)">
			<view @click="selectRoom(item)" :class="['address-item', item.roomid === currentHouse.roomid ? 'active' : '']">
				<view class="p-name">{{ item.villageaddr }}—{{ item.villagename }}</view>
				<view class="code">{{ item.roomnum }}</view>
				<view class="radio">
					<radio color="#ec4040" :value="item.id" :checked="item.roomid === currentHouse.roomid" />
				</view>
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
						backgroundColor: '#ec4040'
					}
				}
			],
			// 页面进入时绑定的房产数据
			oldHouse: '',
			// 当前选中的房产数据
			currentHouse: '',
			// 按钮是否禁用
			btnForbidden: false,
		};
	},
	onShow() {
		this.currentHouse = this.$store.state.myHouse.ownerInfo;
		this.oldHouse = this.$store.state.myHouse.ownerInfo;
	},
	methods: {
		// 跳转添加房产页
		toBindHouse() {
			uni.navigateTo({
				url: '/pages/reg/bound-house/bound-house'
			});
		},
		getData() {
			let data = {};
			this.$api.userCenter(data, res => {
				this.$store.commit('setMyHouse', res.data);
			});
		},
		// 房产解绑
		bindClick(item) {
			let _this = this;
			let data = {
				roomid: item.roomid
			};
			// 解绑房产为当前登录房产
			if (item.roomid === this.oldHouse.roomid) {
				uni.showToast({
					icon: 'none',
					title: '解绑房产为当前登录房产，禁止解绑！'
				})
				return false;
			}
			//解绑房产
			this.$api.unbind(data, res => {
				uni.showToast({
					icon: 'none',
					title: '成功解绑房产',
					success() {
						if (_this.currentHouse.roomid === item.roomid ) {
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
				roomid: this.currentHouse.roomid
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
						}, 600)
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
			url: '/pages/reg/bound-house/bound-house'
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
	border-radius: 10upx;
}

.address-item {
	border-radius: 10rpx;
	box-shadow: 0 0 rgba(0, 0, 0, 0.05);
	background-color: #fff;
	padding: 28rpx;
	position: relative;
	border: 1px solid #fff;
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

.address-item.active {
	background-color: rgba(236,62,62, 0.05);
	border: 1px solid #ec4040;
}
.address-item.active .p-name,
.address-item.active .code {
	color: #ec4040;
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
.my-btn1[aria-disabled="true"],
.my-btn2 {
	flex: 1;
	background-color: #ec4040!important;
	color: #fff!important;
	font-size: 28rpx;
	line-height: 40rpx;
	padding: 24rpx 0;
	border-radius: 6rpx;
}
.my-btn1,
.my-btn1[aria-disabled="true"] {
	border: none!important;
}
.my-btn2,
.my-btn2[aria-disabled="true"]{
	margin-left: 30upx;
	background-color: #fff!important;
	color: #ec4040!important;
	border-color: #ec4040!important;
}
.my-btn1:active,
.my-btn2:active {
	opacity: 0.6;
}
.my-btn:after {
	display: none;
}

.add-house {
	position: fixed;
	bottom: 200upx;
	right: 100upx;
	height: 140upx;
	width: 140upx;
	text-align: center;
	line-height: 140upx;
	border-radius: 50%;
	color: #ffffff;
	background: rgba(236,62,62, 0.5);
	z-index: 999;
}
</style>
