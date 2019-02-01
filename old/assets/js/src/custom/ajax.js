function ajax(root, json, method) {
  fetch(root + "/api.php",{
    method: "post",
    mode: "same-origin",
    credentials: "same-origin",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: json
  })
  .then(function(response){
    return response.text();
  })
  .then(function(html){
    window[method](html);
  });
}