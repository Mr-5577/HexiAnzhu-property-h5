<template>
	<view class="pay">
		<view class="uni-flex-center">
			<view class="uni-cell-90 est-content" v-if="generatedList.length != 0">
				<view class="title uni-font-36 uni-font-bold uni-flex">
					<view>物业预缴（{{ preRoomData.label }}）</view>
					<view class="icon-rights" @click="chooseAllPay"> <text v-show="chooseAll">✔</text> </view>
					</view>
				<view class="uni-flex-btw est-content-header">
					<view class="uni-cell-40">缴费月份</view>
					<view class="uni-cell-20">金额</view>
					<view class="uni-cell-20">缴费类型</view>
				</view>
				<view class="uni-flex-btw est-content-header" v-for="(items, index) in generatedList" :key="index" @click="choosePay(items, index)">
					<view v-show="items.isChoose" class="icon-right">✔</view>
					<view class="icon-right"></view>
					<view class="uni-cell-40">{{ items.ymonth }}</view>
					<view class="uni-cell-20">{{ items.money }}</view>
					<view class="uni-cell-20">物管费</view>
				</view>
			</view>
		</view>

		<view class="uni-flex-center" style="margin-bottom: 100upx;">
			<view class="uni-cell-90 est-content" v-if="preRoomData.label">
				<view class="title uni-font-36 uni-font-bold">物业预缴（{{ preRoomData.label }}）</view>
				<view class="uni-flex-btw est-content-header">
					<view class="uni-cell-40">开始月份</view>
					<view class="uni-cell-20">费用/月</view>
					<view class="uni-cell-20">选择缴费</view>
				</view>
				<view class="uni-flex-btw est-content-header">
					<view class="uni-cell-40">{{ preRoomData.yjmonth }}</view>
					<view class="uni-cell-20">{{ preRoomData.fee }}</view>
					<view class="uni-cell-20 yearMonth uni-flex-btw">
						<view class="minus colorOrange" @click="minus">-</view>

						<text style="padding-left: 20upx;padding-right: 20upx;">{{ monthNum }}</text>
						<view class="minus colorOrange" @click="append">+</view>
					</view>
				</view>
			</view>
		</view>
		<view class="foot-pays uni-flex-btw">
			<view class="uni-cell-70 money">
				合计缴费金额：
				<text class="uni-font-bold">{{ preMoney }}</text>
			</view>
			<button class="uni-cell-30 to-pay bg-gradient-btn" @click="payment" :class="{'po-event-none':disabled ==true}" :disabled="disabled">去支付</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			payCostData: '',
			yearMonth: '',
			monthNum: 0, //默认预缴费1个月
			preRoomData: '',
			generatedList: [], //已生成缴费数据
			chooseList: [] ,//选择缴费数据
			chooseAll:false,
			disabled:false
		};
	},
	onShow() {
		this.disabled = false;
	},
	computed: {
		preMoney(){
			  let money = 0
			  if(this.chooseList){
				  this.chooseList.forEach(res =>{
					money = money +  parseFloat(res.money);
				  })
			  }
			  if(this.monthNum >0){
				  money = money + ((this.monthNum - 1) * this.preRoomData.fee + this.preRoomData.first);
			  }
			return money.toFixed(2);
		}
	},

	methods: {
		chooseAllPay(){
			this.chooseAll = !this.chooseAll;
			this.chooseList =[];
			if(this.generatedList){
				this.generatedList.forEach(res => {
					res.isChoose = this.chooseAll;
					if (res.isChoose == true) {
						this.chooseList.push(res);
					}
				});
				this.$forceUpdate();
			}
		},
		choosePay(item, index) {
			this.generatedList[index].isChoose = !item.isChoose;
			this.chooseList = [];
			this.generatedList.forEach(res => {
				if (res.isChoose == true) {
					this.chooseList.push(res);
				}
			});
			if(this.chooseList.length == this.generatedList.length){
				this.chooseAll = true;
			}else{
				this.chooseAll = false;
			}
			this.$forceUpdate();
		},
		//判断一串数字是否是连续的 并且必须选择第一个
		isContinuityNum(num) {
			let array = [];
			if (num instanceof Array) {
				array = [...num];
			} else {
				array = Array.from(num.toString()); //转换为数组
			}
			var i = array[0];
			var isContinuation = true;
			for (var e in array) {
				if (array[e] != i) {
					isContinuation = false;
					break;
				}
				//第一项必须为0
				if (array[0] != 0) {
					isContinuation = false;
					break;
				}
				i++;
			}
			return isContinuation;
		},
		payment() {
			let test = [];
			var ids = [];
			this.chooseList = [];
			//当有生成预缴数据时
			let data = {
				type: 1, //物业预缴
				keyid: this.preRoomData.keyid
				
			};
			if(this.generatedList.length != 0){
				for (let var1 in this.generatedList) {
					if (this.generatedList[var1].isChoose == true) {
						test.push(var1);
						ids.push(this.generatedList[var1].id);
						this.chooseList.push(this.generatedList[var1]);
					}
				}
				if (test.length == 0) {
					uni.showToast({
						icon: 'none',
						title: '必须先选择要缴费月份'
					});
					return;
				}
				let iscon = this.isContinuityNum(test);
				if (!iscon) {
					uni.showToast({
						icon: 'none',
						title: '必须选择连续缴费月份'
					});
					return;
				}
				
				data.ids = this.$uitls.toStrings(ids);
				if(this.chooseList.length == this.generatedList.length){
					if(this.monthNum > 0){
						data.num = this.monthNum
					}
				}
				
			}else{
				if(this.monthNum > 0){
					data.num = this.monthNum
				}else{
					uni.showToast({
						icon: 'none',
						title: '必须选择大于等于1月'
					});
					return
				}
			}
			this.disabled = true;
			this.$api.advancePayment(data, res => {
				let data = {
					sn: res.data.ordernum,
					money: res.data.paymoney
				};
				this.$store.commit('setOrderData', data);
				uni.navigateTo({
					url: '/pages/payment/payment'
				});
			});
		},
		append() {
			//当没有生成预缴数据时
			if(!this.generatedList){
				if (this.monthNum < 24) {
					this.monthNum = this.monthNum + 1;
				} else {
					uni.showToast({
						icon: 'none',
						title: '最多支持24个月预缴'
					});
				}
				return
			}
			//当有预缴数据 必须全部选择预缴数据
			if (this.chooseList.length == this.generatedList.length) {
				if (this.monthNum < 24) {
					this.monthNum = this.monthNum + 1;
				} else {
					uni.showToast({
						icon: 'none',
						title: '最多支持24个月预缴'
					});
				}
			} else {
				uni.showToast({
					icon: 'none',
					title: '请先全部选中'
				});
			}
		},
		minus() {
			//当没有生成预缴数据时
			if(!this.generatedList){
				if (this.monthNum === 0) {
					return;
				}
				this.monthNum = this.monthNum - 1;
				return
			}
			//当有预缴数据 必须全部选择预缴数据
			if (this.chooseList.length == this.generatedList.length) {
				if (this.monthNum === 0) {
					return;
				}
				this.monthNum = this.monthNum - 1;
			} else {
				uni.showToast({
					icon: 'none',
					title: '请先全部选中'
				});
			}
		},
		getAdvancePaymentPage() {
			let data = {
				type: 1,
				keyid: this.payCostData.id
			};
			this.$api.advancePaymentPage(data, res => {
				this.preRoomData = res.data;
				if (res.data.list) {
					res.data.list.forEach(res => {
						res.isChoose = false;
						this.generatedList.push(res);
					});
				}
			});
		}
	},

	onLoad(option) {
		this.payCostData = JSON.parse(option.data);
		this.getAdvancePaymentPage();
	}
};
</script>

