import * as api from './myStorage.js';

// 데이터 로드
const loadData = async () => {
  const todos = await api.getTodos();
  const incompleteTodos =
    todos.length > 0 ? todos.filter((todo) => !todo.complete) : [];
  const completeTodos =
    todos.length > 0 ? todos.filter((todo) => todo.complete) : [];

  // 개수 셋팅
  const incompleteCnt = document.querySelector('.incomplete .cnt');
  const completeCnt = document.querySelector('.complete .cnt');
  incompleteCnt.innerHTML = incompleteTodos.length;
  completeCnt.innerHTML = completeTodos.length;

  // 리스트 셋팅
  const incompleteUl = document.querySelector('.incomplete .todos');
  const completeUl = document.querySelector('.complete .todos');
  incompleteUl.innerHTML = incompleteTodos
    .map((todo) => getElementByText(todo))
    .join('');
  completeUl.innerHTML = completeTodos
    .map((todo) => getElementByText(todo))
    .join('');

  return new Promise((resolve, reject) => {
    resolve(todos);
  });
};

// li 요소 동적 생성
const getElementByText = (todo) => {
  return `<li class="todo ${todo.id}" data-id="${todo.id}">
    <button class="btn check" data-id="${todo.id}" title="완료여부 체크하기">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
        ${
          todo.complete
            ? '<path d="M19 0h-14c-2.762 0-5 2.239-5 5v14c0 2.761 2.238 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-8.959 17l-4.5-4.319 1.395-1.435 3.08 2.937 7.021-7.183 1.422 1.409-8.418 8.591z" />'
            : '<path d="M5 2c-1.654 0-3 1.346-3 3v14c0 1.654 1.346 3 3 3h14c1.654 0 3-1.346 3-3v-14c0-1.654-1.346-3-3-3h-14zm19 3v14c0 2.761-2.238 5-5 5h-14c-2.762 0-5-2.239-5-5v-14c0-2.761 2.238-5 5-5h14c2.762 0 5 2.239 5 5z" />'
        }
      </svg>
    </button>
    <span class="title">${todo.title}</span>
    <input class="input" value=${todo.title} />
    <div class="buttons">
      <button class="btn edit${todo.complete ? ' gray' : ''}" data-id="${
    todo.id
  }" title="수정하기">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
          <path d="M18.363 8.464l1.433 1.431-12.67 12.669-7.125 1.436 1.439-7.127 12.665-12.668 1.431 1.431-12.255 12.224-.726 3.584 3.584-.723 12.224-12.257zm-.056-8.464l-2.815 2.817 5.691 5.692 2.817-2.821-5.693-5.688zm-12.318 18.718l11.313-11.316-.705-.707-11.313 11.314.705.709z" />
        </svg>
      </button>
      <button class="btn delete${todo.complete ? ' gray' : ''}" data-id="${
    todo.id
  }" title="삭제하기">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
          <path d="M9 19c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5-17v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712zm-3 4v16h-14v-16h-2v18h18v-18h-2z" />
        </svg>
      </button>
    </div>
  </li>`;
};

// 할 일 추가 영역 토글
const onToggleAddTodo = () => {
  const main = document.querySelector('main');
  const txtarea = document.querySelector('.txtarea');

  main.classList.toggle('add-on');
  txtarea.value = '';
  if (main.className.includes('add-on')) {
    txtarea.focus();
  }
};

// 할 일 추가
const onClickAddTodo = async () => {
  const todos = await api.getTodos();
  const title = document.querySelector('.txtarea');
  if (!title.value) {
    alert('⚠ 할 일을 입력해주세요 ⚠');
    title.focus();
    return;
  }

  const newTodo = {
    id: todos.length,
    title: title.value,
    complete: false,
  };
  const result = await api.addTodo(newTodo);
  if (result) {
    onToggleAddTodo(); // 추가 영역 토글
    handleLoadPromise(); // 리로드
  }
};

