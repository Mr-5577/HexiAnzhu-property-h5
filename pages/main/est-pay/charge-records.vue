<template>
	<view class="">
		<uni-segmented-control :current="current" :values="items" :style-type="styleType" :active-color="activeColor" @clickItem="onClickItem"></uni-segmented-control>
		<view class="position-view" />
		<view class="content">
			<view v-show="current === 0">
				<view v-if="chargeRecords.length === 0" class="uni-flex-center">
					<image src="/static/img/est/empty.jpg" mode="aspectFit" class="uni-empty-img" />
				</view>
				<view v-else class="list-box">
					<view class="container_of_slide" v-for="(item, index) in chargeRecords" :key="index">
						<view class="slide_list">
							<view class="now-message-info">
								<view class="icon-circle">{{ item.type }}</view>
								<view class="list-right">
									<view class="list-title" v-if="item.sn">{{ item.sn }}</view>
									<view class="list-detail">{{ item.ctime}}</view>
								</view>
								<view class="list-right-1">{{ item.money }}</view>
							</view>
							<view style="clear:both"></view>
						</view>
					</view>
				</view>
			</view>
			<view v-show="current === 1">
				<view v-if="expendRecords.length === 0" class="uni-flex-center">
					<image src="/static/img/est/empty.jpg" mode="aspectFit" class="uni-empty-img" />
				</view>
				<view v-else class="list-box">
					<view class="container_of_slide" v-for="(item, index) in expendRecords" :key="index">
						<view class="slide_list">
							<view class="now-message-info">
								<view class="icon-circle">{{ item.type }}</view>
								<view class="list-right">
									<view class="list-title" v-if="item.sn">{{ item.sn }}</view>
									<view class="list-detail">{{ item.ctime}}</view>
								</view>
								<view class="list-right-1">{{ item.money }}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import uniSegmentedControl from '@/components/uni-segmented-control/uni-segmented-control.vue';
export default {
	components: {
		uniSegmentedControl
	},
	computed: {
		records() {
			return this.$store.state.accountData.record;
		}
	},
	onLoad() {
		this.chargeRecords =[];
		this.expendRecords =[];
		if(this.records){
			this.records.forEach(res =>{
				if(res.type === '充值'){
					this.chargeRecords.push(res)
				}
				if(res.type === '消费'){
					this.expendRecords.push(res)
				}
			})
		}
		
	},
	data() {
		return {
			items: ['充值记录', '支出记录'],
			current: 0,
			activeColor: '#ff913b',
			styleType: 'text',
			expendRecords: [] ,//支出记录
			chargeRecords:[], //充值记录
		};
	},
	methods: {
		onClickItem(index) {
			if (this.current !== index) {
				this.current = index;
			}
		}
	}
};
</script>

<style>
page{
	background: #FFFFFF;
}
.position-view {
	height: 30upx;
	width: 100%;
	background: #f8f8f8;
}
.list-box {
	/* border-top: 1upx solid #EEEEEE; */
	border-bottom: 1upx solid #EEEEEE;
}
.container_of_slide {
	width: 100%;
	overflow: hidden;
}

.slide_list {
	transition: all 100ms;
	transition-timing-function: ease-out;
	min-width: 200%;
	height: 160upx;
	border: none;
	border-radius: 0;
	background: #ffffff;
}

.now-message-info {
	box-sizing: border-box;
	display: flex;
	align-items: center;
	/* justify-content: space-between; */
	font-size: 16px;
	clear: both;
	height: 160upx;
	padding: 0 30upx;
	margin-bottom: 20upx;
	background: #ffffff;
	float: left;
}

.icon-circle {
	background: #898989;
	border-radius: 100%;
	width: 100upx;
	height: 100upx;
	line-height: 100upx;
	text-align: center;
	color: #ffffff;
	font-weight: bold;
	font-size: 20px;
	float: left;
}
.list-right {
	float: left;
	margin-left: 25upx;
	margin-right: 30upx;
}
.list-right-1 {
	float: right;
	color: #ED7A30;
}
.list-title {
	width: 350upx;
	line-height: 1.5;
	overflow: hidden;
	margin-bottom: 10upx;
	color: #333;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 1;
	overflow: hidden;
}
.list-detail {
	width: 350upx;
	font-size: 14px;
	color: #a9a9a9;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 1;
	overflow: hidden;
}
</style>
