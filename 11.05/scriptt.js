const postsContainer = document.getElementById('postsContainer');
const userSelect = document.getElementById('userSelect');


const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';
const USERS_URL = 'https://jsonplaceholder.typicode.com/users';

//  Функция для получения и отображения пользователей в select
async function loadUsers() {
    try {
        const response = await fetch(USERS_URL);
        const users = await response.json();

        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id; // Зашиваем ID в value
            option.textContent = user.name;
            userSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Ошибка при загрузке пользователей:', error);
    }
}

//  Функция для получения и отрисовки постов
async function loadPosts(userId = '') {
    // Очищаем контейнер перед загрузкой
    postsContainer.innerHTML = '<p>Загрузка...</p>';

    // Формируем URL в зависимости от того, выбран ли пользователь
    const url = userId 
        ? `${POSTS_URL}?userId=${userId}` 
        : POSTS_URL;

}

//  Функция отрисовки карточек в DOM
function renderPosts(posts) {
    postsContainer.innerHTML = ''; // Очищаем текст "Загрузка"


    posts.forEach(post => {
        const card = document.createElement('div');
        card.className = 'post-card';
        card.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.body}</p>
        `;
        postsContainer.appendChild(card);
    });
}

//  Слушатель событий на изменение выбора в select
userSelect.addEventListener('change', (event) => {
    const selectedUserId = event.target.value;
    loadPosts(selectedUserId); // Загружаем посты выбранного юзера (или все, если value пустой)
});

// Инициализация приложения
loadUsers(); // Загружаем список пользователей в фильтр
loadPosts(); // При первой загрузке показываем все посты