// 완료 여부 토글
const onToggleCheck = async (e) => {
  const checkBtn = e.target.closest('.btn.check');
  if (!checkBtn) {
    return;
  }
  const result = await api.toggleTodo(parseInt(checkBtn.dataset.id, 10));
  if (result) {
    handleLoadPromise(); // 리로드
  }
};

// 완료된 할 일 보이기
const onToggleCompleteTodos = () => {
  const completeTodos = document.querySelector('.complete .todos');
  completeTodos.classList.toggle('display');
};

// 아이템 하나 삭제
const onDeleteTodo = async (e) => {
  const delBtn = e.target.closest('.btn.delete');
  if (!delBtn) {
    return;
  }
  const result = await api.deleteTodo(parseInt(delBtn.dataset.id, 10));
  if (result) {
    handleLoadPromise(); // 리로드
  }
};

// 완료 아이템 전부 삭제
const onDeleteCompletedTodos = async () => {
  const result = await api.deleteCompletedTodos();
  if (result) {
    handleLoadPromise(); // 리로드
  }
};

// 타이틀 수정 영역 보이기
const handleEdit = async (e) => {
  const editBtn = e.target.closest('.btn.edit');
  if (!editBtn) {
    return;
  }

  const todo = document.querySelector(`.todo[data-id="${editBtn.dataset.id}"]`);
  const title = document.querySelector(
    `.todo[data-id="${editBtn.dataset.id}"] .title`,
  );
  const input = document.querySelector(
    `.todo[data-id="${editBtn.dataset.id}"] .input`,
  );

  todo.classList.toggle('edit-on');

  // 타이틀 수정 영역 보이기
  if (todo.className.includes('edit-on')) {
    input.value = title.innerHTML;
    input.focus();
    return;
  }

  // 타이틀 변경
  const payload = {
    id: parseInt(editBtn.dataset.id, 10),
    title: input.value,
  };
  changeEdit(payload);
};

const changeEdit = async (payload) => {
  const { id, title } = payload;
  const todos = await api.getTodos();

  // 비교
  const diff = todos.find((todo) => todo.id === id).title === title;
  if (diff) {
    return;
  }

  // 이전 값과 다를 때만 변경
  const result = await api.editTodo(payload);
  if (result) {
    handleLoadPromise(); // 리로드
  }
};

// 이벤트 등록
const setEventListeners = (todos) => {
  const toggleBtn = document.querySelectorAll('.btn.toggle');
  const addBtn = document.querySelector('.btn.add');
  const checkBtn = document.querySelectorAll('.btn.check');
  const toggleHeader = document.querySelector('.complete .toggle');
  const delBtn = document.querySelectorAll('.btn.delete');
  const delAllBtn = document.querySelector('.btn.delete-all');
  const editBtn = document.querySelectorAll('.btn.edit');

  // 할 일 추가 영역 토글
  toggleBtn.forEach((item) => item.addEventListener('click', onToggleAddTodo));

  // 할 일 추가
  addBtn.addEventListener('click', onClickAddTodo);

  // 완료 여부 토글
  checkBtn.forEach((item) =>
    item.addEventListener('click', (e) => onToggleCheck(e)),
  );

  // 완료된 할 일 보이기
  toggleHeader.addEventListener('click', onToggleCompleteTodos);

  // 아이템 하나 삭제
  delBtn.forEach((item) =>
    item.addEventListener('click', (e) => onDeleteTodo(e)),
  );

  // 완료 아이템 전체 삭제
  delAllBtn.addEventListener('click', onDeleteCompletedTodos);

  // 타이틀 수정
  editBtn.forEach((item) =>
    item.addEventListener('click', (e) => handleEdit(e)),
  );
};

const handleLoadPromise = () => {
  loadData() //
    .then((todos) => {
      setEventListeners(todos);
    })
    .catch(console.log);
};

handleLoadPromise();
