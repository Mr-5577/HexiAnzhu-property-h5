<template>
	<view class="pay">
		<view class="" v-if="roomData.summoney">
			<view class="uni-flex-center qf-wrapper">
				<view class="uni-cell-94 est-content">
					<view class="title uni-font-36 uni-font-bold uni-flex">
						<view>物业欠费（{{ preRoomData.label }}）</view>
					</view>
					<view class="uni-flex-btw est-content-header">
						<view class="uni-cell-10"></view>
						<view class="uni-cell-30">缴费月份</view>
						<view class="uni-cell-30">金额</view>
						<view class="uni-cell-30">优惠金额</view>
						<view class="uni-cell-30">缴费类型</view>
					</view>
					<view class="uni-flex-btw est-content-header" v-for="(item, index) in roomDetailList" :key="index">
						<checkbox style="transform:scale(0.7)" :disabled="item.disable" @click="checkBoxs(item)"
							:checked="item.checked" :value="item.id"></checkbox>
						<view class="uni-cell-30">{{ item.key }}</view>
						<view class="uni-cell-30">{{ item.money }}</view>
						<!-- 优惠金额 -->
						<view class="uni-cell-30">{{ item.disc_fee || 0 }}</view>
						<view class="uni-cell-30">{{ item.title }}</view>
					</view>
					<view class="heji">
						欠费合计：
						<text style="font-weight: 600;">{{ oweAllMoney }}</text>
						元
					</view>
				</view>
			</view>
		</view>
		<view>
			<view class="uni-flex-center">
				<view class="uni-cell-94 est-content" v-if="preRoomData.label">
					<view class="title  uni-font-bold">物业预缴（{{ preRoomData.label }}）</view>
					<view class="uni-flex-btw est-content-header">
						<view class="uni-cell-30">开始月份</view>
						<view class="uni-cell-30">费用/月</view>
						<view class="uni-cell-30">总优惠金额</view>
						<view class="uni-cell-30">选择缴费</view>
					</view>
					<view class="uni-flex-btw est-content-header">
						<view class="uni-cell-30">{{ preRoomData.yjmonth }}</view>
						<view class="uni-cell-30">{{ preRoomData.fee }}</view>
						<!-- 总优惠金额 -->
						<view class="uni-cell-30">{{ totalDiscount }}</view>
						<view class="uni-cell-30 uni-flex-btw">
							<view class="minus" @click="minus">-</view>
							<text style="padding-left: 20upx;padding-right: 20upx;">{{ monthNum }}</text>
							<view class="minus" style="background-color: #ffcf5a;" @click="append">+</view>
						</view>
					</view>
					<view class="heji">
						预缴合计：
						<text style="font-weight: 600;">{{ totalPrepaidAmount }}</text>
						元
					</view>
				</view>
			</view>
			<view class="uni-flex-center" v-if="activityData" @click="activeRule">
				<view class="uni-cell-94">
					<view class="activity">
						预缴优惠活动
					</view>
				</view>
			</view>

		</view>

		<view class="foot-pays" v-if="roomData.summoney || preRoomData.label">
			<view class="discount-info" v-if="hasDiscountScheme">
				<text class="property-name">总优惠金额: {{ totalDiscountAmount }}</text>
				<view class="selection-scheme" @click="openPopup">
					<text class="scheme-text">{{ schemeText }}</text>
					<uni-icons type="arrowright" size="14"></uni-icons>
				</view>
			</view>
			<view class="tip">暂不支持水电费缴纳，请前往物业中心缴纳！</view>
			<view class="action-btn">
				<view class="uni-cell-70 money">
					合计缴费金额：
					<text class="uni-font-bold" style="color: #ffcf5a;">{{ preMoney }}</text>
				</view>
				<button class="uni-cell-30 to-pay" plain @click="payment" :class="{ 'po-event-none': disabled == true }"
					:disabled="disabled">去支付</button>
			</view>
		</view>
		<!-- 优惠方案选择 -->
		<uni-popup class="popup-dialog" ref="popupRef" type="bottom" background-color="#fff"
			border-radius="10px 10px 0 0" :is-mask-click="false">
			<view class="popup-contain">
				<view class="popup-top">
					<text class="popup-title">优惠方案</text>
					<uni-icons type="closeempty" size="18" class="close-btn" @click="closePopup"></uni-icons>
				</view>
				<view class="popup-content">
					<!-- 优惠组合列表 -->
					<view class="discount-groups" v-if="discountData.length > 0">
						<view 
							v-for="(combo,index) in discountData" 
							:key="index"
							class="group-item"
							:class="{ 'group-item-active': selectedGroupId === combo.line_id }"
							@click="toggleGroup(combo.line_id)"
						>
							<view class="group-header">
								<text class="group-name">{{ combo.name }}</text>
								<view class="group-action">
									<uni-icons 
										:type="selectedGroupId === combo.line_id ? 'checkmarkempty' : 'right'" 
										size="16" 
										color="#999"
									/>
								</view>
							</view>
							 <!-- 显示折扣信息 -->
							<view v-if="combo.has_discount" class="discount-section">
								<text class="discount">{{ combo.discount.sub_name }}</text>
							</view>
							<!-- 显示赠品信息 -->
							<view v-if="combo.has_gifts"class="gift-section">
								<!-- <view class="gift-section-title">赠送礼品</view> -->
								
								<!-- 循环赠品方案（可能有多个赠品方案） -->
								<view 
									v-for="giftScheme in combo.giftData" 
									:key="giftScheme.line_id"
									class="gift-scheme"
								>
									<!-- 赠品方案名称 -->
									<view v-if="giftScheme.sub_name" class="gift-scheme-name">
										{{ giftScheme.sub_name }}
									</view>
									
									<!-- 循环该方案下的所有赠品 -->
									<view class="gift-items">
										<view 
											v-for="gift in giftScheme.list" 
											:key="gift.gift_id"
											class="gift-item"
										>
											<text class="gift-name">{{ gift.gift_name }}</text>
											<text class="gift-quantity">{{ gift.gift_num }}{{ gift.gift_unit }}</text>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<!-- 空状态 -->
					<view v-else class="empty-state">
						<text class="empty-text">暂无优惠方案</text>
					</view>
				</view>
				<view class="popup-bottom" v-if="discountData.length > 0">
					<button class="submit-Btn" @click="confirmSelection">
						确定
					</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				payCostData: '',
				yearMonth: '',
				monthNum: 0, //默认预缴费3个月
				preRoomData: '',
				generatedList: [], //已生成缴费数据
				chooseList: [], //选择缴费数据
				chooseAll: false,
				disabled: false,
				price: '1',
				wgids: [], //物管id
				waterids: [], //水费id
				eleids: [], //电费id
				roomData: '',
				roomDetailList: [],
				checkIndex: [],
				activityData: '',
				
				totalDiscount: 0, // 总优惠
				discountData: [], // 优惠方案数据
				selectedGroupId: null, // 当前选中的方案ID
				selectedGroup: null, // 当前选中的方案
				previousSelectedGroupId: null,  // 保存之前选中的方案ID
				previousSelectedGroup: null,  // 保存之前选中的方案对象
				hasDiscountScheme: false, // 是否有优惠方案
			};
		},
		onShow() {
			this.disabled = false;
		},
		computed: {
			// 欠费合计（优惠后）
			oweAllMoney() {
				let owe = 0
				this.wgids = [];
				this.waterids = [];
				this.eleids = [];
				this.checkIndex = []
				this.roomDetailList.forEach((res, index) => {

					if (res.checked) {
						// 原始金额
						const originalMoney = parseFloat(res.money) || 0;
						// 优惠金额
						const discountFee = parseFloat(res.disc_fee) || 0;
						// 实际应付金额 = 原始金额 - 优惠金额
      					const actualMoney = originalMoney - discountFee;

						owe += actualMoney;

						if (res.type == 'wg') {
							this.wgids.push(res.id)
						}
						if (res.type == 'water') {
							this.waterids.push(res.id)
						}
						if (res.type == 'ele') {
							this.eleids.push(res.id)
						}
						this.checkIndex.push(index)
					}
				})
				return owe.toFixed(2)
			},
			// 预缴金额（优惠后）
			totalPrepaidAmount() {
				if (!this.preRoomData || !this.preRoomData.fee || this.monthNum <= 0) {
					return 0;
				}
				const fee = Number(this.preRoomData.fee);
				const monthNum = Number(this.monthNum);
				const totalDiscount = Number(this.totalDiscount) || 0;
				const totalAmount = (fee * monthNum - totalDiscount);
				return totalAmount > 0 ? totalAmount.toFixed(2) : 0;
			},
			// 合计缴费金额（优惠后的总金额）
			preMoney() {
				// 获取欠费金额
				const oweAmount = parseFloat(this.oweAllMoney) || 0;
				// 获取预缴金额
				const prepaidAmount = parseFloat(this.totalPrepaidAmount) || 0;
				// 计算总和并格式化
				return (oweAmount + prepaidAmount).toFixed(2);
			},
			// 总优惠金额（预缴和欠费）
			totalDiscountAmount() {
				let total = 0;
				// 计算欠费部分的优惠金额
				this.roomDetailList.forEach(item => {
					if (item.checked) {
						// 欠费项目的优惠金额
						const discountFee = parseFloat(item.disc_fee) || 0;
						total += discountFee;
					}
				});
				
				// 加上预缴部分的优惠金额
				const prepaidDiscount = parseFloat(this.totalDiscount) || 0;
				total += prepaidDiscount;
				
				return total.toFixed(2);
			},
			myRoom() {
				return this.$store.state.myRoom;
			},
			schemeText() {
				if(this.discountData && this.discountData.length > 0) {
					if (this.selectedGroup) {
						// 选中的可能是discount对象或combo对象
						return this.selectedGroup.line_group || this.selectedGroup.name || '已选择方案'
					} else {
						return '请选择优惠方案'
					}
				} else {
					return '请选择优惠方案'
				}
			},
			// 总金额（不包含优惠）
			totalOriginalAmount() {
				let total = 0;
				
				// 1. 计算欠费部分的原始金额（不包含优惠）
				this.roomDetailList.forEach(item => {
					if (item.checked) {
						// 欠费项目的原始金额（不含优惠）
						const originalMoney = parseFloat(item.money) || 0;
						total += originalMoney;
					}
				});
				
				// 2. 加上预缴部分的原始金额（不包含优惠）
				if (this.preRoomData && this.preRoomData.fee && this.monthNum > 0) {
					const fee = Number(this.preRoomData.fee);
					const monthNum = Number(this.monthNum);
					total += (fee * monthNum);
				}
				return total.toFixed(2);
			},
			// 欠费和预缴的优惠描述
			discountDescription() {
				let descriptions = [];
				// 1. 处理欠费项目的优惠描述
				this.roomDetailList.forEach(item => {
					if (item.checked && item.disc_fee && parseFloat(item.disc_fee) > 0) {
						const discount = parseFloat(item.disc_fee).toFixed(2);
						// descriptions.push(`${item.key}：优惠${discount}`);
						descriptions.push({ month: item.key, fee: item.money, disc_fee: discount });
					}
				});
				
				// 2. 处理预缴部分的优惠描述 - 显示每月明细（需要生成预缴月份列表）
				if (this.monthNum > 0 && this.preRoomData && this.preRoomData.yjmonth) {
					const prepaidDiscount = parseFloat(this.totalDiscount) || 0;
					if (prepaidDiscount > 0) {
						// 如果有选中的方案，获取每月明细
						if (this.selectedGroup) {
							let costList = [];
							if (this.selectedGroup.cost_list) {
								costList = this.selectedGroup.cost_list;
							} else if (this.selectedGroup.discount && this.selectedGroup.discount.cost_list) {
								costList = this.selectedGroup.discount.cost_list;
							}
							// 生成预缴月份列表
							const prepaidMonths = this.convertMonthlyData();
							
							// 查找每个月的优惠
							prepaidMonths.forEach(monthData => {
								const matchedMonth = costList.find(item => item.month === monthData.month);
								if (matchedMonth) {
									const discount = parseFloat(matchedMonth.disc_fee) || 0;
									// descriptions.push(`${monthData.month}：优惠${discount}`);
									descriptions.push({ month: monthData.month, fee: matchedMonth.fee, disc_fee: discount });
								}
							});
						} else {
							// 没有选中方案时显示总优惠
							// const startMonth = this.preRoomData.yjmonth;
							// descriptions.push(`预缴${startMonth}起合计优惠${prepaidDiscount.toFixed(2)}`);
						}
					}
				}
				return JSON.stringify(descriptions);
			},
		},
		methods: {
			// 通过选中的赠品方案，然后通过年月匹配来处理优惠金额
			processDataSimple(originData, newData) {
				// 1. 复制原始数据，避免修改原数据
				const resultData = originData.map(item => ({...item}));
				
				// 2. 创建新数据的映射（用month作为key）
				const feeMap = {};
				newData.forEach(item => {
					feeMap[item.month] = {
						disc_fee: item.disc_fee,
						fee: item.fee,
						pay_fee: item.pay_fee
					};
				});
				
				// 3. 遍历原始数据，匹配的添加disc_fee
				resultData.forEach(item => {
					const matched = feeMap[item.key];
					if (matched) {
					item.disc_fee = matched.disc_fee;
					// 标记已匹配（可选）
					item.matched = true;
					// 从映射中删除已匹配的
					delete feeMap[item.key];
					}
				});
				
				// 4. 计算未匹配的总金额
				let unmatchedTotal = 0;
				Object.values(feeMap).forEach(item => {
					unmatchedTotal += parseFloat(item.disc_fee) || 0;
				});
				
				return {
					data: resultData,       // 处理后的数据
					unmatchedTotal: unmatchedTotal.toFixed(2)  // 未匹配总金额
				};
			},
			// 年月递增 处理数据
			convertMonthlyData() {
				const { yjmonth, fee } = this.preRoomData;
				if(!(yjmonth && fee)) {
					return []
				}
				const result = [];
				const num = Number(this.monthNum)
				if (num > 0) {
					// 解析起始年月
					let year = parseInt(yjmonth.substring(0, 4));
					let month = parseInt(yjmonth.substring(4, 6));
					// 生成每个月的费用记录
					for (let i = 0; i < num; i++) {
						// 计算当前年月
						let currentYear = year;
						let currentMonth = month + i;
						// 处理月份进位
						if (currentMonth > 12) {
							currentYear += Math.floor((currentMonth - 1) / 12);
							currentMonth = ((currentMonth - 1) % 12) + 1;
						}
						// 格式化月份为两位数
						const formattedMonth = currentMonth.toString().padStart(2, '0');
						const monthStr = `${currentYear}${formattedMonth}`;
						result.push({
							month: monthStr,
							fee: fee // 如果每个月的费用相同，直接使用传入的fee
						});
					}
				}
				return result;
			},
			// 切换选中组合
			toggleGroup(lineId) {
				// 根据lineId找到对应的组合
				const selectedCombo = this.discountData.find(item => item.line_id === lineId );
				
				if (this.selectedGroupId === lineId) {
					// 如果点击已选中的，则取消选中
					this.selectedGroupId = null;
					this.selectedGroup = null;
				} else {
					// 选中新的组合
					this.selectedGroupId = lineId;
					// 保存整个combo对象，方便后续使用
					this.selectedGroup = selectedCombo || null;
				}
			},
			// 清除方案数据以及选中的数据
			clearSelection() {
				this.selectedGroup = null
				this.selectedGroupId = null
				this.discountData = []
			},
			// 确定选择
			confirmSelection() {
				// 如果没有选择任何方案
				if (!this.selectedGroupId) {
					uni.showToast({
						icon: 'none',
						title: '请先选择方案！'
					});
					return;
				}
				// 根据selectedGroupId找到选中的组合
				const selectedCombo = this.discountData.find(item => item.line_id === this.selectedGroupId);
				if (selectedCombo) {
					// 保存选中的完整combo对象
					this.selectedGroup = selectedCombo;
					
					// 选中方案重置数据的优惠金额
					this.roomDetailList.forEach((item) => item.disc_fee = 0);
					this.totalDiscount = 0;
					
					// 通过选中的方案内的优惠计算优惠金额
					const originData = this.roomDetailList || [];
					const costList = selectedCombo.discount ? selectedCombo.discount.cost_list || [] : [];
					
					const result = this.processDataSimple(originData, costList);
					this.roomDetailList = result.data || [];
					this.totalDiscount = result.unmatchedTotal || 0;

					// 关闭弹窗
					this.$refs.popupRef.close()
				} else {
					this.selectedGroup = null;
					uni.showToast({
						icon: 'none',
						title: '请先选择方案！'
					});
				}
			},
			// 打开优惠弹窗
			async openPopup() {
				try {
					// 保存当前的选中状态（用于取消时恢复）
					this.previousSelectedGroupId = this.selectedGroupId;
					this.previousSelectedGroup = this.selectedGroup;
					console.log('this.roomDetailList', this.roomDetailList)
					// 获取优惠方案
					await this.getDiscountScheme()
					this.$refs.popupRef.open(); // 打开弹窗
					// const preRoomList = this.roomDetailList.map((item) => {
					// 	if (item.checked) {
					// 		return {
					// 			month: item.key,
					// 			fee: item.money
					// 		}
					// 	}
					// })
					// const monthlyCostList  = this.convertMonthlyData()
					// const newCostList = preRoomList.concat(monthlyCostList )
					// const params = {
					// 	resources_type: 'house',
					// 	village_id: this.myRoom.vvid,
					// 	cost_list: JSON.stringify(newCostList),
					// 	total_money: this.preMoney || 0,
					// };
					// const resp = await this.$api.getDiscountsSolution(params)
					// if (resp.code === 1) {
					// 	const list = resp.data || []
					// 	// 处理数据
					// 	const newData = this.processData(list)
					// 	this.discountData = newData
					// 	// 当只有一个优惠方案时默认选中并计算优惠
					// 	if (this.discountData && this.discountData.length === 1) {
					// 		const firstData = this.discountData[0]
					// 		this.selectedGroupId = firstData.line_id;
					// 		this.selectedGroup = firstData;
					// 		// 保存当前的选中状态（用于取消时恢复）
					// 		this.previousSelectedGroupId = firstData.line_id;
					// 		this.previousSelectedGroup = firstData;

					// 		// 计算优惠，选中方案重置数据的优惠金额
					// 		this.roomDetailList.forEach((item) => item.disc_fee = 0);
					// 		this.totalDiscount = 0;
							
					// 		// 通过选中的方案内的优惠计算优惠金额
					// 		const originData = this.roomDetailList || [];
					// 		const costList = firstData.discount ? firstData.discount.cost_list || [] : [];
							
					// 		const result = this.processDataSimple(originData, costList);
					// 		this.roomDetailList = result.data || [];
					// 		this.totalDiscount = result.unmatchedTotal || 0;
					// 	}
					// 	this.$refs.popupRef.open();
					// 	console.log(newData)
					// }
				} catch (err) {
					console.log('err', err)
				}
			},
			// 请求优惠方案
			async getDiscountScheme() {
				const preRoomList = this.roomDetailList.map((item) => {
					if (item.checked) {
						return {
							month: item.key,
							fee: item.money
						}
					}
				})
				const monthlyCostList  = this.convertMonthlyData()
				const newCostList = preRoomList.concat(monthlyCostList )
				const params = {
					resources_type: 'house',
					village_id: this.myRoom.vvid,
					cost_list: JSON.stringify(newCostList),
					total_money: this.preMoney || 0,
				};
				const resp = await this.$api.getDiscountsSolution(params)
				if (resp.code === 1) {
					const list = resp.data || []
					// 处理数据
					const newData = this.processData(list)
					this.discountData = newData

					// 设置是否有优惠方案
					if (newData && newData.length > 0) {
						this.hasDiscountScheme = true
					} else {
						this.hasDiscountScheme = false
					}

					// 当只有一个优惠方案时默认选中并计算优惠
					if (this.discountData && this.discountData.length === 1) {
						const firstData = this.discountData[0]
						this.selectedGroupId = firstData.line_id;
						this.selectedGroup = firstData;
						// 保存当前的选中状态（用于取消时恢复）
						this.previousSelectedGroupId = firstData.line_id;
						this.previousSelectedGroup = firstData;

						// 计算优惠，选中方案重置数据的优惠金额
						this.roomDetailList.forEach((item) => item.disc_fee = 0);
						this.totalDiscount = 0;
						
						// 通过选中的方案内的优惠计算优惠金额
						const originData = this.roomDetailList || [];
						const costList = firstData.discount ? firstData.discount.cost_list || [] : [];
						
						const result = this.processDataSimple(originData, costList);
						this.roomDetailList = result.data || [];
						this.totalDiscount = result.unmatchedTotal || 0;
					}
				}
			},
			// 关闭优惠弹窗
			closePopup() {
				// 关闭弹窗时恢复之前的选中状态
				this.selectedGroupId = this.previousSelectedGroupId;
				this.selectedGroup = this.previousSelectedGroup;
				
				this.$refs.popupRef.close()
			},
			// 处理优惠方案数据，按照折扣、赠品来组合
			processData(originalData) {
				if (!originalData || !Array.isArray(originalData)) {
					return [];
				}
				// 按line_group名称分组
				const groups = {};
				originalData.forEach(item => {
					const groupName = item.line_group; // 名称作为键
					if (!groups[groupName]) {
						groups[groupName] = {
							discounts: null,
							gifts: {}  // 用line_id作为键来区分不同的赠品方案
						};
					}
					// 判断是否是折扣
					if (item.disc_type === '折扣') {
						// 只保留sort最小的折扣
						if (!groups[groupName].discount || item.sort < groups[groupName].discount.sort) {
							groups[groupName].discount = item;
						}
					}
					// 判断是否是赠品
					if (item.disc_type === '赠品') {
						// 用line_id作为键，确保不同的赠品方案分开存储
						groups[groupName].gifts[item.line_id] = {
							...item,  // 存储整个赠品方案对象
							gift_list: item.gift_list || []
						};
					}
				});
				// 构建最终对象
				const resultArray = [];
				for (const groupName in groups) {
					const group = groups[groupName]; // 得到组合的数据
					// 构建赠品数据数组（区分不同的赠品方案）
					const giftArray = [];
					for (const lineId in group.gifts) {
						const giftItem = group.gifts[lineId];
						giftArray.push({
							line_id: giftItem.line_id,
							disc_line_id: giftItem.disc_line_id,
							sub_name: giftItem.sub_name,  // 赠品方案名称，如"缴费送礼（普通）"
							main_name: giftItem.main_name,
							list: giftItem.gift_list || []
						});
					}
					const hasGifts = giftArray.length > 0;
					const hasDiscount = !!group.discount;

					// 如果没有折扣也没有赠品，跳过
					if (!hasDiscount && !hasGifts) {
						continue;
					}

					// 确定这个组合的line_id（优先使用折扣的，没有则用第一个赠品的）
					let line_id = null;
					if (group.discount) {
						line_id = group.discount.line_id;
					} else if (giftArray.length > 0) {
						line_id = giftArray[0].line_id;
					}
					// 创建结果对象
					resultArray.push({
						name: groupName,
						line_id: line_id, // 添加line_id用于选中判断
						has_discount: hasDiscount,
						has_gifts: hasGifts,
						// 折扣数据（如果有折扣）
						discount: group.discount ? {
							...group.discount,
							giftData: hasGifts ? giftArray : null  // 有赠品才设置giftData
						} : null,
						// 单独的赠品数据
						giftData: hasGifts ? giftArray : [],
						// 赠品列表（平铺，用于generateorder）
						gift_list: hasGifts ? giftArray.flatMap(giftScheme => giftScheme.list) : []
					});
				}
				// 排序：有折扣的优先，都按sort排序, 过滤掉既没折扣也没赠品的
				return resultArray.filter(item => item.has_discount || item.has_gifts)
					.sort((a, b) => {
						// 按折扣的sort排序，如果没有折扣用999
						const aSort = a.discount?.sort || 999;
						const bSort = b.discount?.sort || 999;
						return aSort - bSort;
					});
			},
			activeRule() {
				uni.navigateTo({
					url: '/pages/activity-rule/activity-rule?rule=' + JSON.stringify(this.activityData)
				})
			},
			checkBoxs(w) {
				w.checked = !w.checked
				this.$forceUpdate();
				// 取消优惠金额。置空优惠方案
				this.roomDetailList.map((item) => item.disc_fee = 0)
				this.totalDiscount = 0
				this.clearSelection()
			},
			billTypeDetail(item) {
				this.$Router.push({
					name: 'bill-type-detail',
					params: {
						data: item
					}
				});
			},
			async payment() {
				let _this = this;
				if (this.checkIndex.length > 0) {
					for (let i = 0; i < this.checkIndex.length; i++) {
						if (i > 0) {
							if (this.checkIndex[i] - this.checkIndex[i - 1] != 1) {
								uni.showToast({
									icon: 'none',
									title: '必须选择连续月份缴费！'
								});
								return
							}
						}
					}
				}
				let wgids = this.$uitls.unique(this.wgids);
				let waterids = this.$uitls.unique(this.waterids);
				let eleids = this.$uitls.unique(this.eleids);
				const data = {
					// type	是	int	缴费类型 1房产类 2车位类
					// wgids	否	str	物管费欠费id,用逗号隔开；1,2,3
					// waterids	否	str	水费欠费id,用逗号隔开
					// eleids	否	str	电费欠费id,用逗号隔开
					type: '1',
					keyid: this.preRoomData.keyid,
					wgids: this.$uitls.toStrings(wgids),
					waterids: this.$uitls.toStrings(waterids),
					eleids: this.$uitls.toStrings(eleids),
					num: this.monthNum,
					owner_id: this.roomData.owner_id
				};
				if (this.roomData.new_system) {
					if (this.roomData.config.id) {
						data.subject_village_id = this.roomData.config.id;
					} else {
						uni.showToast({
							icon: 'none',
							title: '楼栋管家未绑定科目，请联系物业中心缴费！'
						});
						return;
					}
				}
				if (this.roomDetailList.length == 0) {
					if (this.monthNum > 0) {
						data.num = this.monthNum;
					} else {
						uni.showToast({
							icon: 'none',
							title: '最少预缴1个月'
						});
						return;
					}
				}
				if (this.monthNum > 0 && this.roomDetailList.length > 0) {
					let allNum = 0
					this.roomDetailList.forEach(res => {
						if (res.checked) {
							allNum++
						}
					})
					if (this.roomDetailList.length != allNum) {
						uni.showToast({
							icon: 'none',
							title: '存在欠费，请先缴清欠费'
						});
						return;
					}
				}
				if (this.roomDetailList.length > 0) {
					let allNum = 0
					this.roomDetailList.forEach(res => {
						if (res.checked) {
							allNum++
						}
					})
					if (allNum == 0) {
						uni.showToast({
							icon: 'none',
							title: '存在欠费，请先缴清欠费'
						});
						return;
					}
				}
				
				// 按钮loading
				this.disabled = true;

				// 获取最新的赠品方案
				const preRoomList = this.roomDetailList.map((item) => {
					if (item.checked) {
						return {
							month: item.key,
							fee: item.money
						}
					}
				})
				const costList = this.convertMonthlyData()
				const newCostList = preRoomList.concat(costList)
				const params = {
					resources_type: 'house',
					village_id: this.myRoom.vvid,
					cost_list: JSON.stringify(newCostList),
					total_money: this.preMoney || 0,
				};
				const resp = await this.$api.getDiscountsSolution(params)
				// 获取最新数据后进行验证
        		let latestData = []
				if (resp.code === 1) {
					const list = resp.data || []
					latestData = this.processData(list)
				}

				const hasSelected = !!this.selectedGroupId;
        		const hasSolutions = latestData.length > 0;

				// 更新是否有优惠方案
    			this.hasDiscountScheme = hasSolutions;

				// 情况1：有方案但没有选择 → 需要选择
				if (hasSolutions && !hasSelected) {
					uni.showToast({ icon: 'none', title: '请选择优惠方案' });
					this.disabled = false;
					return;
				}

				// 情况2：有方案且已选择 → 验证有效性
				if (hasSolutions && hasSelected) {
					// 需要找到对应的原始数据来验证
					const isValid = latestData.some(it => {
						// 检查原始数据中是否有匹配的line_id
						return it.line_id === this.selectedGroupId
					});
					
					if (!isValid) {
						uni.showToast({ icon: 'none', title: '方案已失效，请重新选择' });
						this.disabled = false;
						return;
					}
				}

				// 情况3：无方案但之前选择了 → 方案失效
				if (!hasSolutions && hasSelected) {
					// uni.showToast({ icon: 'none', title: '优惠方案已失效' });

					// // 重置优惠金额
					// this.roomDetailList.forEach((item) => item.disc_fee = 0);  // 重置欠费优惠
					// this.totalDiscount = 0;  // 重置预缴优惠 - 物业预缴列表里的总优惠金额

					// this.selectedGroup = null;
					// this.selectedGroupId = null;
					// this.disabled = false;
					// return;

					// 重置优惠金额和优惠方案，不return，继续执行支付流程
					this.roomDetailList.forEach((item) => item.disc_fee = 0);
					this.totalDiscount = 0;

					this.selectedGroup = null;
					this.selectedGroupId = null;
				}

				// 情况4：无方案也没有选择 → 自动设置无方案状态，直接放行
				if (!hasSolutions && !hasSelected) {
					this.selectedGroup = null;
					this.selectedGroupId = null;
				}
				
				// this.disabled = true;
				//获取活动规则
				this.$api.checkCostHasPrestoreActivity({
					type: 'rooms',
					num: this.monthNum,
					keyid: this.preRoomData.keyid,
					cost_ids: this.$uitls.toStrings(wgids),
					subject_village_id: this.roomData.config.id,
					vid: this.roomData.config.vid,
					owner_id: this.roomData.owner_id
				}).then(res => {
					if (res.code == 1 && res.data.result) {
						uni.showModal({
							content: `当前缴费已经满足预缴${res.data.use_activity_rule.prestore_ymonth}个月赠送${res.data.use_activity_rule.preferential_ymonth}个月活动，支付成功系统将自动为您优惠！`,
							title: `满足活动提醒！`,
							showCancel: false,
							success(s) {
								if (s.confirm) {
									data['use_activity'] = 'prestore_preferential'
									_this.generateorder(data)
								}
							}
						})
					} else {
						this.generateorder(data)
					}
					this.disabled = false;
				}).catch(err => {
					this.disabled = false;
				})

			},
			//生成订单
			async generateorder(data) {
				uni.showLoading({
					title: '生成订单中...',
					mask: true,
				});
				try {
					const orderRes = await this.$api.generateorder(data)
					// 生成订单后需要保存之前选择的方案
					if (orderRes.code === 1) {
						const orderId = orderRes.ordernum || (orderRes.data && orderRes.data.ordernum)
	
						// 获取赠品列表
						let giftList = [];
						let discLineId = '';
						let lineId = '';
	
						// 只有在选中方案时才处理优惠相关数据
						if (this.selectedGroup) {
							if (this.selectedGroup.gift_list && this.selectedGroup.gift_list.length > 0) {
								// 如果selectedGroup有gift_list（来自combo对象）
								giftList = this.selectedGroup.gift_list.map(item => ({
									disc_gift_id: item.disc_gift_id,
									gift_id: item.gift_id,
									gift_num: item.gift_num,
								}));
							} else if (this.selectedGroup.discount && this.selectedGroup.discount.giftData) {
								// 如果selectedGroup是discount对象，从giftData获取
								giftList = this.selectedGroup.giftData.flatMap(giftScheme => 
									giftScheme.list.map(item => ({
										disc_gift_id: item.disc_gift_id,
										gift_id: item.gift_id,
										gift_num: item.gift_num,
									}))
								);
							}
							// 获取折扣信息
							const discountData = this.selectedGroup.discount;
							if (discountData) {
								discLineId = discountData.disc_line_id || '';
								lineId = discountData.line_id || '';
							}
						}
						const params = {
							order_sn_app: orderId, // 订单ID
							disc_line_id: discLineId, // 折扣的disc_line_id
							line_id: lineId, // 折扣的line_id
							should_money: this.totalOriginalAmount, // 应付金额（优惠前总金额）
							discount_money: this.totalDiscountAmount, // 总优惠金额
							discount_desc: this.discountDescription, // 优惠描述
							gift_list: JSON.stringify(giftList)
						}
						try {
							const saveRes = await this.$api.saveDiscountsSolution(params)
							uni.hideLoading();
							if (saveRes.code === 1) {
								let orderData = {
									sn: orderId,
									money: this.preMoney,
									type: 'house',
								};
								this.$store.commit('setOrderData', orderData);
								this.$Router.push({
									name: 'payment'
								});
							}
						} catch (error) {
							uni.hideLoading();
							console.log(error)
						}
					}
				} catch (error) {
					uni.hideLoading();
				}
			},
			async getRoomsMaterials() {
				let data = {
					roomid: this.myRoom.roomid
				};
				try {
					const res = await this.$api.getRoomsMaterial(data)
					this.roomData = res.data;
					this.roomDetailList = [];
					for (let var1 in this.roomData.qfinfo) {
						let data = {};
						data.key = var1.replace(/\"/g, '');
						if (this.roomData.qfinfo[var1].wg) {
							//物业费id
							data.checked = true;
							data.title = this.roomData.qfinfo[var1].wg.table_type;
							data.money = this.roomData.qfinfo[var1].wg.money;
							data.disable = this.roomData.qfinfo[var1].wg.disable;
							data.id = this.roomData.qfinfo[var1].wg.id;
							data.type = 'wg'
						}
						if (this.roomData.qfinfo[var1].water) {
							//水费id
							data.checked = true;
							data.title = this.roomData.qfinfo[var1].water.table_type;
							data.money = this.roomData.qfinfo[var1].water.money;
							data.disable = this.roomData.qfinfo[var1].water.disable;
							data.id = this.roomData.qfinfo[var1].water.id;
							data.type = 'water'
						}
						if (this.roomData.qfinfo[var1].ele) {
							data.checked = true;
							data.title = this.roomData.qfinfo[var1].ele.table_type;
							data.money = this.roomData.qfinfo[var1].ele.money;
							data.disable = this.roomData.qfinfo[var1].ele.disable;
							data.id = this.roomData.qfinfo[var1].ele.id;
							data.type = 'ele'
						}
						this.roomDetailList.push(data);
					}
					if (this.roomDetailList.length > 0) {
						this.monthNum = 0
					} else {
						this.monthNum = 1
					}
					this.getPrestoreActivity()
				} catch (err) {}
			},

			//判断一串数字是否是连续的 并且必须选择第一个
			isContinuityNum(num) {
				let array = [];
				if (num instanceof Array) {
					array = [...num];
				} else {
					array = Array.from(num.toString()); //转换为数组
				}
				var i = array[0];
				var isContinuation = true;
				for (var e in array) {
					if (array[e] != i) {
						isContinuation = false;
						break;
					}
					//第一项必须为0
					if (array[0] != 0) {
						isContinuation = false;
						break;
					}
					i++;
				}
				return isContinuation;
			},
			append() {
				//当没有生成预缴数据时
				if (this.monthNum < 24) {
					this.monthNum = this.monthNum + 1;
				} else {
					uni.showToast({
						icon: 'none',
						title: '最多支持24个月预缴'
					});
				}
				this.roomDetailList.map((item) => item.disc_fee = 0)
				this.totalDiscount = 0
				this.clearSelection()
			},
			minus() {
				if (this.roomDetailList.length > 0) {
					if (this.monthNum > 0) {
						this.monthNum = this.monthNum - 1;
					} else {
						this.monthNum = 0
					}
				} else {
					if (this.monthNum > 0) {
						this.monthNum = this.monthNum - 1;
					} else {
						this.monthNum = 0
					}
				}
				this.roomDetailList.map((item) => item.disc_fee = 0)
				this.totalDiscount = 0
				this.clearSelection()
			},
			async getAdvancePaymentPage() {
				let data = {
					type: 1, //1房产 2车位
					keyid: this.id
				};
				const res = await this.$api.advancePaymentPagenew(data)
				this.preRoomData = res.data;
			},
			getPrestoreActivity() {
				let wgids = this.$uitls.unique(this.wgids);
				// 接口参数需要重新验证 TODO
				this.$api.getPrestoreActivity({
						type: 'rooms',
						keyid: this.preRoomData.keyid,
						cost_ids: this.$uitls.toStrings(wgids),
						subject_village_id: this.roomData.config.id,
						vid: this.roomData.config.vid
					})
					.then(res => {
						if (res.code == 1 && res.data.result) {
							this.activityData = res.data.activity_rule
						}
					})
			}

		},

		async onLoad(option) {
			if (option.id) {
				this.id = option.id;
				await this.getRoomsMaterials();
				await this.getAdvancePaymentPage();
				// 先把缴费数据加载完成再加载优惠方案
				await this.getDiscountScheme()
			}
		}
	};
