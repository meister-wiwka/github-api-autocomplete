// Получаем ссылки на элементы ввода и списков из HTML
const repoSearch = document.getElementById('repoSearch');
const autocompleteList = document.getElementById('autocompleteList');
const repoList = document.getElementById('repoList');

// Добавляем обработчик события ввода для поля поиска
repoSearch.addEventListener('input', debounce(handleInput, 400));

// Функция для обработки ввода в поле поиска
// Эта функция вызывается каждый раз, когда пользователь вводит что-то в поле поиска
// Получаем введенное пользователем значение и убираем лишние пробелы
// Если есть введенное значение, то выполняем поиск репозиториев
// Отправляем запрос к API GitHub для поиска репозиториев по введенному запросу
// Преобразуем ответ в формат JSON
// Отображаем результаты автозаполнения, передавая массив найденных репозиториев
// Если поле поиска пустое, очищаем список автозаполнения

function handleInput(event) {

    const query = event.target.value.trim();

    if (query) {
        fetch(`https://api.github.com/search/repositories?q=${query}&per_page=5`)
            .then(response => response.json())
            .then(data => {
                showAutocomplete(data.items);
            })
            .catch(error => {
                console.error('Ошибка при получении данных:', error);
            });
    } else {
        clearAutocomplete();
    }
}

// Функция для показа результатов автозаполнения
// Эта функция создает элементы списка для каждого найденного репозитория
// Очищаем текущий список автозаполнения, чтобы не было дублирования
// Для каждого найденного репозитория создаем элемент списка
// Создаем элемент li
// Добавляем класс для стилизации
// Устанавливаем текст элемента как имя репозитория
// Добавляем обработчик клика для элемента списка
// При клике на элемент добавляем репозиторий в основной список
// Добавляем элемент li в список автозаполнения

function showAutocomplete(repos) {
    clearAutocomplete();
    repos.forEach(repo => {
        const li = document.createElement('li');
        li.classList.add('list-item');
        li.textContent = repo.name;
        li.addEventListener('click', () => {
            addRepo(repo);
        });
        autocompleteList.appendChild(li);
    });
}

// Функция для очистки списка автозаполнения
function clearAutocomplete() {
    autocompleteList.innerHTML = '';
}

// Функция для добавления репозитория в основной список
// Эта функция добавляет выбранный репозиторий в список добавленных репозиториев
// Создаем элемент li
// Добавляем класс для стилизации
// Устанавливаем HTML содержимое элемента с информацией о репозитории и кнопкой удаления
// Добавляем обработчик клика для кнопки удаления
// При клике на кнопку удаляем элемент из списка
// Добавляем элемент li в основной список репозиториев
// Очищаем поле поиска и список автозаполнения после добавления репозитория

function addRepo(repo) {
    const li = document.createElement('li');
    li.classList.add('list-item');
    li.innerHTML = `
        Repository: ${repo.name} by ${repo.owner.login} - stars: ${repo.stargazers_count}
        <button class="remove-btn">delete</button>
    `;
    li.querySelector('.remove-btn').addEventListener('click', () => {
        li.remove();
    });
    repoList.appendChild(li);
    repoSearch.value = '';

    clearAutocomplete();
}

// Функция для отложенного выполнения
// Возвращаем новую функцию, которая будет выполнена с задержкой
// Очищаем предыдущий таймер, если пользователь продолжает вводить текст
// Устанавливаем новый таймер

function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}
