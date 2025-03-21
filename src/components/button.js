export const createButton = ( title ) => {

  const button = document.createElement('button');
  button.setAttribute('class', 'button')
  button.setAttribute('id', 'button')
  button.setAttribute('type', 'button');


  button.textContent = title;


  return button
}