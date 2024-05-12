<!-- eslint-disable indent -->
<!-- eslint-disable no-mixed-spaces-and-tabs -->
<!-- Developed by Taipei Urban Intelligence Center 2023-2024-->

<script setup>
import { ref, computed } from "vue";
import { useDialogStore } from "../../store/dialogStore";

import { jsonToCsv } from "../../assets/utilityFunctions/jsonToCsv";
import DialogContainer from "./DialogContainer.vue";

const dialogStore = useDialogStore();

// Stores the inputted dashboard name
const name = ref(dialogStore.moreInfoContent.name);
// Stores the file type
const fileType = ref("JSON");

console.log("test");

const prevJsonData = computed(() => {
	return JSON.stringify(dialogStore.moreInfoContent.chart_data, null, "\t");
});

const prevCsvData = computed(() => {
	const csvString = dialogStore.moreInfoContent.chart_data
		? jsonToCsv(
				dialogStore.moreInfoContent.chart_data,
				dialogStore.moreInfoContent.chart_config
		  )
		: "";
	return csvString
		.trim()
		.split("\n")
		.map((row) => row.split(","));
});

const parsedJson = computed(() => {
	let json = {};
	json.data = dialogStore.moreInfoContent.chart_data;
	if (dialogStore.moreInfoContent.chart_config.categories) {
		json.categories = dialogStore.moreInfoContent.chart_config.categories;
	}

	const jsonString = encodeURIComponent(JSON.stringify(json));
	// const base64Json = btoa(jsonString)
	return jsonString;
});

const parsedCsv = computed(() => {
	const csvString = dialogStore.moreInfoContent.chart_data
		? jsonToCsv(
				dialogStore.moreInfoContent.chart_data,
				dialogStore.moreInfoContent.chart_config
		  )
		: "";
	return encodeURI(csvString);
});

function handleSubmit() {
	handleClose();
}
function handleClose() {
	name.value = dialogStore.moreInfoContent.name;
	dialogStore.dialogs.downloadData = false;
}

function isValidDateTimeFormat(dateTimeString) {
	// Regular expression to match the datetime format: YYYY-MM-DDTHH:MM:SS
	const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

	// Check if the datetime string matches the regex pattern
	return dateTimeRegex.test(dateTimeString);
}

function shortenDatetime(dateTimeString) {
	const date = new Date(dateTimeString);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");
	const seconds = String(date.getSeconds()).padStart(2, "0");

	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
</script>

<template>
	<DialogContainer :dialog="`downloadData`" @on-close="handleClose">
		<div class="downloaddata">
			<h2>資料預覽</h2>
			<div
				v-if="name && fileType === 'JSON'"
				class="downloaddata, previewDataCss"
			>
				<pre class="downloaddata-control-preview">{{
					prevJsonData
				}}</pre>
			</div>
			<table
				v-if="name && fileType === 'CSV'"
				class="downloaddata, previewDataCss"
			>
				<table class="downloaddata-control-preview">
					<tr v-for="items in prevCsvData" key="items.id">
						<td v-for="item in items" key="item.id">
							{{
								isValidDateTimeFormat(item)
									? shortenDatetime(item)
									: item
							}}
						</td>
					</tr>
				</table>
			</table>
		</div>

		<div class="downloaddata">
			<h2>下載資料</h2>
			<div class="downloaddata-input">
				<h3>請輸入檔名</h3>
				<input v-model="name" type="text" :minlength="1" required />
			</div>
			<h3>請選擇檔案格式</h3>
			<div>
				<input
					id="JSON"
					v-model="fileType"
					class="downloaddata-radio"
					type="radio"
					value="JSON"
				/>
				<label for="JSON">
					<div />
					JSON
				</label>
				<input
					id="CSV"
					v-model="fileType"
					class="downloaddata-radio"
					type="radio"
					value="CSV"
				/>
				<label for="CSV">
					<div />
					CSV (UTF-8)
				</label>
			</div>
			<div class="downloaddata-control">
				<button
					class="downloaddata-control-cancel"
					@click="handleClose"
				>
					取消
				</button>
				<button
					v-if="name && fileType === 'JSON'"
					class="downloaddata-control-confirm"
					@click="handleSubmit"
				>
					<a
						:href="`data:application/json;charset=utf-8,${parsedJson}`"
						:download="`${name}.json`"
						>下載JSON</a
					>
				</button>
				<button
					v-if="name && fileType === 'CSV'"
					class="downloaddata-control-confirm"
					@click="handleSubmit"
				>
					<a
						:href="`data:text/csv;charset=utf-8,${parsedCsv}`"
						:download="`${name}.csv`"
						>下載CSV</a
					>
				</button>
			</div>
		</div>
	</DialogContainer>
</template>

<style scoped lang="scss">
.previewDataCss {
	border-right: 2px solid var(--color-border);
	margin-right: 10px;
	padding-right: 10px;
	border-radius: 0;
}
.downloaddata {
	width: 300px;
	display: inline-block;
	overflow: auto;
	vertical-align: top;

	h3 {
		margin-bottom: 0.5rem;
		font-size: var(--font-s);
		font-weight: 400;
		color: var(--color-complement-text);
	}

	&-input {
		display: flex;
		flex-direction: column;
		margin: 0.5rem 0;
	}

	&-radio {
		display: none;

		&:checked + label {
			color: white;

			div {
				background-color: var(--color-highlight);
			}
		}

		&:hover + label {
			color: var(--color-highlight);

			div {
				border-color: var(--color-highlight);
			}
		}
	}

	label {
		position: relative;
		display: flex;
		align-items: center;
		margin-bottom: 2px;
		font-size: var(--font-s);
		color: var(--color-complement-text);
		transition: color 0.2s;
		cursor: pointer;

		div {
			width: calc(var(--font-s) / 2);
			height: calc(var(--font-s) / 2);
			margin-right: 4px;
			padding: calc(var(--font-s) / 4);
			border-radius: 50%;
			border: 1px solid var(--color-border);
			transition: background-color 0.2s;
		}
	}

	&-control {
		display: flex;
		justify-content: flex-end;

		&-cancel {
			margin: 0 2px;
			padding: 4px 6px;
			border-radius: 5px;
			transition: color 0.2s;

			&:hover {
				color: var(--color-highlight);
			}
		}

		&-confirm {
			margin: 0 2px;
			padding: 4px 10px;
			border-radius: 5px;
			background-color: var(--color-highlight);
			transition: opacity 0.2s;

			&:hover {
				opacity: 0.8;
			}
		}

		&-preview {
			overflow: scroll;
			margin: 2px;
			padding: 4px 10px;
			border-radius: 5px;
			width: 100%;
			height: 400px;
			float: left;
			font-size: var(--font-ms);
			display: inline-block;
			vertical-align: top;
			color: var(--color-complement-text);
			transition: opacity 0.2s;
		}
	}
}
</style>
message.txt 6 KB
