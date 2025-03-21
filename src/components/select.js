
const arrFormat = ['mp4', 'mov', 'avi', 'mpg']


export const createSelect = () => {



  const selectBox = document.createElement('div')
  selectBox.setAttribute('class', 'preference_box')
  selectBox.setAttribute('id', 'selectBox')



  const span = document.createElement('span')
  span.setAttribute('class', 'preference_title')
  span.textContent = 'выберите формат'

  const select = document.createElement('select');
  select.setAttribute('class', 'select')
  select.setAttribute('id', 'select')
  console.log(select)


  arrFormat.forEach(element => {
    select.innerHTML += `<option class='select-option' value="${element}">${element}</option>`
  })

  selectBox.appendChild(span)
  selectBox.appendChild(select)

  return selectBox
}