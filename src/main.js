const { app, BrowserWindow } = require('electron');
const { dialog, ipcMain } = require('electron');
const path = require('node:path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const ProgressBar = require('electron-progressbar');



const logo = path.resolve(__dirname, './logo.png')




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

  console.log(result.filePaths)
  return null
})

ipcMain.handle('dialog:selectOutputFolder', async (event, arg) => {
  const result = await dialog.showOpenDialog({ properties: ['openDirectory']});

  if(!result.canceled) {
    return result.filePaths[0];
  }

  console.log(result.filePaths)
  return null
})

ipcMain.handle('dialog:selectLogo', async (event, arg) => {
  const result = await dialog.showOpenDialog({ properties: ['openFile']});

  if(!result.canceled) {
    return result.filePaths[0];
  }


  console.log(result.filePaths)

  return null
})





ipcMain.on('startConversion', async (event, data) => {
  const info = data
  const files = fs.readdirSync(info.input);

  if (info.input === '' || info.output === '' || info.logo === '' || info.format === '' || info.bitrate === '') {
    return alert('Необходимо выбрать все поля!')
  }
  console.log(info)

  try {
    await convertFiles(files, data);
    console.log('All files converted');
  } catch (error) {
    console.error('Conversion error:', error);
    if (progressBar && !progressBar.isCompleted()) {
      progressBar.setCompleted();
    }
  }

})




// convertation FN

const convertFiles = async (input, data) => {





  for (let i = 0; i < input.length; i++) {
    const inputParse = path.parse(input[i])

    await new Promise((resolve) => {
      console.log(`new convertation ${input[i]}`)


      progressBar = new ProgressBar({
        indeterminate: false,
        text: 'Подготовка',
        detail: 'Ожидаю файл...',
        maxValue: 100
      })


      if (data.logo === '' || !data.logo) {

      const command = ffmpeg(data.input + '/' + input[i]).videoBitrate(`${data.bitrate}k`).videoCodec('libx264').format(data.format).audioCodec('aac').audioBitrate (128).audioChannels(2)
      .on('start', (commandLine) => {
        console.log(`start convertation: ${commandLine}`);

        if (progressBar && !progressBar.isCompleted()) {
          progressBar.text = 'Подготовка';
          progressBar.detail = 'Ожидаю файл...';
        }
      })
      .on('progress', (progress) => {
        const percentCeil = Math.ceil(progress.percent)

        if (progressBar && !progressBar.isCompleted()) {
          progressBar.text = 'Идет кодирование файла';
          progressBar.value = percentCeil;
          progressBar.detail = `${data.input + '/' + input[i]}: ${percentCeil}%`
        }



      })
      .on('end', () => {

        console.log(`Convertation ${input[i]} end!`);

        if (progressBar && !progressBar.isCompleted()) {
          progressBar.setCompleted();
        }

        fs.unlinkSync(data.input + '/' + input[i])
        console.log(`file ${input[i]} deleted`)

        resolve();


      })
      .on('error', (err) => {
        console.error('Conversion error:', err.message);
          if (progressBar && !progressBar.isCompleted()) {
            progressBar.setCompleted();
          }
          reject(err);
      })
      .save(`${data.output + '/' + inputParse.name}.${data.format}`)
      }


      const command = ffmpeg(data.input + '/' + input[i]).input(data.logo).videoBitrate(`${data.bitrate}k`).videoCodec('libx264').format(data.format).audioCodec('aac').audioBitrate (128).audioChannels (2).complexFilter(['[1:v] scale=230:-1 [logo]', '[0:v][logo] overlay=W-w-80:H-h-930 [v]']).outputOptions('-map', '[v]', '-map', '0:a')
      .on('start', (commandLine) => {
        console.log(`start convertation: ${commandLine}`);

        if (progressBar && !progressBar.isCompleted()) {
          progressBar.text = 'Подготовка';
          progressBar.detail = 'Ожидаю файл...';
        }
      })
      .on('progress', (progress) => {
        const percentCeil = Math.ceil(progress.percent)

        if (progressBar && !progressBar.isCompleted()) {
          progressBar.text = 'Идет кодирование файла';
          progressBar.value = percentCeil;
          progressBar.detail = `${data.input + '/' + input[i]}: ${percentCeil}%`
        }



      })
      .on('end', () => {

        console.log(`Convertation ${input[i]} end!`);

        if (progressBar && !progressBar.isCompleted()) {
          progressBar.setCompleted();
        }

        fs.unlinkSync(data.input + '/' + input[i])
        console.log(`file ${input[i]} deleted`)

        resolve();


      })
      .on('error', (err) => {
        console.error('Conversion error:', err.message);
          if (progressBar && !progressBar.isCompleted()) {
            progressBar.setCompleted();
          }
          reject(err);
      })
      .save(`${data.output + '/' + inputParse.name}.${data.format}`)


    })


  }


}











