/**
 *自动录屏模块*录制桌面
 *
 * @class Recorder
 */
class Recorder {
    constructor(path) {
        this.mediaOutputPath = path;
    }

    /**
     *开始录制
     *
     * @memberof Recorder
     */
    startRecord = () => {
        /* 要获取桌面音频必须设置audio约束如下 */
        this.getVedioStream().then(vedioStream => {
            this.getAudioStream().then((audioStream) => {
                vedioStream.addTrack(audioStream.getAudioTracks()[0])//注！此处添加麦克风音轨无效
                this.startRecorder(vedioStream);
            });
        }).catch(err => {
            this.getUserMediaError(err);
        });
    };

    /**
     *获取麦克风音频流
     *
     * @memberof Recorder
     */
    getAudioStream = () => {
        return navigator.mediaDevices.getUserMedia({audio: true, video: false})
    };


    /**
     *获取屏幕视频流
     *
     * @memberof Recorder
     */
    getVedioStream = () => {
        return navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    maxWidth: window.screen.width,
                    maxHeight: window.screen.height
                }
            }
        })
    };

    /**
     *获取媒体源失败
     *
     * @memberof Recorder
     */
    getUserMediaError = (err) => {
        console.log('mediaError', err);
    };


    getUserAudioError = (err) => {
        console.log('audioError', err);

    };

    /**
     *开始视频录制
     *
     * @memberof Recorder
     */
    startRecorder = (stream) => {
        this.recorder = new MediaRecorder(stream);
        this.recorder.start();
        this.recorder.ondataavailable = event => {
            let blob = new Blob([event.data], {
                type: 'video/webm'
            });
            this.saveMedia(blob);
        };
    };


    formatLength = (str, length) => {
        str += '';
        if (str.length < length)
            return this.formatLength('0' + str, length)
        else
            return str
    };


    getnowstr = () => {
        var now = new Date();
        var year = now.getFullYear(); //得到年份
        var month = this.formatLength(now.getMonth(), 2);//得到月份
        var date = this.formatLength(now.getDate(), 2);//得到日期
        var hour = this.formatLength(now.getHours(), 2);//得到小时
        var minu = this.formatLength(now.getMinutes(), 2);//得到分钟
        var all_time = year + "-" + month + "-" + date + "_" + hour + "-" + minu;
        return all_time;
    };

    /**
     *数据转换并保存成MP4
     *
     * @memberof Recorder
     */
    saveMedia = (blob) => {
        let reader = new FileReader();
        let _t = this;
        var filename = this.mediaOutputPath + "/" + this.getnowstr() + "_vedio.webm";
        reader.onload = function () {
            let buffer = Buffer.from(reader.result);
            const fs = require('fs')
            fs.writeFile(filename, buffer, {}, (err, res) => {
                if (err) {
                    console.error(err);
                    return
                }
            })
        };
        reader.readAsArrayBuffer(blob);
    };


    /**
     *停止录制视频
     *
     * @memberof Recorder
     */
    stopRecord = () => {
        this.recorder.stop();
    }


}

exports.Recorder = Recorder;
