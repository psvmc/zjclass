// Modules to control application life and create native browser window
const {app, BrowserWindow} = require("electron");
const electron = require("electron");
const path = require("path");
const {ipcMain} = require("electron");
const {useCapture} = require("./views/capture/capture-main");

const user32 = require('./utils/user32').User32;

let mainWindow;
let rtmpWindow;
let pptWindow;
let tipWindow;
let classWindow;
let blackboardWindow;
global.winIds = {};


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
    let winW = electron.screen.getPrimaryDisplay().workAreaSize.width;
    let winH = electron.screen.getPrimaryDisplay().workAreaSize.height;
    let winMaxW = electron.screen.getPrimaryDisplay().bounds.width;
    let winMaxH = electron.screen.getPrimaryDisplay().bounds.height;
    mainWindow = new BrowserWindow({
        width: 480,
        height: 600,
        x: winW - 80,
        y: parseInt((winH - 600) / 2),
        // useContentSize:true,
        type: "toolbar",
        frame: false, //要创建无边框窗口
        resizable: false, //禁止窗口大小缩放
        transparent: true, //设置透明
        alwaysOnTop: true, //窗口是否总是显示在其他窗口之前
        hasShadow: false,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            devTools: true
        }
    });
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.openDevTools();
    });

    mainWindow.once('ready-to-show', () => {
        let hwnd = mainWindow.getNativeWindowHandle() //获取窗口句柄。
        console.log(hwnd);
        user32.GetSystemMenu(hwnd.readUInt32LE(0), true); //禁用系统菜单.
        mainWindow.show()
    });

    // and load the index.html of the app.
    mainWindow.loadFile("views/index.html");

    // Emitted when the window is closed.
    mainWindow.on("closed", function () {
        mainWindow = null;
    });

    let bound = mainWindow.getBounds();

    tipWindow = new BrowserWindow({
        width: 200,
        height: 60,
        x: winW - 220,
        y: 80,
        type: "notification",
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
    blackboardWindow.webContents.on('did-finish-load', () => {
        //blackboardWindow.webContents.openDevTools();
    });


    pptWindow = new BrowserWindow({
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

    pptWindow.loadFile("views/ppt/ppt.html");

    classWindow = new BrowserWindow({
        width: winW - 80,
        height: winH,
        x: 0,
        y: 0,
        frame: false,
        resizable: false,
        hasShadow: false,
        show: false,
        maximizable: true,
        fullscreenable: false,
        title: ""
    });
    classWindow.loadFile("views/class/login.html");
    // classWindow.webContents.openDevTools();
    classWindow.on("close", function (e) {
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
    rtmpWindow.webContents.on('did-finish-load', () => {
        rtmpWindow.webContents.openDevTools();
    });
    global.winIds.rtmpWindowId = rtmpWindow.id;

}

app.on("ready", createWindow);

app.on("window-all-closed", function () {
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
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
        rtmpWindow.webContents.send('asynchronous-msg', rtmpWindow.id);
    }
});

ipcMain.on("open_ppt_window", (event, arg) => {
    let bound = mainWindow.getBounds();
    if (pptWindow.isVisible()) {
        pptWindow.hide();
    } else {
        pptWindow.setBounds({
            x: 0,
            y: 0
        });
        pptWindow.show();
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
    setTimeout(function () {
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
