<template>
	<view>
		<view class="bill-detail-head uni-flex-center">
			<view class="">
				<view class="color-font-gray uni-text-center">支付金额</view>
				<view class="uni-font-64 color-font-orange uni-text-center">¥{{ roomData.summoney }}</view>
				<button class="colorOrange bg-gradient-btn" @click="payment" :class="{'po-event-none':disabled ==true}" :disabled="disabled">去支付</button>
			</view>
		</view>
		<view class="arrearage-title color-font-gray">欠费明细</view>
		<view class="uni-flex-center" v-for="(items,index) in roomDetail" :key="index">
			<view class="uni-cell-90 bill-detail-content" >
				<view class="uni-margin-top-20">
					<view class="user-list">
						<view class="user-list-cell">
							<view class="uni-cell-70" >
								<view class="uni-cell-lineheight-40  uni-h4">{{items.key}}</view>
							</view>
							<view class="uni-cell-30 uni-text-right">
								<text class="uni-cell-lineheight-40 uni-font-32 uni-font-bold" ></text>
							</view>
						</view>
						<view class="uni-margin-top-40">
							<view class="user-list-cell" v-for="(item, index) in items.val" :key="index" >
								<view class="uni-cell-70">
									<view class="uni-cell-lineheight-40">{{ item.title }}</view>
								</view>
								<view class="uni-cell-30 uni-text-right">
									<text class="uni-cell-lineheight-40">{{ item.money }}</text>
								</view>
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
			price: '1',
			wgids:[],//物管id
			waterids:[],//水费id
			eleids:[],//电费id
			disabled:false
		};
	},
	onShow() {
		this.disabled = false;
		this.getRoomsMaterials();
	},
	computed:{
		myRoom(){
		  return this.$store.state.myRoom;
		},
		roomData(){
			return this.$store.state.roomData;
		},
		roomDetail(){
			let list = []
			for (let var1 in this.roomData.qfinfo) {
				let data={}
				data.key = var1.replace(/\"/g,"");
				let vals = [];
				for (let var2 in this.roomData.qfinfo[var1]) {
					if(var2 === 'wg'){ //物业费id
						this.wgids.push(this.roomData.qfinfo[var1][var2].id);
					}
					if(var2 === 'water'){//水费id
						this.waterids.push(this.roomData.qfinfo[var1][var2].id);
					}
					if(var2 == 'ele'){
						this.eleids.push(this.roomData.qfinfo[var1][var2].id);
					}
					let val={}
					val.title = this.roomData.qfinfo[var1][var2].table_type;
					val.money = this.roomData.qfinfo[var1][var2].money;
					vals.push(val)
				}
				data.val = vals;
				list.push(data);
			}
			return list;
		}
	},
	methods: {
		billTypeDetail(item) {
			this.$Router.push({name:'bill-type-detail',params:{data:item}})
		},
		payment() {
			let wgids = this.$uitls.unique(this.wgids);
			let waterids = this.$uitls.unique(this.waterids);
			let eleids = this.$uitls.unique(this.eleids);
			const data ={
				// type	是	int	缴费类型 1房产类 2车位类
				// wgids	否	str	物管费欠费id,用逗号隔开；1,2,3
				// waterids	否	str	水费欠费id,用逗号隔开
				// eleids	否	str	电费欠费id,用逗号隔开
				type:'1',
				wgids:this.$uitls.toStrings(wgids),
				waterids:this.$uitls.toStrings(waterids),
				eleids:this.$uitls.toStrings(eleids),
			}
			this.disabled = true;
			this.$api.payList(data,res =>{
				let data ={
					sn:res.data.ordernum,
					money:res.data.money
				}
				this.$store.commit('setOrderData',data);
				this.$Router.push({name:'payment'})
			})
		
		},
		getRoomsMaterials(){
			let data ={
				roomid:this.myRoom.roomid
			}
			this.$api.getRoomsMaterial(data,res =>{
			})
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
