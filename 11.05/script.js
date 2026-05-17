const postsContainer = document.getElementById('postsContainer');
const userSelect = document.getElementById('userSelect');

const russianTitles = [
    "Заметка о программировании", "Новости технологий", "Как выучить JavaScript", 
    "Путешествие по миру", "Секреты продуктивности", "Обзор инструментов разработчика",
    "Искусственный интеллект сегодня", "Основы веб-дизайна", "Жизнь на удаленке", "Планы на будущее"
];

const russianBodies = [
    "Сегодня мы изучили базовые принципы работы с API и DOM деревом. Это было очень познавательно!",
    "Текст этого поста был заменен на русский для удобства чтения в учебном приложении.",
    "Многие разработчики сталкиваются с трудностями при изучении асинхронности, но практика помогает всё понять.",
    "В этом блоке информации мы делимся полезными советами по написанию чистого и понятного кода.",
    "Просто пример текста, который имитирует реальное содержимое статьи в нашей мини-ленте."
];

// Функция для замены английских данных на русские
function makePostRussian(post) {
    return {
        ...post,
        // Выбираем текст из массивов на основе ID поста, чтобы они были разными
        title: russianTitles[post.id % russianTitles.length],
        body: russianBodies[post.id % russianBodies.length]
    };
}

//  Загрузка пользователей для SELECT
async function loadUsers() {

    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    const users = await response.json();

    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = user.name;
        userSelect.appendChild(option);
    })
    
}

//  Загрузка постов (с учетом фильтра по userId)
async function loadPosts(userId = '') {
    postsContainer.innerHTML = '<p>Загрузка...</p>';
    
    // Формируем URL: если выбран юзер, добавляем ?userId=...
    const url = userId 
        ? `https://jsonplaceholder.typicode.com/posts?userId=${userId}` 
        : 'https://jsonplaceholder.typicode.com/posts';

    
        const response = await fetch(url);
        const posts = await response.json();

        // Превращаем каждый пост в "русский"
        const translatedPosts = posts.map(makePostRussian);
        
        renderPosts(translatedPosts);

}

// Функция отрисовки карточек
function renderPosts(posts) {
    postsContainer.innerHTML = '';
    
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

// Слушатель изменения выбора в списке
userSelect.addEventListener('change', (e) => {
    loadPosts(e.target.value);
});

// Инициализация
loadUsers();
loadPosts();

