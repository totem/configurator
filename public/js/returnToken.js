;(function() {
  var token = document.querySelector("meta[name='token']").getAttribute('content'),
      origin = document.querySelector("meta[name='origin']").getAttribute('content');

  console.log(origin);

  if (window.opener) {
    // This works in all but IE.
    window.opener.postMessage(
      JSON.stringify({
        type: 'oauth',
        token: token
      }),
      origin
    );
  }

  // This if for IE. Since we can't postMessage we just wait a bit and close without notifying.
  setTimeout(function () {
    window.close();
  }, 500);

}.call(this));
