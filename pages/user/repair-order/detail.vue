<template>
	<view class="order-detail">
		<!-- 基本信息部分 -->
		<view class="basic-info">
			<view class="title">{{ repairData.typename ? repairData.typename : ''}}</view>
			<view class="name-addr">
				<text class="name">{{ repairData.name ? repairData.name : '' }}</text>
				<text class="addr">{{ (repairData.villagename ? repairData.villagename : '') + ' ' }}{{ repairData.room ? repairData.room : '' }}</text>
			</view>
			<view class="name-addr">
				<text class="name">{{ repairData.tel ? repairData.tel : '' }}</text>
				<text class="addr">{{ repairData.yuyuetime ? repairData.yuyuetime : '' }}</text>
			</view>
		</view>
		<!-- 问题描述部分 -->
		<view class="describe">
			<view class="title">问题描述</view>
			<view class="content">{{ repairData.content }}</view>
			<!-- 图片部分 -->
			<view class="img-wrapper"><image v-for="(item, index) in imgs" :key="index" @click="showImgs(item)" :src="baseImgUrls + item" mode="aspectFit"></image></view>
		</view>
		<!-- 评价部分 -->
		<view class="evaluate">
			<view class="title">工单进度</view>
			<timeline>
				<timelineItem
					:class="[item.type != 1 && index != 0 ? 'finish' : '']"
					:leftTime="item.ctime"
					:color="item.type != 1 && index != 0 ? '#ccc' : '#ec4040'"
					v-for="(item, index) in repairData.followRecord"
					:key="index"
				>
					<view class="tripItem">
						<view class="title">{{ item.status }}</view>
						<view class="tips">{{ item.content ? item.content : '' }}</view>
						<!-- 图片部分 -->
						<view class="img-wrapper" v-if="item.imgs && item.imgs.length > 0">
							<image v-for="(itm, i) in item.imgs" :key="i" @click="showImgs(itm)" :src="baseImgUrls + itm" mode="aspectFit"></image>
						</view>
					</view>
				</timelineItem>
			</timeline>
		</view>
		<!-- 评价按钮部分 -->
		<!-- (repairData.status == '1' || repairData.status =='4') && repairData.score == null -->
		<view class="btn-wrapper1" v-if="(repairData.status == '1' || repairData.status =='4') && repairData.score == null">
			<button type="warn" @click="evaluate">评价服务</button>
		</view>

		<!-- 图片放大 -->
		<view class="uni-common-mark uni-flex-center" v-show="mark" @touchmove.stop.prevent="moveHandle">
			<view class="uni-cell-100">
				<view class="uni-flex-center">
					<view class="uni-common-mark-content uni-flex-center"><image :src="showImg" mode="aspectFit"></image></view>
				</view>
				<view class="uni-flex-center" @click="closeMark"><view class="uni-common-mark-close">X</view></view>
			</view>
		</view>
	</view>
</template>

<script>
import timeline from '@/components/chenbin-timeline/timeLine.vue';
import timelineItem from '@/components/chenbin-timeline/timelineItem.vue';
export default {
	components: {
		timeline,
		timelineItem
	},
	data() {
		return {
			key: '',
			mark: false,
			showImg: '',
			imgs: [],
			orderId: '',
			repairData: '',
			lengths: 0,
			label: 1
		};
	},
	computed: {
		baseImgUrls() {
			return this.$store.state.baseImgUrl;
		}
	},
	methods: {
		moveHandle() {},
		closeMark() {
			this.mark = !this.mark;
		},
		//图片预览
		showImgs(urlImg) {
			this.mark = !this.mark;
			this.showImg = this.baseImgUrls + urlImg;
		},
		getRepairDetail() {
			let data = {
				id: this.orderId
			};
			this.$api.repairDetail(data, res => {
				this.repairData = res.data;
				this.lengths = this.repairData.followRecord.length - 1;
				this.imgs = JSON.parse(this.repairData.filepath);
			});
		},
		getComplaintdetail() {
			let data = {
				id: this.orderId
			};
			this.$api.complaintdetail(data, res => {
				this.repairData = res.data;
				this.lengths = this.repairData.followRecord.length - 1;
				this.imgs = JSON.parse(this.repairData.filepath);
			});
		},
		evaluate() {
			if (this.repairData.id) {
				this.$Router.push({ name: 'evaluate', params: { id: this.repairData.id, label: this.label } });
			}
		}
	},
	onLoad() {
		this.orderId = this.$Route.query.id;
		this.label = this.$Route.query.label;
	},
	onShow() {
		if (this.orderId) {
			if (this.label == 2) {
				this.getComplaintdetail();
			} else {
				this.getRepairDetail();
			}
		}
	}
};
</script>

