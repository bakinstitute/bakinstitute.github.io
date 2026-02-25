/**
 * Bāk Institute Data Loader
 * Loads content from local JSON files into the frontend.
 */
const DATA_LOADER = {
    // Path Detection: Calculate many slashes are in the path to determine depth
    getPath(file) {
        const segments = window.location.pathname.split('/').filter(s => s.length > 0);
        const isRoot = segments.length === 0 || (segments.length === 1 && segments[0].endsWith('.html'));
        return (isRoot ? 'data/' : '../data/') + file + '.json';
    },

    async fetchData(file) {
        const url = this.getPath(file);
        console.log(`CMS: 📂 Loading ${url}...`);
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Could not load ${url}`);
        return await response.json();
    },

    async loadPublications() {
        const container = document.getElementById('pub-list') || document.querySelector('.pub-list');
        if (!container) return;
        try {
            const allPubs = await this.fetchData('publications');
            container.innerHTML = '';

            allPubs.sort((a, b) => (b.year || 0) - (a.year || 0));
            allPubs.forEach(pub => {
                const article = document.createElement('article');
                article.className = 'pub-item reveal visible';
                article.dataset.category = (pub.category || 'nlp').toLowerCase();
                article.dataset.search = [pub.title, pub.authors, pub.badge, pub.body].join(' ').toLowerCase();
                article.innerHTML = `
            <div class="pub-year">${pub.year}</div>
            <div>
                <div class="pub-title">${pub.title}</div>
                <div class="pub-authors">${pub.authors}</div>
                <div class="pub-abstract">${pub.body || ''}</div>
                <div class="pub-links">
                    ${pub.pdf ? `<a href="${pub.pdf}" class="pub-link">PDF</a>` : ''}
                    ${pub.dataset ? `<a href="${pub.dataset}" class="pub-link">Dataset</a>` : ''}
                    ${pub.code ? `<a href="${pub.code}" class="pub-link">Code</a>` : ''}
                </div>
                <button class="pub-toggle">Show abstract ↓</button>
            </div>
            <div><span class="pub-badge">${pub.badge || ''}</span></div>
        `;
                container.appendChild(article);
            });

            document.querySelectorAll('.pub-toggle').forEach(btn => {
                btn.onclick = (e) => {
                    const item = e.target.closest('.pub-item');
                    item.classList.toggle('expanded');
                    e.target.textContent = item.classList.contains('expanded') ? 'Hide abstract ↑' : 'Show abstract ↓';
                };
            });
            console.log("CMS: ✅ Publications loaded.");
            // Activate filters if exposed by the publications page
            if (typeof window.applyFilters === 'function') window.applyFilters();
        } catch (err) {
            console.error("CMS Error:", err);
            container.innerHTML = `<p style="padding:2rem; text-align:center; color:red;">Error loading publications.</p>`;
        }
    },

    async loadTeam() {
        const leaderGrid = document.getElementById('leader-grid') || document.querySelector('.leader-grid');
        const staffGrid = document.getElementById('staff-grid') || document.querySelector('.staff-grid') || document.querySelector('.member-grid');
        const advisoryList = document.querySelector('.advisory-list');
        if (!leaderGrid && !staffGrid && !advisoryList) return;
        try {
            const members = await this.fetchData('team');
            if (leaderGrid) leaderGrid.innerHTML = '';
            if (staffGrid) staffGrid.innerHTML = '';
            if (advisoryList) advisoryList.innerHTML = '';

            let hasAdvisors = false;

            members.forEach(member => {
                const div = document.createElement('div');
                div.className = (member.section === 'leadership' ? 'leader-card' : 'member-card') + ' reveal visible';
                div.innerHTML = `
            <div class="${member.section === 'leadership' ? 'leader-avatar' : 'member-avatar-sm'}" aria-hidden="true" ${member.image ? `style="background-image: url('${member.image}'); background-size: cover; background-position: center;"` : ''}>
                ${!member.image ? `<div class="team-avatar-initials" lang="bn">${member.initials || '..'}</div>` : ''}
            </div>
            ${member.section === 'leadership' ? '<div>' : ''}
                <div class="member-name">${member.title}</div>
                <div class="member-role">${member.role}</div>
                <div class="member-inst">${member.institution}</div>
                <p class="member-bio" style="display:block; opacity:1;">${member.body || ''}</p>
                <div class="member-links">
                    ${member.email ? `<a href="mailto:${member.email}" class="member-link">Email</a>` : ''}
                    ${member.link ? `<a href="${member.link}" class="member-link">Profile</a>` : ''}
                </div>
            ${member.section === 'leadership' ? '</div>' : ''}
        `;
                if (member.section === 'leadership' && leaderGrid) leaderGrid.appendChild(div);
                else if (member.section === 'staff' && staffGrid) staffGrid.appendChild(div);
                else if (member.section === 'advisory' && advisoryList) {
                    hasAdvisors = true;
                    const adv = document.createElement('div');
                    adv.className = 'advisory-item reveal visible';
                    adv.innerHTML = `
                        <div class="advisory-avatar" aria-hidden="true" lang="bn">${member.initials || '..'}</div>
                        <div>
                            <div class="advisory-name">${member.title}</div>
                            <div class="advisory-inst">${member.institution}</div>
                            <div class="advisory-role">${member.role || 'Advisor'}</div>
                        </div>
                    `;
                    advisoryList.appendChild(adv);
                }
            });

            if (advisoryList && !hasAdvisors) {
                const section = advisoryList.closest('section');
                if (section) section.style.display = 'none';
            }
            console.log("CMS: ✅ Team loaded.");
        } catch (err) { console.error("CMS Error:", err); }
    },

    async loadResearch() {
        const container = document.getElementById('research-container') || document.querySelector('.research-container');
        if (!container) return;
        try {
            const allAreas = await this.fetchData('research');
            container.innerHTML = '';

            allAreas.sort((a, b) => (a.order || '00').localeCompare(b.order || '00'));
            allAreas.forEach(area => {
                const projectsList = Array.isArray(area.projects) ? area.projects : [];
                const toolsList = Array.isArray(area.tools) ? area.tools : [];

                const div = document.createElement('div');
                div.className = 'area-card reveal visible';
                div.innerHTML = `
            <div class="area-icon-wrap">
                <span class="area-icon-char" lang="bn" aria-hidden="true">${area.char}</span>
                <span class="area-num">${area.order}</span>
            </div>
            <div>
                <div class="area-tag">${area.tag}</div>
                <h2 class="area-title">${area.title}</h2>
                <div class="area-desc">${area.body || ''}</div>
                <div class="area-details">
                    <div><h4>Current Projects</h4><ul>${projectsList.map(p => `<li>${p}</li>`).join('')}</ul></div>
                    <div><h4>Tools & Datasets</h4><ul>${toolsList.map(t => `<li>${t}</li>`).join('')}</ul></div>
                </div>
                <a href="${area.link}" class="area-link">View ${area.title} publications →</a>
            </div>
        `;
                container.appendChild(div);
            });
            console.log("CMS: ✅ Research loaded.");
        } catch (err) { console.error("CMS Error:", err); }
    },

    async loadHome() {
        const pubContainer = document.querySelector('.pub-list');
        const teamGrid = document.querySelector('.team-grid');
        if (!pubContainer && !teamGrid) return;
        try {
            if (pubContainer) {
                const allPubs = await this.fetchData('publications');
                pubContainer.innerHTML = '';
                allPubs.sort((a, b) => (b.year || 0) - (a.year || 0));
                allPubs.slice(0, 3).forEach(pub => {
                    const article = document.createElement('article');
                    article.className = 'pub-item reveal visible';
                    article.innerHTML = `<div class="pub-year">${pub.year}</div><div><div class="pub-title">${pub.title}</div><div class="pub-authors">${pub.authors}</div></div><div><span class="pub-badge">${pub.badge || ''}</span></div>`;
                    pubContainer.appendChild(article);
                });
            }
            if (teamGrid) {
                const members = await this.fetchData('team');
                teamGrid.innerHTML = '';
                members.slice(0, 4).forEach(data => {
                    const div = document.createElement('div');
                    div.className = 'team-card reveal visible';
                    div.innerHTML = `<div class="team-avatar" ${data.image ? `style="background-image: url('${data.image}'); background-size: cover; background-position: center;"` : ''}>${!data.image ? `<div class="team-avatar-initials" lang="bn">${data.initials || '..'}</div>` : ''}</div><div class="team-name">${data.title}</div><div class="team-role">${data.role}</div><div class="team-inst">${data.institution}</div>`;
                    teamGrid.appendChild(div);
                });
            }
            console.log("CMS: ✅ Home content loaded.");
        } catch (err) { console.error("CMS Error:", err); }
    },

    async loadBlog() {
        const grid = document.getElementById('blog-grid') || document.querySelector('.blog-grid');
        if (!grid) return;
        try {
            const allPosts = await this.fetchData('blog');
            allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

            const params = new URLSearchParams(window.location.search);
            const postIndex = params.get('post');

            if (postIndex !== null && allPosts[postIndex]) {
                const post = allPosts[postIndex];

                const featured = document.querySelector('.blog-featured');
                const filters = document.querySelector('.blog-filter');
                const heroDesc = document.querySelector('.page-hero-desc');
                if (featured) featured.style.display = 'none';
                if (filters) filters.style.display = 'none';
                if (heroDesc) heroDesc.style.display = 'none';

                document.querySelector('.page-hero-title').innerHTML = post.title;

                grid.style.display = 'block';

                // Fetch full markdown content from the content/blog/ directory
                let bodyContent = '';
                try {
                    const mdPath = (window.location.pathname.includes('/blog') ? '../' : '') + 'content/blog/' + post.slug + '.md';
                    const mdResponse = await fetch(mdPath);
                    if (mdResponse.ok) {
                        let mdText = await mdResponse.text();
                        // Strip YAML frontmatter (---...---)
                        mdText = mdText.replace(/^---[\s\S]*?---\s*/, '');
                        bodyContent = typeof marked !== 'undefined' ? marked.parse(mdText) : mdText.replace(/\n/g, '<br>');
                    } else {
                        throw new Error('Markdown file not found');
                    }
                } catch (mdErr) {
                    console.warn('CMS: Could not load markdown file, falling back to JSON body:', mdErr);
                    bodyContent = typeof marked !== 'undefined' ? marked.parse(post.body || '') : (post.body || '').replace(/\n/g, '<br>');
                }

                grid.innerHTML = `
                  <article class="single-post-view reveal visible" style="background:white; padding: 4rem; border: 1px solid rgba(200,154,46,0.15);">
                      <div class="blog-meta" style="margin-bottom: 2rem; font-family: 'DM Mono', monospace;">
                          <span style="color:var(--saffron); text-transform:uppercase; letter-spacing:0.1em;">${post.category || 'News'}</span>
                          <span>&nbsp;&nbsp;·&nbsp;&nbsp;</span>
                          <span style="color:var(--warm-gray);">${new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      ${post.image ? `<div style="width:100%; height:400px; background-image:url('${post.image}'); background-size:cover; background-position:center; margin-bottom: 3rem;"></div>` : ''}
                      <div class="markdown-content" style="font-size:1.1rem; line-height:1.85; color:var(--ink);">
                          ${bodyContent}
                      </div>
                      <div style="margin-top: 4rem; border-top: 1px solid rgba(200,154,46,0.15); padding-top: 2rem;">
                          <a href="?" class="btn-primary">← Back to all posts</a>
                      </div>
                  </article>
                `;

                const buttons = document.querySelectorAll('.btn-primary');
                buttons.forEach(btn => {
                    if (btn.textContent.includes('Load More')) btn.parentElement.style.display = 'none';
                });
                const recentPostsHeading = document.querySelectorAll('.section-label');
                recentPostsHeading.forEach(h => {
                    if (h.textContent === 'Recent Posts') h.style.display = 'none';
                });

                return;
            }

            grid.innerHTML = '';

            // Dynamically populate the featured section with the most recent post
            const featuredSection = document.querySelector('.blog-featured');
            if (featuredSection && allPosts.length > 0) {
                const latest = allPosts[0];
                const featuredImg = featuredSection.querySelector('.blog-featured-img');
                const featuredCat = featuredSection.querySelector('.blog-category');
                const featuredTitle = featuredSection.querySelector('.blog-title');
                const featuredExcerpt = featuredSection.querySelector('.blog-excerpt');
                const featuredMeta = featuredSection.querySelector('.blog-meta');
                const featuredLink = featuredSection.querySelector('.blog-read-more');

                if (featuredImg && latest.image) {
                    featuredImg.style.backgroundImage = `url('${latest.image}')`;
                    featuredImg.style.backgroundSize = 'cover';
                    featuredImg.style.backgroundPosition = 'center';
                    featuredImg.textContent = '';
                }
                if (featuredCat) featuredCat.textContent = latest.category || 'News';
                if (featuredTitle) featuredTitle.textContent = latest.title;
                if (featuredExcerpt) featuredExcerpt.textContent = latest.excerpt || (latest.body ? latest.body.substring(0, 250) + '...' : '');
                if (featuredMeta) {
                    featuredMeta.innerHTML = `<span>${new Date(latest.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>`;
                }
                if (featuredLink) featuredLink.href = `?post=0`;
            }

            // Category normalization map to match filter button data-filter values
            const categoryMap = {
                'dataset release': 'release',
                'research': 'research',
                'fieldwork': 'field',
                'commentary': 'commentary',
                'news': 'news'
            };

            allPosts.forEach((post, index) => {
                const article = document.createElement('article');
                article.className = 'blog-card reveal visible';
                const rawCat = (post.category || 'News').toLowerCase();
                article.dataset.category = categoryMap[rawCat] || rawCat;
                article.innerHTML = `
            <div class="blog-card-img"${post.image ? ` style="background-image: url('${post.image}'); background-size: cover; background-position: center;"` : ''}>
                ${!post.image ? `<span aria-hidden="true" lang="bn">ব</span>` : ''}
            </div>
            <div class="blog-card-body">
                <div class="blog-category">${post.category || 'News'}</div>
                <h3 class="blog-card-title">${post.title}</h3>
                <p class="blog-card-excerpt">${post.excerpt || (post.body ? post.body.substring(0, 150) + '...' : '')}</p>
                <div class="blog-meta"><span>${new Date(post.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span></div>
                <a href="?post=${index}" class="blog-read-more">Read →</a>
            </div>
        `;
                grid.appendChild(article);
            });

            // Activate blog category filters if the function exists
            if (typeof window.applyBlogFilters === 'function') window.applyBlogFilters();

            console.log("CMS: ✅ Blog loaded.");
        } catch (err) { console.error("CMS Error:", err); }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname.toLowerCase();

    // Decide which loader to call based on path
    if (path.includes('/publications')) DATA_LOADER.loadPublications();
    else if (path.includes('/team')) DATA_LOADER.loadTeam();
    else if (path.includes('/blog')) DATA_LOADER.loadBlog();
    else if (path.includes('/research')) DATA_LOADER.loadResearch();
    else if (path === '/' || path.endsWith('index.html') || path === '' || path.endsWith('/')) DATA_LOADER.loadHome();
});
