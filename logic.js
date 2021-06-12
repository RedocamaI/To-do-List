let D;
function ReceivenUpdate() {
  console.log("List getting updated...");
  let tit = document.getElementById("title").value;
  let desc = document.getElementById("description").value;
  let date_value = document.getElementById("due_date").value;
  D = Date.parse(date_value);
  let str_date = String(date_value);
  let display_date = changeformatt(str_date);
  // Calculate the difference between the due date and today:
  let Today = Date.parse(new Date());
  let diff = D - Today;

  if (!tit || str_date.length == 0) {
    alert("Missing title and due date!");
  } else {
    if (diff <= -86400000) {
      // DESCRIBE: Why you've taken diff to be less than '-86400000'!
      alert("Please enter a valid date!");
    } else if (localStorage.getItem("itemsJson") == null) {
      taskArray = [];
      taskArray.push([tit, desc, display_date]);
      localStorage.setItem("itemsJson", JSON.stringify(taskArray));
    } else {
      taskArrayStr = localStorage.getItem("itemsJson");
      taskArray = JSON.parse(taskArrayStr);
      taskArray.push([tit, desc, display_date]);
      localStorage.setItem("itemsJson", JSON.stringify(taskArray));
    }
    SetnUpdate();
  }
}

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
    list += `
                  <tr onclick="view(${index})">
                    <td id="table_data" style="width: auto;">${element[0]}</td>
                    <td id="table_data">${element[2]}</td>
                  </tr>`;
  });
  tableBody.innerHTML = list;
}
add = document.getElementById("add");
add.addEventListener("click", ReceivenUpdate);
SetnUpdate();

function Delete(item) {
  console.log("Deleted", item);
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

function changeformatt(date) {
  let currentDate = new Date(date);
  var fd = currentDate.toDateString();
  return fd;
}

// toggle between two classes:
function view(item) {
  let blur = document.getElementById("blur");
  blur.classList.toggle("active");
  let pop_up = document.getElementById("pop-up-window_desc");
  let desc = taskArray[item][1];
  if(desc.length == 0){
      desc = "No Description added."
  }
  pop_up.innerHTML =
    `<h2>Description</h2>` +
    desc +
    `<br><a href='#' id="close" onclick='view(${item})'>Close</a>
    <a href='#' id="delete" onclick='Delete(${item})'>Delete</a>`;
  pop_up.classList.toggle("active");
}