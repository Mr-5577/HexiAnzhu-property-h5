<template>
	<view><web-view :src="websrc"></web-view></view>
</template>

<script>
export default {
	data() {
		return {
			websrc: ''
		};
	},

	onLoad(option) {
		this.websrc = `http://est.ygddwy.com/web/receipt.html?id=${option.id}`;
	}
};
</script>

<style></style>