<style>
.icon-right {
	line-height: 40upx;
	text-align: center;
	width: 40upx;
	height: 40upx;
	padding: 2upx;
	border-radius: 50%;
	font-weight: 700;
	color: #ed7130;
	position: absolute;
	border: 1upx solid #ed7130;
	border-radius: 50%;
}
.icon-rights {
	line-height: 40upx;
	text-align: center;
	width: 40upx;
	height: 40upx;
	padding: 2upx;
	border-radius: 50%;
	font-weight: 700;
	color: #ed7130;
	border: 1upx solid #ed7130;
	border-radius: 50%;
}
.pay {
}
.minus {
	border-radius: 5upx;
	color: #ffffff;
	height: 50upx;
	width: 50upx;
	line-height: 40upx;
	font-size: 50upx;
	text-align: center;
}
.minus:active {
	background: #555555;
}
.est-content {
	background: #ffffff;
	margin: 20upx;
}
.est-content .title {
	padding: 20upx;
}
.est-content-header {
	height: 80upx;
	text-align: center;
}
.pay-cost {
	background: #ffead7;
	border: 1upx solid #ff913b;
	color: #ff913b;
	border-radius: 10upx;
	padding: 5upx 20upx 5upx;
}
.yearMonth {
	color: #007aff;
}
.foot-pays {
	position: fixed;
	height: 120upx;
	width: 100%;
	background: #ffffff;
	bottom: 0upx;
	line-height: 120upx;
}
.foot-pays .money {
	line-height: 120upx;
	height: 120upx;
	padding-left: 40upx;
	font-size: 30upx;
}
.foot-pays .to-pay {
	color: #ffffff;
	border-radius: 50upx;
	width: 200upx;
	line-height: 80upx;
	height: 80upx;
	text-align: center;
	margin-top: 20upx;
	margin-right: 10upx;
}
</style>
