<template>	<view class="more-bill">
		<view v-if="list.length == 0">
			<view class="uni-empty">暂无数据</view>
		</view>
		<view class="bill-wrapper" v-else>
			<view class="bill-item" @click="billDetail(item)" v-for="(item, index) in list" :key="index">
				<view class="info">
					<text class="month">{{ item.ymonth }}月账单</text>
					<text class="money">
						{{ tonums(item.moneyNum) }}
						<text class="unit">（元）</text>
					</text>
					<text class="status1" v-if="item.t == '已交'">{{ item.t }}</text>
					<text class="status2" v-else>{{ item.t }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			list: [],
			type: 1,
			ymonth: this.$uitls.yearMonth(),
			id: '',
		};
	},

	computed: {
		nowYear() {
			let yearMonths = this.$uitls.yearMonth();
			let year = yearMonths.substring(0, 4);
			return year;
		}
	},
	methods: {
		tonums(index1, index2, index3) {
			let num1 = parseFloat(index1);
			let num2 = parseFloat(index2);
			let num3 = parseFloat(index3);
			let allnum = num1;
			if (num2) {
				allnum = num1 + num2;
			}
			if (num3) {
				allnum = num1 + num2 + num3;
			}
			return allnum.toFixed(2);
		},
		billDetail(item) {
			this.$Router.push({ name: 'bill-detail', params: { data: item } });
		},
		onConfirm(e) {
			this.ymonth = e.checkArr[0] + e.checkArr[1];
			this.getNowMonthOrder();
		},
		changeYearMonth() {
			this.$refs.yearMonth.show();
		},
		getNowMonthOrder() {
			let data = {
				ymonth: this.ymonth
			};
			this.$api.everyMonth(data, res => {
				if (this.type === 1) {
					this.list = res.data.car;
				} else {
					this.list = res.data.room;
				}
			});
		},

		getRoomBill() {
			let data = {
				roomid: this.id
			};
			this.list = [];
			this.$api.roomsMonthBillList(data, res => {
				
				for (let i in res.data.billinfo) {
					this.list.push(res.data.billinfo[i]);
				}
				this.list.forEach(res => {
					res.moneyNum = 0;
					if (res.wg) {
						res.ymonth = res.wg.ymonth;
						res.t = res.wg.t;
						res.moneyNum = res.moneyNum + parseFloat(res.wg.money);
					}
					if (res.water) {
						res.ymonth = res.water.ymonth;
						res.t = res.water.t;
						res.moneyNum = res.moneyNum + parseFloat(res.water.money);
					}
					if (res.ele) {
						res.ymonth = res.ele.ymonth;
						res.t = res.ele.t;
						res.moneyNum = res.moneyNum + parseFloat(res.ele.money);
					}
					res.moneyNum = res.moneyNum.toFixed(2);
				});
				
			});
		},
		getCarBill() {
			let data = {
				carid: this.id
			};
			this.list = [];
			this.$api.carMonthBillList(data, res => {
				for (let i in res.data.billinfo) {
					this.list.push(res.data.billinfo[i]);
					this.list.forEach(res => {
						
						res.moneyNum = 0;
						if (res.wg) {
							res.ymonth = res.wg.ymonth;
							res.t = res.wg.t;
							res.moneyNum = res.moneyNum + parseFloat(res.wg.money);
						}
						if (res.water) {
							res.ymonth = res.water.ymonth;
							res.t = res.water.t;
							res.moneyNum = res.moneyNum + parseFloat(res.water.money);
						}
						if (res.ele) {
							res.ymonth = res.ele.ymonth;
							res.t = res.ele.t;
							res.moneyNum = res.moneyNum + parseFloat(res.ele.money);
						}
						res.moneyNum = res.moneyNum.toFixed(2);
					});
				}
			});
		}
	},
	onLoad() {
		let datas = this.$Route.query;
		this.type = datas.type;
		this.id = datas.id;
		/*
		 type  1 是车辆账单，2是物业账单
		 */
		// this.getNowMonthOrder();
		if (this.type === 1) {
			uni.setNavigationBarTitle({
				title: '车辆账单'
			});
			this.getCarBill();
		} else {
			uni.setNavigationBarTitle({
				title: '物业账单'
			});
			this.getRoomBill();
		}
	}
};
</script>

<style lang="scss">
.more-bill {
	min-height: 100vh;
	box-sizing: border-box;
	background-color: #FAFAFA;
	.bill-wrapper {
		padding: 30upx 24upx;
		>.bill-item {
			box-shadow: 0 0 6upx rgba(0, 0, 0, 0.05);
			background-color: #fff;
			padding: 60upx 30upx;
			margin-bottom: 30upx;
			border-radius: 10upx;
			.info {
				display: flex;
				.month {
					font-size: 30upx;
					line-height: 44upx;
					color: #333;
				}
				.money {
					flex: 1;
					color: #ec4040;
					font-size: 32upx;
					line-height: 44upx;
					text-align: center;
					.unit {
						color: #999;
						font-size: 24upx;
					}
				}
				.status1 {
					font-size: 30upx;
					line-height: 44upx;
					color: #ccc;
				}
				.status2 {
					font-size: 30upx;
					line-height: 44upx;
					color: #333;
				}
			}
		}
	}
}
</style>
