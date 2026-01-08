<template>
	<view class="est-pay" v-if="carMaterial">
		<view class="est-name uni-ellipsis">{{ carDatas.plates }}</view>
		<view class="uni-flex-center">
			<view class="uni-cell-95 est-content uni-flex-center" style="padding-bottom: 30upx;">
				<view v-if="payMoney">
					<view class="uni-font-64 color-font-orange uni-text-center" v-cloak>¥{{ moneyNum }}</view>
					<view class="color-font-gray uni-text-center" style="margin-bottom: 20upx">待缴金额</view>
					<button class="jf-btn" plain @click="toPay">立即缴费</button>
				</view>
				<view v-else>
					<view class="uni-flex-center">
						<image src="/static/images/jqing.png" mode="aspectFit" class="est-img"></image>
					</view>
					<view class="clear-bill" style="margin-bottom: 20upx">账单已经缴清啦~</view>
					<!-- <button class="colorOrange bg-gradient-btn" @click="getNav('main/car/car-pre-pay')">立即预缴</button> -->
					<button class="jf-btn" plain @click="toPay">立即预缴</button>
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
				<view class="uni-flex-btw est-content-header">
					<view class="uni-cell-40 ">
						<view class="uni-font-32 uni-font-bold">{{ nowMonth }}</view>
						<view class="color89">账单月</view>
					</view>
					<view class="uni-cell-20">
						<view class="uni-font-32 uni-font-bold" v-if="allPrice">{{ parseFloat(allPrice) }}</view>
						<view class="uni-font-32 uni-font-bold" v-else>0</view>
						<view class="color89">总金额</view>
					</view>
					<view class="uni-cell-30">
						<view class="uni-font-32 uni-font-bold">{{ parseFloat(dealPrice) }}</view>
						<view class="color89">待缴费</view>
					</view>
				</view>
				<view class="user-list">
					<view class="user-list-cell" v-for="(item, index) in carOrderDetail" v-if="item.car_wg" :key="index"
						@click="billTypeDetail(item.car_wg)">
						<view class="uni-flex-center uni-cell-100">
							<view class="uni-cell-100" style="display: flex;">
								<view class="uni-cell-75">
									<template>
										{{ item.car_wg.table_type }}
									</template>
								</view>
								<view class="uni-cell-20">
									<text>{{ item.car_wg.allmoney }}</text>
								</view>
							</view>
						</view>
					</view>
					<view class="user-list-cell" v-for="(item, index) in carOrderDetail" v-if="item.car_water"
						:key="index" @click="billTypeDetail(item.car_water)">
						<view class="uni-flex-center uni-cell-100">
							<view class="uni-cell-100" style="display: flex;">
								<view class="uni-cell-75">
									<template>
										{{ item.car_water.table_type }}
									</template>
								</view>
								<view class="uni-cell-20">
									<text>{{ item.car_water.allmoney }}</text>
								</view>
							</view>
						</view>
					</view>
					<view class="user-list-cell" v-for="(item, index) in carOrderDetail" v-if="item.car_ele"
						:key="index" @click="billTypeDetail(item.car_ele)">
						<view class="uni-flex-center uni-cell-100">
							<view class="uni-cell-100" style="display: flex;">
								<view class="uni-cell-75">
									<template>
										{{ item.car_ele.table_type }}
									</template>
								</view>
								<view class="uni-cell-20">
									<text>{{ item.car_ele.allmoney }}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="uni-flex-center tip">
			<view class="uni-cell-95 uni-flex-btw">
				<view class="est-title uni-font-28 uni-font-bold">*点击费用项可查看费用更多详情</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				payMoney: true, //是否有缴费
				carMaterial: '',
				moneyNum: '',
				carOrderDetail: '', //本月账单
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
			},
			carDatas() {
				return this.$store.state.changeCar;
			}
		},
		methods: {
			 getData(item) {
				this.$api.userCenter({}, res => {
					this.$store.commit('setMyHouse', res.data);
					 this.$api.getDefult({}, res => {
						this.datas = res.data;
						this.$store.commit('setMyRoom', res.data);
						this.$store.commit('setChangeCar', item);
						 this.getCarMaterials();
						 this.getNowMonthOrder();
					});
				});
			},
			invoice() {
				this.$Router.push({
					name: 'electronic_invoice'
				});
			},
			pay(url) {
				if (!this.carMaterial.summoney) {
					return;
				}
				this.$Router.push({
					name: url
				});
			},
			toMoreBill() {
				let data = {
					type: 1,
					id: this.carDatas.id,
					resType: this.carDatas.resourcesmodel_type
				};
				this.$Router.push({
					name: 'more-bill',
					params: data
				});
			},
			getNav(url) {
				if (url === 'main/car/car-pre-pay') {
					uni.navigateTo({
						url: '/pages/' + url + '?data=' + JSON.stringify(this.carMaterial)
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
				this.$Router.push({
					name: 'bill-type-detail',
					params: {
						data: datas
					}
				});
			},
			toPay() {
				// this.$Router.push({ name: 'car-to-pay' });

				uni.navigateTo({
					url: '/pages/main/car/est-car-oweAndpre-pay?data=' + JSON.stringify(this.carMaterial)
				});
			},
			getCarMaterials() {
				let data = {
					carid: this.carDatas.id,
					resourcesmodel_type: this.carDatas.resourcesmodel_type ? this.carDatas.resourcesmodel_type : ''
				};
				this.$api.getCarMaterial(data, res => {
					if(res.code == 1){
						res.data.resourcesmodel_type = data.resourcesmodel_type
						this.carMaterial = res.data;
						this.$store.commit('setCarData', res.data);
						if (!this.carMaterial.summoney) {
							//当没有欠费的时候
							this.payMoney = false;
						}
						this.moneyNum = this.carMaterial.summoney;
					}
				});
			},
			getNowMonthOrder() {
				this.$api.everyMonth({}, res => {
					this.carOrderDetail = res.data.car;
					this.allPrice = 0;
					this.dealPrice = 0;
					res.data.car.forEach(resp => {
						if (resp.car_wg) {
							// 新项目
							if (res.data.new_system) {
								if (resp.car_wg.status == 0) {
									this.dealPrice = this.dealPrice + parseFloat(resp.car_wg.allmoney);
								}
							} else {
								if (resp.car_wg.statusCode == 0) {
									this.dealPrice = this.dealPrice + parseFloat(resp.car_wg.allmoney);
								}
							}
							this.allPrice = this.allPrice + parseFloat(resp.car_wg.allmoney);
						}
						if (resp.car_water) {
							// 新项目
							if (res.data.new_system) {
								if (resp.car_water.status == 0) {
									this.dealPrice = this.dealPrice + parseFloat(resp.car_water.allmoney);
								}
							} else {
								if (resp.car_water.statusCode == 0) {
									this.dealPrice = this.dealPrice + parseFloat(resp.car_water.allmoney);
								}
							}
							this.allPrice = this.allPrice + parseFloat(resp.car_water.allmoney);
						}
						if (resp.car_ele) {
							// 新项目
							if (res.data.new_system) {
								if (resp.car_ele.status == 0) {
									this.dealPrice = this.dealPrice + parseFloat(resp.car_ele.allmoney);
								}
							} else {
								if (resp.car_ele.statusCode == 0) {
									this.dealPrice = this.dealPrice + parseFloat(resp.car_ele.allmoney);
								}
							}
							this.allPrice = this.allPrice + parseFloat(resp.car_ele.allmoney);
						}
					});
					this.allPrice = this.allPrice.toFixed(2);
					this.dealPrice = this.dealPrice.toFixed(2);
				});
			}
		},
		// onShow() {
		// 	this.getData()
		// },
		onLoad(option) {
			if(option.carid && option.vid && option.resourcesmodel_type && option.plates){
				let item = {
					id: option.carid,
					resourcesmodel_type: option.resourcesmodel_type,
					vid: option.vid,
					plates:option.plates
				}
				this.getData(item)
			}else{
				this.getCarMaterials();
				this.getNowMonthOrder();
			}
			

		}
	};
</script>

<style scoped>
	@import url('./car-pay.css');
</style>