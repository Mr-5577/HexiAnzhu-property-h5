<template>
	<view class="uni-padding-wrap">
		<view>
			<view style="background:#FFF; padding:50upx 0;border-radius: 10upx;">
				<view class="uni-hello-text uni-center">支付金额</view>
				<view class="uni-h1 uni-center uni-common-mt">
					<text class="rmbLogo">￥</text>
					<input class="price" type="number" :value="orderInfo.money" maxlength="10" disabled="true" />
				</view>
			</view>
		</view>
		<view class="pay-type">请选择支付方式</view>
		<!-- 支付方式选择部分 -->
		<view class="type-select">
		<view class="payment-content" v-if="type == '1'">
			<view class="payment-content-cell" style="justify-content: space-between;" v-if="payData.wechatPay || payData.aliPay" @click="toBalance" >
				<template >
					<view class="payment-content-cell" style="border: none;">
						<image src="/static/images/balance.png" mode="aspectFit" class="pay-icon"></image>
						<view class="uni-cell-lineheight-80" :class="{ 'uni-text-gray': payData.balance < orderInfo.money }" :loading="item.loading">当前余额 ： {{payData.balance}}</view>
						<view class="uni-cell-lineheight-80 uni-text-gray" v-if="payData.balance < orderInfo.money">
							(余额不足)
						</view>
					</view>
					<view class="uni-cell-lineheight-80" v-if="payData.balance > orderInfo.money || payData.balance == orderInfo.money " style="margin: 10upx;" >
					   余额支付
					</view>
				</template>
			</view>
		</view>
		<view class="payment-content">
			<view class="payment-content-cell" :class="{'po-event-none' : disabled == true}" v-for="(item, index) in providerList" v-if="(item.id == 'wxpay' &&  payData.wechatPay == true) || (item.id == 'alipay' &&  payData.aliPay == true)"  :key="index" @click="requestPayment(item, index)" >
				
				<!-- #ifdef APP-PLUS -->
				<template >
					<image :src="'/static/images/' + item.id + '.png'" mode="aspectFit" class="pay-icon"></image>
					<view class="uni-cell-lineheight-80" :loading="item.loading">{{ item.name }}</view>
				</template>
			
				<!-- #endif -->
				
				<!-- #ifdef MP-WEIXIN -->
				<image :src="'/static/images/' + item.id + '.png'" mode="aspectFit" class="pay-icon"></image>
				<view class="uni-cell-lineheight-80" :loading="item.loading">{{ item.name }}</view>
				<!-- #endif -->
				
				
			</view>
		</view>
		</view>
	</view>
</template>
<script>
export default {
	data() {
		return {
			loading: false,
			providerList: [],
			payData:'',
			type:'',
			disabled:false
		};
	},
	computed: {
		orderInfo() {
			return this.$store.state.orderData;
		}
	},
	onShow() {
		this.disabled = false
	},
	onLoad(option) {
		this.type='';
		if(option.type){
			this.type = option.type;
		}else{
			this.type = '1'
		}
		uni.getProvider({
			service: 'payment',
			success: e => {
				let providerList = [];
				e.provider.map(value => {
					switch (value) {
						case 'alipay':
							providerList.push({
								name: '支付宝',
								id: value,
								loading: false
							});
							break;
						case 'wxpay':
							providerList.push({
								name: '微信',
								id: value,
								loading: false
							});
							break;
						default:
							break;
					}
				});
				this.providerList = providerList;
			},
			fail: e => {}
		});
		
		this.$api.checkpayway({},res =>{
			this.payData = res.data;
		})
		
		
	},
	
	methods: {
		toBalance(){
			if(this.payData.balance > this.orderInfo.money || this.payData.balance == this.orderInfo.money){
				let data ={
					sn: this.orderInfo.sn,
					total_fee: this.orderInfo.money
				}
				uni.showLoading({
					title:'正在使用余额支付'
				})
				this.$api.balance(data,res =>{
					setTimeout(res =>{
						uni.hideLoading();
						uni.navigateBack({
							delta:2
						})
					},1500)
				})
			}
		},
		async requestPayment(e, index) {
			this.disabled = true;
			uni.showLoading({
				title:'正在发起支付...'
			})
			let orderInfo = await this.getOrderInfo(e.id);

			if (orderInfo.code !== 1) {
				uni.showModal({
					content: '获得订单信息失败',
					showCancel: false
				});
				uni.hideLoading();
				return;
			}
			// #ifdef APP-PLUS
			let orderInfos = orderInfo.data;
			if (e.id === 'alipay') {
				 orderInfos = orderInfo.data;
			}
			uni.requestPayment({
				provider: e.id,
				orderInfo: orderInfos,
				success: e => {
					uni.showToast({
						title: '感谢您的使用!',
						success() {
							uni.navigateBack({
								delta: 2
							});
						}
					});
				},
				fail: e => {
					this.disabled = false;
					uni.showModal({
						content: '支付失败',
						showCancel: false
					});
				},
				complete: () => {
					this.providerList[index].loading = false;
				}
			});
			// #endif
			uni.hideLoading();
			// #ifdef MP-WEIXIN
			uni.requestPayment({
				timeStamp: orderInfo.data.timeStamp,
				nonceStr: orderInfo.data.nonceStr,
				package: orderInfo.data.package,
				signType: 'MD5',
				paySign: orderInfo.data.paySign,
				success: e => {
					uni.showToast({
						title: '感谢您的使用!',
						success() {
							uni.navigateBack({
								delta: 2
							});
						}
					});
				},
				fail: e => {
					uni.showModal({
						content: '支付失败',
						showCancel: false
					});
					this.disabled = false;
				},
				complete: () => {
					this.providerList[index].loading = false;
				}
			});

			// #endif
			
		},

		getOrderInfo(id) {
			let _this = this;
			// 实际的支付
			let data = {
				sn: this.orderInfo.sn,
				total_fee: this.orderInfo.money
			};
			return new Promise(res => {
				// #ifdef APP-PLUS
				if(id == 'alipay'){
					_this.$api.aliPay(data, resp => {
						uni.hideLoading();
						res(resp);
					});
				}else{
					_this.$api.payMent(data, resp => {
						uni.hideLoading();
						res(resp);
					});
				}
				
				// #endif
				// #ifdef MP-WEIXIN
				_this.$api.payMentXcx(data, resp => {
					uni.hideLoading();
					res(resp);
				});
				// #endif
			});
		}
	}
};
</script>
<style>
@import './payment.css';
</style>
