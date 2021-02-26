import { getTodos, addTodo, toggleTodo } from './myStorage.js';

// 1. 데이터 로드
const loadData = async () => {
  const todos = await getTodos();
  const incompleteTodos =
    todos.length > 0 ? todos.filter((todo) => !todo.complete) : [];
  const completeTodos =
    todos.length > 0 ? todos.filter((todo) => todo.complete) : [];

  // 개수 셋팅
  const incompleteCnt = document.querySelector('.incomplete .cnt');
  const completeCnt = document.querySelector('.complete .cnt');
  incompleteCnt.innerHTML = incompleteTodos.length;
  completeCnt.innerHTML = completeTodos.length;

  if (incompleteTodos.length === 0 && completeTodos.length === 0) {
    return;
  }

  // 리스트 셋팅
  if (incompleteTodos.length > 0) {
    const incompleteUl = document.querySelector('.incomplete .todos');
    incompleteUl.innerHTML = incompleteTodos
      .map((todo) => getElementByText(todo))
      .join('');
  }
  if (completeTodos.length > 0) {
    const completeUl = document.querySelector('.complete .todos');
    completeUl.innerHTML = completeTodos
      .map((todo) => getElementByText(todo))
      .join('');
  }
  return new Promise((resolve, reject) => {
    resolve(true);
  });
};

// li 요소 동적 생성
const getElementByText = (todo) => {
  return `<li class="todo">
    <button class="btn check" data-id="${todo.id}">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
        ${
          todo.complete
            ? '<path d="M19 0h-14c-2.762 0-5 2.239-5 5v14c0 2.761 2.238 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-8.959 17l-4.5-4.319 1.395-1.435 3.08 2.937 7.021-7.183 1.422 1.409-8.418 8.591z" />'
            : '<path d="M5 2c-1.654 0-3 1.346-3 3v14c0 1.654 1.346 3 3 3h14c1.654 0 3-1.346 3-3v-14c0-1.654-1.346-3-3-3h-14zm19 3v14c0 2.761-2.238 5-5 5h-14c-2.762 0-5-2.239-5-5v-14c0-2.761 2.238-5 5-5h14c2.762 0 5 2.239 5 5z" />'
        }
      </svg>
    </button>
    <span class="title">${todo.title}</span>
    <div class="buttons">
      <button class="btn edit ${todo.complete && 'gray'}">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
          <path d="M18.363 8.464l1.433 1.431-12.67 12.669-7.125 1.436 1.439-7.127 12.665-12.668 1.431 1.431-12.255 12.224-.726 3.584 3.584-.723 12.224-12.257zm-.056-8.464l-2.815 2.817 5.691 5.692 2.817-2.821-5.693-5.688zm-12.318 18.718l11.313-11.316-.705-.707-11.313 11.314.705.709z" />
        </svg>
      </button>
      <button class="btn delete ${todo.complete && 'gray'}">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
          <path d="M9 19c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5-17v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712zm-3 4v16h-14v-16h-2v18h18v-18h-2z" />
        </svg>
      </button>
    </div>
  </li>`;
};

// 2. 할 일 추가 영역 토글
const onToggleAddTodo = () => {
  const main = document.querySelector('main');
  const txtarea = document.querySelector('.txtarea');

  main.classList.toggle('add-on');
  txtarea.value = '';
  if (main.className.includes('add-on')) {
    txtarea.focus();
  }
};

// 3. 할 일 추가
const onClickAddTodo = async () => {
  const todos = await getTodos();
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
  const result = await addTodo(newTodo);

  if (result) {
    onToggleAddTodo(); // 추가 영역 토글
    loadData(); // 리로드
  }
};

// 4. 완료 여부 토글
// ###### 버그: 완료된 할일 토글할 때!!!!
const onToggleCheck = async (e) => {
  const checkBtn = e.target.closest('.btn.check');
  if (!checkBtn) {
    return;
  }
  const result = await toggleTodo(parseInt(checkBtn.dataset.id, 10));
  if (result) {
    loadData(); // 리로드
  }
};

// 5. 완료된 할 일 보이기
const onToggleCompleteTodos = () => {
  const completeTodos = document.querySelector('.complete .todos');
  completeTodos.classList.toggle('display');
};

// 6. 수정 및 삭제

// 7. 완료 아이템 전부 삭제

// 이벤트 등록
const setEventListeners = () => {
  // 할 일 추가 영역 토글
  const toggleBtn = document.querySelectorAll('.btn.toggle');
  toggleBtn.forEach((item) => item.addEventListener('click', onToggleAddTodo));

  // 할 일 추가
  const addBtn = document.querySelector('.btn.add');
  addBtn.addEventListener('click', onClickAddTodo);

  // 완료 여부 토글
  const checkBtn = document.querySelectorAll('.btn.check');
  checkBtn.forEach((item) =>
    item.addEventListener('click', (e) => onToggleCheck(e)),
  );

  // 완료된 할 일 보이기
  const toggleHeader = document.querySelector('.complete .toggle');
  toggleHeader.addEventListener('click', onToggleCompleteTodos);
};

loadData() //
  .then((bool) => {
    setEventListeners();
  });
