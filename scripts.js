// Utility to escape HTML characters
function escapeHtml(s) {
    return s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] || c);
}

// Render Markdown to HTML with enhanced support
function renderMarkdown(md) {
    try {
        md = md.replace(/\r/g, '');
        // Code blocks
        md = md.replace(/```([\s\S]*?)```/g, (m, code) => `<pre style="background:#121212;padding:16px;border-radius:8px;overflow:auto"><code>${escapeHtml(code)}</code></pre>`);
        // Headers
        md = md.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        md = md.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        md = md.replace(/^# (.*$)/gim, '<h1>$1</h1>');
        // Bold and italic
        md = md.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        md = md.replace(/\*(.*?)\*/g, '<em>$1</em>');
        // Links
        md = md.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
        // Lists
        md = md.replace(/^\s*[-\*] (.*)/gm, '<li>$1</li>');
        md = md.replace(/^\s*\d+\. (.*)/gm, '<li>$1</li>');
        md = md.replace(/(<li>.*<\/li>\n?)+/g, m => {
            const isOrdered = m.includes('<li>') && m.match(/^\d+\./m);
            return isOrdered ? `<ol>${m}</ol>` : `<ul>${m}</ul>`;
        });
        // Blockquotes
        md = md.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');
        // Paragraphs
        md = md.replace(/^(?!<h|<ul|<ol|<pre|<blockquote|<img)(.+)$/gm, m => m.trim() === '' ? '' : `<p>${m}</p>`);
        return md;
    } catch (err) {
        console.error('Error rendering markdown:', err);
        return '<div class="loading">Error rendering post content. Please try another post.</div>';
    }
}

// Load blog posts for the index page
async function loadPosts() {
    const listEl = document.getElementById('postList');
    if (!listEl) {
        console.warn('Post list element (#postList) not found');
        return;
    }
    listEl.innerHTML = '<div class="small">Loading posts…</div>';
    try {
        const resp = await fetch('posts/posts.json', { cache: 'no-store' });
        if (!resp.ok) throw new Error(`Failed to fetch posts.json: ${resp.status} ${resp.statusText}`);
        const posts = await resp.json();
        if (!Array.isArray(posts) || posts.length === 0) {
            listEl.innerHTML = '<div class="small">No posts found in posts/posts.json</div>';
            return;
        }
        listEl.innerHTML = '';
        posts.sort((a, b) => new Date(b.date || '1970-01-01') - new Date(a.date || '1970-01-01'));
        for (const p of posts) {
            if (!p.file || !p.title) {
                console.warn('Invalid post entry:', p);
                continue;
            }
            const preview = document.createElement('div');
            preview.className = 'post-preview';
            preview.tabIndex = 0;
            preview.innerHTML = `<div style="font-weight:700;font-size:16px">${escapeHtml(p.title)}</div><div class="small" style="margin-top:8px">${escapeHtml(p.date || '')}</div>`;
            preview.addEventListener('click', () => {
                window.location.href = `blog.html?post=${encodeURIComponent(p.file)}`;
            });
            preview.addEventListener('keydown', e => e.key === 'Enter' && (window.location.href = `blog.html?post=${encodeURIComponent(p.file)}`));
            listEl.appendChild(preview);
        }
        if (!listEl.hasChildNodes()) {
            listEl.innerHTML = '<div class="small">No valid posts found in posts/posts.json</div>';
        }
    } catch (err) {
        listEl.innerHTML = '<div class="small">Could not load posts. Ensure <code>posts/posts.json</code> exists and is valid JSON. <a href="index.html">Return to home</a>.</div>';
        console.error('Error loading posts:', err);
    }
}

// Load a single blog post
async function loadBlogPost() {
    const contentEl = document.getElementById('postContent');
    const titleEl = document.getElementById('articleTitle');
    const authorEl = document.getElementById('articleAuthor');
    const dateEl = document.getElementById('articleDate');
    const tagsEl = document.getElementById('articleTags');
    const relatedPostsEl = document.getElementById('relatedPosts');
    if (!contentEl || !titleEl || !authorEl || !dateEl || !tagsEl || !relatedPostsEl) {
        console.error('Required elements missing');
        return;
    }
    const params = new URLSearchParams(window.location.search);
    const postFile = params.get('post');
    if (!postFile) {
        contentEl.innerHTML = '<div class="loading">No post specified. Please select a post from the <a href="index.html#thoughts">posts list</a>.</div>';
        console.warn('No post parameter in URL');
        return;
    }
    contentEl.innerHTML = '<div class="loading">Loading post: ' + escapeHtml(postFile) + '…</div>';
    try {
        // Fetch posts.json to get metadata
        const postsResp = await fetch('posts/posts.json', { cache: 'no-store' });
        if (!postsResp.ok) throw new Error(`Failed to fetch posts.json: ${postsResp.status} ${postsResp.statusText}`);
        const posts = await postsResp.json();
        const post = posts.find(p => p.file === postFile);
        if (!post) throw new Error(`Post ${postFile} not found in posts.json`);

        // Fetch markdown content
        const resp = await fetch(`posts/${postFile}`, { cache: 'no-store' });
        if (!resp.ok) throw new Error(`Failed to fetch post ${postFile}: ${resp.status} ${resp.statusText}`);
        const md = await resp.text();
        if (!md.trim()) throw new Error('Post content is empty');

        // Update metadata
        titleEl.textContent = post.title || 'Untitled';
        authorEl.textContent = post.author || 'Khawaja M. Owais';
        dateEl.textContent = post.date ? new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '--';

        // Render tags
        tagsEl.innerHTML = '';
        if (post.tags && Array.isArray(post.tags)) {
            post.tags.forEach(tag => {
                const tagEl = document.createElement('a');
                tagEl.className = 'tag';
                tagEl.textContent = tag;
                tagEl.href = `index.html#thoughts?tag=${encodeURIComponent(tag)}`;
                tagsEl.appendChild(tagEl);
            });
        }

        // Render related posts
        relatedPostsEl.innerHTML = '';
        const relatedPosts = posts.filter(p => p.file !== postFile && p.tags && p.tags.some(t => post.tags && post.tags.includes(t))).slice(0, 3);
        if (relatedPosts.length === 0) {
            const recentPosts = posts.filter(p => p.file !== postFile).sort((a, b) => new Date(b.date || '1970-01-01') - new Date(a.date || '1970-01-01')).slice(0, 3);
            relatedPosts.push(...recentPosts);
        }
        relatedPosts.forEach(p => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `blog.html?post=${encodeURIComponent(p.file)}`;
            a.textContent = p.title;
            li.appendChild(a);
            relatedPostsEl.appendChild(li);
        });
        if (relatedPosts.length === 0) {
            relatedPostsEl.innerHTML = '<li>No related posts found.</li>';
        }

        // Render content
        contentEl.innerHTML = renderMarkdown(md);
        updateReadingTime(contentEl);
        updateReadingProgress();
        initHighlighting();
    } catch (err) {
        contentEl.innerHTML = `<div class="loading">Unable to load post: ${escapeHtml(postFile)}. <a href="index.html#thoughts">Return to posts</a>.</div>`;
        console.error('Error loading post:', err);
    }
}

