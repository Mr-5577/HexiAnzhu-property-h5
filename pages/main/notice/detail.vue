<template>
	<view class="detail-wrapper">
		<view class="content" v-if="strings != ''">
			<view class="title" >{{strings.name}}</view>
			<rich-text class="text" :nodes="strings.content"></rich-text>
			<view class="time" >{{strings.c_time}}</view>
		</view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				strings: '',
				id:''
			}
		},
		methods:{
			getCircularInfo(){
				let data ={
					id : this.id
				}
				this.$api.circularInfo(data,res =>{
					this.strings = res.data
				})
			}
		},
		onLoad() {
			this.id = this.$Route.query.id;
			this.getCircularInfo();
		}
	}
</script>

<style>
.detail-wrapper {
	min-height: 100vh;
	background-color: #FAFAFA;
	padding: 30upx 24upx;
	box-sizing: border-box;
}
.detail-wrapper .content {
	background-color: #fff;
	box-shadow: 0 0 6upx rgba(0, 0, 0, 0.05);
	padding: 0;
	border-radius: 10upx;
}
.detail-wrapper .content .title {
	font-size: 30upx;
	line-height: 44upx;
	font-weight: 600;
	color: #333;
	padding: 30upx;
	text-align: center;
	border-bottom: 1px solid #ebebeb;
}
.detail-wrapper .content .text {
	padding: 30upx 30upx 0 30upx;
	font-size: 30upx;
	line-height: 42upx;
	text-align: justify;
	color: #333;
}
.detail-wrapper .content .time {
	font-size: 26upx;
	color: #666;
	line-height: 36upx;
	padding: 30upx;
	text-align: right;
}
</style>
