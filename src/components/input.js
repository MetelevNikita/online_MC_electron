export const createInput = (id, className, type, title) => {


  const inputFileBox = document.createElement('div');
  inputFileBox.setAttribute('class', 'input_file_box')



  const button = document.createElement('button');
  button.setAttribute('class', `upload_btn`)
  button.textContent = `${title}`


  const label = document.createElement('label');
  label.setAttribute('class', `label_file`)


  inputFileBox.appendChild(button)
  inputFileBox.appendChild(label)

  return inputFileBox

}