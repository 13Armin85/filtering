document.addEventListener('DOMContentLoaded', function() {
    // ====================================================
    // بخش ۱: کدهای موجود شما برای فیلتر و منوی اصلی
    // ====================================================
    const icons = document.querySelectorAll('.icon-group .icon');
    const menuIcon = document.getElementById('menu-icon');
    const filterIcon = document.getElementById('filter-icon');
    const dropdownMenu = document.getElementById('dropdown');
    const filterSection = document.getElementById('filter-section');

    function closeAllPanels() {
        if(dropdownMenu) dropdownMenu.classList.remove('show');
        if(filterSection) filterSection.classList.remove('show');
        if(icons) icons.forEach(i => i.classList.remove('active'));
    }

    if (filterIcon) {
        filterIcon.addEventListener('click', function(event) {
            event.stopPropagation();
            const isActive = this.classList.contains('active');
            closeAllPanels();
            if (!isActive) {
                filterSection.classList.add('show');
                this.classList.add('active');
            }
        });
    }

    if (menuIcon) {
        menuIcon.addEventListener('click', function(event) {
            event.stopPropagation();
            const isActive = this.classList.contains('active');
            closeAllPanels();
            if (!isActive) {
                dropdownMenu.classList.add('show');
                this.classList.add('active');
            }
        });
    }

    // ====================================================
    // بخش ۲: کدهای جدید برای منوی کشویی سفارشی (زیر منو)
    // ====================================================
    const customSelectWrapper = document.querySelector('.custom-select-wrapper');

    // فقط در صورتی که منوی سفارشی در صفحه وجود داشته باشد، کد آن را اجرا کن
    if (customSelectWrapper) {
        const display = customSelectWrapper.querySelector('.custom-select-display');
        const optionsList = customSelectWrapper.querySelector('.custom-options-list');
        const options = customSelectWrapper.querySelectorAll('li');
        const realSelect = document.getElementById('real-category-select');

        // باز و بسته کردن منوی سفارشی
        display.addEventListener('click', function() {
            optionsList.classList.toggle('show');
        });

        // مدیریت انتخاب گزینه‌ها
        options.forEach(function(option) {
            option.addEventListener('click', function() {
                display.querySelector('span').textContent = this.textContent;
                realSelect.value = this.getAttribute('data-value');
                optionsList.classList.remove('show');
            });
        });
    }

    // ====================================================
    // بخش ۳: رویداد کلیک کلی روی صفحه (ترکیب شده)
    // ====================================================
    window.addEventListener('click', function(event) {
        // بستن پنل فیلتر و منوی اصلی در صورت کلیک در خارج از آن‌ها
        if (filterIcon && !filterIcon.contains(event.target) &&
            menuIcon && !menuIcon.contains(event.target) &&
            filterSection && !filterSection.contains(event.target) &&
            dropdownMenu && !dropdownMenu.contains(event.target)) {
            closeAllPanels();
        }

        // بستن منوی کشویی سفارشی در صورت کلیک در خارج از آن
        if (customSelectWrapper && !customSelectWrapper.contains(event.target)) {
            customSelectWrapper.querySelector('.custom-options-list').classList.remove('show');
        }
    });
});