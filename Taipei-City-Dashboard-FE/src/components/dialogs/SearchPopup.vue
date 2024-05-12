<script setup>
import { ref } from "vue";
import { useDialogStore } from "../../store/dialogStore";
import { useMapStore } from "../../store/mapStore";

import DialogContainer from "./DialogContainer.vue";

const dialogStore = useDialogStore();
const name = ref(dialogStore.moreInfoContent.name);

const mapStore = useMapStore();

const searchType = ref("Distance");

const nNumber = ref(3);
const distance = ref(1500);

function handleClose(isComfirm) {
	if (isComfirm) {
		mapStore.algorithmItem = searchType.value;
		mapStore.searching = true;
		mapStore.searchingData =
			searchType.value === "NPosition"
				? nNumber.value
				: distance.value / 1000;
	}
	dialogStore.dialogs.searchPopup = false;
	console.log(searchType.value);
	console.log(nNumber.value);
	console.log(distance.value);
	dialogStore.dialogs["moreInfo"] = false;
}
</script>

<template>
	<DialogContainer dialog="searchPopup" @on-close="handleClose(false)">
		<div class="searchPopup">
			<h2>搜尋條件</h2>

			<div>
				<input
					id="NPosition"
					type="radio"
					v-model="searchType"
					value="NPosition"
					class="searchPopup-input"
				/><label for="nNearby" class="searchPopup-label"
					>最近的幾個點</label
				>
			</div>

			<div>
				<input
					id="Distance"
					type="radio"
					v-model="searchType"
					value="Distance"
					class="searchPopup-input"
				/><label for="nNearby" class="searchPopup-label"
					>距離範圍搜尋</label
				>
			</div>

			<div v-if="name && searchType === 'NPosition'">
				<h3>輸入想要搜尋的位置數量</h3>
				<input v-model="nNumber" type="text" placeholder="點的數量" />
			</div>
			<div v-if="name && searchType === 'Distance'">
				<h3>輸入想要搜尋的距離(單位: 公尺)</h3>
				<input
					v-model="distance"
					type="text"
					placeholder="單位: 公尺"
				/>
			</div>
			<div class="searchPopup-control">
				<button
					class="searchPopup-control-confirm"
					@click="handleClose(true)"
				>
					確認
				</button>
			</div>
		</div>
	</DialogContainer>
</template>

<style scoped lang="scss">
.searchPopup {
	width: 300px;
	display: inline-block;

	h3 {
		margin-bottom: 0.5rem;
		font-size: var(--font-s);
		font-weight: 400;
		color: var(--color-complement-text);
	}
	div {
		width: 100%;
		padding: calc(var(--font-s) / 4);
		transition: background-color 0.2s;
	}

	&-input {
		display: inline-block;
		margin: 0.5rem 0;
		margin-right: 10px;

		textarea {
			font-size: var(--font-s);
			height: 160px;
			resize: none;
		}
	}

	&-label {
		white-space: nowrap;
		display: inline-block;
	}

	&-control {
		display: flex;

		&-confirm {
			margin: 10px 2px;
			padding: 4px 10px;
			border-radius: 5px;
			background-color: var(--color-highlight);
			transition: opacity 0.2s;

			&:hover {
				opacity: 0.8;
			}
		}
	}
}
</style>
