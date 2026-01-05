<template>
	<view >
		<view class="bill-detail-head uni-flex-center">
			<view class="">
				<view class="uni-font-40" style="color: #ec4040;">
					{{billDetail.wg.ymonth}}月账单
				</view>
				<view class="uni-text-center" style="color: #ec4040;">
					<text v-if="dealMoney == 0">已缴清</text>
					<text v-else>未缴清</text>
				</view>
			</view>
		</view>
		<view class="uni-flex-center uni-margin-top-40">
			<view class="uni-cell-90 bill-detail-content">
				<view class="uni-flex-btw uni-cell-lineheight-80">
					<text>总金额</text>
					<text>{{billDetail.moneyNum}}</text>
				</view>
				<view class="uni-flex-btw uni-cell-lineheight-80">
					<text>已支付</text>
					<text>{{overMoney}}</text>
				</view>
				<view class="uni-margin-top-40 rule">
					<view class="user-list">
						<view class="user-list-cell" v-for="(item, index) in list" :key="index" @click="billTypeDetail(item)">
							<view class="uni-cell-70" style="display: flex;">
								<view class="uni-cell-lineheight-60">
									{{item.table_type}}
								</view>
							</view>
							<view class="uni-cell-30 uni-flex-btw">
								<text class="uni-cell-lineheight-60 uni-cell-80" style="text-align: right;">{{item.allmoney}}</text>
							  <uni-icons type="arrowright" style="line-height: 60upx;"></uni-icons>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="uni-empty">
			*点击费用项可查看费用更多详情
		</view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				price: '1',
				list:[{title:'物业管理费用',price:'22.00'},{title:'生活垃圾服务费',price:'212222.00'},{title:'水费',price:'2112.00'}],
				billDetail:'',
				overMoney:0,//已缴费
				dealMoney:0,//未缴费
			}
		},
		methods:{
			billTypeDetail(item){
				let datas = {
					status: item.statusCode,
					sn: item.sn,
					allmoney: item.allmoney,
					table_type: item.table_type,
					ymonth: item.ymonth
				};
				this.$Router.push({ name: 'bill-type-detail', params: { data: datas } });
			}
		},
		onLoad(option){
			this.billDetail = this.$Route.query.data;
			// status 1是已交  0 是未交
			this.overMoney = 0;
			this.dealMoney =0;
			this.list =[];
			if(this.billDetail.wg){
				if(this.billDetail.wg.status == '1'){
					this.overMoney = this.overMoney+ parseFloat(this.billDetail.wg.money)
				}
				if(this.billDetail.wg.status == '0'){
					this.dealMoney = this.dealMoney+ parseFloat(this.billDetail.wg.money)
				}
				let data ={
					table_type:"物业管理费用",
					allmoney:this.billDetail.wg.money,
					statusCode:this.billDetail.wg.status,
					ymonth:this.billDetail.wg.ymonth
				}
				this.list.push(data)
			}
			if(this.billDetail.water){
				if(this.billDetail.water.status == '1'){
					this.overMoney = this.overMoney+ parseFloat(this.billDetail.water.money)
				}
				if(this.billDetail.water.status == '0'){
					this.dealMoney = this.dealMoney+ parseFloat(this.billDetail.water.money)
				}
				let data ={
					table_type:"水费",
					allmoney:this.billDetail.water.money,
					statusCode:this.billDetail.water.status,
					ymonth:this.billDetail.water.ymonth
				}
				this.list.push(data)
			}
			if(this.billDetail.ele){
				if(this.billDetail.ele.status == '1'){
					this.overMoney = this.overMoney+ parseFloat(this.billDetail.ele.money)
				}
				if(this.billDetail.ele.status == '0'){
					this.dealMoney = this.dealMoney+ parseFloat(this.billDetail.ele.money)
				}
				let data ={
					table_type:"电费",
					allmoney:this.billDetail.ele.money,
					statusCode:this.billDetail.ele.status,
					ymonth:this.billDetail.ele.ymonth
				}
				this.list.push(data)
			}
			this.overMoney = this.overMoney.toFixed(2);
			this.dealMoney = this.dealMoney.toFixed(2);
			
		}
	}
</script>

<style>
	.bill-detail-head{
		height: 300upx;
		width: 100%;
		background: #FFFFFF;
	}
	.bill-detail-content{
		background: #FFFFFF;
		padding: 20upx;
		margin: 20upx;
		border-radius: 10upx;
	}
	.rule{
		border-top: 1upx dashed #DDDDDD;
	}
	.user-list-cell{
		display: flex;
		justify-content: space-between;
		margin-top: 30upx;
	}
	.user-list-cell:last-child {
		margin-bottom: 20upx;
	}
	.user-list-cell-right{
		line-height:60upx;
		text-align: right;
		color: #898989;
		padding-left: 10upx;
	}
	.uni-empty{
		text-align: left;
		padding-left: 40upx;
		font-size: 22upx;
	}
</style>
