<template>
	<view class="">
		<view class="uni-flex-center">
			<view class="uni-cell-95">
				<view>请选择建议内容</view>
				<!-- <view class="uni-font-20 color-font-gray">您的选择可以帮助我们更快速的安排相应的人员进行处理</view> -->
				<view class="report-content">
					<view v-for="(item, index) in types" :key="index" @click="changeType(index)" class="_box" :class="{ _boxActive: indexType === index }">{{ item.typename }}</view>
				</view>
			</view>
		</view>
		<view class="uni-flex-center">
			<view class="uni-cell-95 maintenance-content">
				<textarea v-model="content" placeholder="请在此填写你所遇到的问题。" style="padding: 10upx;height: 180upx;"></textarea>
				<image-drag-sort @imageUpload="imageUploadComplaint" :picNum="3"></image-drag-sort>
				<radio-group @change="radioChange" style="display: flex;margin: 20upx;">
					<view v-for="(item, index) in items" :key="item.value" style="margin: 10upx;">
						<label :style="{ color: index == delCurrent ? '#ff8402' : '#000000' }">
							<radio color="#ff8402" :value="item.value" :checked="index === delCurrent" />
							{{ item.text }}
						</label>
					</view>
				</radio-group>
				<view class="color-font-orange" style="padding-left: 20upx;">最快将在 {{ times }} -{{nowHours+2}}:00 为您服务</view>
				<view class="color-font-gray" style="padding-left: 20upx;">报事联系人</view>
				<scroll-view class="scroll-view_H" scroll-x="true">
					<radio-group @change="radioChangePerson" style="display: flex;margin: 20upx;">
						<view style="display: inline-block;" v-for="(item, index) in person" :key="index">
							<view class="scroll-view-item_H">
								<view class="uni-flex-btw">
									<view style="padding: 20upx;">
										<text style="color: #000000;">{{ item.name }}</text>
										<br />
										{{ item.tel }}
									</view>
									<radio class="uni-margin-top-40" color="#ff8402" :value="index" :checked="index === personCurrent" />
								</view>
							</view>
						</view>
						<view style="display: inline-block;">
							<view class="scroll-view-item_H" @click="addPerson"><view class="_add_person">+ 添加联系人</view></view>
						</view>
					</radio-group>
				</scroll-view>
			</view>
		</view>
		<w-picker
			mode="limit"
			dayStep="60"
			startHour="8"
			endHour="20"
			minuteStep="5"
			afterStep="30"
			:defaultVal="[0, 0, 0]"
			:current="true"
			@confirm="onConfirm"
			ref="limit"
			themeColor="#f00"
		></w-picker>
		<view class="uni-flex-center tenance-foot"><button class="foot-btn bg-gradient-btn" @click="sub">提交</button></view>
	</view>
