"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function error(message) {
    return JSON.stringify({ success: false, message: message });
}
exports.error = error;
function success(result) {
    let response = { success: true, result: {} };
    if (result)
        response.result = result;
    return JSON.stringify(response);
}
exports.success = success;
function renderError(res) {
    return (msg) => res.render('error', { error: { message: msg } });
}
exports.renderError = renderError;
//# sourceMappingURL=jsonerror.js.map