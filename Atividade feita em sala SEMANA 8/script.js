const taskInput = document.getElementById('taskInput')
const taskList = document.getElementById('taskList')

function addTask(){
  const textInput = taskInput.value.trim()
  if(textInput != ''){
    const newItem = document.createElement('li')
    newItem.innerHTML = `
      <span>${textInput}</span>
      <button onclick="editar()">Editar</button>
      <button onclick="delet(this)">Remover</button>
      <button onclick="completar(this)">Feito</button>
    `
    taskList.appendChild(newItem)
    taskInput.value = ''
  }
  
}

function delet(button){
  const itemToRemove = button.parentElement
  taskList.removeChild(itemToRemove)
}

function completar(button){
   const itemToRemove = button.parentElement
   itemToRemove.classList.toggle('completed')
}