</script>

<style>
	.activity {
		padding: 20upx;
		background-color: #fffbe5;
		color: rgb(255, 175, 25);
		margin-top: 30upx;
	}

	.pay {
		padding-bottom: 230upx;
		min-height: 100vh;
		box-sizing: border-box;
	}

	.uni-cell-94 {
		width: 94%;
	}

	.heji {
		color: #333;
		text-align: right;
		padding: 0 30upx 30upx;
	}

	.icon-right {
		line-height: 40upx;
		text-align: center;
		width: 40upx;
		height: 40upx;
		padding: 2upx;
		border-radius: 50%;
		font-weight: 700;
		color: #ffcf5a;
		position: absolute;
		border: 1upx solid #ffcf5a;
		border-radius: 50%;
	}

	.icon-rights {
		line-height: 40upx;
		text-align: center;
		width: 40upx;
		height: 40upx;
		padding: 2upx;
		border-radius: 50%;
		font-weight: 700;
		color: #ffcf5a;
		border: 1upx solid #ffcf5a;
		border-radius: 50%;
	}

	.minus {
		width: 50upx;
		height: 50upx;
		color: #fff;
		line-height: 50upx;
		text-align: center;
		background-color: #e6e6e6;
		font-size: 40upx;
	}

	.minus:active {
		opacity: 0.6;
	}

	.est-content {
		background: #ffffff;
		margin-top: 30upx;
		border-radius: 10upx;
	}

	.est-content .title {
		padding: 20upx;
		color: #333;
	}

	.est-content-header {
		height: 80upx;
		text-align: center;
		padding-right: 30upx;
		color: #333;
	}

	.pay-cost {
		background: #ffead7;
		border: 1upx solid #ffcf5a;
		color: #ffcf5a;
		border-radius: 10upx;
		padding: 5upx 20upx 5upx;
	}

	.foot-pays .tip {
		/* position: absolute;
		top: -36upx;
		left: 0; */
		width: 100%;
		height: 20px;
		line-height: 20px;
		padding: 0 30upx;
		background-color: #f7f6fb;
		color: #f56c6c;
		font-size: 24upx;
	}

	.foot-pays {
		position: fixed;
		height: 220upx;
		width: 100%;
		background: #ffffff;
		bottom: 0upx;
		line-height: 120upx;
	}
	.foot-pays .discount-info {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		flex-wrap: nowrap;
		align-items: center;
		padding: 0 30upx;
		box-sizing: border-box;
		height: 60upx;
		line-height: 60upx;
	}
	.foot-pays .discount-info .property-name {
		font-size: 26upx;
		color: #fb1616;
		font-weight: 600;
	}
	.foot-pays .discount-info .selection-scheme {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.foot-pays .discount-info .selection-scheme .scheme-text {
		font-size: 26upx;
		color: #707070;
	}
	.foot-pays .action-btn {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.foot-pays .money {
		line-height: 110upx;
		height: 110upx;
		padding-left: 30upx;
		font-size: 30upx;
	}

	.foot-pays .to-pay {
		color: #ffffff;
		border-radius: 50upx;
		width: 200upx;
		line-height: 80upx;
		height: 80upx;
		text-align: center;
		margin-top: 20upx;
		margin-right: 10upx;
		background-color: #ffcf5a;
		border: none !important;
	}

	.foot-pays .to-pay:active {
		opacity: 0.6;
	}
	.popup-dialog .popup-contain {
		width: 100%;
		height: 70vh;
		display: flex;
		flex-direction: column;
	}
	.popup-dialog .popup-top {
		width: 100%;
		height: 70upx;
		line-height: 70upx;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
	}
	.popup-dialog .popup-top .popup-title{
		color: #333;
		font-size: 32upx;
		font-weight: 600;
	}
	.popup-dialog .popup-top .close-btn{
		position: absolute;
		top: 0;
		right: 20upx;
	}
	.popup-dialog .popup-content{
		width: 100%;
		padding: 20upx 20upx;
		box-sizing: border-box;
		flex: 1;
		overflow-y: auto;
		height: calc(100% - 170upx);
	}
	/* 优惠组合样式 */
	.discount-groups {
		margin-bottom: 20upx;
	}

	.group-item {
		background: #fff;
		border-radius: 12upx;
		margin-bottom: 20upx;
		padding: 24upx;
		border: 2upx solid #eee;
		transition: all 0.3s;
	}

	.group-item-active {
		border-color: #ffcf5a;
		background-color: #fffcf3;
	}

	.group-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.group-name {
		font-size: 28upx;
		font-weight: 600;
		color: #333;
		max-width: 60%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.group-action {
		display: flex;
		align-items: center;
	}

	.group-action .group-sub-name {
		font-size: 24upx;
		color: #666;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin-right: 12upx;
	}
	.discount-section {
		width: 100%;
		padding-left: 30upx;
		box-sizing: border-box;
	}
	.discount-section .discount {
		font-size: 28upx;
		color: #333;
	}

	/* 礼品列表样式 */
	.gift-section {
		padding-left: 30upx;
		box-sizing: border-box;
	}

	.gift-section-title {
		font-size: 26upx;
		font-weight: 600;
		color: #333;
		margin-bottom: 12upx;
	}

	/* 赠品方案样式 */
	.gift-scheme {
		margin-bottom: 20upx;
	}

	.gift-scheme:last-child {
		margin-bottom: 0;
	}

	.gift-scheme-name {
		font-size: 28upx;
		color: #333;
		margin-bottom: 12upx;
		display: inline-block;
	}

	/* 赠品项样式 */
	.gift-items {
		padding-left: 30upx;
		box-sizing: border-box;
	}

	.gift-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.gift-item:last-child {
		border-bottom: none;
	}

	.gift-name {
		font-size: 26upx;
		color: #333;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 70%;
	}

	.gift-group {
		font-size: 22upx;
		color: #999;
		margin-left: 8upx;
		flex-shrink: 0;
	}

	.gift-quantity {
		font-size: 24upx;
		color: #ff6b35;
		font-weight: 500;
		margin-left: 16upx;
		flex-shrink: 0;
	}

	/* 空状态样式 */
	.empty-state {
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.empty-text {
		font-size: 28upx;
		color: #999;
	}

	.popup-dialog .popup-bottom{
		width: 100%;
		height: 80upx;
		display: flex;
		justify-content: center;
	}
	.popup-dialog .popup-bottom .submit-Btn{
		width: 70%;
		height: 60upx;
		line-height: 60upx;
		color: #fff;
		background: #ffcf5a;
		font-size: 28upx;
		font-weight: 600;
		border: none;
	}
</style>