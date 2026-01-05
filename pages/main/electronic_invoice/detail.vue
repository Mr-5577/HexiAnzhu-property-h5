<template>
    <view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                webviewStyles: {
                    progress: {
                        color: '#FF3333'
                    }
                },
				invoiceUrl:''
            }
        },
		onLoad() {
			let invoiceUrl = this.$Route.query.url;
			var w = plus.webview.create(invoiceUrl);
				plus.webview.show(w); // 显示窗口
		}
    }
</script>

<style>

</style>