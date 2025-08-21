const habitInput = document.getElementById("habitInput");
const addHabitBtn = document.getElementById("addHabitBtn");
const habitList = document.getElementById("habitList");

let habits = JSON.parse(localStorage.getItem("habits")) || [];

function saveHabits() {
  localStorage.setItem("habits", JSON.stringify(habits));
}


function renderHabits() {
  habitList.innerHTML = "";
  habits.forEach((habit, index) => {
    const li = document.createElement("li");

    
    let progressHTML = '<div class="progress-bar">';
    for (let i = 0; i < 7; i++) {
      progressHTML += `<div class="day ${habit.weekLog.includes(i) ? "done" : ""}"></div>`;
    }
    progressHTML += '</div>';

    li.innerHTML = `
      <span>${habit.name} 🌟 <span class="streak">Streak: ${habit.streak}</span></span>
      <div>
        <button onclick="markDone(${index})">Done</button>
        <button onclick="resetHabit(${index})">🔄 Reset</button>
        <button onclick="deleteHabit(${index})">❌</button>
      </div>
      ${progressHTML}
    `;
    habitList.appendChild(li);
  });
  saveHabits();
}


addHabitBtn.addEventListener("click", () => {
  const habitName = habitInput.value.trim();
  if (habitName) {
    const habit = {
      name: habitName,
      streak: 0,
      lastCompleted: null,
      weekLog: [] // store days (0-6 for Sun-Sat)
    };
    habits.push(habit);
    renderHabits();
    habitInput.value = "";
  }
});



function markDone(index) {
  const habits = JSON.parse(localStorage.getItem("habits")) || [];
  const today = new Date().toDateString();
  let message = "";

  // If the habit was already logged today, do nothing
  if (habits[index].lastDate === today) {
    return;
  }

  // Check if streak should continue or reset
  if (habits[index].lastDate) {
    const lastDate = new Date(habits[index].lastDate);
    const diffDays = Math.floor(
      (new Date(today) - lastDate) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
      // consecutive day → increase streak
      habits[index].streak += 1;
    } else if (diffDays > 1) {
      // missed day(s) → reset streak
      habits[index].streak = 1;
      message = "⚠️ Streak broken!";
    }
  } else {
    // first time logging
    habits[index].streak = 1;
  }

  habits[index].lastDate = today;

  localStorage.setItem("habits", JSON.stringify(habits));
  renderHabits();

  // Show message if streak broke
  if (message) {
    const msgBox = document.getElementById("message");
    msgBox.textContent = message;
    setTimeout(() => msgBox.textContent = "", 3000); // clears after 3 sec
  }
}




function resetHabit(index) {
  habits[index].weekLog = [];
  renderHabits();
}


function deleteHabit(index) {
  habits.splice(index, 1);
  renderHabits();
}


renderHabits();




