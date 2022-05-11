/* TO DO
 * Pagination
 * Sort Asceding/descending
 * Click on completed entry to resume project*/
let timerTime = 0,
  interval = null,
  isRunning = false;
let startTime, endTime;
const mixBtn = document.getElementById('mix-btn'),
  $resetButton = document.querySelectorAll('.cancel'),
  $saveButton = document.querySelectorAll('.finish'),
  $currentTask = document.querySelectorAll('.current-task'),
  $currentTaskData = document.querySelectorAll('.current-task__data'),
  $startButton = document.querySelectorAll('.start'),
  $stopButton = document.querySelectorAll('.stop'),
  $taskForm = document.querySelectorAll('.task-form'),
  $taskLabel = document.querySelectorAll('.task-label'),
  $timerWrapper = document.querySelectorAll('.timer-wrapper'),
  $controls = document.querySelectorAll('.controls'),
  $timerMinutes = document.querySelectorAll('.timer .minutes'),
  $timerSeconds = document.querySelectorAll('.timer .seconds'),
  minutes = document.querySelectorAll('.minutes'),
  seconds = document.querySelectorAll('.seconds'),
  $completedTasks = document.querySelectorAll('.task-area .completed-tasks'),
  $timeList = document.querySelectorAll('.time-list'),
  $deleteAllButton = document.querySelectorAll('.clear'),
  $timeListMeta = document.querySelectorAll('.time-list-meta'),
  $modal = document.querySelectorAll('.modal'),
  $modalClose = document.querySelectorAll('.modal__cancel'),
  $modalTitle = document.querySelectorAll('.modal__title'),
  $modalSave = document.querySelectorAll('.modal__save'),
  $modalForm = document.querySelectorAll('.modal__form');

function startTimer() {
  if (!isRunning) {
    isRunning = true;
    startTime = new Date().toLocaleString();
    clearInterval(interval);
    interval = setInterval(incrementTimer, 1000);
  }

  // Update UI
  $taskForm[0].classList.remove('task-form--show');
  $controls[0].classList.add('controls--running');
  $timerWrapper[0].classList.add('timer-wrapper--running');
}
// Stop timer
function stopTimer() {
  isRunning = false;
  endTime = new Date().toLocaleString();
  clearInterval(interval);

  // Update UI
  $taskForm[0].classList.add('task-form--show');
  $timerWrapper[0].classList.remove('timer-wrapper--running');

  console.log(timerTime);
  console.log(startTime.toLocaleString());
  console.log(endTime.toLocaleString());
  document.title = 'Timely';
}
mixBtn.addEventListener('click', e => {
  if (isRunning) {
    isRunning = false;
    // hide the start button on timer stop
    mixBtn.style.display = 'none';
    e.currentTarget.textContent = 'Start';
    stopTimer();
  }
  else {
    turnedOn = true;
    e.currentTarget.textContent = 'Stop';
    timerTime = 0;
    startTimer();
  }
});

// Increment timer
function incrementTimer() {
  const numOfMinutes = Math.floor(timerTime / 60),
    numOfSeconds = timerTime % 60 + 1;

  timerTime++;
  seconds[0].innerText = numOfSeconds >= 10 ? numOfSeconds : '0' + numOfSeconds;
  minutes[0].innerText = numOfMinutes >= 10 ? numOfMinutes : '0' + numOfMinutes;

  document.title = $timerMinutes[0].innerHTML + ':' + $timerSeconds[0].innerHTML;
}

function resetTimer() {
  stopTimer();
  resetUI();
  timerTime = 0;
  seconds[0].innerText = '00';
  minutes[0].innerText = '00';
}
function resetUI() {
  $taskLabel[0].value = '';
  mixBtn.style.display = 'inline-block';
  $taskForm[0].classList.remove('task-form--show');
  $currentTaskData[0].innerHTML = '';
  $currentTask[0].style.display = 'none';
  $controls[0].classList.remove('controls--running');
}



function saveTimer() {
  const numOfMinutes = Math.floor(timerTime / 60),
    numOfSeconds = timerTime % 60,
    minutes = numOfMinutes,
    seconds = numOfSeconds,
    label = $taskLabel[0].value;

  addStoredItem(label, minutes, seconds, startTime, endTime);
  updateTimeList();
  resetUI();
  resetTimer();
  //console.log(localStorage);
}
// Add tasks to localStorage
// Save data in one long string for easier addition/removal/editing
function addStoredItem(title, minutes, seconds, startTime, endTime,) {
  const existingItems = JSON.parse(localStorage.getItem('storageString')) || [];
  const newItem = {
    title,
    minutes,
    seconds,
    startTime,
    endTime
  };

  existingItems.push(newItem);
  localStorage.setItem('storageString', JSON.stringify(existingItems));
}

