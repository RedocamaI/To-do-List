var D, day;
var Today = Date.parse(new Date());
var diff,
  newOrder = false,
  alerts = false;
var taskArray = [];
var OrgTaskArray = [];
var listArray = [];
listArray = JSON.parse(localStorage.getItem("itemsJson"));
if (!isSorted(listArray)) {
  newOrder = true;
}

// Updates the taskArray, which is then used to update the list shown in the UI.
function ReceivenUpdate() {
  let tit = document.getElementById("title").value;
  let desc = document.getElementById("description").value;
  let date_value = document.getElementById("due_date").value;
  D = Date.parse(date_value);
  day = new Date(date_value);
  let str_date = String(date_value);
  let display_date = changeformatt(str_date);

  // Calculate the difference between the due date and today:
  diff = D - Today;

  if (!tit || str_date.length == 0) {
    alert("Missing title OR due date!");
  } else {
    if (diff <= -86400000) {
      // DESCRIBE: Why you've taken diff to be less than '-86400000'!
      alert("Please enter a valid date!");
    } else if (localStorage.getItem("itemsJson") == null) {
      taskArray = [];
      taskArray.push([tit, desc, display_date, D, day]);
      localStorage.setItem("itemsJson", JSON.stringify(taskArray));
    } else {
      taskArrayStr = localStorage.getItem("itemsJson");
      taskArray = JSON.parse(taskArrayStr);
      taskArray.push([tit, desc, display_date, D, day]);
      localStorage.setItem("itemsJson", JSON.stringify(taskArray));
    }
    SetnUpdate();
  }
}

// Sets the task alongside updating the list. Responsible for populating the list.
function SetnUpdate() {
  if (localStorage.getItem("itemsJson") == null) {
    taskArray = [];
    localStorage.setItem("itemsJson", JSON.stringify(taskArray));
  } else {
    taskArrayStr = localStorage.getItem("itemsJson");
    taskArray = JSON.parse(taskArrayStr);
  }
  // Populate the table:
  let tableBody = document.getElementById("table_body");
  let list = "";
  taskArray.forEach((element, index) => {
    el = element;
    ind = index;
    list += `
                  <tr onclick="view_desc(${index})" id="${index}">
                    <td class="table_data" style="width: auto;">${element[0]}</td>
                    <td class="table_data due_font">${element[2]}</td>
                  </tr>`;
  });
  OrgTaskArray = taskArray.slice();
  tableBody.innerHTML = list;
}
add = document.getElementById("add");
add.addEventListener("click", ReceivenUpdate);
add.addEventListener("click", Sort);
SetnUpdate();
if (newOrder == false) {
  Sort();
}

// This function is responsible for deleting a particular TODO from the list.
function Delete(item) {
  let blur = document.getElementById("blur");
  let pop_up = document.getElementById("pop-up-window_desc");
  if (confirm("The current task would be deleted permanently!")) {
    taskArraystr = localStorage.getItem("itemsJson");
    taskArray = JSON.parse(taskArraystr);
    // Delete the clicked item in the list.
    taskArray.splice(item, 1);
    localStorage.setItem("itemsJson", JSON.stringify(taskArray));
    SetnUpdate();
    blur.classList.toggle("active");
    pop_up.classList.toggle("active");
  }
}

// this function is responsible to clear the whole list, along with a prior warning!
function Clear_list() {
  if (taskArray.length != 0) {
    if (confirm("The list would be deleted permanently!")) {
      localStorage.clear();
      SetnUpdate();
    }
  } else {
    alert("The list is empty!");
  }
}

// Changing the date formatt, i.e increasing it's readability.
function changeformatt(date) {
  let currentDate = new Date(date);
  var fd = currentDate.toDateString();
  return fd;
}

// toggle between two classes to view description of each list item:
function view_desc(item) {
  let blur = document.getElementById("blur");
  blur.classList.toggle("active");
  let pop_up = document.getElementById("pop-up-window_desc");
  let desc = taskArray[item][1];
  if (desc.length == 0) {
    desc = "No Description added.";
  }
  pop_up.innerHTML =
    `<h2>Description for task ${item + 1}</h2>` +
    desc +
    `<br><a href='#' id="close" onclick='view_desc(${item})'>Close</a>
    <a href='#' id="delete" onclick='Delete(${item})'>Delete</a>`;
  pop_up.classList.toggle("active");
}