// Calculate reading time
function updateReadingTime(contentEl) {
    const readingTimeEl = document.getElementById('readingTime');
    if (!readingTimeEl) return;
    const text = contentEl.innerText;
    const words = text.split(/\s+/).length;
    const readingTime = Math.ceil(words / 200); // 200 words per minute
    readingTimeEl.textContent = `${readingTime} min`;
}

// Update reading progress bar
function updateReadingProgress() {
    const progressBar = document.querySelector('.reading-progress-bar');
    if (!progressBar) return;
    const contentEl = document.getElementById('postContent');
    if (!contentEl) return;
    window.addEventListener('scroll', () => {
        const { top, height } = contentEl.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const scrollHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const progress = Math.min(1, Math.max(0, scrollTop / scrollHeight)) * 100;
        progressBar.style.width = `${progress}%`;
    });
}

// Initialize text highlighting
let isHighlighting = false;
function initHighlighting() {
    const contentEl = document.getElementById('postContent');
    if (!contentEl) return;
    contentEl.addEventListener('mousedown', (e) => {
        if (!isHighlighting) return;
        e.preventDefault();
        const selection = window.getSelection();
        selection.removeAllRanges();
        contentEl.addEventListener('mouseup', () => {
            if (selection.toString().trim()) {
                const range = selection.getRangeAt(0);
                const span = document.createElement('span');
                span.className = 'highlight';
                try {
                    range.surroundContents(span);
                } catch (err) {
                    console.warn('Highlighting failed:', err);
                }
                selection.removeAllRanges();
            }
        }, { once: true });
    });
}

function toggleHighlight() {
    isHighlighting = !isHighlighting;
    const highlightBtn = document.querySelector('.tool-btn[title="Highlight text"]');
    if (highlightBtn) {
        highlightBtn.classList.toggle('active', isHighlighting);
    }
    showToast(isHighlighting ? '✏️ Highlighting enabled' : '✏️ Highlighting disabled');
}

// Search within article
function openSearch() {
    const modal = document.getElementById('searchModal');
    const input = document.getElementById('searchInput');
    if (!modal || !input) return;
    modal.classList.toggle('active');
    if (modal.classList.contains('active')) {
        input.focus();
        searchInArticle();
    } else {
        input.value = '';
        document.getElementById('searchResults').innerHTML = '';
    }
}

function searchInArticle() {
    const input = document.getElementById('searchInput');
    const resultsEl = document.getElementById('searchResults');
    const contentEl = document.getElementById('postContent');
    if (!input || !resultsEl || !contentEl) return;
    input.addEventListener('input', () => {
        const query = input.value.toLowerCase().trim();
        resultsEl.innerHTML = '';
        if (!query) return;
        const textNodes = getTextNodes(contentEl);
        const matches = textNodes.filter(node => node.textContent.toLowerCase().includes(query));
        if (matches.length === 0) {
            resultsEl.innerHTML = '<div class="search-result">No matches found</div>';
            return;
        }
        matches.forEach((node, index) => {
            const div = document.createElement('div');
            div.className = 'search-result';
            div.textContent = node.textContent.substring(0, 100) + (node.textContent.length > 100 ? '...' : '');
            div.addEventListener('click', () => {
                node.parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                const range = document.createRange();
                range.selectNodeContents(node);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            });
            resultsEl.appendChild(div);
        });
    });
}

