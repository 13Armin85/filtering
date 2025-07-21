document.addEventListener('DOMContentLoaded', function() {

    const filterIcon = document.getElementById('filter-icon');
    const menuIcon = document.getElementById('menu-icon');
    const dropdownMenu = document.getElementById('dropdown');
    const filterSection = document.getElementById('filter-section');
    const controlsContainer = document.querySelector('.controls-container');
    const initialDropdownWrapper = document.querySelector('.custom-select-wrapper');

    function createDropdownHTML(initialText = "انتخاب دسته بندی") {
        return `
            <div class="custom-select-wrapper">
                <div class="custom-select-display">
                    <span>${initialText}</span>
                    <i class="fa-solid fa-chevron-down"></i>
                </div>
                <ul class="custom-options-list">
                    <li class="search-box-li">
                        <input type="text" class="dropdown-search-input" autocomplete="off" placeholder="جستجو...">
                    </li>
                    <li data-value="cat1">قابلیت های مدیریت سرویس</li>
                    <li data-value="cat2">امکانات عمومی</li>
                    <li data-value="cat3">پیکربندی و اختصاصی سازی</li>
                </ul>
            </div>
        `;
    }

    function initializeDropdown(wrapperElement) {
        const display = wrapperElement.querySelector('.custom-select-display');
        const optionsList = wrapperElement.querySelector('.custom-options-list');
        const options = wrapperElement.querySelectorAll('.custom-options-list li:not(.search-box-li)');
        const searchInput = wrapperElement.querySelector('.dropdown-search-input');

        if (!display || !optionsList) return;

        display.addEventListener('click', () => {
            document.querySelectorAll('.custom-options-list.show').forEach(list => {
                if (list !== optionsList) list.classList.remove('show');
            });
            optionsList.classList.toggle('show');
        });

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                options.forEach(option => {
                    option.style.display = option.textContent.toLowerCase().includes(searchTerm) ? '' : 'none';
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


    function closeAllPanels() { if (dropdownMenu) dropdownMenu.classList.remove('show'); if (filterSection) filterSection.classList.remove('show'); document.querySelectorAll('.icon-group .icon').forEach(i => i.classList.remove('active')); }
    if(filterIcon) filterIcon.addEventListener('click', function(event) { event.stopPropagation(); const isActive = this.classList.contains('active'); closeAllPanels(); if (!isActive) { if (filterSection) filterSection.classList.add('show'); this.classList.add('active'); } });
    if(menuIcon) menuIcon.addEventListener('click', function(event) { event.stopPropagation(); const isActive = this.classList.contains('active'); closeAllPanels(); if (!isActive) { if (dropdownMenu) dropdownMenu.classList.add('show'); this.classList.add('active'); } });

    let isStructureCreated = false;

    if (initialDropdownWrapper) {
        initializeDropdown(initialDropdownWrapper);
        const initialOptions = initialDropdownWrapper.querySelectorAll('.custom-options-list li:not(.search-box-li)');
        
        const handleOptionClick = function(event) {
            event.stopPropagation();

            const selectedCategoryText = this.textContent.trim();

            if (!isStructureCreated) {
                filterSection.innerHTML = '';

                const fullStructureHTML = `
                    <div class="filter-row">
                        <button type="button" class="btn-filter">اجرا</button>
                        <button type="button" class="btn-filter">ذخیره‌سازی</button>
                        <button type="button" class="btn-filter">شرط "و"</button>
                        <button type="button" class="btn-filter">شرط "یا"</button>
                        <button type="button" class="btn-icon"><i class="fa-regular fa-star"></i></button>
                    </div>
                    <div class="filter-group" id="and-conditions-group">
                        <div class="filter-group-header">تمام شروط باید در نظر گرفته شود</div>
                        <div class="filter-rows-container">
                            <div class="filter-row">
                                <button type="button" class="btn-icon-delete" title="حذف شرط"><i class="fa-solid fa-xmark"></i></button>
                                <button type="button" class="btn-filter">شرط "یا"</button>
                                <button type="button" class="btn-filter">شرط "و"</button>
                                <input type="text" class="filter-input" placeholder="ارزش">
                                <input type="text" class="filter-input" placeholder="عملیات">
                                ${createDropdownHTML(selectedCategoryText)}
                            </div>
                            <div class="filter-row">
                                <button type="button" class="btn-icon-delete" title="حذف شرط"><i class="fa-solid fa-xmark"></i></button>
                                <button type="button" class="btn-filter">شرط "یا"</button>
                                <button type="button" class="btn-filter">شرط "و"</button>
                                <button type="button" class="btn-icon" title="تاریخ"><i class="fa-regular fa-calendar"></i></button>
                                <input type="text" class="filter-input" placeholder="ارزش">
                                <input type="text" class="filter-input" placeholder="عملیات">
                                ${createDropdownHTML('قابلیت‌های مدیریت سرویس')}
                            </div>
                            <div class="filter-row" id="or-placeholder-row">                              
                                <input type="text" class="filter-input" placeholder="ارزش">
                                <input type="text" class="filter-input" placeholder="عملیات">                                
                                ${createDropdownHTML('قابلیت‌های مدیریت سرویس')}
                                <span class="or-text">یا</span>
                            </div>
                        </div>
                    </div>
                    <div class="filter-group" id="or-conditions-group">
                        <div class="filter-group-header">یا تمام این شروط باید در نظر گرفته شود</div>
                        <div class="filter-rows-container">
                            <div class="filter-row">
                                <input type="text" class="filter-input" placeholder="ارزش">
                                <input type="text" class="filter-input" placeholder="عملیات">
                                ${createDropdownHTML('قابلیت‌های مدیریت سرویس')}
                            </div>
                        </div>
                    </div>
                `;
                
                filterSection.innerHTML = fullStructureHTML;
                filterSection.querySelectorAll('.custom-select-wrapper').forEach(initializeDropdown);
                isStructureCreated = true;
            } else {
                const newRow = document.createElement('div');
                newRow.className = 'filter-row';
                newRow.innerHTML = `
                    <button type="button" class="btn-icon-delete" title="حذف شرط"><i class="fa-solid fa-xmark"></i></button>
                    <button type="button" class="btn-filter">شرط "یا"</button>
                    <button type="button" class="btn-filter">شرط "و"</button>
                    <input type="text" class="filter-input" placeholder="ارزش">
                    <input type="text" class="filter-input" placeholder="عملیات">
                    ${createDropdownHTML(selectedCategoryText)}
                `;
                
                const rowsContainer = document.querySelector('#and-conditions-group .filter-rows-container');
                const orPlaceholderRow = document.getElementById('or-placeholder-row');
                if (rowsContainer && orPlaceholderRow) {
                    rowsContainer.insertBefore(newRow, orPlaceholderRow);
                    initializeDropdown(newRow.querySelector('.custom-select-wrapper'));
                }
            }
        };

        initialOptions.forEach(option => {
            option.addEventListener('click', handleOptionClick);
        });
    }

    filterSection.addEventListener('click', function(e) {
        const deleteButton = e.target.closest('.btn-icon-delete');
        
        if (deleteButton) {
            e.stopPropagation(); 
            deleteButton.closest('.filter-row').remove();
        }
    });
    window.addEventListener('click', function(event) {
        if (controlsContainer && !controlsContainer.contains(event.target) && filterSection && !filterSection.contains(event.target)) {
            closeAllPanels();
        }
        
        if (!event.target.closest('.custom-select-wrapper')) {
            document.querySelectorAll('.custom-options-list.show').forEach(list => list.classList.remove('show'));
        }
    });
});