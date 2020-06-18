const electron = require("electron");
const { ipcRenderer } = electron;

const ul = document.querySelector("ul");

// Add Item
ipcRenderer.on("item:add", (e, item) => {
  ul.className = "collection";
  const output = `
    <li class="collection-item">${item}</li>
    `;
  ul.insertAdjacentHTML("beforeend", output);
});

// Clear all Item
ipcRenderer.on("item:clear", () => {
  ul.innerHTML = "";
  ul.className = "";
});

// Remove individual item
ul.addEventListener("dblclick", (e) => {
  e.target.remove();
  if (ul.children.length === 0) ul.className = "";
});
