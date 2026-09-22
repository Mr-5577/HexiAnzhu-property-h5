<!-- 可开票科目说明 -->
<template>
    <view class="mask" v-if="value" @tap="close">
        <view class="dialog" @tap.stop="noop">
            <view class="dialog-title">可开票科目说明</view>

            <scroll-view class="dialog-body" scroll-y>
                <view class="subject-item" v-for="(item, index) in subjectList" :key="index">
                    <view class="subject-index">{{ index + 1 }}</view>
                    <text class="subject-text">{{ item }}</text>
                </view>
            </scroll-view>

            <view class="dialog-footer">
                <view class="dialog-btn confirm" @tap="close">我知道了</view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    name: "InvoiceSubjectDialog",
    props: {
        // 外部控制显隐
        value: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            // 可开票科目
            subjectList: [
                "物业管理服务",
                "车位管理服务",
                "装修管理服务",
                "建渣清运服务",
                "综合管理服务",
                "非机动车管理服务",
                "家政服务",
                "中介服务",
                "转供电",
                "出入证工本费",
                "门禁卡",
                "泄水费"
            ]
        };
    },
    methods: {
        // 阻止冒泡
        noop() { },

        // 关闭：通知父组件把 value 置 false
        close() {
            this.$emit("input", false);
            this.$emit("update:value", false);
        }
    }
};
</script>

<style lang="scss" scoped>
/* 遮罩层 */
.mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* 弹窗主体 */
.dialog {
    width: 600upx;
    max-height: 70vh;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border-radius: 16upx;
    overflow: hidden;

    .dialog-title {
        flex: none;
        padding: 24upx;
        font-size: 30upx;
        font-weight: 600;
        text-align: center;
        color: #333;
    }

    .dialog-body {
        flex: 1;
        max-height: 50vh;
        padding: 0 32upx 16upx;
        box-sizing: border-box;

        .subject-item {
            display: flex;
            align-items: center;
            padding: 10upx 0;
            // border-bottom: 1upx dashed #f0f0f0;

            &:last-child {
                border-bottom: none;
            }

            .subject-index {
                flex: none;
                width: 36upx;
                height: 36upx;
                line-height: 36upx;
                text-align: center;
                margin-right: 16upx;
                font-size: 22upx;
                color: #ec7f27;
                background-color: rgba(236, 127, 39, 0.1);
                border-radius: 50%;
            }

            .subject-text {
                flex: 1;
                font-size: 28upx;
                line-height: 40upx;
                color: #333;
                word-break: break-all;
            }
        }
    }

    .dialog-footer {
        flex: none;
        display: flex;
        border-top: 1upx solid #f0f0f0;

        .dialog-btn {
            flex: 1;
            height: 88upx;
            line-height: 88upx;
            text-align: center;
            font-size: 30upx;

            &:active {
                background-color: #f5f6f8;
            }

            &.confirm {
                color: #ffcf5a;
                font-weight: 600;
            }
        }
    }
}
</style>