// Update UI
function updateTimeList() {

  // Empty projects list contents
  $timeList[0].innerHTML = '';

  if (localStorage.getItem('storageString')) {
    const data = JSON.parse(localStorage.getItem('storageString'));
    const arrayLength = data.length;

    for (let i = (arrayLength) - 1; i >= 0; i--) {

      if (data[i].minutes == 0) {
        $timeList[0].innerHTML += '<li data-name="' + data[i].title + '"><button class="edit-project"></button><button class="delete-project"></button><div>Project: <span>' + data[i].title + '</span></div><div>Start time: <span>' + data[i].startTime + '</span></div><div>End time: <span>' + data[i].endTime + '</span></div><div>Project duration: <span>' + data[i].seconds + ' seconds</span></div></li>';
      } else {
        $timeList[0].innerHTML += '<li data-name="' + data[i].title + '"><button class="edit-project"></button><button class="delete-project"></button><div>Project: <span>' + data[i].title + '</span></div><div>Start time: <span>' + data[i].startTime + '</span></div><div>End time: <span>' + data[i].endTime + '</span></div><div>Project duration: <span>' + data[i].minutes + ' minutes and ' + data[i].seconds + ' seconds</span></div></li>';
      }
    }
    // If there are completed projects, add the delete all button, else hide it
    $completedTasks[0].innerHTML = 'Completed project entries:';
    $timeListMeta[0].classList.add('time-list-meta--show');
  } else {
    $completedTasks[0].innerHTML = 'No completed project entries';
    $timeListMeta[0].classList.remove('time-list-meta--show');
  }
}
// Remove all tasks from localStorage
function deleteData() {
  localStorage.removeItem('storageString');
  updateTimeList();
}


// Remove specific task from locaStorage
function deleteItem(item) {
  const data = JSON.parse(localStorage.getItem('storageString')),
    clickedItem = item.closest('li').getAttribute('data-name');

  Array.prototype.forEach.call(data, function (el, i) {
    if (data[i].title == clickedItem) {
      data.splice(i, 1);
      localStorage.setItem('storageString', JSON.stringify(data));
      return false;
    }
  });

  // Update task list
  updateTimeList();
}

function populateModal(title) {
  $modalTitle[0].value = title;
  $modal[0].setAttribute('data-name', title);
  showModal();
}

function showModal() {
  $modal[0].style.display = 'block';
}

function hideModal() {
  $modal[0].style.display = 'none';
}

// Prepare/populate modal
function prepareModal(item) {
  const data = JSON.parse(localStorage.getItem('storageString')),
    clickedItem = item.closest('li').getAttribute('data-name');

  Array.prototype.forEach.call(data, function (el, i) {
    if (data[i].title == clickedItem) {
      populateModal(data[i].title);
      localStorage.setItem('storageString', JSON.stringify(data));
      return false;
    }
  });
}
// Save modal contents
function saveModal() {
  const data = JSON.parse(localStorage.getItem('storageString')),
    currentItem = $modal[0].getAttribute('data-name');

  Array.prototype.forEach.call(data, function (el, i) {
    if (data[i].title == currentItem) {
      data[i].title = $modalTitle[0].value;
      localStorage.setItem('storageString', JSON.stringify(data));
      return false;
    }
  });

  // Update task list
  updateTimeList();
  hideModal();
  return false;
}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

function downloadAsExcel() {
  const excelData = JSON.parse(localStorage.getItem('storageString'));
  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = {
    Sheets: {
      'excelData': worksheet
    },
    SheetNames: ['excelData']
  };
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  saveAsExcel(excelBuffer, 'myProjects')
}
function saveAsExcel(buffer, filename) {
  const excelData = new Blob([buffer], { type: EXCEL_TYPE });
  saveAs(excelData, filename + + new Date().getTime() + EXCEL_EXTENSION);
}
// Event listeners
$modalClose[0].addEventListener('click', hideModal());
$modalForm[0].addEventListener('submit', function () {
  saveModal();
});
document.addEventListener('click', function (element) {
  if (element.target && element.target.className == 'delete-project') {
    let item = element.target;
    deleteItem(item);
  }
});
document.addEventListener('click', function (element) {
  if (element.target && element.target.className == 'edit-project') {
    let item = element.target;
    prepareModal(item);
  }
});
$deleteAllButton[0].addEventListener('click', deleteData);
$saveButton[0].addEventListener('click', saveTimer);
window.onload = function () {
  updateTimeList();
};
$resetButton[0].addEventListener('click', resetTimer);


