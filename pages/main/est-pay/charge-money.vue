<template>
	<view class="charge-money" v-if="accountData">
		<view class="uni-flex-center">
			<view class="uni-cell-90 charge-content" >
				<view style="display: flex;margin: 20upx;">
					<!-- <image v-if="accountData" :src="userInfo.avatarUrl" mode="aspectFit" class="user-header"></image> -->
					<image  :src="defaultImg" mode="aspectFit" class="user-header"></image>
					<text class="user-name">{{accountData.realname }} 的账户</text>
				</view>
				<view class="uni-flex-center">
					<view class="balance">
						<view class="uni-font-64" style="color: #ec4040;">
							<text>￥{{ accountData.balance === null ? '0' : accountData.balance  }}</text>
						</view>
						<view class="color89">账户余额</view>
					</view>
				</view>
			</view>
		</view>
		<view class="uni-flex-center" v-if="show">
			<view class="uni-cell-90 charge-content">
				<view class="uni-input" style="justify-content: space-between;">
					<input type="number" v-model="price" @input="validatyNum" placeholder="请输入充值金额" class="uni-input-row" />
					<text class="color89">元</text>
				</view>
				<view class="uni-flex-btw uni-margin-top-40">
					<view  v-for="(item, index) in nums" :key="index" @click="changeNum(item,index)" class="charge-nums" :class="{ _active: indexs === index }">   {{ item }} 元</view>
				</view>
				<view class="uni-flex-center uni-margin-top-80">
					<view class="balance">
						<view class="uni-font-32 charge-btn" style="color: #ec4040;" @click="payment"><text>充值</text></view>
						<view class="uni-flex-center uni-margin-top-20">
							<view class="color89" style="display: flex;" @click="getNav('charge-explain')">
								<icon type="warn uni-margin-top-20"></icon>
								<view style="padding-left: 10upx;">充值说明</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="uni-flex-center" v-if="show">
			<view class="uni-cell-90 charge-content" @click="getNav('charge-records')">
				<view class="uni-flex-btw uni-cell-lineheight-100">历史记录</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			nums: [200, 500, 800, 1000],
			price: '',
			defaultImg:'/static/images/avatar.png',
			indexs:-1,
			accountData:'',
			show:false
		};
	},
	computed: {
		userInfo() {
			let userInfo = {};
			try {
				userInfo = uni.getStorageSync('userInfo');
				return userInfo;
			} catch (e) {
				// error
			}
			return userInfo;
		}
	},
	onShow(){
		this.getAccountInfo();
	},
	methods: {
		//验证输入框只能输入两位小数
		validatyNum(evt){
			this.price = evt.target.value = (evt.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null;
		},
		getNav(url) {
			this.$store.commit('setAccountData',this.accountData);
			this.$Router.push({ name: url});
		},
		//选择金额
		changeNum(num,index) {
			this.indexs = index;
			this.price = num;
		},
		//获取用户信息
		getAccountInfo(){
		  this.$api.accountInfo({},res =>{
			  this.accountData = res.data
		  })	
		},
		//充值
		payment() {
			if (!this.price) {
				uni.showToast({
					icon: 'none',
					title: '请先填写您要充值的金额'
				});
				return;
			}
			let data={
				money:this.price
			}
			this.$api.advanceCoin(data,res =>{
				let data ={
					sn:res.data.ordernum,
					money:res.data.paymoney
				}
				this.$store.commit('setOrderData',data);
				uni.navigateTo({
					url: '/pages/payment/payment?type=charge'
				});
			})
		}
	}
};
</script>
<style>
.uni-cell-lineheight-100 {
	padding-left: 20upx;
}
.uni-input {
	margin: 20upx;
	display: flex;
	height: 80upx;
	border-bottom: 1upx solid #bbbbbb;
}
.charge-nums {
	border-radius: 50upx;
	background: #efefef;
	line-height: 40upx;
	padding: 10upx 30upx 10upx;
}

._active{
	background: #ec4040;
	color: #FFFFFF;
}
.charge-btn {
	border: 1upx solid #ec4040;
	border-radius: 50upx;
	padding: 0upx 160upx 0upx;
	height: 80upx;
	line-height: 80upx;
}
.uni-input-row {
	line-height: 100upx;
}
.charge-money {
	background: #f7f6fb;
}

.charge-content {
	background: #ffffff;
	margin: 20upx;
}
.charge-content-header {
	text-align: center;
	line-height: 60upx;
}
.user-header {
	height: 80upx;
	width: 80upx;
	border-radius: 50%;
}
.user-name {
	line-height: 80upx;
	padding-left: 20upx;
}
.balance {
	height: 280upx;
	line-height: 300upx;
}
.color89 {
	text-align: center;
	line-height: 100upx;
}
</style>