function Notify() {
  // Alert Feature:
  if (alerts == false) {
    alertOn();
    alerts = true;
  } else {
    alertOff();
    alerts = false;
  }
}

function alertOn() {
  let tableBody = document.getElementById("table_body");
  let today = new Date(Today).getDate();
  let list = "";
  taskArray.forEach((element, index) => {
    let due_day = new Date(element[4]).getDate();
    let days_left = Math.abs(today - due_day);
    // console.log(days_left);
    switch (days_left) {
      case 0:
        // console.log("It's Today!");
        list += `
                <tr onclick="view_desc(${index})" id="${index}" style="background-color: #f6705c">
                  <td class="table_data" style="width: auto;">${element[0]}</td>
                  <td class="table_data due_font">${element[2]}</td>
                </tr>`;
        break;

      case 1:
        // console.log("It's Tomorrow!");
        list += `
                <tr onclick="view_desc(${index})" id="${index}" style="background-color: #ffb970">
                  <td class="table_data" style="width: auto;">${element[0]}</td>
                  <td class="table_data due_font">${element[2]}</td>
                </tr>`;
        break;

      case 2:
        // console.log("It's Day after Tomorrow!");
        list += `
                <tr onclick="view_desc(${index})" id="${index}" style="background-color: #fff083">
                  <td class="table_data" style="width: auto;">${element[0]}</td>
                  <td class="table_data due_font">${element[2]}</td>
                </tr>`;
        break;

      default:
        // console.log("Just another Day!");
        list += `
                <tr onclick="view_desc(${index})" id="${index}">
                  <td class="table_data" style="width: auto;">${element[0]}</td>
                  <td class="table_data due_font">${element[2]}</td>
                </tr>`;
        break;
    }

    // first itemsJson is initialised to null to avoid appending of the previous taskArray
    // elements.
    localStorage.setItem("itemsJson", null);
    localStorage.setItem("itemsJson", JSON.stringify(taskArray));
    tableBody.innerHTML = list;
  });
}

function alertOff() {
  SetnUpdate();
}

// Check if the taskArray is sorted
function isSorted(listArray) {
  for (let index = 0; index < taskArray.length - 1; index++) {
    const date1 = listArray[index] / 86400000;
    const date2 = listArray[index + 1] / 86400000;
    if (date1 > date2) {
      return false;
    }
  }
  return true;
}

// Sorting the TODOs according to their due dates, in ascending order.
function Sort() {
  taskArray.sort((a, b) => a[3] - b[3]);
  let tableBody = document.getElementById("table_body");
  let list = "";
  taskArray.forEach((element, index) => {
    el = element;
    ind = index;
    list += `
                  <tr onclick="view_desc(${index})" id="${index}">
                    <td class="table_data" style="width: auto;">${element[0]}</td>
                    <td class="table_data due_font">${element[2]}</td>
                  </tr>`;
  });
  localStorage.setItem("itemsJson", null);
  localStorage.setItem("itemsJson", JSON.stringify(taskArray));
  tableBody.innerHTML = list;
}

// Drag and drop feature.
const dragArea = document.querySelector("#table_body");
new Sortable(dragArea, {
  animation: 350,
});

// function to save the current order generated from Drag and drop.
function SaveNewOrder() {
  newtaskArray = [];
  let row_items = document.getElementsByTagName("tr");
  let l = row_items.length;
  for (let index = 1; index < l; index++) {
    let indexOf_OrgTaskArray = parseInt(row_items[index].id);
    newtaskArray.push(OrgTaskArray[indexOf_OrgTaskArray]);
    console.log(newtaskArray[index-1]);
  }
  // update the itemsJson:
  localStorage.setItem("itemsJson", null);
  localStorage.setItem("itemsJson", JSON.stringify(newtaskArray));
  console.log(localStorage.getItem("itemsJson"));
  taskArray = [];
  taskArray = JSON.parse(localStorage.getItem("itemsJson"));
  newOrder = true;
}

// toggle between two classes to view description of each list item:
let droptions = document.getElementById("drops");
function view_droptions() {
  droptions.classList.toggle("active");
}
// container = document.getElementsByClassName("container largest");
// document.container.addEventListener('click', view_droptions());
