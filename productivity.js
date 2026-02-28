const todo = document.querySelector("#todo");
const planner = document.querySelector("#planner");
const motivation = document.querySelector("#motivation");
const pomodoro = document.querySelector("#pomodoro");
// const goals = document.querySelector("#goals");

let screen = document.querySelector("#screen");

let apps = [todo, planner, motivation, pomodoro];

function openFeatues() {
  let themeBtn = document.querySelector("#navbar button");

  let dark = true;

  themeBtn.addEventListener("click", () => {
    if (dark) {
      document.documentElement.style.setProperty(
        "--bg",
        "linear-gradient(135deg,#0f2027,#2c5364)",
      );
      document.documentElement.style.setProperty("--prim", "#00c6ff");
      document.documentElement.style.setProperty("--accent", "#f7971e");
    } else {
      document.documentElement.style.setProperty(
        "--bg",
        "linear-gradient(135deg,#1f1c2c,#928dab)",
      );
      document.documentElement.style.setProperty("--prim", "#ff6b6b");
      document.documentElement.style.setProperty("--accent", "#ffe66d");
    }
    dark = !dark;
  });

  apps.forEach((page) => {
    page.addEventListener("click", function () {
      screen.style.display = "none";
      document.querySelector(`#${page.id}app`).style.display = "flex";
      document.body.style.overflow = "hidden";
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      document.querySelectorAll("section").forEach((sec) => {
        sec.style.display = "none";
      });
      document.body.style.cursor = "default";
      screen.style.display = "flex";
      document.body.style.overflow = "auto";
    }
  });
}
openFeatues();

function closebutton() {
  let closebtn = document.querySelectorAll(".close");
  closebtn.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      document.querySelector(
        `#${e.target.parentElement.parentElement.id}`,
      ).style.display = "none";
      screen.style.display = "block";
      document.body.style.cursor = "default";
    });
  });
}
closebutton();

// To Do App Drag and Drop

let newtasks = document.querySelector("#newtodotask");
let ongoingtasks = document.querySelector("#ongoingtask");
let donetasks = document.querySelector("#donetask");
const column = [newtasks, ongoingtasks, donetasks];
let dragelem;
let addtaskbtn = document.querySelector("#addtask");
let createtaskbtn = document.querySelector("#createtask");
let taskData = {};

if (localStorage.getItem("tasks")) {
  const tododata = JSON.parse(localStorage.getItem("tasks"));
  for (let key in tododata) {
    const column = document.querySelector(`#${key}`);
    tododata[key].forEach((task) => {
      let taskdiv = document.createElement("div");
      taskdiv.classList.add("task");
      taskdiv.draggable = true;
      taskdiv.innerHTML = `<h2>${task.name}</h2><p>${task.desc}</p><button class="delete">Delete</button>`;
      column.appendChild(taskdiv);
    });
  }
  updateCount();
}

function todoworking() {
  let task = document.querySelectorAll(".task");
  task.forEach((item) => {
    item.addEventListener("dragstart", (e) => {
      dragelem = item;
    });
  });
}
todoworking();

function updateCount() {
  column.forEach((item) => {
    let count = item.querySelector("span");
    let tasks = item.querySelectorAll(".task");
    count.textContent = tasks.length;
  });
}

function saveTodoData() {
  column.forEach((item) => {
    let tasks = item.querySelectorAll(".task");

    taskData[item.id] = Array.from(tasks).map((t) => {
      return {
        name: t.querySelector("h2").textContent,
        desc: t.querySelector("p").textContent,
      };
    });
    localStorage.setItem("tasks", JSON.stringify(taskData));
  });
}
function hoverover() {
  column.forEach((item) => {
    item.addEventListener("dragenter", (e) => {
      e.preventDefault();
      item.classList.add("hover-over");
    });
    item.addEventListener("dragleave", (e) => {
      e.preventDefault();
      item.classList.remove("hover-over");
    });
    item.addEventListener("dragover", (e) => {
      e.preventDefault();
    });
    item.addEventListener("drop", (e) => {
      e.preventDefault();
      item.classList.remove("hover-over");
      item.appendChild(dragelem);
      saveTodoData();
      updateCount();
    });
  });
}
hoverover();

