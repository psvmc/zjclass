const clipboard = require('electron').clipboard;
const desktopCapturer = require('electron').desktopCapturer;
const {screen} = require('electron').remote;

function getScreen(callback) {
    this.callback = callback
    document.body.style.opacity = '0';
    let oldCursor = document.body.style.cursor;
    document.body.style.cursor = 'none';
    let display = screen.getPrimaryDisplay();
    let scaleFactor = display.scaleFactor;
    desktopCapturer.getSources({
        types: ['screen'],
        thumbnailSize: {
            width: display.bounds.width * scaleFactor,
            height: display.bounds.height * scaleFactor
        },
    }, (e, sources) => {
        let selectSource = sources[0];
        console.info(selectSource);
        console.info(selectSource.thumbnail.getSize());
        clipboard.writeImage(selectSource.thumbnail);
        document.body.style.cursor = oldCursor;
        document.body.style.opacity = '1';
        this.callback(selectSource.thumbnail.toDataURL('image/png'))
    })
}

exports.getScreenSources = ({types = ['screen']} = {}, callback) => {
    getScreen(callback)
}
