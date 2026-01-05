<template>
	<view>
		<view class="uni-list">
			<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(item,index) in list" :key="index" @click="addUnit(item)">
				<view class="uni-media-list">
					<view class="uni-media-list-body">
						<view class="uni-media-list-text-top">{{item.unit}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[],
				id:''
			}
		},
		onLoad(option){
			this.id = this.$Route.query.data;
			this.getUnit();
		},
		methods: {
			getUnit(){
				const data ={
					type:3,
					id:this.id,
					login_token:this.$store.state.login_token
				}
				this.$api.getResource(data,res =>{
					this.list = res.data;
				})
			},
			addUnit(item){
				this.$store.commit('setUnit',item);
				uni.navigateBack({
					delta:1
				})
			}
		}
		
	}
</script>

<style>
.uni-media-list-body{
	height: 76upx;
}
.uni-media-list-text-top {
	line-height: 76upx;
}
</style>
