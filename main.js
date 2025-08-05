// =================================================================================
// --- 核心功能區 (此檔案掌管所有網站互動邏輯) ---
// =================================================================================

// 將所有功能封裝在一個立即執行函式中，避免污染全域命名空間
(function() {
    let typingTimeout, galleryInterval;
    let currentNovelContentIndex = -1;

    // --- 元素快取 ---
    const header = document.getElementById('main-header');
    const mobileMenu = document.getElementById('mobile-menu');
    const typingTextElement = document.getElementById('typing-text');
    const novelModal = document.getElementById('novel-modal');
    const portfolioModal = document.getElementById('portfolio-modal');
    const novelModalContent = document.getElementById('novel-modal-content');
    const novelNavigation = document.getElementById('novel-navigation');

    // --- 核心功能 ---

    function revealOnScroll() {
        document.querySelectorAll('.reveal').forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight - 100) {
                el.classList.add('visible');
            }
        });
    }

    function showSection(targetId, isPushState = true) {
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.toggle('active', '#' + section.id === targetId);
        });
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === targetId);
        });

        if (targetId === '#home') {
            startTypingAnimation();
        } else {
            stopTypingAnimation();
        }

        if (isPushState) {
            history.pushState({ path: targetId }, '', targetId);
        }
        revealOnScroll();
    }

    function addNavTriggerListeners(selector) {
        document.querySelectorAll(selector).forEach(trigger => {
            trigger.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId.startsWith('#')) {
                    e.preventDefault();
                    mobileMenu.classList.add('hidden');
                    showSection(targetId);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        });
    }

    function startTypingAnimation() {
        if (typingTimeout || !typingTextElement) return;
        const texts = ["一位熱愛文字的開發者。", "一位沉浸程式碼的夢想家。", "探索技術與故事的邊界。"];
        let textIndex = 0, charIndex = 0, isDeleting = false;
        function type() {
            const currentText = texts[textIndex];
            let typeSpeed = isDeleting ? 75 : 150;
            typingTextElement.textContent = currentText.substring(0, charIndex);
            if (isDeleting) charIndex--; else charIndex++;
            if (!isDeleting && charIndex === currentText.length) { typeSpeed = 2000; isDeleting = true; } 
            else if (isDeleting && charIndex === 0) { isDeleting = false; textIndex = (textIndex + 1) % texts.length; }
            typingTimeout = setTimeout(type, typeSpeed);
        }
        type();
    }

    function stopTypingAnimation() {
        if (typingTimeout) clearTimeout(typingTimeout);
        typingTimeout = null;
        if (typingTextElement) typingTextElement.textContent = "";
    }

    function openModal(modalElement) {
        modalElement.classList.remove('hidden');
        setTimeout(() => modalElement.classList.remove('opacity-0'), 10);
    }

    function closeModal(modalElement) {
        modalElement.classList.add('opacity-0');
        setTimeout(() => modalElement.classList.add('hidden'), 300);
        if (modalElement.id === 'portfolio-modal' && galleryInterval) {
            clearInterval(galleryInterval);
            galleryInterval = null;
        }
    }

    function updateNovelModalContent(index) {
        currentNovelContentIndex = index;
        const contentList = novelsData[0].contentList;
        const item = contentList[index];
        novelModalContent.innerHTML = '<p>載入中...</p>';
        fetch(item.file)
            .then(res => res.ok ? res.text() : Promise.reject(res.status))
            .then(text => {
                novelModalContent.innerHTML = `<h2 class="text-3xl font-bold text-amber-400 mb-6 font-serif">${item.title}</h2><div class="novel-text-content">${text}</div>`;
            })
            .catch(err => {
                novelModalContent.innerHTML = `<p class="text-red-400">錯誤: 無法載入內容。</p>`;
            });
        
        novelNavigation.innerHTML = `
            <button class="novel-prev-btn text-white disabled:text-gray-600" ${index === 0 ? 'disabled' : ''}><i class="fas fa-arrow-left mr-2"></i> 上一篇</button>
            <button class="novel-next-btn text-white disabled:text-gray-600" ${index === contentList.length - 1 ? 'disabled' : ''}>下一篇 <i class="fas fa-arrow-right ml-2"></i></button>
        `;
    }

    function openPortfolioModal(itemIndex) {
        const item = portfolioData[itemIndex];
        const imageContainer = document.getElementById('portfolio-gallery-images');
        const dotsContainer = document.getElementById('portfolio-gallery-dots');
        const detailsContainer = document.getElementById('portfolio-modal-details');
        const prevBtn = document.getElementById('gallery-prev');
        const nextBtn = document.getElementById('gallery-next');
        let currentImageIndex = 0;

        imageContainer.innerHTML = item.images.map((imgSrc, index) => `<img src="${imgSrc}" class="portfolio-gallery-image absolute top-0 left-0 w-full h-full object-contain ${index === 0 ? 'active' : ''}" />`).join('');
        dotsContainer.innerHTML = item.images.map((_, index) => `<button class="gallery-dot h-3 w-3 rounded-full ${index === 0 ? 'bg-amber-500' : 'bg-gray-600'}" data-index="${index}"></button>`).join('');
        
        let detailsHTML = `<h3 class="text-3xl font-bold text-amber-400 mb-4 font-serif">${item.title}</h3><div class="text-gray-300 space-y-4">${item.details}</div>`;
        if (item.externalLink) {
            detailsHTML += `<a href="${item.externalLink}" target="_blank" rel="noopener noreferrer" class="inline-block mt-6 px-4 py-2 bg-amber-500 text-gray-900 font-bold rounded-md hover:bg-amber-400 transition-colors">前往連結 <i class="fas fa-external-link-alt ml-2"></i></a>`;
        }
        detailsContainer.innerHTML = detailsHTML;

        const images = imageContainer.querySelectorAll('.portfolio-gallery-image');
        const dots = dotsContainer.querySelectorAll('.gallery-dot');

        function showImage(index) {
            if (images.length === 0) return;
            images[currentImageIndex].classList.remove('active');
            dots[currentImageIndex]?.classList.replace('bg-amber-500', 'bg-gray-600');
            currentImageIndex = index;
            images[currentImageIndex].classList.add('active');
            dots[currentImageIndex]?.classList.replace('bg-gray-600', 'bg-amber-500');
        }
        
        function resetInterval() {
            if (galleryInterval) clearInterval(galleryInterval);
            if (item.images.length > 1) {
                galleryInterval = setInterval(() => showImage((currentImageIndex + 1) % item.images.length), 4000);
            }
        }

        dotsContainer.addEventListener('click', e => {
            if (e.target.matches('.gallery-dot')) {
                showImage(parseInt(e.target.dataset.index));
                resetInterval();
            }
        });
        
        prevBtn.onclick = () => {
            showImage((currentImageIndex - 1 + images.length) % images.length);
            resetInterval();
        };
        nextBtn.onclick = () => {
            showImage((currentImageIndex + 1) % images.length);
            resetInterval();
        };

        if (item.images.length <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'block';
            nextBtn.style.display = 'block';
        }

        resetInterval();
        openModal(portfolioModal);
    }

    // --- 渲染函式 (已加入全面安全檢查) ---
    function renderAboutMe() {
        const container = document.getElementById('about-me-text-container');
        if (!container || typeof aboutMeData === 'undefined') return;
        container.innerHTML = `
            <p>${aboutMeData.p1}</p>
            <p>${aboutMeData.p2}</p>
            <p>${aboutMeData.p3}</p>
        `;
    }

    function renderSkills() {
        const container = document.querySelector('#skills-section .max-w-4xl');
        if (!container || typeof skillsData === 'undefined') return;
        container.innerHTML = skillsData.map(skill => `<div><div class="flex justify-between mb-1"><span class="text-base font-medium text-amber-400">${skill.name}</span><span class="text-sm font-medium text-amber-400">${skill.percentage}%</span></div><div class="w-full bg-gray-700 rounded-full h-2.5"><div class="skill-bar-progress bg-amber-500 h-2.5 rounded-full" data-percentage="${skill.percentage}"></div></div></div>`).join('');
    }

    function renderPortfolio() {
        const grid = document.getElementById('portfolio-grid');
        const filtersContainer = document.getElementById('portfolio-filters');
        if (!grid || !filtersContainer || typeof portfolioData === 'undefined') return;

        const categories = ['all', ...new Set(portfolioData.map(item => item.category))];
        filtersContainer.innerHTML = categories.map(cat => `<button class="filter-btn px-4 py-2 bg-gray-800 text-white rounded-md capitalize ${cat === 'all' ? 'active' : ''}" data-filter="${cat}">${cat === 'all' ? '全部' : cat === 'web' ? '網頁開發' : cat === 'writing' ? '寫作' : '設計'}</button>`).join('');
        const renderItems = (filter) => {
            grid.innerHTML = portfolioData.map((item, index) => ({...item, originalIndex: index})).filter(item => filter === 'all' || item.category === filter).map(item => `<div class="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform hover:-translate-y-2 transition-transform duration-300 reveal"><img src="${item.images[0]}" alt="${item.title}" class="w-full h-48 object-cover cursor-pointer portfolio-item" data-index="${item.originalIndex}" onerror="this.onerror=null;this.src='https://placehold.co/600x400/1f2937/f59e0b?text=Image+Error';"><div class="p-6"><h3 class="text-2xl font-bold text-amber-400 mb-2">${item.title}</h3><p class="text-gray-400 mb-4">${item.desc}</p><button class="text-white font-semibold hover:text-amber-400 transition-colors portfolio-item" data-index="${item.originalIndex}">查看詳情 <i class="fas fa-arrow-right ml-1"></i></button></div></div>`).join('');
            revealOnScroll();
        };
        filtersContainer.addEventListener('click', e => { if (e.target.matches('.filter-btn')) { filtersContainer.querySelector('.active').classList.remove('active'); e.target.classList.add('active'); renderItems(e.target.dataset.filter); } });
        grid.addEventListener('click', e => { const item = e.target.closest('.portfolio-item'); if (item) { const itemIndex = parseInt(item.dataset.index); const portfolioItem = portfolioData[itemIndex]; if (portfolioItem.link && portfolioItem.link.startsWith('#')) { showSection(portfolioItem.link); window.scrollTo({ top: 0, behavior: 'smooth' }); } else if (portfolioItem.link && !portfolioItem.details) { window.open(portfolioItem.link, '_blank'); } else { openPortfolioModal(itemIndex); } } });
        renderItems('all');
    }

    function renderVideos() {
        const grid = document.getElementById('videos-grid');
        if (!grid || typeof videosData === 'undefined') return;
        grid.innerHTML = videosData.map(video => `<div class="bg-gray-800 rounded-lg shadow-lg overflow-hidden reveal"><div class="aspect-video">${video.type === 'youtube' ? `<iframe class="w-full h-full" src="https://www.youtube.com/embed/${video.src}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>` : `<video class="w-full h-full" controls src="${video.src}"></video>`}</div><div class="p-6"><h3 class="text-2xl font-bold text-amber-400 mb-2">${video.title}</h3><p class="text-gray-400">${video.description}</p></div></div>`).join('');
    }

    function renderJourney() {
        const timeline = document.getElementById('journey-timeline');
        if (!timeline || typeof journeyData === 'undefined') return;
        timeline.innerHTML = `<div class="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-700"></div><div class="space-y-16">${journeyData.map(item => `<div class="flex items-center justify-between ${item.align === 'left' ? 'flex-row-reverse' : ''} reveal"><div class="w-5/12"></div><div class="z-10 w-8 h-8 bg-amber-500 rounded-full shadow-lg flex items-center justify-center"><i class="fas ${item.icon} text-gray-900"></i></div><div class="w-5/12 bg-gray-800 p-4 rounded-lg shadow-lg"><p class="text-amber-400 font-bold">${item.date}</p><h3 class="text-xl font-serif mb-1">${item.title}</h3><p class="text-sm text-gray-400">${item.description}</p></div></div>`).join('')}</div>`;
    }

    function renderBlog() {
        const container = document.getElementById('blog-posts-container');
        if (!container || typeof blogData === 'undefined') return;
        container.innerHTML = blogData.map(post => `<div class="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700/50 transition-colors duration-300 reveal"><a href="${post.link}"><p class="text-sm text-gray-400 mb-1">${post.date}</p><h3 class="text-2xl font-bold text-amber-400 mb-2">${post.title}</h3><p class="text-gray-300">${post.summary}</p></a></div>`).join('');
    }

    function renderNovels() {
        const container = document.getElementById('novel-container');
        if (!container || typeof novelsData === 'undefined') return;
        container.innerHTML = novelsData.map(novel => `<h2 class="text-4xl font-bold text-center text-white mb-4 reveal">${novel.title}</h2><p class="text-lg text-center text-gray-400 mb-12 max-w-3xl mx-auto reveal">${novel.description}</p><div class="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col md:flex-row gap-8 reveal"><img src="${novel.coverImage}" alt="小說封面" class="w-full md:w-1/3 h-auto object-cover rounded shadow-md" onerror="this.onerror=null;this.src='https://placehold.co/400x600/1f2937/d1d5db?text=Cover';"><div class="md:w-2/3"><div class="mb-8"><h4 class="text-2xl font-bold text-amber-400 mb-4 border-b-2 border-amber-500/30 pb-2">章節列表</h4><div class="space-y-3">${novel.contentList.filter(c => c.type === 'chapter').map((chap) => `<button class="chapter-btn text-left w-full p-3 bg-gray-700/50 rounded-md hover:bg-amber-500/20 transition-colors" data-index="${novel.contentList.indexOf(chap)}"><span class="font-bold text-white">${chap.title}</span><span class="block text-sm text-gray-400">${chap.subtitle}</span></button>`).join('')}</div></div><div><h4 class="text-2xl font-bold text-amber-400 mb-4 border-b-2 border-amber-500/30 pb-2">相關信件</h4><div class="space-y-3">${novel.contentList.filter(c => c.type === 'letter').map((letter) => `<button class="chapter-btn text-left w-full p-3 bg-gray-700/50 rounded-md hover:bg-amber-500/20 transition-colors" data-index="${novel.contentList.indexOf(letter)}"><span class="font-bold text-white">${letter.title}</span></button>`).join('')}</div></div></div></div>`).join('');
        document.querySelectorAll('.chapter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const button = e.currentTarget;
                updateNovelModalContent(parseInt(button.dataset.index));
                openModal(novelModal);
            });
        });
    }

    // --- 初始化 ---
    // 將此函式暴露到全域，以便 data.js 可以呼叫它
    window.initializePage = function() {
        document.getElementById('profile-img-about').src = profileImage;
        renderAboutMe();
        renderSkills();
        renderPortfolio();
        renderVideos();
        renderJourney();
        renderBlog();
        renderNovels();
        addNavTriggerListeners('.nav-trigger');
        showSection(window.location.hash || '#home', false);

        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    document.querySelectorAll('.skill-bar-progress').forEach(bar => {
                        bar.style.width = bar.dataset.percentage + '%';
                    });
                    skillsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        if(document.getElementById('skills-section')) {
            skillsObserver.observe(document.getElementById('skills-section'));
        }
    }

    // --- 事件監聽 ---
    window.addEventListener('scroll', revealOnScroll);
    document.getElementById('mobile-menu-button').addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
    
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', e => { if (e.target === modal) closeModal(modal); });
        modal.querySelector('.close-modal-btn').addEventListener('click', () => closeModal(modal));
    });

    novelNavigation.addEventListener('click', e => {
        if (e.target.closest('.novel-prev-btn') && currentNovelContentIndex > 0) {
            updateNovelModalContent(currentNovelContentIndex - 1);
        }
        if (e.target.closest('.novel-next-btn') && currentNovelContentIndex < novelsData[0].contentList.length - 1) {
            updateNovelModalContent(currentNovelContentIndex + 1);
        }
    });

    const form = document.getElementById('contact-form');
    form.addEventListener("submit", async function handleSubmit(event) {
        event.preventDefault();
        const status = document.getElementById('form-status');
        const data = new FormData(event.target);
        try {
            const response = await fetch(event.target.action, {
                method: form.method,
                body: data,
                headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                status.innerHTML = "<p class='text-green-400'>感謝您的訊息，我會盡快回覆！</p>";
                form.reset();
            } else {
                const responseData = await response.json();
                status.innerHTML = responseData.errors ? `<p class='text-red-400'>${responseData.errors.map(e => e.message).join(", ")}</p>` : "<p class='text-red-400'>糟糕！訊息發送失敗。</p>";
            }
        } catch (error) {
            status.innerHTML = "<p class='text-red-400'>糟糕！訊息發送失敗，請檢查您的網路連線。</p>";
        }
    });

    // 修正: 移除此處的 initializePage() 呼叫，改由 data.js 的末端觸發。
    // initializePage(); 
})();
