<template>
	<view class="est-pay"  v-if="roomsMaterial">
		<view class="est-name uni-ellipsis">{{ myRoom.room.roomnum }}</view>
		<view class="uni-flex-center">
			<view class="uni-cell-95 est-content uni-flex-center" style="padding-bottom: 30upx;">
				<view v-if="roomsMaterial.summoney">
					<view class="uni-font-64 uni-text-center" style="color: #ec3e3e;">¥{{ roomsMaterial.summoney }}</view>
					<view class="color-font-gray uni-text-center" style="margin-bottom: 20upx">待缴金额</view>
					<button class="jf-btn" type="warn" plain @click="toPay" :disabled="disabled">立即缴费</button>
				</view>
				<view v-else>
					<view class="uni-flex-center"><image src="/static/images/jqing.png" mode="aspectFit" class="est-img"></image></view>
					<view class="clear-bill" style="margin-bottom: 20upx">账单已经缴清啦~</view>
					<button class="jf-btn" type="warn" plain @click="toPay" :class="{'po-event-none':disabled ==true}" :disabled="disabled">立即预缴</button>
				</view>
			</view>
		</view>

		<view class="uni-flex-center">
			<view class="uni-cell-95 est-content">
				<view class="uni-flex-btw" style="margin: 20upx 0;">
					<view class="uni-cell-50 uni-flex-btw icon-wra" @click="getNav('main/est-pay/charge-money')">
						<image src="/static/images/bill.png" mode="aspectFit" class="est-balance"></image>
						<text class="est-balance-text">余额</text>
						<text class="line"></text>
					</view>
					<view class="uni-cell-50 uni-flex-btw icon-wra" @click="invoice">
						<image src="/static/images/fapiao.png" mode="aspectFit" class="est-balance"></image>
						<text class="est-balance-text">电子发票</text>
					</view>
				</view>
			</view>
		</view>
		<view class="uni-flex-center">
			<view class="uni-cell-95 uni-flex-btw" style="margin: 20upx;">
				<view class="est-title uni-font-28 uni-font-bold">本月账单</view>
				<view class="more-bill uni-font-28 uni-font-bold" @click="toMoreBill">更多账单 ></view>
			</view>
		</view>

		<view class="uni-flex-center">
			<view class="uni-cell-95 est-content" style="padding: 30upx 0 30upx;">
				<view class="uni-flex-btw est-content-header" v-if="roomsMaterial">
					<view class="uni-cell-40 ">
						<view class="uni-font-32 uni-font-bold">{{ nowMonth }}</view>
						<view class="color89">账单月</view>
					</view>
					<view class="uni-cell-20">
						<view class="uni-font-32 uni-font-bold">{{ parseFloat(allPrice) }}</view>
						<view class="color89">总金额</view>
					</view>
					<view class="uni-cell-30">
						<view class="uni-font-32 uni-font-bold">{{ parseFloat(dealPrice) }}</view>
						<view class="color89" >待缴费</view>
					</view>
				</view>
				<view class="user-list">
					<view class="user-list-cell" v-for="(item, index) in roomOrderDetail" :key="index" v-if="item.room_wg" @click="billTypeDetail(item.room_wg[0])">
						<view class="uni-flex-center uni-cell-100">
							<view class="uni-cell-100" style="display: flex;">
								<view class="uni-cell-75">
									<template>
										{{ item.room_wg[0].table_type }}
									</template>
								</view>
								<view class="uni-cell-20">
									<text>{{ item.room_wg[0].allmoney }}</text>
								</view>
							</view>
						</view>
					</view>
					<view class="user-list-cell" v-for="(item, index) in roomOrderDetail" v-if="item.room_water" :key="index" @click="billTypeDetail(item.room_water[0])">
						<view class="uni-flex-center uni-cell-100">
							<view class="uni-cell-100" style="display: flex;">
								<view class="uni-cell-75">
									<template>
										{{ item.room_water[0].table_type }}
									</template>
								</view>
								<view class="uni-cell-20">
									<text>{{ item.room_water[0].allmoney }}</text>
								</view>
							</view>
						</view>
					</view>
					<view class="user-list-cell" v-for="(item, index) in roomOrderDetail" v-if="item.room_ele" :key="index" @click="billTypeDetail(item.room_ele[0])">
						<view class="uni-flex-center uni-cell-100">
							<view class="uni-cell-100" style="display: flex;">
								<view class="uni-cell-75">
									<template>
										{{ item.room_ele[0].table_type }}
									</template>
								</view>
								<view class="uni-cell-20">
									<text>{{ item.room_ele[0].allmoney }}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="uni-flex-center">
			<view class="uni-cell-95 uni-flex-btw"><view class="est-title uni-font-28 uni-font-bold">*点击费用项可查看费用更多详情</view></view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			disabled:false,
			payMoney: true, //是否有缴费
			roomsMaterial: '',
			roomOrderDetail: '',
			allPrice: 0, //总金额
			dealPrice: 0 //待缴金额
		};
	},
	computed: {
		myRoom() {
			return this.$store.state.myRoom;
		},
		nowMonth() {
			var date = new Date();
			var Y = date.getFullYear();
			var M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
			return Y + '' + M;
		}
	},
	onShow() {
		this.disabled = false;
	},
	methods: {
		invoice() {
			this.$Router.push({ name: 'electronic_invoice' });
		},
		toMoreBill() {
			let data ={
				type:2,
				id:this.myRoom.roomid
			}
			this.$Router.push({ name: 'more-bill', params: data });
		},
		pay(money, url) {
			if (money == '0') {
				return;
			} else {
				this.$Router.push({ name: url });
			}
		},
		getNav(url) {
			this.disabled = true;
			if (url === 'main/est-pay/pre-pay') {
				uni.navigateTo({
					url: '/pages/' + url + '?data=' + JSON.stringify(this.roomsMaterial)
				});
				return;
			}
			uni.navigateTo({
				url: '/pages/' + url
			});
		},
		billTypeDetail(item) {
			let datas = {
				status: item.statusCode,
				sn: item.sn,
				allmoney: item.allmoney,
				table_type: item.table_type,
				ymonth: item.ymonth
			};
			this.$Router.push({ name: 'bill-type-detail', params: { data: datas } });
		},
		toPay() {
			this.disabled = true;
			// setTimeout(res =>{
			// 	uni.navigateTo({
			// 		url: '/pages/main/est-pay/to-pay'
			// 	});
			// },1000)
			uni.navigateTo({
				url: '/pages/main/est-pay/est-oweAndpre-pay/est-oweAndpre-pay?data=' + JSON.stringify(this.roomsMaterial)
			});
			
		},
		getRoomsMaterials() {
			let data = {
				roomid: this.myRoom.roomid
			};
			this.$api.getRoomsMaterial(data, res => {
				this.roomsMaterial = res.data;
				this.$store.commit('setRoomData', res.data);
				if (!this.roomsMaterial.summoney) {
					//当没有欠费的时候
					this.payMoney = false;
				}
			});
		},
		getNowMonthOrder() {
			this.$api.everyMonth({}, res => {
				
				this.roomOrderDetail = res.data.room;
				this.allPrice = 0;
				this.dealPrice = 0;
				res.data.room.forEach(resp => {
					if (resp.room_wg) {
						resp.room_wg.forEach(response => {
							if (response.statusCode == 0) {
								this.dealPrice  = (this.dealPrice + parseFloat(response.allmoney));
							}
							this.allPrice = (this.allPrice + parseFloat(response.allmoney));
						});
					}
					if (resp.room_water) {
						resp.room_water.forEach(response => {
							if (response.statusCode == 0) {
								this.dealPrice  = (this.dealPrice + parseFloat(response.allmoney));
							}
							this.allPrice = (this.allPrice + parseFloat(response.allmoney));
						});
					}
					if (resp.room_ele) {
						resp.room_ele.forEach(response => {
							if (response.statusCode == 0) {
								this.dealPrice  = (this.dealPrice + parseFloat(response.allmoney));
							}
							this.allPrice = (this.allPrice + parseFloat(response.allmoney));
						});
					}
				});
				this.allPrice = this.allPrice.toFixed(2)
				this.dealPrice = this.dealPrice.toFixed(2)
			});
		}
	},
	onLoad() {
		this.getRoomsMaterials();
		this.getNowMonthOrder();
	}
};
</script>

