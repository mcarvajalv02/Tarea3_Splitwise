// Definir las listas para almacenar usuarios y gastos
let users = [];
let expenses = [];

// Función para cambiar de página
function displayPage(pageID) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(pageID).classList.add('active');
}

// Función para agregar un usuario y redirigir a la página de "Usuarios"
function addUserAndRedirect() {
    const name = document.getElementById('name-user').value;
    const gender = document.querySelector('input[name="gender"]:checked')?.value;
    const icon = document.querySelector('input[name="icon"]:checked')?.value;

    const newUser = {
        name: name,
        gender: gender,
        icon: icon,
        paid: 0,
        owed: 0
    };

    users.push(newUser);
    updateUsersList();
}

// Función para actualizar la lista de usuarios y el select en el formulario de gastos
function updateUsersList() {
    const usersContainer = document.getElementById('all-users');
    usersContainer.innerHTML = '';

    const selectUser = document.getElementById('select-user');
    selectUser.innerHTML = '';

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.textContent = 'Elige un usuario';
    selectUser.appendChild(defaultOption);

    users.forEach(user => {
        const userEntry = document.createElement('div');
        userEntry.className = 'entry-users';
        userEntry.innerHTML = `
            <div class="entry-details-user">
                <div class="img-user-details">
                    <img src="src/images/${user.icon}.png" alt="Ícono de ${user.name}">
                </div>
            </div>
            <div class="user-details">
                <p>${user.name}</p>
            </div>
        `;
        usersContainer.appendChild(userEntry);

        const option = document.createElement('option');
        option.value = user.name;
        option.textContent = user.name;
        selectUser.appendChild(option);
    });
}

// Función para agregar un gasto y redirigir a la página "Home"
function addExpenseAndRedirect() {
    const user = document.getElementById('select-user').value;
    const amount = document.getElementById('expense-amount').value;
    const title = document.getElementById('expense-title').value;

    const newExpense = {
        user: user,
        amount: parseFloat(amount),
        title: title
    };

    expenses.push(newExpense);
    updateExpensesList();

    const userObj = users.find(u => u.name === user);
    userObj.paid += newExpense.amount;

    const totalUsers = users.length;
    const sharePerUser = newExpense.amount / totalUsers;

    users.forEach(u => {
        if (u.name !== user) {
            u.owed += sharePerUser;
        }
    });

    updateBalancesList();
}

// Función para actualizar la lista de gastos en la página "Home"
function updateExpensesList() {
    const expensesContainer = document.getElementById('entries-home');
    expensesContainer.innerHTML = '';

    expenses.forEach(expense => {
        const user = users.find(u => u.name === expense.user);
        const expenseEntry = document.createElement('div');
        expenseEntry.className = 'entry-home';
        expenseEntry.innerHTML = `
            <div class="entry-date-home">
                <p>Oct</p>
                <p>10</p>
            </div>
            <div class="entry-details-home">
                <div class="img-details">
                    <img src="src/images/${user.icon}.png" alt="icono de ${user.name}">
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

// Función para actualizar la lista de balances en la página "Balances"
function updateBalancesList() {
    const balancesContainer = document.getElementById('entries-balances');
    balancesContainer.innerHTML = '';

    if (users.length === 0) {
        balancesContainer.innerHTML = '<p>No hay balances disponibles.</p>';
        return;
    }

    users.forEach(user => {
        const balanceEntry = document.createElement('div');
        balanceEntry.className = 'balances-user';
        balanceEntry.innerHTML = `
            <div class="entry-details-user">
                <div class="img-user-details">
                    <img src="src/images/${user.icon}.png" alt="Ícono de ${user.name}">
                </div>
            </div>
            <div class="user-details">
                <h3>${user.name}</h3>
                <p>${user.gender === 'male' ? 'Él' : 'Ella'} ha pagado ${user.paid} €</p>
                <p>${user.gender === 'male' ? 'Él' : 'Ella'} debe ${user.owed} €</p>
            </div>
        `;
        balancesContainer.appendChild(balanceEntry);
    });
}

function settleAllBalances() {
    users.forEach(user => {
        user.owed = 0;
        user.paid = 0;
    });
    updateBalancesList(); // Actualiza la interfaz para reflejar los cambios
}

// Eventos para los formularios
document.getElementById('myForm').addEventListener('submit', function(event) {
    event.preventDefault();
    addUserAndRedirect();
});

document.getElementById('expenseForm').addEventListener('submit', function(event) {
    event.preventDefault();
    addExpenseAndRedirect();
});

// Actualizar las listas al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    updateUsersList();
    updateExpensesList();
    updateBalancesList();
});