// Get all text nodes in an element
function getTextNodes(element) {
    const nodes = [];
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while (node = walker.nextNode()) {
        if (node.textContent.trim()) nodes.push(node);
    }
    return nodes;
}

// Handle subscription form
function subscribe(event) {
    event.preventDefault();
    const email = document.getElementById('subscribeEmail')?.value.trim();
    if (!email) {
        showToast('⚠️ Please enter a valid email address.');
        return;
    }
    // Placeholder for subscription logic (e.g., send to sendmail.php or third-party service)
    fetch('subscribe.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ email })
    })
    .then(response => {
        if (response.ok) {
            showToast('✅ Subscribed successfully!');
            document.getElementById('subscribeForm').reset();
        } else {
            showToast('⚠️ Failed to subscribe. Please try again later.');
        }
    })
    .catch(err => {
        showToast('❌ Error subscribing. Check your internet connection.');
        console.error('Subscription error:', err);
    });
}

// Copy text to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast("📋 Email copied to clipboard!");
    }).catch(err => {
        console.error('Clipboard error:', err);
        prompt('Copy this:', text);
    });
}

// Send contact form message
function sendMessage(event) {
    event.preventDefault();
    const name = document.getElementById('name')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const subject = document.getElementById('subject')?.value.trim();
    const message = document.getElementById('message')?.value.trim();
    if (!name || !email || !message || !subject) {
        showToast("⚠️ Please fill all form fields.");
        return;
    }
    fetch('sendmail.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ name, email, subject, message })
    })
    .then(response => {
        if (response.ok) {
            showToast("✅ Message sent successfully!");
            document.querySelector('.contact-form')?.reset();
        } else {
            showToast("⚠️ Failed to send message. Please try again later.");
        }
    })
    .catch(err => {
        showToast("❌ Error sending message. Check your internet connection.");
        console.error('Form submission error:', err);
    });
}

// Show toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) {
        console.warn('Toast element (#toast) not found');
        return;
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
}

// Initialize services filter
function initServicesFilter() {
    const filterButtons = document.querySelectorAll('#services .filter-button');
    const serviceTiles = document.querySelectorAll('#services .tile');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const selected = button.getAttribute('data-filter');
            serviceTiles.forEach(tile => {
                const category = tile.getAttribute('data-category');
                tile.classList.toggle('hidden', selected !== 'all' && category !== selected);
            });
        });
    });
}

// Initialize particles for index.html
function initParticles() {
    if (typeof particlesJS === 'undefined') {
        console.warn('particles.js not loaded');
        return;
    }
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: '#00ffcc' },
            shape: { type: 'circle', stroke: { width: 0 } },
            opacity: { value: 0.3, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1 } },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: '#00ffcc', opacity: 0.2, width: 1 },
            move: { enable: true, speed: 2, direction: 'none', random: true, out_mode: 'out' }
        },
        interactivity: {
            detect_on: 'canvas',
            events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' }, resize: true },
            modes: { grab: { distance: 140, line_linked: { opacity: 0.5 } }, push: { particles_nb: 4 } }
        },
        retina_detect: true
    });
}

// Initialize animations for index.html
function initAnimations() {
    if (typeof AOS === 'undefined') {
        console.warn('AOS not loaded');
        return;
    }
    AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true });
    const sections = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });
    sections.forEach(section => observer.observe(section));
}

// Change font size for blog content
function changeFontSize(delta) {
    const contentEl = document.getElementById('postContent');
    if (!contentEl) return;
    const currentSize = parseInt(window.getComputedStyle(contentEl).fontSize) || 16;
    const newSize = Math.max(12, Math.min(24, currentSize + delta));
    contentEl.style.fontSize = `${newSize}px`;
    const fontSizeEl = document.getElementById('fontSize');
    if (fontSizeEl) fontSizeEl.textContent = `${newSize}px`;
}

// Toggle dark/light theme
function toggleTheme() {
    document.body.classList.toggle('light');
    const isLight = document.body.classList.contains('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
        themeIcon.className = isLight ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill';
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Initialize particles and animations for index.html
    if (document.getElementById('particles-js')) {
        initParticles();
    }
    initAnimations();
    
    // Load posts or blog content based on page
    if (document.getElementById('postList')) {
        loadPosts();
    }
    if (document.getElementById('postContent')) {
        loadBlogPost();
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light');
            const themeIcon = document.getElementById('themeIcon');
            if (themeIcon) themeIcon.className = 'bi bi-sun-fill';
        }
        // Initialize Ctrl+K for search
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                openSearch();
            }
        });
    }
    if (document.getElementById('services')) {
        initServicesFilter();
    }
});