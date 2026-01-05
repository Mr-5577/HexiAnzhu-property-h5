<template>
	<view class="maintenance">
		<view class="content">
			<!-- 报事报修 -->
			<template>
				<view class="">
					<view class="uni-flex-center">
						<view class="uni-cell-100">
							<view class="title" style="padding-left: 20upx;">投诉类型</view>
							<view class="report-content">
								<view v-for="(item, index) in type2" :key="index" @click="changeType(index, 2)" class="_box" :class="{ _boxActive: indexType2 === index }">
									{{ item.typename }}
								</view>
							</view>
						</view>
					</view>
				</view>
			</template>
			<!-- 通用样式 -->
			<view class="title" style="margin-bottom: 0;padding-left: 20upx;">问题描述</view>
			<view class="uni-flex-center main-wrapper">
				<view class="uni-cell-100 maintenance-content">
					<textarea class="txa" v-model="content" placeholder="请在此填写你所遇到的问题。"></textarea>
					<view class="title" style="margin: 30upx 0 0;">
						<text>上传图片</text>
						<text style="color: #ccc;font-size: 24upx;font-weight: 400;">（最多三张）</text>
					</view>
					<image-drag-sort @imageUpload="imageUploadComplaint" :picNum="3"></image-drag-sort>
					<radio-group @change="radioChange" style="display: flex;margin-bottom: 20upx;">
						<view v-for="(item, index) in items" :key="item.value">
							<label :style="{ color: index == delCurrent ? '#ec4040' : '#000000' }" @click="changeTime(index)">
								<radio color="#ec4040" :value="item.value" :checked="index === delCurrent" style="transform: scale(0.7);margin-left: -5upx;" />
								{{ item.text }}
							</label>
						</view>
					</radio-group>
					<view class="color-font-orange" style="padding-left: 20upx;color: #ec4040;background-color: #f5f5f5;
					border-radius: 10upx;font-size: 24upx;line-height: 60upx;">最快将在 {{ times }} -{{ nowHours + 2 }}:00 为您服务</view>
					<view class="title" style="margin: 20upx 0 0;padding: 20upx 0;">报修联系人</view>
					<scroll-view class="scroll-view_H" scroll-x="true">
						<radio-group style="display: flex;">
							<view style="display: inline-block;" @click="radioChangePerson(index)" :class="['person', index === personCurrent ? 'active' : '']" v-for="(item, index) in person" :key="index">
								<view class="scroll-view-item_H">
									<view class="uni-flex-btw">
										<view class="textt" style="color: #666;">
											<text>{{ item.name }}</text>
											<br />
											{{ item.tel }}
										</view>
									</view>
								</view>
							</view>
							<view style="display: inline-block;border: 1px solid #ebebeb;border-radius: 8upx;">
								<view class="scroll-view-item_H" @click="addPerson">
									<view class="add">+</view>
									<view class="_add_person">添加联系人</view>
								</view>
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
			<view class="uni-flex-center tenance-foot">
				<button class="foot-btn bg-gradient-btn" :disabled="disabled" @tap="sub">提交</button>
			</view>
		</view>
		<!-- <li-mask ref="showMask"></li-mask> -->
	</view>
</template>

