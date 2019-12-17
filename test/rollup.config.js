// rollup.config.js
import commonjs from 'rollup-plugin-commonjs';
export default {
	// 核心选项
	input: "index.js", // 必须

	output: {
		// 必须 (如果要输出多个，可以是一个数组)
		// 核心选项
		file: "bundle.js", // 必须
		format: "cjs" // 必须
	},
	plugins: [
		commonjs()
	]
};
