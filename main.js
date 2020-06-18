const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require("path");

// Set ENV
process.env.NODE_ENV = "production";

let mainWindow;
let addWindow;

function createWindow() {
  // Create browser window
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // icon: path.join(__dirname, "/images/sysinfo.png"),
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // Load index.html
  mainWindow.loadFile("mainWindow.html");

  // Open devtools
  // win.webContents.openDevTools();

  // Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // Insert menu
  Menu.setApplicationMenu(mainMenu);

  mainWindow.on("closed", () => app.quit());
}

// Run create winfow fn
app.whenReady().then(createWindow);

// Quit wen all windows are closed
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Handle create add window
function createAddWindow() {
  // Create browser window
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: "Add an Item",
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // Load index.html
  addWindow.loadFile("addWindow.html");

  // Garbage collection handle
  addWindow.on("close", () => (addWindow = null));
}

// Catch item:add
ipcMain.on("item:add", (e, item) => {
  console.log(item);

  mainWindow.webContents.send("item:add", item);
  addWindow.close();
});

// Create menu template
const mainMenuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "Add Item",
        accelerator:
          process.platform == "darwin" ? "Command+Plus" : "Ctrl+Plus",
        click() {
          createAddWindow();
        },
      },
      {
        label: "Clear Items",
        click() {
          mainWindow.webContents.send("item:clear");
        },
      },
      {
        label: "Quit",
        accelerator: process.platform == "darwin" ? "Command+Q" : "Ctrl+Q",
        click() {
          app.quit();
        },
      },
    ],
  },
];

if (process.platform == "darwin") mainMenuTemplate.unshift({ label: app.name });

// Add devtools intem menu if not in prod
if (process.env.NODE_ENV !== "production")
  mainMenuTemplate.push({
    label: "Developer Tools",
    submenu: [
      {
        label: "Toggle DevTools",
        accelerator: process.platform == "darwin" ? "Command+I" : "Ctrl+I",
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
      },
      {
        role: "reload",
      },
    ],
  });
