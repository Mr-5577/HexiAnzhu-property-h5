<template>
	<view class="integrated-service">
		<view class="content">
			<template>
				<view class="">
					<view class="uni-flex-center">
						<view class="uni-cell-100">
							<view class="title" style="padding-left: 20upx">业务类型</view>
							<view class="report-content">
								<view v-for="(item, index) in typeList" :key="index" @click="changeType(item)"
									class="_box" :class="{ _boxActive: currentId === item.id }">
									{{ item.typename }}
								</view>
							</view>
						</view>
					</view>
				</view>
			</template>
			<view class="uni-flex-center main-wrapper">
				<view class="uni-cell-100 integrated-service-content">
					<view class="content-item">
						<view class="title">
							<text>留言内容</text>
							<text style="color: #ccc; font-size: 28upx; font-weight: 400">（必填）</text>
						</view>
						<textarea class="txa" v-model="content" placeholder="请输入留言内容。"></textarea>
					</view>
					<view class="content-item">
						<view class="title">
							<text>联系人</text>
							<text style="color: #ccc; font-size: 28upx; font-weight: 400">（必填）</text>
						</view>
						<input class="item-input" v-model="name" placeholder="请输入联系人" maxlength="20" />
					</view>
					<view class="content-item">
						<view class="title">
							<text>联系电话</text>
							<text style="color: #ccc; font-size: 28upx; font-weight: 400">（必填）</text>
						</view>
						<input class="item-input" v-model="tel" placeholder="请输入手机号码" type="number"
							maxlength="11" />
					</view>
					<view class="content-item">
						<view class="title">
							<text>上传图片</text>
							<text style="color: #ccc; font-size: 28upx; font-weight: 400">（最多三张）</text>
						</view>
						<image-drag-sort @imageUpload="imageUploadComplaint" :picNum="3"></image-drag-sort>
					</view>


				</view>
			</view>
			<view class="uni-flex-center tenance-foot">
				<button class="foot-btn" plain :disabled="disabled" @tap="handleSubmit">
					提交
				</button>
			</view>
		</view>
	</view>
</template>

<script>
	import imageDragSort from "@/components/image-drag-sort/index.vue";
	import qiniuUploader from "@/common/js/qiniuUploader.js";
	export default {
		components: {
			imageDragSort,
		},
		data() {
			return {
                comprehensive: [
					{ id: 15, typename: "找装修", ptype: 4 },
					{ id: 16, typename: "找保洁", ptype: 4 },
					{ id: 17, typename: "其他服务需求", ptype: 4 },
				], // 类型列表
				content: "", // 内容
				currentId: '', // 从首页带过来的装修办理id:15,，综合服务id：16
				complaintImages: [], //报事报修要上传的图片
				disabled: false,
				name: '', // 联系人
				tel: '', // 联系电话
			};
		},
		computed: {
			qiniuDatas() {
				return this.$store.state.qiniuData;
			},
			nowDay() {
                const date = new Date();
				return `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`;
			},
            typeList() {
                // 装修办理只能选（装修办理），综合服务可选（家政服务/其他留言）
                if (this.currentId == 15) {
                    return this.comprehensive.filter((v => v.id === 15))
                } else {
                    return this.comprehensive.filter((v => v.id !== 15))
                }
            },
		},
        onShow() {
			if (this.$store.state.login_token) {
				this.getTypeList();
				this.getUpToken();
			}
		},
		onLoad(option) {
			this.currentId = this.$Route.query.id;
		},
		methods: {
            getTypeList() {
                this.$api.repairStart({}, res => {
                    if (res.code === 1) {
                        this.comprehensive = res.data.comprehensive || []
                    }
				});
            },
			getUpToken() {
				this.$api.upToken({}, (res) => {
					this.$store.commit("setQiniuData", res.data);
				});
			},
			changeType(item) {
				this.currentId = item.id;
			},
			// 上传的图片
			imageUploadComplaint(img) {
				this.complaintImages = img;
			},
			imageUploads() {
				let _this = this;
				return new Promise((resolve) => {
					let keys = [];
					let token = this.qiniuDatas.Data;
					let domain = this.qiniuDatas.http_domain;
					let bucket = this.qiniuDatas.bucket;
					_this.complaintImages.forEach((filePath) => {
						let key =
							"sunest-" + this.nowDay + "-" + new Date().getTime() + ".jpg";
						keys.push(key);
						qiniuUploader.upload(
							filePath,
							(res) => {
								// console.log('ressss: ' + JSON.stringify(res));
							},
							(error) => {
								// resolve(error)
							}, {
								region: "SCN", // ECN, SCN, NCN, NA, ASG，分别对应七牛的：华东，华南，华北，北美，新加坡 5 个区域
								domain: domain, // // bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL 字段。否则需要自己拼接
								key: key, // [非必须]自定义文件 key。如果不设置，默认为使用微信小程序 API 的临时文件名
								// 以下方法三选一即可，优先级为：uptoken > uptokenURL > uptokenFunc
								uptoken: token, // 由其他程序生成七牛 uptoken
							},
							(res) => {
								if (res.progress === 100) {
									resolve(keys);
								}
							}
						);
					});
				});
			},
			async handleSubmit() {
				if (!this.$store.state.login_token) {
					uni.showModal({
						title: '提示',
						content: '此功能需要验证您的身份，登录后使用完整综合服务。是否前往登录？',
						cancelColor: '#898989',
						cancelText: '取消',
						confirmColor: '#fe845e',
						confirmText: '去登录',
						success(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pages/login/login'
								})
							}
						}
					});
					return
				}
				if (!this.content) {
					uni.showToast({
						icon: "none",
						title: "请填写内容",
					});
					return;
				}
				if (!this.name) {
					uni.showToast({
						icon: "none",
						title: "请填写联系人",
					});
					return;
				}
				if (!this.tel) {
					uni.showToast({
						icon: "none",
						title: "请输入联系电话",
					});
					return;
				}
                const reg = /^1[3-9]\d{9}$/;
				if (!reg.test(this.tel)) {
                    uni.showToast({
						icon: "none",
						title: "请正确输入联系电话",
					});
					return;
				}
				// this.disabled = !this.disabled;
				uni.showLoading({
					title: "正在提交数据...",
				});
				let _this = this;
				let imgs = ""; //七牛云图片名
				if (this.complaintImages.length !== 0) {
					imgs = await this.imageUploads();
				}
				const data = {
                    // vid: this.$store.state.myHouse.ownerInfo.roomid, // 小区ID
                    type: this.currentId,
					content: this.content,
                    name: this.name,
                    tel: this.tel,
					imgs: JSON.stringify(imgs),
				};
				try {
					this.$api.comprehensive(data, (res) => {
						if (res.code === 1) {
							uni.showToast({
								icon: 'none',
								title: '提交成功，我们将及时和您联系',
								duration: 2000
							});
							setTimeout(() => {
								uni.hideLoading();
								_this.disabled = !_this.disabled;
								uni.navigateBack({
									delta: 1,
								});
							}, 1800);
						}
						uni.hideLoading();
					});
				} catch (error) {
					uni.hideLoading();
				}
			},
		},
		
	};
</script>
<style scoped>
	@import "./integrated-service.css";
</style>