<style>
.est-name {
	height: 80upx;
	text-align: center;
	line-height: 80upx;
	width: 100%;
	background: #ffffff;
	font-size: 32upx;
	font-weight: 600;
}
.jf-btn {
	background-color: rgba(236, 64, 64, 0.1);
	color: #ec3e3e;
	border: 1px solid #ec3e3e;
	padding: 16upx 40upx;
	border-radius: 72upx;
	font-size: 28upx;
	line-height: 40upx;
}
.icon-wra {
	flex-direction: column;
	text-align: center;
	position: relative;
}
.line {
	width: 2upx;
	height: 80upx;
	position: absolute;
	top: 50%;
	right: 0;
	transform: translateY(-50%);
	background-color: #ebebeb;
}
.clear-bill {
	color: #898989;
	text-align: center;
}
.est-img {
	height: 200upx;
	width: 200upx;
}
.est-balance {
	height: 80upx;
	width: 80upx;
	display: inline-block;
	margin: 0 auto;
}
.user-list {
	margin-left: 30upx;
}
.user-list-cell {
	display: flex;
	justify-content: space-between;
	height: 50upx;
	padding-left: 30upx;
	margin-top: 20upx;
}
.user-list-cell-right {
	line-height: 80upx;
	text-align: right;
	padding-left: 20upx;
	color: #898989;
}
.uni-cell-75 {
	width: 75%;
}
.more-bill {
	color: #ec3e3e;
	margin-top: 10upx;
}
.est-balance-text {
	line-height: 40upx;
	color: #898989;
}
.est-pay {
	background: #f7f6fb;
}
.est-content {
	background: #ffffff;
	margin: 20upx 0;
	padding-bottom: 10upx;
	border-radius: 10upx;
}
.est-title {
	padding: 10upx;
	color: #898989;
}
.est-content-header {
	text-align: center;
	line-height: 60upx;
}

.pay-cost {
	background: #ffead7;
	border: 1upx solid #ec3e3e;
	color: #ec3e3e;
	border-radius: 10upx;
	padding: 5upx 20upx 5upx;
}
</style>