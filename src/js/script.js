// Define the lists to store users and expenses
let users = [];
let expenses = [];
let currentDate = new Date();

// Function to change the page
function displayPage(pageID) {
  const pages = document.querySelectorAll(".page");
  pages.forEach((page) => page.classList.remove("active"));
  document.getElementById(pageID).classList.add("active");
}

// Update the current month and year in the span inside the div with id "month"
function updateCurrentMonthAndYear() {
  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  const currentMonth = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  // Select the span inside the div with id "month" and update its content
  const monthSpan = document.querySelector("#month > span");
  if (monthSpan) {
    monthSpan.textContent = `${currentMonth} ${currentYear}`;
  }
}

// Function to add a user and redirect to the "Users" page
function addUserAndRedirect() {
  const nameInput = document.getElementById("name-user");
  const genderInput = document.querySelector('input[name="gender"]:checked');
  const iconInput = document.querySelector('input[name="icon"]:checked');

  const newUser = {
    name: nameInput.value,
    gender: genderInput?.value,
    icon: iconInput?.value,
    paid: 0,
    owed: 0,
  };

  users.push(newUser);
  updateUsersList();

  // Clear the form
  nameInput.value = "";
  if (genderInput) genderInput.checked = false;
  if (iconInput) iconInput.checked = false;
}

// Function to update the list of users and the select in the expenses form
function updateUsersList() {
  const usersContainer = document.getElementById("all-users");
  usersContainer.innerHTML = "";

  const selectUser = document.getElementById("select-user");
  selectUser.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.disabled = true;
  defaultOption.selected = true;
  defaultOption.textContent = "Choose a user";
  selectUser.appendChild(defaultOption);

  users.forEach((user) => {
    const userEntry = document.createElement("div");
    userEntry.className = "entry-users";
    userEntry.innerHTML = `
            <div class="entry-details-user">
                <div class="img-user-details">
                    <img src="src/images/${user.icon}.png" alt="Icon of ${user.name}">
                </div>
            </div>
            <div class="user-details">
                <p>${user.name}</p>
            </div>
        `;
    usersContainer.appendChild(userEntry);

    const option = document.createElement("option");
    option.value = user.name;
    option.textContent = user.name;
    selectUser.appendChild(option);
  });
}

// Function to add an expense and redirect to the "Home" page
function addExpenseAndRedirect() {
  const userSelect = document.getElementById("select-user");
  const amountInput = document.getElementById("expense-amount");
  const titleInput = document.getElementById("expense-title");

  const newExpense = {
    user: userSelect.value,
    amount: parseFloat(amountInput.value),
    title: titleInput.value,
  };

  expenses.push(newExpense);
  updateExpensesList();

  const userObj = users.find((u) => u.name === userSelect.value);
  userObj.paid += newExpense.amount;

  const totalUsers = users.length;
  const sharePerUser = newExpense.amount / totalUsers;

  users.forEach((u) => {
    if (u.name !== userSelect.value) {
      u.owed += sharePerUser;
    }
  });

  updateBalancesList();

  // Clear the form
  userSelect.selectedIndex = 0;
  amountInput.value = "";
  titleInput.value = "";
}

// Function to update the list of expenses on the "Home" page
function updateExpensesList() {
  const expensesContainer = document.getElementById("entries-home");
  expensesContainer.innerHTML = "";

  // Get the current date
  const currentDate = new Date();
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const currentMonth = monthNames[currentDate.getMonth()];
  const currentDay = currentDate.getDate();

  expenses.forEach((expense) => {
    const user = users.find((u) => u.name === expense.user);
    const expenseEntry = document.createElement("div");
    expenseEntry.className = "entry-home";
    expenseEntry.innerHTML = `
      <div class="entry-date-home">
        <p>${currentMonth}</p>
        <p>${currentDay}</p>
      </div>
      <div class="entry-details-home">
        <div class="img-details">
          <img src="src/images/${user.icon}.png" alt="Icon of ${user.name}">
        </div>
      </div>
      <div class="pay-details">
        <p>${expense.title}</p>
        <p>${expense.user} paid ${expense.amount} €</p>
      </div>
    `;
    expensesContainer.appendChild(expenseEntry);
  });
}

// Function to update the list of balances on the "Balances" page
function updateBalancesList() {
  const balancesContainer = document.getElementById("entries-balances");
  balancesContainer.innerHTML = "";

  if (users.length === 0) {
    balancesContainer.innerHTML = "<p>No balances available.</p>";
    return;
  }

  users.forEach((user) => {
    const balanceEntry = document.createElement("div");
    balanceEntry.className = "balances-user";
    balanceEntry.innerHTML = `
            <div class="entry-details-user">
                <div class="img-user-details">
                    <img src="src/images/${user.icon}.png" alt="Icon of ${user.name}">
                </div>
            </div>
            <div class="user-details">
                <h3>${user.name}</h3>
                <p>${user.gender === "male" ? "He" : "She"} has paid ${user.paid} €</p>
                <p>${user.gender === "male" ? "He" : "She"} owes ${user.owed} €</p>
            </div>
        `;
    balancesContainer.appendChild(balanceEntry);
  });
}

// Function to settle all balances
function settleAllBalances() {
  users.forEach((user) => {
    user.owed = 0;
    user.paid = 0;
  });
  updateBalancesList(); // Update the interface to reflect the changes
}

// Events for the forms
document.getElementById("myForm").addEventListener("submit", function (event) {
  event.preventDefault();
  addUserAndRedirect();
});

// Set up the submit event to avoid duplicates
const expenseForm = document.getElementById("expenseForm");
expenseForm.removeEventListener("submit", handleExpenseSubmit);
expenseForm.addEventListener("submit", handleExpenseSubmit);

function handleExpenseSubmit(event) {
  event.preventDefault();
  addExpenseAndRedirect();
}

// Update the lists and the month/year when the page loads
document.addEventListener("DOMContentLoaded", () => {
  updateCurrentMonthAndYear();
  updateUsersList();
  updateExpensesList();
  updateBalancesList();
});
