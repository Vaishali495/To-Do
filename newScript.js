const newTaskArea = document.getElementById("new-task-area");
const addBtn = document.getElementById("add-btn");
const editBtn = document.getElementById("edit-btn");
const toDoList = document.getElementById("to-do-list");
isEdit = false;  
let tasks = []; 

function createNewTask() {
  // check whether the input is empty 
  if (!isEmpty()) {
    const newTaskObj = {
      body: newTaskArea.value,
      id: Date.now(),
      isCompleted: false,
    };
    tasks.push(newTaskObj);
    createTaskElement(newTaskObj);
    updateStorage();
    // clearing input
    newTaskArea.value = "";
  } else {
    alert("Add new task");
  }
}


// cretes a new task element 
function createTaskElement(obj) {
  let newTask = createTaskSnippet(obj);
  addNewTaskToDom(newTask);
}

// snippet for making new tasks
function createTaskSnippet(obj) {
  const newTask = document.createElement("li");
  newTask.classList.add("task-item", "flex");
  
  const div = document.createElement("div");
  div.classList.add("task");
  div.innerText = obj.body;
  // if (obj.isCompleted) {
  //   div.style.textDecoration = "line-through";
  //   newCheckBox.checked = true;
  // }
  
  const newCheckBox = document.createElement("input");
  newCheckBox.setAttribute("type", "checkbox");
  newCheckBox.classList.add("complete-task");
  newCheckBox.addEventListener("click", (e) => {
    setComplete(e, obj);
  });
  if (obj.isCompleted) {
    div.style.textDecoration = "line-through";
    newCheckBox.checked = true;
  }

  const newEditIcon = document.createElement("i");
  newEditIcon.classList.add("ri-pencil-line", "task-edit-icon");
  newEditIcon.addEventListener("click",(e) => {
    handleEditButton(e,obj);
  })

  const newDeleteIcon = document.createElement("i");
  newDeleteIcon.classList.add("ri-delete-bin-6-line", "task-delete-icon");
  newDeleteIcon.addEventListener("click",(e) => {
    handleDeleteButton(e,obj);
  })

  newTask.appendChild(newCheckBox);
  newTask.appendChild(div);
  newTask.appendChild(newEditIcon);
  newTask.appendChild(newDeleteIcon);
  newTask.setAttribute("id", `${obj.id}`);
  return newTask;
}

function handleEditButton(e,obj)
{
  newTaskArea.value = obj.body;
  addBtn.style.display = "none";
  editBtn.classList.remove("hidden");
  editBtn.addEventListener("click", (e) => {
    editTask(e,obj)

  });
}

function editTask(e,obj)
{
  obj.body = newTaskArea.value;
  let element = document.getElementById(obj.id).getElementsByClassName('task')[0];
  // console.log(element);   
  element.innerText = newTaskArea.value;

  updateStorage();
  // renderTask(); we dont need to reload the whole page 
}

function handleDeleteButton(e,obj)
{
  let listItem = e.target.parentNode;
  if (listItem) {
    listItem.remove(); // Remove item from the DOM
    removeFromLocalStorage(obj.id); // Remove item from local storage
  }
}


function removeFromLocalStorage(itemId) {
    //new array to store the remaining tasks
    let newTasks = [];
    
    for (let i = 0; i < tasks.length; i++) {
      // Add tasks to the new array
      if (tasks[i].id !== itemId) {
        newTasks.push(tasks[i]);
      }
    }

    tasks = newTasks;
  
    updateStorage();
  }

function setComplete(e, obj) {
  let task = e.target.nextSibling;
  // console.log(task);
  let listItem = task.parentNode;
  // console.log(listItem);
  obj.isCompleted = true;
  toDoList.appendChild(listItem);
  task.style.textDecoration = "line-through";
  updateStorage();
}

function isEmpty() {
  if (newTaskArea.value.trim(" ") != "") return 0;
  return 1;
}

function addNewTaskToDom(newTask) {
  toDoList.insertBefore(newTask, toDoList.firstChild);
}

function updateStorage() {
  let item = JSON.stringify(tasks);
  localStorage.setItem("tasks", item);
}

function renderTask() {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  if (tasks == null) tasks = [];

  //creating tasks after getting from local storage
  renderTasks();
}

function renderTasks() {
  // creating new task for each element
  tasks.forEach((task) => {
    // for completed tasks
    if (task.isCompleted) {
      let newTask = createTaskSnippet(task);
      addNewTaskToDom(newTask);
    }
  });

  tasks.forEach((task) => {
    // for not completed tasks
    if (!task.isCompleted) {
      let newTask = createTaskSnippet(task);
      addNewTaskToDom(newTask);
    }
  });
}

renderTask();
