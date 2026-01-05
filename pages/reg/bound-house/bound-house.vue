<template>
	<view class="bound-house">
		<view class="build_content">
			<view class="uni-flex-center">
				<view class="change-build uni-cell-90" @tap="changeCity">
					<text class="uni-cell-30">选择城市</text>
					<input class="uni-cell-70" disabled="true" v-model="city.villageaddr" />
				</view>
			</view>
			<view class="uni-flex-center">
				<view class="change-build uni-cell-90" @tap="changeHouse">
					<text class="uni-cell-30">选择楼盘</text>
					<input class="uni-cell-70" disabled="true" v-model="village.villagename" />
				</view>
			</view>
			<view class="uni-flex-center">
				<view class="change-build uni-cell-90" @tap="changeTower">
					<text class="uni-cell-30">选择楼栋</text>
					<input class="uni-cell-70" disabled="true" v-model="tower.block" />
				</view>
			</view>
			<view class="uni-flex-center">
				<view class="change-build uni-cell-90" @tap="changeUnit">
					<text class="uni-cell-30">选择单元</text>
					<input class="uni-cell-70" disabled="true" v-model="unit.unit" />
				</view>
			</view>
			<view class="uni-flex-center last-list">
				<view class="change-build uni-cell-90" @tap="changeRoom">
					<text class="uni-cell-30">选择房号</text>
					<input class="uni-cell-70" disabled="true" v-model="room.roomnum" />
				</view>
			</view>

			<view class="information">
				<view class="title">业主姓名</view>
				<catLabel dataType="text" placeholder="请输入姓名" />
				<view class="title t2">证件号</view>
				<catLabel dataType="text" placeholder="请输入业主证件号（必填）" v-model="idcard" :maxlength="18" />
			</view>
		</view>

		<view class="color-font-gray">为了保障本社区内的住户能够享受高品质的服务，请提供您的真实有效信息以供物业中心进行验证</view>
		<view class="foot">
			<button class="foot-btn" :disabled="disabledBtn" @click="submit">提交认证</button>
		</view>
	</view>
</template>

<script>
import catLabel from '@/components/cat-label/cat-label.vue';
export default {
	components: {
		catLabel
	},
	data() {
		return {
			disabled: true,
			idcard: '',
			selectTowerList: [],
			disabledBtn: true
		};
	},
	computed: {
		city() {
			return this.$store.state.city;
		},
		village() {
			return this.$store.state.village;
		},
		tower() {
			return this.$store.state.tower;
		},
		unit() {
			return this.$store.state.unit;
		},
		room() {
			return this.$store.state.room;
		}
	},
	onShow() {
		if (this.$store.state.room.id) {
			this.disabledBtn = false;
		}
		if (!this.$store.state.room) {
			this.disabledBtn = true;
		}
	},
	methods: {
		changeCity() {
			this.$Router.push({ name: 'add-city' });
			if (!this.$store.state.room) {
				this.disabledBtn = true;
			}
		},
		changeHouse() {
			if (!this.$store.state.city.id && this.$store.state.city.id !== 0) {
				uni.showToast({
					icon: 'none',
					title: '请先选择城市'
				});
				return;
			}
			if (!this.$store.state.room.id) {
				this.disabledBtn = true;
			}
			this.$Router.push({ name: 'add-project', params: { data: this.$store.state.city.id } });
		},
		changeTower() {
			if (!this.$store.state.room.id) {
				this.disabledBtn = true;
			}
			if (!this.$store.state.city.id) {
				uni.showToast({
					icon: 'none',
					title: '请先选择城市'
				});
				return;
			}
			if (!this.$store.state.village.id) {
				uni.showToast({
					icon: 'none',
					title: '请先选择楼盘'
				});
				return;
			}
			this.$Router.push({ name: 'add-tower', params: { data: this.$store.state.village.id } });
		},
		changeUnit() {
			if (!this.$store.state.room.id) {
				this.disabledBtn = true;
			}
			if (!this.$store.state.village.id) {
				uni.showToast({
					icon: 'none',
					title: '请先选择楼盘'
				});
				return;
			}
			if (!this.$store.state.tower.id) {
				uni.showToast({
					icon: 'none',
					title: '请先选择楼栋'
				});
				return;
			}
			this.$Router.push({ name: 'add-unit', params: { data: this.$store.state.tower.id } });
		},
		changeRoom() {
			if (!this.$store.state.room.id) {
				this.disabledBtn = true;
			}
			if (!this.$store.state.village.id) {
				uni.showToast({
					icon: 'none',
					title: '请先选择楼盘'
				});
				return;
			}
			if (!this.$store.state.tower.id) {
				uni.showToast({
					icon: 'none',
					title: '请先选择楼栋'
				});
				return;
			}
			if (!this.$store.state.unit.id) {
				uni.showToast({
					icon: 'none',
					title: '请先选择单元'
				});
				return;
			}
			this.$Router.push({ name: 'add-room', params: { data: this.$store.state.unit.id } });
		},
		submit() {
			let data = {
				login_token: this.$store.state.login_token, //登录令牌
				idcard: this.idcard, //		身份证号
				vid: this.village.id, //		项目id
				bid: this.tower.id, //		楼栋id
				unit: this.unit.id, //		单元id
				roomid: this.room.id //房间号
			};
			if (!this.idcard) {
				uni.showToast({
					icon: 'none',
					title: '请输入身份证号码'
				});
				return;
			}
			if (!this.$uitls.isIdCard(this.idcard)) {
				uni.showToast({
					icon: 'none',
					title: '请输入正确的身份证号码'
				});
				return;
			}
			this.$api.bind(data, res => {
				this.$store.commit('bindHouse', res.data);
				uni.navigateBack({
					delta: 2
				});
			});
		}
	}
};
</script>

<style lang="scss">
.bound-house {
	min-height: 100vh;
	background-color: #fff;
	padding-bottom: 160upx;
}
.build_content {
	width: 100%;
	background: #ffffff;
}
.uni-flex-center {
}
.change-build {
	display: flex;
	height: 120upx;
	border-bottom: 2upx solid #ebebeb;
	line-height: 120upx;
	font-size: 30upx;
	color: #333;
	font-weight: 600;
	input {
		height: 120upx;
		line-height: 120upx;
	}
}
.last-list {
	border-bottom: 30upx solid #ebebeb;
}
.last-list .change-build {
	border-bottom: none;
}
.cat-label .container {
	padding: 20upx 36upx !important;
}
.cat-label .container > .text {
	display: none;
}
.cat-label .container input {
	padding: 0 10upx;
}
.information {
	margin-top: 40upx;
}
.information .title {
	font-size: 30upx;
	color: #333;
	font-weight: 600;
	line-height: 44upx;
	width: 90%;
	margin: 0 auto 20upx;
}
.information .title.t2 {
	margin-top: 60upx;
}
.color-font-gray {
	padding: 30upx;
	color: #ec4040;
	font-size: 24upx;
	line-height: 34upx;
}
.foot {
	padding: 40upx 0 60upx;
	position: fixed;
	bottom: 0;
	left: 0;
	z-index: 100;
	background-color: #fff;
	width: 100%;
}
.foot-btn {
	width: 92%;
	background-color: #ec4040!important;
	color: #fff!important;
	font-size: 28upx;
	line-height: 40upx;
	border-radius: 8upx;
	border: none!important;
	padding: 24upx 0;
}
.foot-btn:active {
	opacity: 0.6;
}
</style>