<script>
import catLabel from '@/components/cat-label/cat-label.vue';
import imageDragSort from '@/components/image-drag-sort/index.vue';
import wPicker from '@/components/w-picker/w-picker.vue';
import qiniuUploader from '@/common/js/qiniuUploader.js';
import liMask from '@/components/li-mask/li-mask.vue';
export default {
	components: {
		wPicker,
		imageDragSort,
		catLabel,
		liMask
	},
	data() {
		return {
			headData: [{ text: '报事报修', cls: 'iconweixiujifei' }, { text: '业主投诉', cls: 'icontousuyiwen' }],
			current: 0, //默认报事报修
			baoshi: '',
			jianyi: '',
			type1: '', //报事类型
			type2: '', //投诉类型
			items: [{ text: '立即处理', value: '1' }, { text: '预约处理', value: '2' }],
			delCurrent: 0, //默认立即处理
			personCurrent: 0, //默认联系人
			indexType: 0, //报修类型的索引
			indexType2: 0, //投诉类型的索引
			indexComplaintType: 0,
			complaintImages: [], //报事报修要上传的图片
			times: null,
			content: '', //报修内容
			type: '', //报修类型
			contact: '', //联系人
			nowHours: null,
			endtime: '', //结束时间
			emergency: 1, //紧急程度 1紧急 2不紧急
			firstName: '2',
			person: '',
			types: '',
			disabled:false
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
		//切换投诉建议
		changeBox(index) {
			this.current = index;
		},
		changeTime(index) {
			if (index == 1) {
				this.$refs.limit.show();
			}
		},
		getRepairStart() {
			// uni.showLoading({
			// 	title:'正在获取数据'
			// })
			this.$api.repairStart({}, res => {
				this.type1 = res.data.family;
				this.type2 = res.data.public;
				this.person = res.data.contacts;
				this.contact = this.person[this.personCurrent].id;
				this.$store.commit('setContacts', res.data.contacts);
				this.$store.commit('setFamilyData', res.data.family);
				this.$store.commit('setPublicData', res.data.public);
			});
		},
		getUpToken() {
			let data = {};
			this.$api.upToken(data, res => {
				this.$store.commit('setQiniuData', res.data);
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
		radioChangePerson(index) {
			this.personCurrent = index;
			this.contact = this.person[index].id;
		},
		//选择预约时间
		onConfirm(res) {
			this.nowHours = parseInt(res.checkArr[1].value);
			this.times = res.checkArr[0].value + '  ' + this.nowHours + ':00';
			this.endtime = res.checkArr[0].value + '  ' + (this.nowHours + 2) + ':00';
		},
		//选择报修内容
		changeType(index, type) {
			if (type == 1) {
				this.indexType = index;
			} else {
				this.indexType2 = index;
			}
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
					let key = 'sunest-' + this.nowDay + '-' + new Date().getTime() + '.jpg';
					keys.push(key);
					qiniuUploader.upload(
						filePath,
						res => {
							// console.log('ressss: ' + JSON.stringify(res));
						},
						error => {
							// resolve(error)
						},
						{
							region: 'SCN', // ECN, SCN, NCN, NA, ASG，分别对应七牛的：华东，华南，华北，北美，新加坡 5 个区域
							domain: domain, // // bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL 字段。否则需要自己拼接
							key: key, // [非必须]自定义文件 key。如果不设置，默认为使用微信小程序 API 的临时文件名
							// 以下方法三选一即可，优先级为：uptoken > uptokenURL > uptokenFunc
							uptoken: token // 由其他程序生成七牛 uptoken
						},
						res => {
							if (res.progress === 100) {
								resolve(keys);
							}
						}
					);
				});
			});
		},
		async sub() {
			this.disabled = !this.disabled
			if (!this.content) {
				uni.showToast({
					icon: 'none',
					title: '请填写内容'
				});
				this.disabled = !this.disabled
				return;
			}
			if (!this.contact) {
				uni.showToast({
					icon: 'none',
					title: '请先选择联系人'
				});
				this.disabled = !this.disabled
				return;
			}
			// this.$refs.showMask.show();
			uni.showModal({
				title:'正在上传数据...'
			})
			let _this = this;
			let imgs = ''; //七牛云图片名
			if (this.complaintImages.length !== 0) {
				imgs = await this.imageUploads();
			}

			let typeid = '';
			if (this.current == 0) {
				typeid = this.type1[this.indexType].id;
			} else {
				typeid = this.type2[this.indexType2].id;
			}
			// #ifdef APP-PLUS
			var froms = 4;
			// #endif

			// #ifdef MP-WEIXIN
			var froms = 2;
			// #endif
			let data = {
				type: typeid,
				content: this.content,
				from: froms,
				imgs: JSON.stringify(imgs),
				emergency: this.emergency,
				starttime: this.$uitls.toTimesTamp(this.times),
				endtime: this.$uitls.toTimesTamp(this.endtime),
				contact: this.person[this.personCurrent].id
			};

			this.$api.complaint(data, res => {
				uni.showToast({
					icon: 'none',
					title: '提交成功，我们将及时和您联系',
					duration: 3000
				});
				uni.navigateBack({
					delta:1
				})
				// this.$refs.showMask.hide();
				setTimeout(() =>{
					uni.hideLoading();
					_this.disabled = !_this.disabled
					
				},1000)
			});
		},
		getNowTime() {
			this.$forceUpdate();
			let date = new Date();
			this.nowHours = date.getHours();
			if (date.getMinutes() > 30) {
				this.nowHours = date.getHours() + 1;
				this.times = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + this.nowHours + ':00';
				this.endtime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + (this.nowHours + 2) + ':00';
			} else {
				this.times = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + this.nowHours + ':00';
				this.endtime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + (this.nowHours + 2) + ':00';
			}
		}
	},
	onShow() {
		this.getNowTime();
		this.getRepairStart();
	},
	onLoad(option) {
		this.current = this.$Route.query.id;
		this.getUpToken();
	}
};
</script>
<style scoped>
@import './maintenance.css';
</style>