function addtask() {
  addtaskbtn.addEventListener("click", () => {
    document.querySelector("#taskname").value = "";
    document.querySelector("#taskdesc").value = "";
    document.querySelector("#addtaskscreen").style.display = "block";
  });
  createtaskbtn.addEventListener("click", () => {
    if (
      document.querySelector("#taskname").value == "" ||
      document.querySelector("#taskdesc").value == ""
    ) {
      alert("Please fill all fields");
      return;
    }
    let taskname = document.querySelector("#taskname").value;
    let taskdesc = document.querySelector("#taskdesc").value;
    let taskdiv = document.createElement("div");
    taskdiv.classList.add("task");
    taskdiv.draggable = true;
    taskdiv.innerHTML = `<h2>${taskname}</h2><p>${taskdesc}</p><button class="delete">Delete</button>`;
    newtasks.appendChild(taskdiv);
    todoworking();
    saveTodoData();
    updateCount();
    document.querySelector("#addtaskscreen").style.display = "none";
  });
  document.querySelector("#addtaskscreen").addEventListener("click", (e) => {
    if (e.target.id == "addtaskscreen") {
      document.querySelector("#addtaskscreen").style.display = "none";
    }
  });
}
addtask();

function deletetask() {
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete")) {
      e.target.parentElement.remove();
      updateCount();
      saveTodoData();
    }
  });
}
deletetask();

// Daily Planner App

let dayPlanData = JSON.parse(localStorage.getItem("planner")) || {};
let hours = Array.from(
  { length: 18 },
  (_, idx) => `${6 + idx}:00 - ${7 + idx}:00`,
);
let plannerScreen = document.querySelector("#dailyPlannerScreen");

let wholeDaySum = "";
hours.forEach(function (elem, idx) {
  let savedPlanData = dayPlanData[idx] || "";
  wholeDaySum += `<div class="plan">
            <p>${elem}</p>
            <input id="${idx}" type="text" placeholder="..." value="${savedPlanData}">
          </div>`;
});

plannerScreen.innerHTML = wholeDaySum;

let dayPlannerInput = document.querySelectorAll(".plan input");
dayPlannerInput.forEach(function (elem) {
  elem.addEventListener("input", function (e) {
    dayPlanData[elem.id] = elem.value;
    localStorage.setItem("planner", JSON.stringify(dayPlanData));
  });
});

// Motivation App

let motivationapp = document.querySelector("#motivationapp");
let cursor = document.querySelector("#cursor");
let api = "https://motivational-spark-api.vercel.app/api/quotes/random";

fetch(api)
  .then((response) => response.json())
  .then((data) => {
    document.querySelector("#motivationbody h1").textContent =
      `"${data.quote}"`;
    document.querySelector("#motivationbody h3").textContent =
      `- ${data.author}`;
  });

motivationapp.addEventListener("mousemove", (e) => {
  document.body.style.setProperty("--x", e.clientX + "px");
  document.body.style.setProperty("--y", e.clientY + "px");
  document.body.style.cursor = "none";
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
  cursor.style.display = "block";
  cursor.style.transform = "translate(-50%, -50%)";

  // let randomSize = 180 + Math.random() * 60;
  //  document.body.style.setProperty("--size", randomSize + "px");
});

// Pomodoro Timer App

let time = 25 * 60;
let timecounter = null;
let breaktime = false;

let screentime = document.querySelector("#countdown h1");
let showbreak = document.querySelector("#countdown h3");
let timestartbtn = document.querySelector("#timestart");
let timestopbtn = document.querySelector("#timestop");
let timeresetbtn = document.querySelector("#timereset");

function displaytime() {
  screentime.textContent = `${Math.floor(time / 60) < 10 ? "0" : ""}${Math.floor(time / 60)}:${time % 60 < 10 ? "0" : ""}${time % 60}`;
}
displaytime();

function countdowntime() {
  if (timecounter) return;
  timecounter = setInterval(() => {
    time--;
    screentime.textContent = `${Math.floor(time / 60) < 10 ? "0" : ""}${Math.floor(time / 60)}:${time % 60 < 10 ? "0" : ""}${time % 60}`;
    if (time < 0) {
      clearInterval(timecounter);
      timecounter = null;

      if (!breaktime) {
        time = 5 * 60;
        breaktime = true;
        showbreak.textContent = "Break Time !!";
      } else {
        time = 25 * 60;
        breaktime = false;
        showbreak.textContent = "Focus Time !!";
      }
      displaytime();
      return;
    }
  }, 1000);
}

function timingbtns() {
  timestartbtn.addEventListener("click", () => {
    countdowntime();
  });

  timestopbtn.addEventListener("click", () => {
    clearInterval(timecounter);
    timecounter = null;
  });
  timeresetbtn.addEventListener("click", () => {
    clearInterval(timecounter);
    timecounter = null;

    time = 25 * 60;
    breaktime = false;
    showbreak.textContent = "Focus Time !!";
    displaytime();
  });
}
timingbtns();
