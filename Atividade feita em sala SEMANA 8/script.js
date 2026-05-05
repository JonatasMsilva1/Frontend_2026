const taskInput = document.getElementById('taskInput')
const taskList = document.getElementById('taskList')

function addTask(){
  const textInput = taskInput.value.trim()
  if(textInput != ''){
    const newItem = document.createElement('li')
    newItem.innerHTML = `<span>${textInput}</span>`
    taskList.appendChild(newItem)
  }
  
}
