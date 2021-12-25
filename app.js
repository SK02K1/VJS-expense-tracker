const formAddExpense = document.querySelector('#form-add-expense');
const expenseContainer = document.querySelector('.expense-container');
const totalExpense = document.querySelector('.total-expense');

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
class Expense {
  constructor(title, amt) {
    this.id = uuidv4();
    this.title = title;
    this.amt = amt;
    this.addedAt = dateFns.format(new Date(), 'MMMM D, YYYY');
  }
}

const expensesInStorage = () => JSON.parse(localStorage.getItem('expenses'));

const updateStorage = (expenses) => {
  localStorage.setItem('expenses', JSON.stringify(expenses));
};

const addToStorage = (newExpense) => {
  const expenses = expensesInStorage();
  expenses.push(newExpense);
  updateStorage(expenses);
};

const removeFromStorage = (expenseID) => {
  updateStorage(
    expensesInStorage().filter((expense) => {
      return expense.id !== expenseID;
    })
  );
};

const updateTotalExpense = (expenseAmt) => {
  totalExpense.textContent = Number(totalExpense.textContent) + expenseAmt;
};

const updateUI = ({ id, title, amt, addedAt }) => {
  expenseContainer.innerHTML += `
    <div class="expense-card" data-id="${id}">
      <div class="expense">
        <h3 class="expense-title">${title}</h3>
        <span class="expense-amt">₹ ${amt}</span>
      </div>
      <div class="data-secondary">
        <small class="added-at">${addedAt}</small>
        <i class="fas fa-trash btn-delete"></i>
      </div>
    </div>
    `;
};

formAddExpense.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = formAddExpense.title.value.trim();
  const amount = Number(formAddExpense.amount.value);
  const newExpense = new Expense(title, amount);
  addToStorage(newExpense);
  updateUI(newExpense);
  updateTotalExpense(amount);
  formAddExpense.reset();
});

const removeExpense = (element) => {
  removeFromStorage(element.getAttribute('data-id'));
  element.remove();
};

expenseContainer.addEventListener('click', (e) => {
  const target = e.target;
  if (target.classList.contains('btn-delete')) {
    removeExpense(target.parentElement.parentElement);
  }
});

if (!expensesInStorage()) {
  console.log('not found');
  localStorage.expenses = JSON.stringify([]);
} else {
  expensesInStorage().forEach((expense) => {
    updateTotalExpense(expense.amt);
    updateUI(expense);
  });
}