</template>
<script>
import catLabel from '@/components/cat-label/cat-label.vue';
import imageDragSort from '@/components/image-drag-sort/index.vue';
import wPicker from '@/components/w-picker/w-picker.vue';
import * as qiniu from 'qiniu-js';
import qiniuUploader from '@/common/js/qiniuUploader.js';
export default {
	components: {
		catLabel,
		imageDragSort,
		wPicker
	},
	data() {
		return {
			items: [{ text: '立即处理', value: '1' }, { text: '预约处理', value: '2' }],
			delCurrent: 0, //默认立即处理
			personCurrent: 0, //默认联系人
			indexType: 0, //报修类型的索引
			indexComplaintType: 0,
			complaintImages: [], //报事报修要上传的图片
			times: '',
			content: '', //报修内容
			type:'',//报修类型
			contact:'',//联系人
			nowHours:'',
			endtime:'',//结束时间
			emergency:1,//紧急程度 1紧急 2不紧急
			types:'',
			person:''
		};
	},
	computed: {
		qiniuDatas() {
			return this.$store.state.qiniuData;
		},
		nowDay() {
			let date = new Date();
			return date.getFullYear() + '' + (date.getMonth() + 1) + '' + date.getDate();
		}
	},
	methods: {
		getRepairStart() {
			// uni.showLoading({
			// 	title:'正在获取数据'
			// })
			this.$api.repairStart({}, res => {
				this.person = res.data.contacts;
				this.types = res.data.public;//投诉建议
				this.contact = this.person[this.personCurrent].id;
				this.type = this.types[this.indexType].id;
				this.$store.commit('setContacts', res.data.contacts);
			});
		},
		//切换立即和预约时间
		radioChange(evt) {
			this.delCurrent = 0;
			if (evt.detail.value === '2') {
				this.delCurrent = 1;
				this.emergency = 2;
				this.$refs.limit.show();
			} else {
				this.emergency = 1;
				this.getNowTime();
			}
		},
		//选择联系人
		radioChangePerson(evt) {
			this.personCurrent = parseInt(evt.detail.value);
		},
		//选择预约时间
		onConfirm(res) {
			this.nowHours =  parseInt(res.checkArr[1].value);
			this.times = res.checkArr[0].value + '  ' + this.nowHours + ':00';
			this.endtime = res.checkArr[0].value + '  ' + (this.nowHours+2) + ':00';
		},
		//选择报修内容
		changeType(index) {
			this.indexType = index;
		},
		addPerson() {
			this.$Router.push({ name: 'add-person' });
		},
		//报事报修要上传的图片
		imageUploadComplaint(img) {
			this.complaintImages = img;
		},

		imageUploads() {
			let _this = this;
			return new Promise(resolve => {
				let keys = [];
				let token = this.qiniuDatas.Data;
				let domain = this.qiniuDatas.http_domain;
				let bucket = this.qiniuDatas.bucket;
				_this.complaintImages.forEach(filePath => {
					let key = 'hxest-' + this.nowDay + '-' + new Date().getTime();
					keys.push(key);
					qiniuUploader.upload(
						filePath,
						res => {
							// resolve(keys);
							// console.log('ressss: ' + JSON.stringify(res));
							// 每个文件上传成功后,处理相关的事情
						},
						error => {
							// resolve(error)
						},
						{
							region: 'SCN',
							domain: bucket, // // bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL 字段。否则需要自己拼接
							key: key, // [非必须]自定义文件 key。如果不设置，默认为使用微信小程序 API 的临时文件名
							// 以下方法三选一即可，优先级为：uptoken > uptokenURL > uptokenFunc
							uptoken: token
						},
						res => {
							// console.log('上传进度', res.progress);
							if(res.progress === 100){
								resolve(keys);
							}
							// console.log('已经上传的数据长度', res.totalBytesSent);
							// console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend);
						}
					);
				});
			});
		},
		async sub() {
			let _this = this;
			let imgs = '';//七牛云图片名
			if (this.complaintImages.length !== 0) {
				 imgs = await this.imageUploads();
			}
			let data = {
				type: this.types[this.indexType].id,
				content: this.content,
				imgs: JSON.stringify(imgs),
				emergency:this.emergency,
				starttime:this.$uitls.toTimesTamp(this.times),
				endtime:this.$uitls.toTimesTamp(this.endtime),
				contact: this.person[this.personCurrent].id
			};
			if (!this.content) {
				uni.showToast({
					icon: 'none',
					title: '请填写报修内容'
				});
				return;
			}
			if (!this.contact) {
				uni.showToast({
					icon: 'none',
					title: '请先选择联系人'
				});
				return;
			}
			this.$api.repair(data,res =>{
				uni.showToast({
					icon:'none',
					title:'提交成功，我们将及时和您联系',
					duration:3000
				})
				setTimeout(() =>{
					uni.navigateBack({
						delta:1
					})
				},1000)
			})
		},
		getNowTime() {
			let date = new Date();
			this.nowHours = date.getHours();
			if(date.getMinutes() > 30){
				this.nowHours = date.getHours() + 1;
				this.times = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + this.nowHours + ':00';
				this.endtime =  date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + (this.nowHours+2)+ ':00';
			}else{
				this.times = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + this.nowHours + ':00';
				this.endtime =  date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + (this.nowHours+2)+ ':00';
			}
		}
	},
	mounted() {
		// this.type = this.types[this.indexType].id;
		// this.contact = this.person[this.personCurrent].id;
	
	},
	created() {
		this.getNowTime();
		this.getRepairStart();
	},
	onShow() {
		console.log(111);
	}
};
</script>
<style scoped>
@import './maintenance.css';
</style>
