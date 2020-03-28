const { app, BrowserWindow } = require("electron");

app.disableHardwareAcceleration();
app.allowRendererProcessReuse = true;

app.on("ready", () => {
    let mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        autoHideMenuBar: true,
    });
    mainWindow.setFullScreen(true);
    // mainWindow.webContents.openDevTools();
    mainWindow.loadURL(`file://${__dirname}/index.html`);
    mainWindow.on("closed", () => {
        mainWindow = null;
    });
});
