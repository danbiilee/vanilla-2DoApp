const defaultPromise = new Promise((resolve, reject) => {
  resolve(true);
});

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
  try {
    let todos = await getTodos();
    todos = todos ? todos : []; // 초기화
    localStorage.setItem('2Do', JSON.stringify(todos.concat(payload)));
    return defaultPromise;
  } catch (e) {
    console.log(e);
  }
};

export const toggleTodo = async (id) => {
  try {
    const todos = await getTodos();
    localStorage.setItem(
      '2Do',
      JSON.stringify(
        todos.map((todo) =>
          todo.id === id ? { ...todo, complete: !todo.complete } : todo,
        ),
      ),
    );
    return defaultPromise;
  } catch (e) {
    console.log(e);
  }
};

export const deleteTodo = async (id) => {
  try {
    const todos = await getTodos();
    localStorage.setItem(
      '2Do',
      JSON.stringify(todos.filter((todo) => todo.id !== id)),
    );
    return defaultPromise;
  } catch (e) {
    console.log(e);
  }
};

export const deleteCompletedTodos = async () => {
  try {
    const todos = await getTodos();
    localStorage.setItem(
      '2Do',
      JSON.stringify(todos.filter((todo) => !todo.complete)),
    );
    return defaultPromise;
  } catch (e) {
    console.log(e);
  }
};

export const editTodo = async (payload) => {
  const { id, title } = payload;
  try {
    const todos = await getTodos();
    localStorage.setItem(
      '2Do',
      JSON.stringify(
        todos.map((todo) => (todo.id === id ? { ...todo, title } : todo)),
      ),
    );
    return defaultPromise;
  } catch (e) {
    console.log(e);
  }
};
