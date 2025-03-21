const { app, BrowserWindow, webContents } = require('electron');
const { dialog, ipcMain } = require('electron');
const path = require('node:path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const ProgressBar = require('electron-progressbar');
const { exec } = require('node:child_process');


const logo = path.resolve(__dirname, './logo.png')
console.log(logo)



let progressBar

if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,

    },
    frame: false,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#27394B',
      symbolColor: '#CB452D'
    },
    resizable: false,


  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);


  ipcMain.on('startConversion', async (event, data) => {
    const info = data
    const files = fs.readdirSync(info.input);

    converFile(files, data).then(() => {
      console.log('All files converted')
    })

  })



};


app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});







ipcMain.handle('dialog:selectInputFolder', async (event, arg) => {
  const result = await dialog.showOpenDialog({ properties: ['openDirectory']});

  if(!result.canceled) {
    return result.filePaths[0];
  }

  return null
})

ipcMain.handle('dialog:selectOutputFolder', async (event, arg) => {
  const result = await dialog.showOpenDialog({ properties: ['openDirectory']});

  if(!result.canceled) {
    return result.filePaths[0];
  }

  return null
})

ipcMain.handle('dialog:selectLogo', async (event, arg) => {
  const result = await dialog.showOpenDialog({ properties: ['openFile']});

  if(!result.canceled) {
    return result.filePaths[0];
  }

  return null
})





// convertation FN

const converFile = async (input, data) => {

  for (let i = 0; i < input.length; i++) {
    const inputParse = path.parse(input[i])

    await new Promise((resolve) => {
      console.log(`new convertation ${input[i]}`)
      const command = ffmpeg(data.input + '/' + input[i]).input(data.logo).videoBitrate(`${data.bitrate}k`).videoCodec('libx264').format(data.format).audioCodec('aac').audioBitrate (128).audioChannels (2).complexFilter(['[1:v] scale=230:-1 [logo]', '[0:v][logo] overlay=W-w-80:H-h-930 [v]']).outputOptions('-map', '[v]', '-map', '0:a')
      .on('start', (commandLine) => {
        console.log(`start convertation: ${commandLine}`);
        progressBar = new ProgressBar({
          indeterminate: false,
          text: 'Подготовка',
          detail: 'Ожидаю файл...',
          maxValue: 100
        })
      })
      .on('progress', (progress) => {
        const percentCeil = Math.ceil(progress.percent)
        progressBar.text = 'Идет кодирование файла'
        progressBar.value = percentCeil
        progressBar.detail = `${data.input + '/' + input[i]}: ${percentCeil}%`
        console.log(`progress: ${percentCeil}%`);
      })
      .on('end', () => {
        console.log(`Convertation ${input[i]} end!`);
        fs.unlinkSync(data.input + '/' + input[i])
        resolve();
      }).save(`${data.output + '/' + inputParse.name}.${data.format}`);

    })


  }


}











