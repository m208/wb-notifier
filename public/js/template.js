export function insertHeader() {
  fetch('/static/header.html')
    .then((res) => res.text())
    .then((html) => {
      document.getElementById('layout__header').innerHTML = html;
    });
}
