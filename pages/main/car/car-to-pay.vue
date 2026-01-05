<template>
	<view>
		<view class="bill-detail-head uni-flex-center">
			<view class="">
				<view class="color-font-gray uni-text-center">支付金额</view>
				<view class="uni-font-64 color-font-orange uni-text-center">¥{{ carData.summoney }}</view>
				<button class="colorOrange" @click="setOrder" :class="{'po-event-none':disabled ==true}" :disabled="disabled">去支付</button>
			</view>
		</view>
		<view class="arrearage-title color-font-gray">欠费明细</view>
		<view class="uni-flex-center" v-for="(items,index) in carDetail" :key="index">
			<view class="uni-cell-90 bill-detail-content" >
				<view class="uni-margin-top-20">
					<view class="user-list">
						<view class="user-list-cell">
							<view class="uni-cell-70" >
								<view class="uni-cell-lineheight-40 uni-font-32 uni-font-bold">{{items.key}}</view>
							</view>
							<view class="uni-cell-30 uni-text-right">
								<text class="uni-cell-lineheight-40 uni-font-32 uni-font-bold" ></text>
							</view>
						</view>
						<view class="user-list-cell" v-for="(item, index) in items.val" :key="index" >
							<view class="uni-cell-70">
								<view class="uni-cell-lineheight-40">{{ item.title ===undefined?'车位费': item.title}}</view>
							</view>
							<view class="uni-cell-30 uni-text-right">
								<text class="uni-cell-lineheight-40">{{ item.money }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- <view class="uni-empty">*点击费用项可查看费用更多详情</view> -->
	</view>
</template>

<script>
export default {
	data() {
		return {
			wgids:[],//物管id
			waterids:[],//水费id
			disabled:false
		};
	},
	onShow() {
		this.getCarMaterials();
		this.disabled = false;
	},
	methods: {
		getCarMaterials(){
			let data ={
				carid:this.carData.id
			}
			this.$api.getCarMaterial(data,res =>{
				this.$store.commit('setCarData',res.data);
			})
		},
		billTypeDetail(item) {
			uni.navigateTo({
				url: '/pages/main/est-pay/bill-type-detail?data=' + JSON.stringify(item)
			});
		},
		payment() {
			uni.navigateTo({
				url: '/pages/payment/payment'
			});
		},
		setOrder(){
			let wgids = this.$uitls.unique(this.wgids);
			let waterids = this.$uitls.unique(this.waterids);
			const data ={
				// type	是	int	缴费类型 1房产类 2车位类
				// wgids	否	str	物管费欠费id,用逗号隔开；1,2,3
				// waterids	否	str	水费欠费id,用逗号隔开
				// eleids	否	str	电费欠费id,用逗号隔开
				type:'2',
				wgids:this.$uitls.toStrings(wgids),
				waterids:this.$uitls.toStrings(waterids),
				eleids:''
			}
			this.disabled =true;
			this.$api.payList(data,res =>{
				let data ={
					sn:res.data.ordernum,
					money:res.data.money
				}
				this.$store.commit('setOrderData',data);
				this.$Router.push({name:'payment'})
			})
		}
	},
	computed:{
		carData(){
			return this.$store.state.carData;
		},
		carDetail(){
			let list = []
			for (let var1 in this.carData.qfinfo) {
				let data={}
				data.key = var1.replace(/\"/g,"");
				let vals = [];
				for (let var2 in this.carData.qfinfo[var1]) {
					if(var2 === 'wg'){ //物业费id
						this.wgids.push(this.carData.qfinfo[var1][var2].id);
					}
					if(var2 === 'water'){
						this.waterids.push(this.carData.qfinfo[var1][var2].id);
					}
					let val={}
					val.title = this.carData.qfinfo[var1][var2].table_type;
					val.money = this.carData.qfinfo[var1][var2].money;
					vals.push(val)
				}
				data.val = vals;
				list.push(data);
			}
			return list;
		}
	}
	
};
</script>

<style>
.arrearage-title {
	margin: 30upx;
}
.colorOrange {
	color: #ffffff;
	height: 80upx;
	border-radius: 50upx;
	line-height: 80upx;
	margin: 40upx;
	padding: 0upx 60upx;
}
.bill-detail-head {
	height: 300upx;
	width: 100%;
	background: #ffffff;
}
.bill-detail-content {
	background: #ffffff;
	padding: 20upx;
	margin: 20upx;
	border-radius: 10upx;
}
.rule {
	border-bottom: 1upx dashed #dddddd;
}
.user-list {
	margin-top: 100upx;
	margin: 20upx;
}
.user-list-cell {
	display: flex;
	justify-content: space-between;
	margin: 20upx;
}
.user-list-cell-right {
	line-height: 60upx;
	text-align: right;
	color: #898989;
	padding-left: 10upx;
}
.uni-empty {
	text-align: left;
	padding-left: 40upx;
	font-size: 22upx;
}
</style>
