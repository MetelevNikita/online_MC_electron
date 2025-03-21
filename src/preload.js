const { contextBridge, ipcRenderer } = require('electron')




contextBridge.exposeInMainWorld('electronAPI', {

  selectInputFolder: async () => {
   const data = await ipcRenderer.invoke('dialog:selectInputFolder')
   return data
  },

  selectOutputFolder: async () => {
    const data = await ipcRenderer.invoke('dialog:selectOutputFolder')
    return data
  },


  selectLogo: async () => {
    const data = await ipcRenderer.invoke('dialog:selectLogo')
    return data
  },


  startConversion: async (data) => {
      console.log(data)
      ipcRenderer.send('startConversion', data)
  },


})







