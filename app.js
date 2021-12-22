const formAddExpense = document.querySelector('#form-add-expense');
const expenseContainer = document.querySelector('.expense-container');

const addNewExpense = (title, amt) => {
  expenseContainer.innerHTML += `
    <div class="expense-card">
      <div class="expense">
        <h3 class="expense-title">${title}</h3>
        <span class="expense-amt">₹ ${amt}</span>
      </div>
    <small class="added-at">${dateFns.format(
      new Date(),
      'MMMM D, YYYY'
    )}</small>
    </div>
    `;
};

formAddExpense.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = formAddExpense.title.value.trim();
  const amount = Number(formAddExpense.amount.value);
  addNewExpense(title, amount);
});
