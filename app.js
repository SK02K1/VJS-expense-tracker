const formAddExpense = document.querySelector('#form-add-expense');
const expenseContainer = document.querySelector('.expense-container');

class Expense {
  constructor(title, amt) {
    this.title = title;
    this.amt = amt;
    this.addedAt = dateFns.format(new Date(), 'MMMM D, YYYY');
  }
}

const expensesInStorage = () => JSON.parse(localStorage.getItem('expenses'));

const addToStorage = (newExpense) => {
  const expenses = expensesInStorage();
  expenses.push(newExpense);
  localStorage.setItem('expenses', JSON.stringify(expenses));
};

const updateUI = ({ title, amt, addedAt }) => {
  expenseContainer.innerHTML += `
    <div class="expense-card">
      <div class="expense">
        <h3 class="expense-title">${title}</h3>
        <span class="expense-amt">₹ ${amt}</span>
      </div>
    <small class="added-at">${addedAt}</small>
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
  formAddExpense.reset();
});

if (!expensesInStorage()) {
  console.log('not found');
  localStorage.expenses = JSON.stringify([]);
} else {
  expensesInStorage().forEach((expense) => {
    updateUI(expense);
  });
}