<style scoped lang="less">
.order-detail {
	min-height: 100vh;
	background-color: #fff;
	box-sizing: border-box;
	padding: 0 !important;
	.basic-info {
		padding: 40upx 24upx;
		border-top: 30upx solid #fafafa;
		.title {
			font-size: 32upx;
			font-weight: 600;
			color: #333;
			line-height: 44upx;
			margin-bottom: 20upx;
		}
		.name-addr {
			display: flex;
			margin-bottom: 20upx;
			.name,
			.addr {
				font-size: 30upx;
				line-height: 42upx;
				color: #333;
			}
			.addr {
				flex: 1;
				text-align: right;
			}
		}
		.name-addr:last-child {
			margin-bottom: 0;
		}
	}
	.describe {
		border-top: 30upx solid #fafafa;
		padding: 30upx 24upx 0;
		.title {
			font-size: 32upx;
			font-weight: 600;
			color: #333;
			line-height: 44upx;
			margin-bottom: 30upx;
		}
		.content {
			font-size: 30upx;
			color: #333;
			line-height: 42upx;
			text-align: justify;
			padding: 0;
			margin-bottom: 30upx;
		}
		.img-wrapper {
			image {
				width: 100upx;
				height: 100upx;
				border-radius: 6upx;
				margin: 0 40upx 20upx 0;
			}
		}
	}
	.evaluate {
		border-top: 30upx solid #fafafa;
		padding: 30upx 24upx;
		.title {
			font-size: 32upx;
			font-weight: 600;
			color: #333;
			line-height: 44upx;
			margin-bottom: 30upx;
		}
		::v-deep .timeline {
			padding: 0;
		}
		::v-deep .leftTime {
			padding: 0 10upx 0 0 !important;
			width: 150upx !important;
			font-size: 24upx !important;
			white-space: pre-wrap !important;
			line-height: 34upx;
		}
		::v-deep .inner {
			background-color: #fff !important;
			width: 12upx !important;
			height: 12upx !important;
		}
		.tripItem {
			padding: 20rpx 30rpx;
			box-sizing: border-box;
			background: rgba(255, 255, 255, 1);
			box-shadow: 0px 0px 40upx 0px rgba(0, 0, 0, 0.08);
			border-radius: 10upx;
			margin-bottom: 30upx;
			.title {
				font-size: 30upx;
				font-weight: 600;
				color: #333;
				line-height: 44upx;
				margin-bottom: 10upx;
			}
			.tips {
				font-size: 28upx;
				color: #333;
				font-weight: 400;
				line-height: 42upx;
				text-align: justify;
			}
			.img-wrapper {
				image {
					width: 100upx;
					height: 100upx;
					border-radius: 6upx;
					margin: 0 10upx 10upx 0;
				}
			}
		}
		.finish {
			.title,
			.tips,
			::v-deep .leftTime {
				color: #ccc;
			}
			::v-deep .out {
				width: 20upx !important;
				height: 20upx !important;
			}
			::v-deep .inner {
				background-color: #ccc !important;
				width: 10upx !important;
				height: 10upx !important;
			}
		}
	}
	.btn-wrapper1 {
		padding: 30upx 24upx 60upx;
		width: 100%;
		box-sizing: border-box;
		button {
			color: #fff;
			font-size: 28upx;
			line-height: 40upx;
			padding: 24upx 0;
			border-radius: 8upx;
		}
	}
}



page {
	background: #ffffff;
}
.order-detail {
	min-height: 100vh;
	padding: 30upx 24upx 200upx;
	box-sizing: border-box;
}
.cleanfloat {
	display: flex;
}
.uni-timeline {
	padding: 22upx 30upx;
	background: #ffffff;
	border-radius: 10upx;
}
.uni-media-list-logo {
	border-radius: 50%;
}
.detail-person {
	margin: 30upx 0;
	background: #ffffff;
	padding: 30upx;
	border-radius: 10upx;
}
.detail-person.bottom {
	margin-bottom: 0;
}
.btn-wrapper {
	position: fixed;
	left: 0;
	bottom: 0;
	padding: 30upx 24upx 60upx;
	width: 100%;
	box-sizing: border-box;
	button {
		color: #fff;
		font-size: 28upx;
		line-height: 40upx;
		padding: 24upx 0;
		border-radius: 8upx;
	}
}
.uni-flex-btw {
	margin-bottom: 10upx;
}
.uni-flex-btw:last-child {
	margin-bottom: 0;
}
</style>
