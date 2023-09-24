// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function onSuccess(token) {
  await fetch("/callback-api", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ token, code: document.getElementById("authcode").value })
  });
  location.href = "/callback/success";
}