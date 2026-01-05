<template>
	<view class="pay">
		<view class="" v-if="roomData.summoney">
			<view class="uni-flex-center qf-wrapper">
				<view class="uni-cell-94 est-content">
					<view class="title uni-font-36 uni-font-bold uni-flex">
						<view>物业欠费（{{ preRoomData.label }}）</view>
					</view>
					<view class="uni-flex-btw est-content-header">
						<view class="uni-cell-40">缴费月份</view>
						<view class="uni-cell-30">金额</view>
						<view class="uni-cell-30">缴费类型</view>
					</view>
					<view class="" v-for="(items, index) in roomDetailList" :key="index">
						<view class="uni-flex-btw est-content-header" v-for="(it, index) in items.val" :key="index">
							<view class="uni-cell-40">{{ items.key }}</view>
							<view class="uni-cell-30">{{ it.money }}</view>
							<view class="uni-cell-30">{{ it.title }}</view>
						</view>
					</view>
					<view class="heji">欠费合计：
						<text style="font-weight: 600;">{{ roomData.summoney + ' ' }}</text>
						元
					</view>
				</view>
			</view>
		</view>
		<view >
			<view class="uni-flex-center">
				<view class="uni-cell-94 est-content" v-if="preRoomData.label">
					<view class="title  uni-font-bold">物业预缴（{{ preRoomData.label }}）</view>
					<view class="uni-flex-btw est-content-header">
						<view class="uni-cell-40">开始月份</view>
						<view class="uni-cell-30">费用/月</view>
						<view class="uni-cell-30">选择缴费</view>
					</view>
					<view class="uni-flex-btw est-content-header">
						<view class="uni-cell-40">{{ preRoomData.yjmonth }}</view>
						<view class="uni-cell-30">{{ preRoomData.fee }}</view>
						<view class="uni-cell-30 uni-flex-btw">
							<view class="minus" @click="minus">-</view>
							<text style="padding-left: 20upx;padding-right: 20upx;">{{ monthNum }}</text>
							<view class="minus" style="background-color: #ec3e3e;" @click="append">+</view>
						</view>
					</view>
					<view class="heji">预缴合计：
						<text style="font-weight: 600;">{{ (preRoomData.fee * monthNum).toFixed(2) + ' ' }}</text>
						元
					</view>
				</view>
			</view>
		</view>

		<view class="foot-pays uni-flex-btw">
			<view class="uni-cell-70 money">
				合计缴费金额：
				<text class="uni-font-bold" style="color: #ec3e3e;">{{ preMoney }}</text>
			</view>
			<button class="uni-cell-30 to-pay" @click="payment" :class="{ 'po-event-none': disabled == true }" :disabled="disabled">去支付</button>
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
			chooseList: [], //选择缴费数据
			chooseAll: false,
			disabled: false,
			price: '1',
			wgids: [], //物管id
			waterids: [], //水费id
			eleids: [], //电费id
			roomData: '',
			roomDetailList: []
		};
	},
	onShow() {
		this.disabled = false;
	},
	computed: {
		preMoney() {
			let money = 0;
			if (this.roomData) {
				money = money + parseFloat(this.roomData.summoney);
			}
			if (this.monthNum > 0) {
				// money = money + (this.monthNum  * this.preRoomData.fee ); 
				money = money + ((this.monthNum - 1) * this.preRoomData.fee + this.preRoomData.first);
			}
			return money.toFixed(2);
		},
		myRoom() {
			return this.$store.state.myRoom;
		}
	},
	methods: {
		billTypeDetail(item) {
			this.$Router.push({ name: 'bill-type-detail', params: { data: item } });
		},
		payment() {
			// uni.showToast({
			// 	icon: 'none',
			// 	title: '支付功能暂未开通！',
			// 	duration: 2000,
			// });
			// return
			let wgids = this.$uitls.unique(this.wgids);
			let waterids = this.$uitls.unique(this.waterids);
			let eleids = this.$uitls.unique(this.eleids);
			const data = {
				// type	是	int	缴费类型 1房产类 2车位类
				// wgids	否	str	物管费欠费id,用逗号隔开；1,2,3
				// waterids	否	str	水费欠费id,用逗号隔开
				// eleids	否	str	电费欠费id,用逗号隔开
				type: '1',
				keyid: this.preRoomData.keyid,
				wgids: this.$uitls.toStrings(wgids),
				waterids: this.$uitls.toStrings(waterids),
				eleids: this.$uitls.toStrings(eleids),
				num:this.monthNum
			};
			if(this.roomDetailList.length == 0){
				if (this.monthNum > 0) {
					data.num = this.monthNum;
				} else {
					uni.showToast({
						icon: 'none',
						title: '必须选择大于等于1月'
					});
					return;
				}
			}
			this.disabled = true;
			this.$api.generateorder(data, res => {
				let data = {
					sn: res.data.ordernum,
					money: res.data.money
				};
				this.$store.commit('setOrderData', data);
				this.$Router.push({ name: 'payment' });
			});
		},
		getRoomsMaterials() {
			let data = {
				roomid: this.myRoom.roomid
			};
			this.$api.getRoomsMaterial(data, res => {
				this.roomData = res.data;
				this.roomDetailList = [];
				for (let var1 in this.roomData.qfinfo) {
					let data = {};
					data.key = var1.replace(/\"/g, '');
					let vals = [];
					for (let var2 in this.roomData.qfinfo[var1]) {
						if (var2 === 'wg') {
							//物业费id
							this.wgids.push(this.roomData.qfinfo[var1][var2].id);
						}
						if (var2 === 'water') {
							//水费id
							this.waterids.push(this.roomData.qfinfo[var1][var2].id);
						}
						if (var2 == 'ele') {
							this.eleids.push(this.roomData.qfinfo[var1][var2].id);
						}
						let val = {};
						val.title = this.roomData.qfinfo[var1][var2].table_type;
						val.money = this.roomData.qfinfo[var1][var2].money;
						vals.push(val);
					}
					data.val = vals;
					this.roomDetailList.push(data);
				}
			});
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
		append() {
			//当没有生成预缴数据时
			if (this.monthNum < 24) {
				this.monthNum = this.monthNum + 1;
			} else {
				uni.showToast({
					icon: 'none',
					title: '最多支持24个月预缴'
				});
			}
		},
		minus() {
			//当没有生成预缴数据时
			if (this.monthNum === 0) {
				return;
			}
			if(this.monthNum > 1 ){
				this.monthNum = this.monthNum - 1;
			}
		},
		getAdvancePaymentPage() {
			let data = {
				type: 1, //1房产 2车位
				keyid: this.payCostData.id
			};
			this.$api.advancePaymentPagenew(data, res => {
				this.preRoomData = res.data;
				this.monthNum = res.data.defult_num;
			});
		}
	},

	onLoad(option) {
		this.payCostData = JSON.parse(option.data);
		this.getAdvancePaymentPage();
		this.getRoomsMaterials();
	}
};
</script>

<style>
.pay {
	padding-bottom: 150upx;
	min-height: 100vh;
	box-sizing: border-box;
}
.uni-cell-94 {
	width: 94%;
}
.heji {
	color: #333;
	text-align: right;
	padding: 0 30upx 30upx;
}
.icon-right {
	line-height: 40upx;
	text-align: center;
	width: 40upx;
	height: 40upx;
	padding: 2upx;
	border-radius: 50%;
	font-weight: 700;
	color: #ec3e3e;
	position: absolute;
	border: 1upx solid #ec3e3e;
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
	color: #ec3e3e;
	border: 1upx solid #ec3e3e;
	border-radius: 50%;
}
.minus {
	width: 50upx;
	height: 50upx;
	color: #fff;
	line-height: 50upx;
	text-align: center;
	background-color: #E6E6E6;
	font-size: 40upx;
}
.minus:active {
	opacity: 0.6;
}
.est-content {
	background: #ffffff;
	margin-top: 30upx;
	border-radius: 10upx;
}
.est-content .title {
	padding: 20upx;
	color: #333;
}
.est-content-header {
	height: 80upx;
	text-align: center;
	padding-right: 30upx;
	color: #333;
}
.pay-cost {
	background: #ffead7;
	border: 1upx solid #ec3e3e;
	color: #ec3e3e;
	border-radius: 10upx;
	padding: 5upx 20upx 5upx;
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
	background-color: #ec3e3e;
	font-size: 30upx;
}
.foot-pays .to-pay:active {
	opacity: 0.6;
}
</style>
