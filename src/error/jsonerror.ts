export function error(message) {
  return JSON.stringify({success: false, message: message});
}

export function success(result?: any) {
  let response = {success: true, result: {}};
  if (result) response.result = result;
  return JSON.stringify(response);
}

export function renderError(res) {
  return (msg: any) => res.render('error', {error: {message: msg}});
}
