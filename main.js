// Modules to control application life and create native browser window
const { app, BrowserWindow } = require("electron");
var electron = require("electron");
const path = require("path");
const { ipcMain } = require("electron");
const { useCapture } = require("./views/capture/capture-main");

const { shell } = require("electron");
const { dialog } = require("electron");
const child = require("child_process").exec;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let rtmpWindow;
let tipWindow;
let classWindow;
let blackboardWindow;
global.winIds= {
};

function openoffice() {
  //shell.openExternal('https://github.com')
  shell.openItem(path.join(__dirname, "new.docx"));
}

ipcMain.on("ondragstart", (event, filePath) => {
  event.sender.startDrag({
    file: filePath,
    icon: "/path/to/icon.png"
  });
});

const Menu = electron.Menu;

function createWindow() {
  Menu.setApplicationMenu(null);
  // 初始化截图
  useCapture();
  var winW = electron.screen.getPrimaryDisplay().workAreaSize.width;
  var winH = electron.screen.getPrimaryDisplay().workAreaSize.height;
  var winMaxW = electron.screen.getPrimaryDisplay().bounds.width;
  var winMaxH = electron.screen.getPrimaryDisplay().bounds.height;
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 80,
    height: 600,
    x: winW - 120,
    y: parseInt((winH - 600) / 2),
    // useContentSize:true,
    type: "toolbar",
    frame: false, //要创建无边框窗口
    resizable: false, //禁止窗口大小缩放
    transparent: true, //设置透明
    alwaysOnTop: true, //窗口是否总是显示在其他窗口之前
    hasShadow: false,
    webPreferences: {
      nodeIntegration: true,
      devTools: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile("views/index.html");
  // Open the DevTools.
  //mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on("closed", function() {
    mainWindow = null;
  });

  var bound = mainWindow.getBounds();

  tipWindow = new BrowserWindow({
    width: 200,
    height: 60,
    x: winW - 220,
    type: "notification",
    y: 80,
    frame: false,
    hasShadow: true,
    show: false,
    transparent: true, //设置透明
    alwaysOnTop: true, //窗口是否总是显示在其他窗口之前
    title: "",
    webPreferences: {
      nodeIntegration: true
    }
  });
  tipWindow.loadFile("views/tip.html");

  blackboardWindow = new BrowserWindow({
    width: winW,
    height: winH,
    x: 0,
    y: 0,
    frame: false,
    hasShadow: true,
    show: false,
    transparent: true, //设置透明
    alwaysOnTop: false, //窗口是否总是显示在其他窗口之前
    title: "",
    webPreferences: {
      nodeIntegration: true
    }
  });

  blackboardWindow.loadFile("views/blackboard/blackboard.html");

  blackboardWindow.webContents.openDevTools();

  var bound = mainWindow.getBounds();
  classWindow = new BrowserWindow({
    width: winW - 240,
    height: winH,
    frame: true,
    hasShadow: true,
    show: false,
    maximizable: true,
    fullscreenable: false,
    title: ""
  });
  classWindow.loadFile("views/class/login.html");
  // classWindow.webContents.openDevTools();
  classWindow.on("close", function(e) {
    classWindow.hide();
    e.preventDefault(); //阻止默认行为
  });

  rtmpWindow = new BrowserWindow({
    parent: mainWindow,
    width: 400,
    height: 600,
    x: bound.x - 400,
    y: bound.y,
    frame: false,
    hasShadow: false,
    show: false,
    title: "",
    webPreferences: {
      nodeIntegration: true
    }
  });
  rtmpWindow.loadFile("views/rtmp.html");
  rtmpWindow.webContents.openDevTools()
  global.winIds.rtmpWindowId = rtmpWindow.id;

}

app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function() {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function() {
  if (mainWindow === null) createWindow();
});

ipcMain.on("open_tools_window", (event, arg) => {
  event.returnValue = "ok";
  var bound = mainWindow.getBounds();
  if (rtmpWindow.isVisible()) {
    rtmpWindow.hide();
  } else {
    rtmpWindow.setBounds({
      x: bound.x - 400,
      y: bound.y
    });
    rtmpWindow.show();
    rtmpWindow.webContents.send('asynchronous-msg',rtmpWindow.id);
  }
});

ipcMain.on("open_class_window", (event, msg) => {
  let bound = mainWindow.getBounds();
  if (classWindow.isVisible()) {
    if (classWindow.isMaximized()) {
      classWindow.minimize();
    } else if (classWindow.isMinimized()) {
      classWindow.restore();
    } else {
      classWindow.hide();
    }
  } else {
    classWindow.show();
  }
});

ipcMain.on("my_notifition", (event, msg) => {
  tipWindow.webContents.send("my_notifition_reply", msg);
  tipWindow.show();
  setTimeout(function() {
    tipWindow.hide();
  }, 2000);
});

ipcMain.on("open_blackboard_window", (event, msg) => {
  if (blackboardWindow.isVisible()) {
    blackboardWindow.hide();
  } else {
    blackboardWindow.show();
  }
});

ipcMain.on("exit_app", (event, msg) => {
  app.quit();
});



// ipcMain.on('asynchronous-message', (event, arg) => {
//   console.log(arg) // prints "ping"
//   event.reply('asynchronous-reply', 'pong')
// });

// ipcMain.on('synchronous-message', (event, arg) => {
//   console.log(arg) // prints "ping"
//   event.returnValue = 'pong'
// });
