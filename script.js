const API = 'https://6a09a8f2e7e3f433d4834d37.mockapi.io/product';

const container = document.getElementById('productsContainer');
const [nameInp, priceInp, catInp] = ['productName', 'productPrice', 'productCategory'].map(id => document.getElementById(id));
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelEditBtn');
const formTitle = document.getElementById('formTitle');
const countSpan = document.getElementById('productsCount');

let editId = null;

const show = (html) => container.innerHTML = html;
const updateCount = () => countSpan.textContent = document.querySelectorAll('.product-card').length;

// === GET: загрузка товаров ===
async function loadProducts() {
    show('<div class="loading-state">⏳ Загрузка...</div>');
        const res = await fetch(API);
        if (!res.ok) throw new Error('Ошибка загрузки');
        const products = await res.json();
        if (!products.length) return show('<div class="empty-state">📭 Товаров пока нет</div>');
        container.innerHTML = products.map(p => `
            <div class="product-card" data-id="${p.id}">
                <div class="product-name">${escapeHtml(p.name)}</div>
                <div class="product-price">${p.price} ₽</div>
                <div class="product-category">${escapeHtml(p.category)}</div>
                <div class="card-actions">
                    <button class="warning" onclick="editProduct('${p.id}')">✏️ Ред.</button>
                    <button class="danger" onclick="deleteProduct('${p.id}')">🗑️ Удалить</button>
                </div>
            </div>
        `).join('');
        updateCount();
    } 


// === POST: добавление ===
async function addProduct(data) {
    const res = await fetch(API, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Не удалось добавить');
    return res.json();
}

// === PUT: обновление ===
async function updateProduct(id, data) {
    const res = await fetch(`${API}/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Не удалось обновить');
    return res.json();
}

// === DELETE: удаление ===
async function deleteProduct(id) {
    if (!confirm('Удалить товар?')) return;
    try {
        await fetch(`${API}/${id}`, {method: 'DELETE'});
        document.querySelector(`.product-card[data-id="${id}"]`)?.remove();
        if (!container.querySelector('.product-card')) show('<div class="empty-state">📭 Товаров пока нет</div>');
        updateCount();
    } catch (err) {
        alert('Ошибка удаления');
    }
}

// === Редактирование: заполнить форму ===
window.editProduct = async (id) => {
    const res = await fetch(`${API}/${id}`);
    const product = await res.json();
    nameInp.value = product.name;
    priceInp.value = product.price;
    catInp.value = product.category;
    editId = id;
    formTitle.innerHTML = ' Редактировать';
    submitBtn.innerHTML = ' Сохранить';
    cancelBtn.style.display = 'inline-flex';
    document.querySelector('.form-card').scrollIntoView({behavior: 'smooth'});
};

// === Сброс формы ===
function resetForm() {
    nameInp.value = priceInp.value = catInp.value = '';
    editId = null;
    formTitle.innerHTML = ' Добавить товар';
    submitBtn.innerHTML = ' Добавить';
    cancelBtn.style.display = 'none';
}

cancelBtn.onclick = resetForm;

submitBtn.onclick = async () => {
    const name = nameInp.value.trim();
    const price = parseInt(priceInp.value);
    const category = catInp.value.trim();
    
    if (!name || isNaN(price) || price <= 0 || !category) {
        alert('Заполните все поля корректно');
        return;
    }
    
        if (editId) {
            await updateProduct(editId, {name, price, category});
        } else {
            await addProduct({name, price, category});
        }
        resetForm();
        await loadProducts();
    } 
    


loadProducts();