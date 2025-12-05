let allTds = JSON.parse(localStorage.getItem("allTodos"));
let allTodos = allTds !== null ? allTds : [];

const todoContainers = document.querySelectorAll(".todo-container")
const tc = document.querySelector(".todo")
const pc = document.querySelector(".progress")
const dc = document.querySelector(".done")

const addBtn = document.querySelector("#add-todo");
const inputSection = document.querySelector(".new-todo-section")
const inputTodo = document.querySelector("#task-input")
const inputDesc = document.querySelector("#desc-input")
const saveBtn = document.querySelector("#save-btn")
const main = document.querySelector("main")
const firstTodoSection = document.querySelector(".create-first-todo");
const createBtn = document.querySelector(".create-first-todo button");

createBtn.addEventListener("click", () => {
    inputSection.style.display = "flex";
})

addBtn.addEventListener("click", () => {
    inputSection.style.display = "flex";
})

inputSection.addEventListener("click", (event) => {
    if (event.target === event.currentTarget) {
        inputSection.style.display = "none";
    }
})

function onSave(){
    if (inputTodo.value != "") {
        allTodos = [...allTodos, { task: inputTodo.value, desc: inputDesc.value, container: "todo" }];
        localStorage.setItem("allTodos", JSON.stringify(allTodos));
        saveBtn.innerHTML = "saving...";
        setTimeout(() => {
            inputTodo.value = ""
            inputDesc.value = ""
            inputSection.style.display = "none";
            firstTodoSection.style.display = "none";
            saveBtn.innerHTML = "Save Todo";
            loadTodos()
        }, 600);
    } else {
        alert("Please enter a task to save!")
    }
}

saveBtn.addEventListener("click", onSave);
inputSection.addEventListener("keydown", (event)=>{event.key === "Enter" && onSave();});

function loadTodos() {
    main.style.display = allTodos.length !== 0 ? "flex" : "none";
    firstTodoSection.style.display = allTodos.length === 0 ? "flex" : "none";
    let todoClutter = `<div class="heading">
                <h1>Todo</h1>
                <span class="counter">${allTodos.filter(todo => { return todo.container === "todo" }).length}</span>
            </div>`;
    let progressClutter = `<div class="heading">
                <h1>In Progress</h1>
                <span class="counter">${allTodos.filter(todo => { return todo.container === "progress" }).length}</span>
            </div>`;
    let doneClutter = `<div class="heading">
                <h1>Done</h1>
                <span class="counter">${allTodos.filter(todo => { return todo.container === "done" }).length}</span>
            </div>`;
    allTodos.map((todo, idx) => {
        if (todo.container === "todo") {
            todoClutter += `<div id="${idx}" draggable="true" class="task">
                <h2 class="title">${todo.task}</h2>
                <p class="desc">${todo.desc}</p>
                <button id="${idx}" class="delete-btn" type="button">Delete</button>
            </div>`;
        } else if (todo.container === "progress") {
            progressClutter += `<div id="${idx}" draggable="true" class="task">
                <h2 class="title">${todo.task}</h2>
                <p class="desc">${todo.desc}</p>
                <button id="${idx}" class="delete-btn" type="button">Delete</button>
            </div>`;
        } else if (todo.container === "done") {
            doneClutter += `<div id="${idx}" draggable="true" class="task">
                <h2 class="title">${todo.task}</h2>
                <p class="desc">${todo.desc}</p>
                <button id="${idx}" class="delete-btn" type="button">Delete</button>
            </div>`;
        }
    })

    tc.innerHTML = todoClutter;
    pc.innerHTML = progressClutter;
    dc.innerHTML = doneClutter;
}
loadTodos();

let targetTaskIndex = null;

todoContainers.forEach((todoContainer, index) => {
    todoContainer.addEventListener("dragstart", (event) => {
        targetTaskIndex = event.target.id;
    })
    todoContainer.addEventListener("dragenter", () => {
        todoContainer.classList.add("hover-container")
    })
    todoContainer.addEventListener("dragleave", () => {
        todoContainer.classList.remove("hover-container")
    })
    todoContainer.addEventListener("dragover", (event) => {
        event.preventDefault();
    })
    todoContainer.addEventListener("drop", (event) => {
        event.preventDefault();
        if (event.currentTarget.classList.contains("hover-container")) {
            allTodos[targetTaskIndex].container = event.currentTarget.classList[0];
            loadTodos();
            localStorage.setItem("allTodos", JSON.stringify(allTodos));
            todoContainer.classList.remove("hover-container");
        }
    })
    todoContainer.addEventListener("click", (event) => {
        if (event.target.className === "delete-btn") {
            allTodos = allTodos.filter((todo, index) => {
                return index != event.target.id;
            })
            localStorage.setItem("allTodos", JSON.stringify(allTodos));
            event.target.parentNode.innerHTML = "Deleted SuccessFully..."
            setTimeout(() => {
                loadTodos();
            }, 500);
        }
    })
})