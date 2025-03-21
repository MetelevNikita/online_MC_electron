export const createProgress= () => {
  const progress = document.createElement('progress');
  progress.max = 100;
  progress.min = 0;
  progress.value = 30
  progress.className = 'progress'


  return progress
}