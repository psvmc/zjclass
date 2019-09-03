// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const {shell} = require("electron");
const path = require("path");
// const child = require('child_process').exec;
// var electron = require("electron");
const {ipcRenderer} = require("electron");
const {Recorder} = require("../utils/Recorder");
const {app} = require("electron").remote;

let my_recorder = new Recorder(app.getPath("downloads"));

document.addEventListener("drop", e => {
  e.preventDefault();
  e.stopPropagation();

  for (const f of e.dataTransfer.files) {
    console.log("File(s) you dragged here: ", f.path);
    shell.openItem(f.path);
  }
});
document.addEventListener("dragover", e => {
  e.preventDefault();
  e.stopPropagation();
});

const setIgnoreMouseEvents = require("electron").remote.getCurrentWindow()
    .setIgnoreMouseEvents;
addEventListener("pointerover", function mousePolicy(event) {
  mousePolicy._canClick =
      event.target === document.documentElement
          ? mousePolicy._canClick && setIgnoreMouseEvents(true, {forward: true})
          : mousePolicy._canClick || setIgnoreMouseEvents(false) || 1;
});
setIgnoreMouseEvents(true, {forward: true});

const holder0 = document.querySelector("#holder0");

holder0.onclick = () => {
  ipcRenderer.send("exit_app", "退出");
};

const holder1 = document.querySelector("#holder1");
holder1.onclick = () => {
  ipcRenderer.send("open_class_window", "");
};

const holder2 = document.querySelector("#holder2");

holder2.onclick = () => {
  shell.openItem(path.join(__dirname, "../static/走进河南.pptx"));
};

const holder3 = document.querySelector("#holder3");
holder3.onclick = () => {
  ipcRenderer.send("open_tools_window", "tools");
};

const holder4 = document.querySelector("#holder4");
holder4.onclick = () => {
  ipcRenderer.send("open_blackboard_window", "");
};

const holder5 = document.querySelector("#holder5");
holder5.onclick = () => {
  var span = holder5.querySelector("span");
  if (span.innerHTML === "录制") {
    my_recorder.startRecord();
    span.innerHTML = "结束";
    ipcRenderer.send("my_notifition", "已经开始录制了");
  } else {
    span.innerHTML = "录制";
    if (my_recorder) {
      my_recorder.stopRecord();
    }
    ipcRenderer.send("my_notifition", "录制结束了");
  }
};



