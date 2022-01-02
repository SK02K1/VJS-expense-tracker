const totalExpense = document.querySelector('#total-expense');
const formAddExpense = document.querySelector('#form-add-expense');
const expenseContainer = document.querySelector('.expense-container');

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

class Expense {
  constructor(title, amount, date) {
    this.id = uuidv4();
    this.title = title;
    this.amount = amount;
    this.date = dateFns.format(new Date(date), 'MMMM D, YYYY');
  }
}

const getExpenses = () => JSON.parse(localStorage.getItem('expenses'));

const updateExpenses = (updatedExpenses) => {
  localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
  updateUI();
};

const addExpense = (newExpense) => {
  updateExpenses([...getExpenses(), newExpense]);
};

const deleteExpense = (expenseID) => {
  updateExpenses(getExpenses().filter(({ id }) => id !== expenseID));
};

const updateUI = () => {
  expenseContainer.innerHTML = getExpenses()
    .map(({ id, title, amount, date }) => {
      return `
        <li data-id=${id}>
          <p>${title}</p>
          <p>₹ ${amount}</p>
          <small>${date}</small>
          <i class="fas fa-trash btn-delete"></i>
        </li>
        `;
    })
    .join('');

  totalExpense.innerHTML = `Total Expense: ${getExpenses().reduce(
    (sum, { amount }) => {
      return (sum += Number(amount));
    },
    0
  )}`;
};

formAddExpense.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = formAddExpense.title.value.trim();
  const amount = formAddExpense.amount.value;
  const date = formAddExpense.date.value;
  const expense = new Expense(title, amount, date);
  addExpense(expense);
  formAddExpense.reset();
});

expenseContainer.addEventListener('click', (e) => {
  const target = e.target;
  if (target.classList.contains('btn-delete')) {
    deleteExpense(target.parentElement.getAttribute('data-id'));
  }
});

if (!getExpenses()) {
  localStorage.setItem('expenses', JSON.stringify([]));
} else {
  updateUI();
}
