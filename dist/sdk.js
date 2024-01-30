/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/environment.ts":
/*!****************************!*\
  !*** ./src/environment.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   BeansMerchantSdkEnvironment: () => (/* binding */ BeansMerchantSdkEnvironment)\n/* harmony export */ });\nvar BeansMerchantSdkEnvironment;\n(function (BeansMerchantSdkEnvironment) {\n    BeansMerchantSdkEnvironment[\"STAGING\"] = \"api.staging.beansapp.com\";\n    BeansMerchantSdkEnvironment[\"PRODUCTION\"] = \"api.beansapp.com\";\n})(BeansMerchantSdkEnvironment || (BeansMerchantSdkEnvironment = {}));\n\n\n//# sourceURL=webpack://beans-merchant-sdk/./src/environment.ts?");

/***/ }),

/***/ "./src/sdk.ts":
/*!********************!*\
  !*** ./src/sdk.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   BeansMerchantSdk: () => (/* binding */ BeansMerchantSdk),\n/* harmony export */   BeansMerchantSdkEnvironment: () => (/* reexport safe */ _environment__WEBPACK_IMPORTED_MODULE_0__.BeansMerchantSdkEnvironment)\n/* harmony export */ });\n/* harmony import */ var _environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./environment */ \"./src/environment.ts\");\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\n\n\nclass BeansMerchantSdk {\n    constructor(environment, apiKey, debug = false) {\n        this.environment = environment;\n        this.apiKey = apiKey;\n        this.debug = debug;\n    }\n    fetchCurrencies(stellarAccountId) {\n        return __awaiter(this, void 0, void 0, function* () {\n            const url = `https://${this.environment}/v3/companies/me/accounts/${stellarAccountId}/stellar-currencies`;\n            try {\n                const response = yield fetch(url, {\n                    headers: {\n                        'X-Beans-Company-Api-Key': this.apiKey\n                    }\n                });\n                const data = yield response.json();\n                return data;\n            }\n            catch (error) {\n                if (this.debug) {\n                    console.error('Error fetching currencies:', error);\n                }\n                throw error;\n            }\n        });\n    }\n    generatePngQRCode(stellarAccountId, currencyId, amount, memo, webhookUrl = null, preferredSize = null) {\n        return __awaiter(this, void 0, void 0, function* () {\n            const url = `https://${this.environment}/v3/companies/me/accounts/${stellarAccountId}/payment-request`;\n            const body = {\n                \"stellarCurrencyId\": currencyId,\n                \"amount\": amount,\n                \"memo\": memo,\n                \"paymentReceivedWebHookUrl\": webhookUrl,\n                \"deeplink\": {\n                    \"include\": true\n                },\n                \"pngQrCodeBase64String\": {\n                    \"include\": true,\n                    \"preferredSize\": preferredSize\n                }\n            };\n            try {\n                const response = yield fetch(url, {\n                    method: 'POST',\n                    headers: {\n                        'Content-Type': 'application/json',\n                        'X-Beans-Company-Api-Key': this.apiKey\n                    },\n                    body: JSON.stringify(body)\n                });\n                const data = yield response.json();\n                return data;\n            }\n            catch (error) {\n                if (this.debug) {\n                    console.error('Error generating QR code:', error);\n                }\n                throw error;\n            }\n        });\n    }\n    generateSvgQRCode(stellarAccountId, currencyId, amount, memo, webhookUrl = null, size = null) {\n        return __awaiter(this, void 0, void 0, function* () {\n            const url = `https://${this.environment}/v3/companies/me/accounts/${stellarAccountId}/payment-request`;\n            const body = {\n                \"stellarCurrencyId\": currencyId,\n                \"amount\": amount,\n                \"memo\": memo,\n                \"paymentReceivedWebHookUrl\": webhookUrl,\n                \"deeplink\": {\n                    \"include\": true\n                },\n                \"svgQrCode\": {\n                    \"include\": true,\n                    \"size\": size\n                }\n            };\n            try {\n                const response = yield fetch(url, {\n                    method: 'POST',\n                    headers: {\n                        'Content-Type': 'application/json',\n                        'X-Beans-Company-Api-Key': this.apiKey\n                    },\n                    body: JSON.stringify(body)\n                });\n                const data = yield response.json();\n                return data;\n            }\n            catch (error) {\n                if (this.debug) {\n                    console.error('Error generating QR code:', error);\n                }\n                throw error;\n            }\n        });\n    }\n}\n\n\n//# sourceURL=webpack://beans-merchant-sdk/./src/sdk.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/sdk.ts");
/******/ 	
/******/ })()
;