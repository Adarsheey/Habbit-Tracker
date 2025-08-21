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
  const today = new Date();
  const todayStr = today.toDateString();
  const dayIndex = today.getDay();

  if (habits[index].lastCompleted !== todayStr) {
    habits[index].streak++;
    habits[index].lastCompleted = todayStr;

    if (!habits[index].weekLog.includes(dayIndex)) {
      habits[index].weekLog.push(dayIndex);
    }
  }
  renderHabits();
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

