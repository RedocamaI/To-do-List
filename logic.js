var D;
var Today = Date.parse(new Date());
var diff, newOrder = false;
var Todos = [];
var taskArray = [];
var listArray = [];
listArray = JSON.parse(localStorage.getItem("itemsJson"));
if(!isSorted(listArray)){
  newOrder = true;
}

// Updates the taskArray, which is then used to update the list shown in the UI.
function ReceivenUpdate() {
  let tit = document.getElementById("title").value;
  let desc = document.getElementById("description").value;
  let date_value = document.getElementById("due_date").value;
  D = Date.parse(date_value);
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
      taskArray.push([tit, desc, display_date, D]);
      localStorage.setItem("itemsJson", JSON.stringify(taskArray));
    } else {
      taskArrayStr = localStorage.getItem("itemsJson");
      taskArray = JSON.parse(taskArrayStr);
      taskArray.push([tit, desc, display_date, D]);
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
  tableBody.innerHTML = list;
}
add = document.getElementById("add");
add.addEventListener("click", ReceivenUpdate);
add.addEventListener("click", Sort);
SetnUpdate();
if(newOrder == false){
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

// IMPORTANT...........
// Currently working on the Alert feature: on a temporary halt due to a bug found in the code!
// ---------XXXXXXXXX-----------

// function Notify(element, index) {
// Alert Feature:
//   console.log(index);
//   Alert = document.querySelectorAll("tr");
//   let days_left = Math.round(Math.abs((Today - element[3]) / 86400000));
//   console.log(days_left);
//   switch (days_left) {
//     case 0:
//       console.log("It's Today!");
//       break;
//     case 1:
//       console.log("It's Tomorrow!");
//       console.log(Alert);
// Access the inner html of the table row with this index, which here is an 'id'.
//       break;
//     case 2:
//       console.log("It's Day after Tomorrow!");
// Access the inner html of the table row with this index, which here is an 'id'.
//       break;
//     default:
//       console.log("Just another Day!");
//   }
// }

// Check if the taskArray is sorted
function isSorted(listArray){
  for (let index = 0; index < taskArray.length-1; index++) {
    const date1 = listArray[index]/86400000;
    const date2 = listArray[index+1]/86400000;
    if(date1>date2){
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
    let indexOf_taskArray = parseInt(row_items[index].id);
    newtaskArray.push(taskArray[indexOf_taskArray]);
  }
  // update the itemsJson:
  localStorage.setItem("itemsJson", null);
  localStorage.setItem("itemsJson", JSON.stringify(newtaskArray));
  taskArray = [];
  taskArray = JSON.parse(localStorage.getItem("itemsJson"));
  newOrder = true;
}

// toggle between two classes to view description of each list item:
function view_droptions() {
  let droptions = document.getElementById("drops");
  droptions.classList.toggle("active");
}
