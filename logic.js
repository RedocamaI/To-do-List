let D;
function ReceivenUpdate() {
  console.log("Updating List...");
  let tit = document.getElementById("title").value;
  let desc = document.getElementById("description").value;
  let date_value = document.getElementById("due_date").value;
  D = Date.parse(date_value);
  let str_date = String(date_value);
  let display_date = changeformatt(str_date);
  // Calculate the difference between the due date and today:
  let Today = Date.parse(new Date());
  let diff = D - Today;

  if (!tit || !desc || str_date.length == 0) {
    alert("Fill something in the title, description, and due date");
  } else {
    if (diff <= -86400000) {
      // DESCRIBE: Why you've taken diff to be less than '-86400000'!
      alert("Please enter a valid date!");
    } else if (localStorage.getItem("itemsJson") == null) {
      itemJsonArray = [];
      itemJsonArray.push([tit, desc, display_date]);
      localStorage.setItem("itemsJson", JSON.stringify(itemJsonArray));
    } else {
      itemJsonArrayStr = localStorage.getItem("itemsJson");
      itemJsonArray = JSON.parse(itemJsonArrayStr);
      itemJsonArray.push([tit, desc, display_date]);
      localStorage.setItem("itemsJson", JSON.stringify(itemJsonArray));
    }
    SetnUpdate();
  }
}

function SetnUpdate() {
  if (localStorage.getItem("itemsJson") == null) {
    itemJsonArray = [];
    localStorage.setItem("itemsJson", JSON.stringify(itemJsonArray));
  } else {
    itemJsonArrayStr = localStorage.getItem("itemsJson");
    itemJsonArray = JSON.parse(itemJsonArrayStr);
  }
  // Populate the table:
  let tableBody = document.getElementById("table_body");
  let list = "";
  itemJsonArray.forEach((element, index) => {
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
  if (confirm("Are you sure, you want to delete the current item?")) {
    itemJsonArraystr = localStorage.getItem("itemsJson");
    itemJsonArray = JSON.parse(itemJsonArraystr);
    // Delete the clicked item in the list.
    itemJsonArray.splice(item, 1);
    localStorage.setItem("itemsJson", JSON.stringify(itemJsonArray));
    SetnUpdate();
    blur.classList.toggle("active");
    pop_up.classList.toggle("active");
  }
}

function New_list() {
  if (itemJsonArray.length != 0) {
    if (
      confirm(
        "By creating a new one you will be clearing the current list. Do you want to continue?"
      )
    ) {
      localStorage.clear();
      SetnUpdate();
    }
  } else {
    alert("New list is already present!");
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
  pop_up.innerHTML =
    `<h2>Description</h2>` +
    itemJsonArray[item][1] +
    `<br><a href='#' id="close" onclick='view(${item})'>Close</a>
    <a href='#' id="delete" onclick='Delete(${item})'>Delete</a>`;
  pop_up.classList.toggle("active");
}