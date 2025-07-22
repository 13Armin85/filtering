document.addEventListener('DOMContentLoaded', function() {
    const filterIcon = document.getElementById('filter-icon');
    const menuIcon = document.getElementById('menu-icon');
    const dropdownMenu = document.getElementById('dropdown');
    const filterSection = document.getElementById('filter-section');
    const controlsContainer = document.querySelector('.controls-container');
    const filterRowsContainer = document.getElementById('filter-rows-container');
    const breadcrumbsList = document.getElementById('breadcrumbs-list');

    // Seleção dos botões de ação
    const runFilterBtn = document.getElementById('run-filter-btn');
    const saveFilterBtn = document.getElementById('save-filter-btn');
    const pinFilterBtn = document.getElementById('pin-filter-btn');
    const addAndBtn = document.getElementById('add-and-btn');
    const addOrBtn = document.getElementById('add-or-btn');

    let breadcrumbState = []; 

    function createDropdownHTML() {
        return `
            <div class="custom-select-wrapper">
                <div class="custom-select-display">
                    <span>انتخاب دسته بندی</span>
                    <i class="fa-solid fa-chevron-down"></i>
                </div>
                <ul class="custom-options-list">
                    <li class="search-box-li">
                        <div class="search-input-container">
                            <i class="fa-solid fa-magnifying-glass search-icon"></i>
                            <input type="text" class="dropdown-search-input" autocomplete="off" placeholder="جستجو...">
                        </div>
                    </li>
                    <li data-value="cat1">قابلیت های مدیریت سرویس</li>
                    <li data-value="cat2">امکانات عمومی</li>
                    <li data-value="cat3">پیکربندی و اختصاصی سازی</li>
                </ul>
            </div>
        `;
    }

    function createNewFilterRow(conditionType = null) {
        const row = document.createElement('div');
        row.className = 'filter-row';

        let conditionTextHTML = '';
        if (conditionType) {
            conditionTextHTML = `<span class="or-text-inline">${conditionType}</span>`;
        }

        row.innerHTML = `
            <button type="button" class="btn-icon-delete" title="حذف شرط"><i class="fa-solid fa-xmark"></i></button>
            <input type="text" class="filter-input" placeholder="ارزش">
            <input type="text" class="filter-input" placeholder="عملیات">
            ${createDropdownHTML()}
            ${conditionTextHTML}
        `;
        return row;
    }

    function initializeDropdown(wrapperElement) {
        const display = wrapperElement.querySelector('.custom-select-display');
        const optionsList = wrapperElement.querySelector('.custom-options-list');
        const options = wrapperElement.querySelectorAll('.custom-options-list li:not(.search-box-li)');
        const searchInput = wrapperElement.querySelector('.dropdown-search-input');

        if (!display || !optionsList) return;

        display.addEventListener('click', (e) => {
            e.stopPropagation();
            document.querySelectorAll('.custom-options-list.show').forEach(list => {
                if (list !== optionsList) list.classList.remove('show');
            });
            optionsList.classList.toggle('show');
        });

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                options.forEach(option => {
                    const isVisible = option.textContent.toLowerCase().includes(searchTerm);
                    option.style.display = isVisible ? '' : 'none';
                });
            });
            searchInput.addEventListener('click', e => e.stopPropagation());
        }

        options.forEach(option => {
            option.addEventListener('click', function() {
                display.querySelector('span').textContent = this.textContent;
                optionsList.classList.remove('show');
            });
        });
    }

    function getFiltersData() {
        const allFilterRows = filterRowsContainer.querySelectorAll('.filter-row');
        const filtersData = [];

        allFilterRows.forEach(row => {
            const condition = row.querySelector('.or-text-inline')?.textContent || 'و';
            const category = row.querySelector('.custom-select-display span').textContent;
            const operationInput = row.querySelector('input[placeholder="عملیات"]');
            const valueInput = row.querySelector('input[placeholder="ارزش"]');

            filtersData.push({
                condition: condition,
                category: category.trim(),
                operation: operationInput ? operationInput.value : '',
                value: valueInput ? valueInput.value : ''
            });
        });

        return filtersData;
    }
    function closeAllPanels() {
        if (dropdownMenu) dropdownMenu.classList.remove('show');
        if (filterSection) filterSection.classList.remove('show');
        document.querySelectorAll('.icon-group .icon').forEach(i => i.classList.remove('active'));
    }

    function renderBreadcrumbs() {
        breadcrumbsList.innerHTML = '';
        breadcrumbState.forEach((item, index) => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = '#';
            link.textContent = item.text;
            link.dataset.index = index;

            listItem.appendChild(link);
            breadcrumbsList.appendChild(listItem);
        });
        saveBreadcrumbsToStorage();
    }
    function saveBreadcrumbsToStorage() {
        localStorage.setItem('breadcrumbs', JSON.stringify(breadcrumbState));
    }
    function loadBreadcrumbsFromStorage() {
        const savedState = localStorage.getItem('breadcrumbs');
        breadcrumbState = savedState ? JSON.parse(savedState) : [{ text: 'همه', value: 'all' }];
    }
    pinFilterBtn.addEventListener('click', function() {
        filterSection.classList.toggle('filter-container-pinned');
        this.classList.toggle('active');
    });

    saveFilterBtn.addEventListener('click', function() {
        const data = getFiltersData();
        console.log("--- 💾 Informações do filtro salvas ---");
        console.table(data);
        alert("Informações salvas no console do navegador.");
    });

    runFilterBtn.addEventListener('click', function() {
        const data = getFiltersData();
        console.log("--- 🚀 Executando com os seguintes filtros ---");
        console.table(data);
        const newBreadcrumbs = data.map(filter => ({
            text: `${filter.category} ${filter.operation || ''} ${filter.value || ''}`.trim(),
            value: filter
        }));
        breadcrumbState = [{ text: 'همه', value: 'all' }, ...newBreadcrumbs];
        renderBreadcrumbs();
    });

    addAndBtn.addEventListener('click', () => {
        const newRow = createNewFilterRow('و');
        filterRowsContainer.appendChild(newRow);
        initializeDropdown(newRow.querySelector('.custom-select-wrapper'));
    });

    addOrBtn.addEventListener('click', () => {
        const newRow = createNewFilterRow('یا');
        filterRowsContainer.appendChild(newRow);
        initializeDropdown(newRow.querySelector('.custom-select-wrapper'));
    });
    filterRowsContainer.addEventListener('click', function(e) {
        const deleteButton = e.target.closest('.btn-icon-delete');
        if (deleteButton) {
            e.stopPropagation();
            deleteButton.closest('.filter-row').remove();
        }
    });
    breadcrumbsList.addEventListener('click', function(e) {
        e.preventDefault();
        if (e.target.tagName === 'A') {
            const index = parseInt(e.target.dataset.index, 10);
            breadcrumbState = breadcrumbState.slice(0, index + 1);
            renderBreadcrumbs();
        }
    });
    filterIcon.addEventListener('click', function(event) {
        event.stopPropagation();
        const isActive = this.classList.contains('active');
        closeAllPanels();
        if (!isActive) {
            filterSection.classList.add('show');
            this.classList.add('active');
        }
    });

    menuIcon.addEventListener('click', function(event) {
        event.stopPropagation();
        const isActive = this.classList.contains('active');
        closeAllPanels();
        if (!isActive) {
            dropdownMenu.classList.add('show');
            this.classList.add('active');
        }
    });
    window.addEventListener('click', function(event) {
        if (controlsContainer && !controlsContainer.contains(event.target) && !filterSection.contains(event.target)) {
            closeAllPanels();
        }
        if (!event.target.closest('.custom-select-wrapper')) {
            document.querySelectorAll('.custom-options-list.show').forEach(list => list.classList.remove('show'));
        }
    });
    loadBreadcrumbsFromStorage();
    renderBreadcrumbs();
    document.querySelectorAll('.custom-select-wrapper').forEach(initializeDropdown);

});