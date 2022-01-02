const totalExpense = document.querySelector('#total-expense');
const formAddExpense = document.querySelector('#form-add-expense');
const expenseContainer = document.querySelector('.expense-container');
const btnSubmit = document.querySelector('#btn-submit');
const btnEdit = document.querySelector('#btn-edit');

let id = null;

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
    this.date = date;
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

const editExpense = (id, title, amount, date) => {
  updateExpenses(
    getExpenses().map((expInfo) => {
      return expInfo.id === id ? { id, title, amount, date } : expInfo;
    })
  );
};

const updateUI = () => {
  expenseContainer.innerHTML = getExpenses()
    .map(({ id, title, amount, date }) => {
      return `
        <li data-id=${id}>
          <p>${title}</p>
          <p>₹ ${amount}</p>
          <small>${dateFns.format(new Date(date), 'MMMM D, YYYY')}</small>
          <i class="fas fa-trash btn-delete"></i>
          <i class="far fa-edit btn-edit"></i>
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

const focusForm = (expenseID) => {
  btnEdit.disabled = false;
  btnSubmit.disabled = true;
  id = expenseID;
  const { title, amount, date } = getExpenses().filter(
    ({ id }) => id === expenseID
  )[0];

  formAddExpense.title.focus();
  formAddExpense.title.value = title;
  formAddExpense.amount.value = amount;
  formAddExpense.date.value = date;
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

formAddExpense.addEventListener('reset', () => {
  btnSubmit.disabled = false;
  btnEdit.disabled = true;
  formAddExpense.reset();
});

btnEdit.addEventListener('click', () => {
  const updatedTitle = formAddExpense.title.value.trim();
  const updatedAmt = formAddExpense.amount.value;
  const updatedDate = formAddExpense.date.value;
  editExpense(id, updatedTitle, updatedAmt, updatedDate);
  formAddExpense.reset();
  btnEdit.disabled = true;
  btnSubmit.disabled = false;
});

expenseContainer.addEventListener('click', (e) => {
  const target = e.target;
  const id = target.parentElement.getAttribute('data-id');
  if (target.classList.contains('btn-delete')) {
    deleteExpense(id);
  } else if (target.classList.contains('btn-edit')) {
    focusForm(id);
  }
});

if (!getExpenses()) {
  localStorage.setItem('expenses', JSON.stringify([]));
} else {
  updateUI();
}
