<template>
	<view>
		<view class="uni-flex-center">
			<text class="uni-cell-lineheight-100 uni-font-40">{{ detail.table_type }}</text>
		</view>
		<view class="uni-flex-center">
			<text class="uni-cell-lineheight-100 uni-font-60" style="color: #ec4040;">¥ {{ detail.allmoney }}</text>
		</view>
		<view class="bill-type-detail-head">
			<view class="user-list">
				<view class="user-list-cell"  >
					<view class="uni-cell-80">
						<view class="uni-cell-lineheight-60">待支付</view>
					</view>
					<view class="uni-cell-20">
						<text class="uni-cell-lineheight-60" v-if="detail.status=='0'" >{{ detail.allmoney }}</text>
						<text class="uni-cell-lineheight-60" v-else >0.00</text>
					</view>
				</view>
				<view class="user-list-cell">
					<view class="uni-cell-80">
						<view class="uni-cell-lineheight-60">已支付</view>
					</view>
					<view class="uni-cell-20">
						<text class="uni-cell-lineheight-60" v-if="detail.status == '1'">{{ detail.allmoney}}</text>
						<text class="uni-cell-lineheight-60" v-else >0.00</text>
					</view>
				</view>
			</view>
		</view>
		<!-- <view class="type-detail-content uni-font-bold ">单价</view>
		<view class="unit-price">
			<view class="user-list">
				<view class="user-list-cell" v-for="(item, index) in unitPrice" :key="index">
					<view class="uni-cell-lineheight-80">{{ item.title }}</view>
				</view>
			</view>
		</view>
		<view>
			<view class="user-list">
				<view class="user-list-cell" v-for="(item, index) in priceType" :key="index" >
					<view class="uni-cell-80" >
						<view class="uni-cell-lineheight-60">{{ item.title }}</view>
					</view>
					<view class="uni-cell-20">
						<text class="uni-cell-lineheight-60">{{ item.price }}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="type-detail-content uni-font-bold ">缴费记录</view>
		<view >
			<view class="user-list">
				<view class="user-list-cell" v-for="(item, index) in payRecords" :key="index">
					<view class="uni-cell-80" >
						<view class="uni-cell-lineheight-60">{{ item.title }}</view>
						<view class="color89 uni-font-22">
							{{item.time}}
						</view>
					</view>
					<view class="uni-cell-20">
						<text class="uni-cell-lineheight-60">{{ item.price }}</text>
					</view>
				</view>
			</view>
		</view> -->
	</view>
</template>

<script>
export default {
	data() {
		return {
			detail: '',
			
			payRecords: [{ title: '支付宝', price: '110.00',time:'2019-11-2' }],
			unitPrice:[{ title: '8元/单位'}, { title: '10元/单位'}],
			priceType:[{ title: '计费数量', price: '1' }, { title: '本期度数', price: '211' }]
		};
	},
	methods: {},
	onLoad(option) {
		this.detail = this.$Route.query.data;
		// uni.setNavigationBarTitle({
		// 	title: this.detail.table_type
		// });
	}
};
</script>

<style>
page {
	background: #ffffff;
}
.bill-type-detail-head{
	border-top: 1upx dashed #eeeeee;
	margin-top: 40upx;
}
.unit-price {
	width: 100%;
	background: #f7f6fb;
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
	line-height: 40upx;
	text-align: right;
	font-size: 60upx;
	color: #898989;
	padding-left: 10upx;
}
.type-detail-content {
	border-top: 1upx dashed #eeeeee;
	font-weight: 900;
	padding: 30upx;
}
</style>
