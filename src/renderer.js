import './index.css';

// components

import { createInput } from './components/input';
import { createButton } from './components/button';
import { createRange } from './components/range';
import { createSelect } from './components/select';

const container = document.getElementById('container')

// input

const inputBox = document.createElement('div')
inputBox.setAttribute('id', 'input_box')
inputBox.setAttribute('class', 'input_box')

const inputFolderBox = document.createElement('div')
inputFolderBox.setAttribute('class', 'input_folder_box')

const outputFolderBox = document.createElement('div')
outputFolderBox.setAttribute('class', 'input_folder_box')

const inputLogoBox = document.createElement('div')
inputLogoBox.setAttribute('class', 'input_folder_box')


const preferenceBox = document.createElement('div')
preferenceBox.setAttribute('class', 'preference_container')
preferenceBox.setAttribute('id', 'preference')




const inputFolderText = document.createElement('p')
inputFolderText.setAttribute('class', 'input_folder_text')

const outputFolderText = document.createElement('p')
outputFolderText.setAttribute('class', 'output_folder_text')

const logoText = document.createElement('p')
logoText.setAttribute('class', 'input_logo_text')
logoText.innerText = 'Логотип'



const inputFolder = createInput('input_folder', 'input_folder', 'file', 'Исходная папка')
const outputFolder = createInput('output_folder', 'output_folder', 'file', 'Выходная папка')
const inputLogo = createInput('logo', 'logo', 'file', 'Логотип')


const rangeBitrate = createRange()
const selectFormat = createSelect()


inputFolderBox.appendChild(inputFolder)
inputFolderBox.appendChild(inputFolderText)

outputFolderBox.appendChild(outputFolder)
outputFolderBox.appendChild(outputFolderText)


inputLogoBox.appendChild(logoText)
inputLogoBox.appendChild(inputLogo)



inputBox.appendChild(inputFolderBox)
inputBox.appendChild(outputFolderBox)




preferenceBox.appendChild(selectFormat)
preferenceBox.appendChild(rangeBitrate)
preferenceBox.appendChild(inputLogoBox)

container.appendChild(inputBox)
container.appendChild(preferenceBox)





// button

const startBtn = createButton('start', 'Начать')






container.appendChild(startBtn)






// fn

let inputFolderPath = ''
let outputFolderPath = ''
let pathLogo = ''
let bitrate = ''
let format = 'mp4'


inputFolder.addEventListener('click', async (e) => {
  inputFolderPath = await window.electronAPI.selectInputFolder()
  if(!inputFolderPath) {
    console.log('no path')
  }
  inputFolderText.innerText = inputFolderPath

})


outputFolder.addEventListener('click', async (e) => {
  outputFolderPath = await window.electronAPI.selectOutputFolder()
  if(!outputFolderPath) {
    console.log('no path')
  }
  outputFolderText.innerText = outputFolderPath
})


inputLogo.addEventListener('click', async (e) => {
  pathLogo = await window.electronAPI.selectLogo()
  if(!pathLogo) {
    console.log('no logo')
  }

  logoText.innerText = pathLogo


})




rangeBitrate.addEventListener('change', async (e) => {
  return bitrate = e.target.value
})

selectFormat.addEventListener('change', async (e) => {
  return format = e.target.value
})








startBtn.addEventListener('click', async (e) => {

  let result = ''

  const renderFile = {
    input: inputFolderPath,
    output: outputFolderPath,
    logo: pathLogo,
    bitrate: bitrate,
    format: format
  }


  await window.electronAPI.startConversion(renderFile)



})





