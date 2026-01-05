<template>
	<view id="order-detail">
		<view class="detail-wrapper">
			<view class="money">{{ allMoney }}元</view>
			<view class="text">账单金额（元）</view>
			<view class="content">
				<view class="item">
					<text class="name">订单号</text>
					<text class="code">{{ orderData.sn }}</text>
				</view>
				<view class="item">
					<text class="name">缴费类型</text>
					<text class="code">{{ allType }}</text>
				</view>
				<view class="item">
					<text class="name">创建时间</text>
					<text class="code">{{ timestampToTime(orderData.createtime) }}</text>
				</view>
			</view>
		</view>
		<view class="btn-wrapper">
			<button type="warn" :disabled="disabled" v-if="orderType === 2" @click="payment">去支付</button>
			<button type="warn" :plain="true" :disabled="disabled" v-if="orderType === 2" @click="delOrder">删除订单</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			orderData: {},
			orderType: 1 ,//1已缴费  2未缴费
			allMoney:0,
			allType:'',
			disabled:false
		};
	},
	onShow() {
		this.disabled = false;
	},
	methods: {
		timestampToTime(timestamp) {
			var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
			var Y = date.getFullYear() + '-';
			var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
			var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
			var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
			var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
			var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
			return Y + M + D + h + m + s;
		},
		payment() {
			// let orderInfo ={}
			// uni.showToast({
			// 	icon: 'none',
			// 	title: '支付功能暂未开通！',
			// 	duration: 2000,
			// });
			// return
			let datas={
				sn:this.orderData.sn,
				money:this.allMoney
			}
			this.disabled =true;
			this.$store.commit('setOrderData', datas);
			this.$Router.push({ name: 'payment' });
		},
		delOrder(){
			let _this = this;
			uni.showModal({
				title: '',
				content: '确定要删除该订单吗？',
				confirmText: '删除订单',
				cancelText: '不删除',
				confirmColor: '#ff3b32',
				success(res) {
					if (res.confirm) {
						let data = {
							order_num: _this.orderData.sn
						};
						_this.$api.delOrder(data, res => {
							_this.recordList =[];
							uni.showToast({
								icon: 'none',
								title: '删除订单成功!',
								duration: 2000,
								success() {
									uni.navigateBack({
										delta:1
									})
								}
							});
						});
					} 
				}
			});
		}
	},
	
	onLoad(option) {
		this.orderType = this.$Route.query.type;
		if(this.orderType == 1){
			this.orderData  = JSON.parse(this.$Route.query.data);
			this.allMoney = this.orderData.money;
			this.allType =[]
			if(this.orderData.costWater){
				this.allType.push(this.orderData.costWater[0].table_type)
			}
			if(this.orderData.costEle){
				this.allType.push(this.orderData.costEle[0].table_type)
			}
			if(this.orderData.costWg){
				this.allType.push(this.orderData.costWg[0].table_type)
			}
			if(this.orderData.costCarWg){
				this.allType.push(this.orderData.costCarWg[0].table_type)
			}
			if(this.orderData.costCar){
				this.allType.push(this.orderData.costCar[0].table_type)
			}
			if(this.orderData.balance){
				this.allType.push(this.orderData.balance[0].table_type)
			}
			this.allType  = this.$uitls.toString(this.allType);
			
		}else{
			let datas = JSON.parse(this.$Route.query.data);
			this.orderData  = JSON.parse(this.$Route.query.data)[0];
			this.allMoney = 0;
		    this.allType = [];
			datas.forEach(res =>{
				this.allMoney = this.allMoney + parseFloat(res.money);
				this.allType.push(res.table_type);
			})
			this.allType  = this.$uitls.toString(this.allType);
			this.allMoney = this.allMoney.toFixed(2);
		}
	}
};
</script>

<style lang="scss">
#order-detail {
	min-height: 100vh;
	background-color: #FAFAFA;
	padding: 30upx 24upx;
	box-sizing: border-box;
	.detail-wrapper {
		background-color: #fff;
		box-shadow: 0 0 6upx rgba(0, 0, 0, 0.05);
		padding: 40upx 30upx 60upx;
		border-radius: 10upx;
		.money {
			font-size: 32upx;
			color: #ec4040;
			line-height: 44upx;
			text-align: center;
			font-weight: 600;
		}
		.text {
			font-size: 26upx;
			color: #999;
			line-height: 36upx;
			margin: 30upx 0 40upx;
			text-align: center;
		}
		.content {
			padding: 30upx;
			background-color: #fafafa;
			border-radius: 10upx;
			.item {
				display: flex;
				margin-bottom: 30upx;
				.name {
					font-size: 30upx;
					line-height: 42upx;
					color: #999;
				}
				.code {
					flex: 1;
					font-size: 30upx;
					line-height: 42upx;
					color: #333;
					text-align: right;
				}
			}
			.item:last-child {
				margin-bottom: 0;
			}
		}
	}
	.btn-wrapper {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		padding: 30upx 24upx 60upx;
		box-sizing: border-box;
		button {
			margin-bottom: 30upx;
			padding: 24upx 0;
			font-size: 28upx!important;
			line-height: 40upx!important;
		}
		button:last-child {
			margin-bottom: 0;
		}
	}
}
</style>
