export const getTodos = () => {
  const todos = localStorage.getItem('2Do');
  if (!todos) {
    return [];
  }
  return new Promise((resolve, reject) => {
    resolve(JSON.parse(todos));
  });
};

export const addTodo = async (payload) => {
  let todos = await getTodos();
  todos = todos ? todos : []; // 초기화
  localStorage.setItem('2Do', JSON.stringify(todos.concat(payload)));
  return new Promise((resolve, reject) => {
    resolve(true);
  });
};

export const toggleTodo = async (id) => {
  const todos = await getTodos();
  localStorage.setItem(
    '2Do',
    JSON.stringify(
      todos.map((todo) =>
        todo.id === id ? { ...todo, complete: !todo.complete } : todo,
      ),
    ),
  );
  return new Promise((resolve, reject) => {
    resolve(true);
  });
};

export const deleteTodo = (id) => {
  const todos = getTodos();
  localStorage.setItem(
    '2Do',
    JSON.stringify(todos.filter((todo) => todo.id !== id)),
  );
};

export const deleteCompletedTodos = () => {
  const todos = getTodos();
  localStorage.setItem(
    '2Do',
    JSON.stringify(todos.filter((todo) => !todo.complete)),
  );
};
