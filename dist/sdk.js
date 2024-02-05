/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ var __webpack_modules__ = ({

/***/ "./src/environment.ts":
/*!****************************!*\
  !*** ./src/environment.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   BeansMerchantSdkEnvironment: () => (/* binding */ BeansMerchantSdkEnvironment)\n/* harmony export */ });\nvar BeansMerchantSdkEnvironment;\r\n(function (BeansMerchantSdkEnvironment) {\r\n    BeansMerchantSdkEnvironment[\"STAGING\"] = \"api.staging.beansapp.com\";\r\n    BeansMerchantSdkEnvironment[\"PRODUCTION\"] = \"api.beansapp.com\";\r\n})(BeansMerchantSdkEnvironment || (BeansMerchantSdkEnvironment = {}));\r\n\n\n//# sourceURL=webpack://beans-merchant-sdk/./src/environment.ts?");

/***/ }),

/***/ "./src/sdk.ts":
/*!********************!*\
  !*** ./src/sdk.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   BeansMerchantSdk: () => (/* binding */ BeansMerchantSdk),\n/* harmony export */   BeansMerchantSdkEnvironment: () => (/* reexport safe */ _environment__WEBPACK_IMPORTED_MODULE_0__.BeansMerchantSdkEnvironment)\n/* harmony export */ });\n/* harmony import */ var _environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./environment */ \"./src/environment.ts\");\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\nvar __generator = (undefined && undefined.__generator) || function (thisArg, body) {\r\n    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;\r\n    return g = { next: verb(0), \"throw\": verb(1), \"return\": verb(2) }, typeof Symbol === \"function\" && (g[Symbol.iterator] = function() { return this; }), g;\r\n    function verb(n) { return function (v) { return step([n, v]); }; }\r\n    function step(op) {\r\n        if (f) throw new TypeError(\"Generator is already executing.\");\r\n        while (g && (g = 0, op[0] && (_ = 0)), _) try {\r\n            if (f = 1, y && (t = op[0] & 2 ? y[\"return\"] : op[0] ? y[\"throw\"] || ((t = y[\"return\"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;\r\n            if (y = 0, t) op = [op[0] & 2, t.value];\r\n            switch (op[0]) {\r\n                case 0: case 1: t = op; break;\r\n                case 4: _.label++; return { value: op[1], done: false };\r\n                case 5: _.label++; y = op[1]; op = [0]; continue;\r\n                case 7: op = _.ops.pop(); _.trys.pop(); continue;\r\n                default:\r\n                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }\r\n                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }\r\n                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }\r\n                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }\r\n                    if (t[2]) _.ops.pop();\r\n                    _.trys.pop(); continue;\r\n            }\r\n            op = body.call(thisArg, _);\r\n        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }\r\n        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };\r\n    }\r\n};\r\n\r\n\r\nvar BeansMerchantSdk = /** @class */ (function () {\r\n    function BeansMerchantSdk(environment, apiKey, debug) {\r\n        if (debug === void 0) { debug = false; }\r\n        this.environment = environment;\r\n        this.apiKey = apiKey;\r\n        this.debug = debug;\r\n    }\r\n    BeansMerchantSdk.prototype.fetchCurrencies = function (stellarAccountId) {\r\n        return __awaiter(this, void 0, void 0, function () {\r\n            var url, response, data, error_1;\r\n            return __generator(this, function (_a) {\r\n                switch (_a.label) {\r\n                    case 0:\r\n                        url = \"https://\".concat(this.environment, \"/v3/companies/me/accounts/\").concat(stellarAccountId, \"/stellar-currencies\");\r\n                        _a.label = 1;\r\n                    case 1:\r\n                        _a.trys.push([1, 4, , 5]);\r\n                        return [4 /*yield*/, fetch(url, {\r\n                                headers: {\r\n                                    'X-Beans-Company-Api-Key': this.apiKey\r\n                                }\r\n                            })];\r\n                    case 2:\r\n                        response = _a.sent();\r\n                        return [4 /*yield*/, response.json()];\r\n                    case 3:\r\n                        data = _a.sent();\r\n                        return [2 /*return*/, data];\r\n                    case 4:\r\n                        error_1 = _a.sent();\r\n                        if (this.debug) {\r\n                            console.error('Error fetching currencies:', error_1);\r\n                        }\r\n                        throw error_1;\r\n                    case 5: return [2 /*return*/];\r\n                }\r\n            });\r\n        });\r\n    };\r\n    BeansMerchantSdk.prototype.generatePngQRCode = function (stellarAccountId, currencyId, amount, memo, webhookUrl, preferredSize) {\r\n        if (webhookUrl === void 0) { webhookUrl = null; }\r\n        if (preferredSize === void 0) { preferredSize = null; }\r\n        return __awaiter(this, void 0, void 0, function () {\r\n            var url, body, response, data, error_2;\r\n            return __generator(this, function (_a) {\r\n                switch (_a.label) {\r\n                    case 0:\r\n                        url = \"https://\".concat(this.environment, \"/v3/companies/me/accounts/\").concat(stellarAccountId, \"/payment-request\");\r\n                        body = {\r\n                            \"stellarCurrencyId\": currencyId,\r\n                            \"amount\": amount,\r\n                            \"memo\": memo,\r\n                            \"paymentReceivedWebHookUrl\": webhookUrl,\r\n                            \"deeplink\": {\r\n                                \"include\": true\r\n                            },\r\n                            \"pngQrCodeBase64String\": {\r\n                                \"include\": true,\r\n                                \"preferredSize\": preferredSize\r\n                            }\r\n                        };\r\n                        _a.label = 1;\r\n                    case 1:\r\n                        _a.trys.push([1, 4, , 5]);\r\n                        return [4 /*yield*/, fetch(url, {\r\n                                method: 'POST',\r\n                                headers: {\r\n                                    'Content-Type': 'application/json',\r\n                                    'X-Beans-Company-Api-Key': this.apiKey\r\n                                },\r\n                                body: JSON.stringify(body)\r\n                            })];\r\n                    case 2:\r\n                        response = _a.sent();\r\n                        return [4 /*yield*/, response.json()];\r\n                    case 3:\r\n                        data = _a.sent();\r\n                        return [2 /*return*/, data];\r\n                    case 4:\r\n                        error_2 = _a.sent();\r\n                        if (this.debug) {\r\n                            console.error('Error generating QR code:', error_2);\r\n                        }\r\n                        throw error_2;\r\n                    case 5: return [2 /*return*/];\r\n                }\r\n            });\r\n        });\r\n    };\r\n    BeansMerchantSdk.prototype.generateSvgQRCode = function (stellarAccountId, currencyId, amount, memo, webhookUrl, size) {\r\n        if (webhookUrl === void 0) { webhookUrl = null; }\r\n        if (size === void 0) { size = null; }\r\n        return __awaiter(this, void 0, void 0, function () {\r\n            var url, body, response, data, error_3;\r\n            return __generator(this, function (_a) {\r\n                switch (_a.label) {\r\n                    case 0:\r\n                        url = \"https://\".concat(this.environment, \"/v3/companies/me/accounts/\").concat(stellarAccountId, \"/payment-request\");\r\n                        body = {\r\n                            \"stellarCurrencyId\": currencyId,\r\n                            \"amount\": amount,\r\n                            \"memo\": memo,\r\n                            \"paymentReceivedWebHookUrl\": webhookUrl,\r\n                            \"deeplink\": {\r\n                                \"include\": true\r\n                            },\r\n                            \"svgQrCode\": {\r\n                                \"include\": true,\r\n                                \"size\": size\r\n                            }\r\n                        };\r\n                        _a.label = 1;\r\n                    case 1:\r\n                        _a.trys.push([1, 4, , 5]);\r\n                        return [4 /*yield*/, fetch(url, {\r\n                                method: 'POST',\r\n                                headers: {\r\n                                    'Content-Type': 'application/json',\r\n                                    'X-Beans-Company-Api-Key': this.apiKey\r\n                                },\r\n                                body: JSON.stringify(body)\r\n                            })];\r\n                    case 2:\r\n                        response = _a.sent();\r\n                        return [4 /*yield*/, response.json()];\r\n                    case 3:\r\n                        data = _a.sent();\r\n                        return [2 /*return*/, data];\r\n                    case 4:\r\n                        error_3 = _a.sent();\r\n                        if (this.debug) {\r\n                            console.error('Error generating QR code:', error_3);\r\n                        }\r\n                        throw error_3;\r\n                    case 5: return [2 /*return*/];\r\n                }\r\n            });\r\n        });\r\n    };\r\n    return BeansMerchantSdk;\r\n}());\r\n\r\n\n\n//# sourceURL=webpack://beans-merchant-sdk/./src/sdk.ts?");

/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
/******/ 
/******/ // startup
/******/ // Load entry module and return exports
/******/ // This entry module can't be inlined because the eval devtool is used.
/******/ var __webpack_exports__ = __webpack_require__("./src/sdk.ts");
/******/ var __webpack_exports__BeansMerchantSdk = __webpack_exports__.BeansMerchantSdk;
/******/ var __webpack_exports__BeansMerchantSdkEnvironment = __webpack_exports__.BeansMerchantSdkEnvironment;
/******/ export { __webpack_exports__BeansMerchantSdk as BeansMerchantSdk, __webpack_exports__BeansMerchantSdkEnvironment as BeansMerchantSdkEnvironment };
/******/ 
