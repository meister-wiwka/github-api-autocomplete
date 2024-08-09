const repoSearch = document.querySelector('.repo-search');
const autocompleteList = document.querySelector('.autocomplete-list');
const repoList = document.querySelector('.repo-list');

repoSearch.addEventListener('input', debounce(handleInput, 400));

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

function clearAutocomplete() {
    while (autocompleteList.firstChild) {
        autocompleteList.removeChild(autocompleteList.firstChild);
    }
}

function addRepo(repo) {
    const li = document.createElement('li');
    li.classList.add('list-item');
    li.textContent = `Repository: ${repo.name} by ${repo.owner.login} - stars: ${repo.stargazers_count}`;
    
    const button = document.createElement('button');
    button.classList.add('remove-btn');
    button.textContent = 'delete';
    button.addEventListener('click', () => {
        li.remove();
    });

    li.appendChild(button);
    repoList.appendChild(li);
    repoSearch.value = '';

    clearAutocomplete();
}

function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}
