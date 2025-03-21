export const createRange = () => {



  const rangeBox = document.createElement('div')
  rangeBox.setAttribute('class', 'preference_box')
  rangeBox.setAttribute('id', 'selectBox')



  const span = document.createElement('span')
  span.setAttribute('class', 'preference_title')
  span.textContent = 'выберите битрэйт'


  const resultRange = document.createElement('span')
  resultRange.setAttribute('class', 'preference_result')
  resultRange.textContent = '0Kbps'


  const range = document.createElement('input')
  range.setAttribute('type', 'range')
  range.setAttribute('min', '0')
  range.setAttribute('max', '12000')
  range.setAttribute('value', '0')
  range.setAttribute('step', '1000')

  //

  range.setAttribute('id', 'range')
  range.setAttribute('name', 'range')
  range.setAttribute('class', 'range_selector')


  range.addEventListener('change', (e) => {
    console.log(e.target.value)
    resultRange.textContent = `${e.target.value}Kbps`
  })


  rangeBox.appendChild(span)
  rangeBox.appendChild(range)
  rangeBox.appendChild(resultRange)

  return rangeBox

}