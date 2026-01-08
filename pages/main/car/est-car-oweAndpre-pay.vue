<template>
	<view class="pay">
		<view class="" v-if="carDetailList.length != 0">
			<view class="uni-flex-center qf-wrapper">
				<view class="uni-cell-94 est-content">
					<view class="title uni-font-36 uni-font-bold uni-flex">
						<view>车位欠费（{{ preCarData.label }}）</view>
					</view>
					<view class="uni-flex-btw est-content-header">
						<view class="uni-cell-40">缴费月份</view>
						<view class="uni-cell-30">金额</view>
						<view class="uni-cell-30">缴费类型</view>
					</view>
					<view class="uni-flex-btw est-content-header" v-for="(item, index) in carDetailList" :key="index">
							<checkbox style="transform:scale(0.7)" :disabled="item.disable" @click="checkBoxs(item)"
								:checked="item.checked" :value="item.id"></checkbox>
							<view class="uni-cell-40">{{ item.key }}</view>
							<view class="uni-cell-30">{{ item.money }}</view>
							<view class="uni-cell-30">{{ item.title }}</view>
					</view>
					<view class="heji">
						欠费合计：
						<text style="font-weight: 600;">{{ carData.summoney + ' ' }}</text>
						元
					</view>
				</view>
			</view>
		</view>
		<view>
			<view class="uni-flex-center">
				<view class="uni-cell-94 est-content" v-if="preCarData.label">
					<view class="title  uni-font-bold">车位预缴（{{ preCarData.label }}）</view>
					<view class="uni-flex-btw est-content-header">
						<view class="uni-cell-40">开始月份</view>
						<view class="uni-cell-30">费用/月</view>
						<view class="uni-cell-30">选择缴费</view>
					</view>
					<view class="uni-flex-btw est-content-header">
						<view class="uni-cell-40">{{ preCarData.yjmonth }}</view>
						<view class="uni-cell-30">{{ preCarData.fee }}</view>
						<view class="uni-cell-30 uni-flex-btw">
							<view class="minus" @click="minus">-</view>
							<text style="padding-left: 20upx;padding-right: 20upx;">{{ monthNum }}</text>
							<view class="minus" style="background-color: #ffcf5a;" @click="append">+</view>
						</view>
					</view>
					<view class="heji">
						预缴合计：
						<text style="font-weight: 600;">{{ preCarData.fee * monthNum + ' ' }}</text>
						元
					</view>
				</view>
			</view>
			<view class="uni-flex-center" v-if="activityData" @click="activeRule">
				<view class="uni-cell-94">
					<view class="activity">
						预缴优惠活动
					</view>
				</view>
			</view>
		</view>

		<view class="foot-pays uni-flex-btw" v-if="carDetailList.length > 0 || preCarData.label">
			<view class="uni-cell-70 money">
				合计缴费金额：
				<text class="uni-font-bold" style="color: #ffcf5a;">{{ preMoney }}</text>
			</view>
			<button class="uni-cell-30 to-pay" plain @click="payment" :class="{ 'po-event-none': disabled == true }" :disabled="disabled">去支付</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			payCostData: '',
			yearMonth: '',
			monthNum: 3, //默认预缴费3个月
			preRoomData: '',
			generatedList: [], //已生成缴费数据
			chooseList: [], //选择缴费数据
			chooseAll: false,
			disabled: false,
			price: '1',
			wgids: [], //物管id
			waterids: [], //水费id
			eleids: [], //电费id
			preCarData: '',
			carDetailList: [],
			carData: '',
			activityData:'',
			checkIndex:[]
		};
	},
	onShow() {
		this.disabled = false;
	},
	computed: {
		oweAllMoney() {
			let owe = 0
			this.wgids = [];
			this.waterids = [];
			this.eleids = [];
			this.checkIndex = []
			this.carDetailList.forEach((res, index) => {
		
				if (res.checked) {
					owe += parseFloat(res.money)
					if (res.type == 'wg') {
						this.wgids.push(res.id)
					}
					if (res.type == 'water') {
						this.waterids.push(res.id)
					}
					if (res.type == 'ele') {
						this.eleids.push(res.id)
					}
					this.checkIndex.push(index)
				}
			})
			return owe.toFixed(2)
		},
		myData() {
			return this.$store.state.carData;
		},
		preMoney() {
			let money = 0;
			if (this.oweAllMoney) {
				money = money + parseFloat(this.oweAllMoney);
			}
			if (this.monthNum > 0) {
				money = money + ((this.monthNum - 1) * this.preCarData.fee + this.preCarData.first);
			}
			return money.toFixed(2);
		},
	},
	methods: {
		checkBoxs(w) {
			w.checked = !w.checked
			this.$forceUpdate();
		},
		activeRule(){
			uni.navigateTo({
				url:'/pages/activity-rule/activity-rule?rule='+JSON.stringify(this.activityData)
			})
		},
		billTypeDetail(item) {
			this.$Router.push({ name: 'bill-type-detail', params: { data: item } });
		},
		//是否有活动
		getPrestoreActivity(){
			let wgids = this.$uitls.unique(this.wgids);
			this.$api.getPrestoreActivity({
				type: 'car',
				keyid: this.payCostData.id,
				cost_ids: this.$uitls.toStrings(wgids),
				subject_village_id:this.carData.config.id,
				vid:this.carData.config.vid
			})
			.then(res =>{
				if (res.code == 1 && res.data.result) {
					this.activityData = res.data.activity_rule
				}
			})
		},
		//车位欠费
		getCarMaterials() {
			let datas = {
				carid: this.myData.id,
				resourcesmodel_type: this.myData.resourcesmodel_type ? this.myData.resourcesmodel_type : ''
			};
			this.$api.getCarMaterial(datas, res => {
				this.carData = res.data;
				this.carDetailList = [];
				for (let var1 in this.carData.qfinfo) {
					let data = {};
					data.key = var1.replace(/\"/g, '');
					let vals = [];
					if (this.carData.qfinfo[var1].wg) {
						//物业费id
						data.checked = true;
						data.title = '车位费';
						data.money = this.carData.qfinfo[var1].wg.money;
						data.disable = this.carData.qfinfo[var1].wg.disable;
						data.id = this.carData.qfinfo[var1].wg.id;
						data.type = 'wg'
					}
					if (this.carData.qfinfo[var1].water) {
						//水费id
						data.checked = true;
						data.title = this.carData.qfinfo[var1].water.table_type;
						data.money = this.carData.qfinfo[var1].water.money;
						data.disable = this.carData.qfinfo[var1].water.disable;
						data.id = this.carData.qfinfo[var1].water.id;
						data.type = 'water'
					}
					if (this.carData.qfinfo[var1].ele) {
						data.checked = true;
						data.title = this.carData.qfinfo[var1].ele.table_type;
						data.money = this.carData.qfinfo[var1].ele.money;
						data.disable = this.carData.qfinfo[var1].ele.disable;
						data.id = this.carData.qfinfo[var1].ele.id;
						data.type = 'ele'
					}
					this.carDetailList.push(data);
					
				}
				if (this.carDetailList.length > 0) {
					this.monthNum = 0
				} else {
					this.monthNum = 1
				}
			});
		},
		payment() {
			
			let _this = this;
			if (this.checkIndex.length > 0) {
				for (let i = 0; i < this.checkIndex.length; i++) {
					if (i > 0) {
						if (this.checkIndex[i] - this.checkIndex[i - 1] != 1) {
							uni.showToast({
								icon: 'none',
								title: '必须选择连续月份缴费！'
							});
							return
						}
					}
				}
			}
			
			let wgids = this.$uitls.unique(this.wgids);
			let waterids = this.$uitls.unique(this.waterids);
			let eleids = this.$uitls.unique(this.eleids);
			// type	是	int	缴费类型 1房产类 2车位类
			// wgids	否	str	物管费欠费id,用逗号隔开；1,2,3
			// waterids	否	str	水费欠费id,用逗号隔开
			// eleids	否	str	电费欠费id,用逗号隔开
			const data = {
				type: '2',
				keyid: this.preCarData.keyid,
				wgids: this.$uitls.toStrings(wgids),
				waterids: this.$uitls.toStrings(waterids),
				eleids: this.$uitls.toStrings(eleids),
				num: this.monthNum,
				resourcesmodel_type: this.myData.resourcesmodel_type ? this.myData.resourcesmodel_type : '',
				owner_id:this.carData.owner_id
			};
			if (this.carData.new_system) {
				if (this.carData.config.id) {
					data.subject_village_id = this.carData.config.id;
				} else {
					uni.showToast({
						icon: 'none',
						title: '楼栋管家未绑定科目，请联系物业中心缴费！'
					});
					return
				}
			}
			if (this.carDetailList.length == 0) {
				if (this.monthNum > 0) {
					data.num = this.monthNum;
				} else {
					uni.showToast({
						icon: 'none',
						title: '至少预缴1个月'
					});
					return;
				}
			}
			let reqData = {
				type: 'car',
				num: this.monthNum,
				keyid: this.payCostData.id,
				cost_ids: this.$uitls.toStrings(wgids),
				subject_village_id: this.carData.config.id,
				vid:this.carData.config.vid,
				owner_id:this.carData.owner_id
			}
			this.disabled = true;
			this.$api.checkCostHasPrestoreActivity(reqData).then(res => {
				if (res.code == 1 && res.data.result) {
					uni.showModal({
						content:`当前缴费已经满足预缴${res.data.use_activity_rule.prestore_ymonth}个月赠送${res.data.use_activity_rule.preferential_ymonth}个月活动，支付成功系统将自动为您优惠！`,
						title:`满足活动提醒！`,
						showCancel:false,
						success(s) {
							if(s.confirm){
								data['use_activity']='prestore_preferential'
								_this.generateorder(data)
							}
						}
					})
				}else{
					this.generateorder(data)
				}
				this.disabled = false;
			}).catch(err =>{
				this.disabled = false;
			})
		},
		generateorder(data){
			this.$api.generateorder(data, res => {
				if(res.ordernum){
					let datas ={
						sn: res.ordernum,
						money: res.paymoney,
						type: 'car',
					}
					this.$store.commit('setOrderData', datas);
					this.$Router.push({
						name: 'payment'
					});
				}else{
					let datas = {
						sn: res.data.ordernum,
						money: res.data.money,
						type: 'car',
					};
					this.$store.commit('setOrderData', datas);
					this.$Router.push({
						name: 'payment'
					});
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
				if (this.monthNum < 1) {
					this.monthNum = 1
				} else {
					this.monthNum = this.monthNum + 1;
				}
			} else {
				uni.showToast({
					icon: 'none',
					title: '最多支持24个月预缴'
				});
			}
		},
		minus() {
			if (this.carDetailList.length > 0) {
				if (this.monthNum > 1) {
					this.monthNum = this.monthNum - 1;
				} else {
					this.monthNum = 0
				}
			} else {
				if (this.monthNum > 1) {
					this.monthNum = this.monthNum - 1;
				} else {
					this.monthNum = 1
					uni.showToast({
						icon: 'none',
						title: '最少预缴1个月'
					});
				}
			}
			
		},
		//车位预缴
		getAdvancePaymentPage() {
			let data = {
				type: 2, //1房产 2车位
				keyid: this.payCostData.id,
				resourcesmodel_type: this.myData.resourcesmodel_type ? this.myData.resourcesmodel_type : ''
			};
			this.$api.advancePaymentPagenew(data, res => {
				this.preCarData = res.data;
				// this.monthNum = res.data.defult_num;
			});
		}
	},

	onLoad(option) {
		this.payCostData = JSON.parse(option.data);
		this.getAdvancePaymentPage();
		this.getCarMaterials();
	}
};
</script>

<style>
.pay {
	padding-bottom: 150upx;
	min-height: 100vh;
	box-sizing: border-box;
}
	.activity {
		padding: 20rpx;
		background-color: #fffbe5;
		color: rgb(255, 175, 25);
		margin-top: 30rpx;
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
	color: #ffcf5a;
	position: absolute;
	border: 1upx solid #ffcf5a;
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
	color: #ffcf5a;
	border: 1upx solid #ffcf5a;
	border-radius: 50%;
}
.minus {
	width: 50upx;
	height: 50upx;
	color: #fff;
	line-height: 50upx;
	text-align: center;
	background-color: #e6e6e6;
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
	border: 1upx solid #ffcf5a;
	color: #ffcf5a;
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
	background-color: #ffcf5a;
	border: none;
}
.foot-pays .to-pay:active {
	opacity: 0.6;
}
</style>
