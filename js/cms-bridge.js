/**
 * Bāk Institute CMS Bridge
 * Dynamically loads content from GitHub into the frontend.
 */
const CMS = {
    repoOwner: 'bakinstitute',
    repoName: 'bakinstitute.github.io',
    branch: 'main',

    async fetchFile(url) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
        return await response.text();
    },

    parseFrontmatter(text) {
        const match = text.match(/^---\r?\n([\s\S]+?)\r?\n---\r?\n?([\s\S]*)$/);
        if (!match) return { data: {}, content: text };

        const yamlPart = match[1];
        const content = match[2];
        const data = {};

        yamlPart.split('\n').forEach(line => {
            const parts = line.split(':');
            if (parts.length < 2) return;
            const key = parts[0].trim();
            let value = parts.slice(1).join(':').trim();
            if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
            if (value.startsWith('[') && value.endsWith(']')) {
                data[key] = value.slice(1, -1).split(',').map(s => s.trim().replace(/^"|"$/g, ''));
            } else {
                data[key] = value;
            }
        });
        return { data, content };
    },

    async loadPublications() {
        const container = document.getElementById('pub-list');
        if (!container) return;
        console.log("CMS: Loading Publications...");

        try {
            const response = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/contents/content/publications?ref=${this.branch}`);
            const files = await response.json();
            if (!Array.isArray(files)) throw new Error("Could not find publications folder on GitHub. Have you pushed your files?");

            container.innerHTML = '';
            let allPubs = [];
            for (const file of files) {
                if (!file.name.endsWith('.md')) continue;
                const raw = await this.fetchFile(file.download_url);
                const { data, content } = this.parseFrontmatter(raw);
                allPubs.push({ ...data, abstract: content });
            }

            allPubs.sort((a, b) => (b.year || 0) - (a.year || 0));
            allPubs.forEach(pub => {
                const article = document.createElement('article');
                article.className = 'pub-item reveal';
                article.dataset.category = (pub.category || 'nlp').toLowerCase();
                article.innerHTML = `
            <div class="pub-year">${pub.year}</div>
            <div>
                <div class="pub-title">${pub.title}</div>
                <div class="pub-authors">${pub.authors}</div>
                <div class="pub-abstract">${pub.abstract}</div>
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
                btn.onclick = () => {
                    const item = btn.closest('.pub-item');
                    const open = item.classList.toggle('expanded');
                    btn.textContent = open ? 'Hide abstract ↑' : 'Show abstract ↓';
                };
            });
            if (window.applyFilters) window.applyFilters();
        } catch (err) {
            console.error("CMS Error:", err);
            container.innerHTML = `<p style="color:red; padding:2rem;">Error: ${err.message}</p>`;
        }
    },

    async loadTeam() {
        const leaderGrid = document.getElementById('leader-grid');
        const staffGrid = document.getElementById('staff-grid');
        if (!leaderGrid && !staffGrid) return;
        console.log("CMS: Loading Team...");

        try {
            const response = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/contents/content/team?ref=${this.branch}`);
            const files = await response.json();
            if (!Array.isArray(files)) throw new Error("Could not find team folder on GitHub.");

            if (leaderGrid) leaderGrid.innerHTML = '';
            if (staffGrid) staffGrid.innerHTML = '';

            for (const file of files) {
                if (!file.name.endsWith('.md')) continue;
                const raw = await this.fetchFile(file.download_url);
                const { data, content } = this.parseFrontmatter(raw);
                const member = { ...data, bio: content };

                const div = document.createElement('div');
                div.className = member.section === 'leadership' ? 'leader-card reveal' : 'member-card reveal';
                div.innerHTML = `
            <div class="${member.section === 'leadership' ? 'leader-avatar' : 'member-avatar-sm'}" aria-hidden="true">
                <div class="team-avatar-initials" lang="bn">${member.initials}</div>
            </div>
            ${member.section === 'leadership' ? '<div>' : ''}
                <div class="member-name">${member.title}</div>
                <div class="member-role">${member.role}</div>
                <div class="member-inst">${member.institution}</div>
                <p class="member-bio">${member.bio}</p>
                <div class="member-links">
                    ${member.email ? `<a href="mailto:${member.email}" class="member-link">Email</a>` : ''}
                    ${member.link ? `<a href="${member.link}" class="member-link">Profile</a>` : ''}
                </div>
            ${member.section === 'leadership' ? '</div>' : ''}
        `;
                if (member.section === 'leadership' && leaderGrid) leaderGrid.appendChild(div);
                else if (member.section === 'staff' && staffGrid) staffGrid.appendChild(div);
            }
        } catch (err) { console.error("CMS Error:", err); }
    },

    async loadBlog() {
        const grid = document.getElementById('blog-grid');
        if (!grid) return;
        console.log("CMS: Loading Blog...");

        try {
            const response = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/contents/content/blog?ref=${this.branch}`);
            const files = await response.json();
            if (!Array.isArray(files)) return;

            grid.innerHTML = '';
            let allPosts = [];
            for (const file of files) {
                if (!file.name.endsWith('.md')) continue;
                const raw = await this.fetchFile(file.download_url);
                const { data, content } = this.parseFrontmatter(raw);
                allPosts.push({ ...data, content });
            }

            allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
            allPosts.forEach(post => {
                const article = document.createElement('article');
                article.className = 'blog-card reveal';
                article.dataset.category = post.category ? post.category.toLowerCase().split(' ')[0] : 'news';
                article.innerHTML = `
            <div class="blog-card-img" style="background-image: url('${post.image}');">
                ${!post.image ? `<span aria-hidden="true" lang="bn">ব</span>` : ''}
            </div>
            <div class="blog-card-body">
                <div class="blog-category">${post.category || 'News'}</div>
                <h3 class="blog-card-title">${post.title}</h3>
                <p class="blog-card-excerpt">${post.excerpt || post.content.substring(0, 150) + '...'}</p>
                <div class="blog-meta">
                    <span>${new Date(post.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                </div>
                <a href="#" class="blog-read-more">Read →</a>
            </div>
        `;
                grid.appendChild(article);
            });
            if (window.applyBlogFilters) window.applyBlogFilters();
        } catch (err) { console.error("CMS Error:", err); }
    },

    async loadResearch() {
        const container = document.getElementById('research-container');
        if (!container) return;
        console.log("CMS: Loading Research...");

        try {
            const response = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/contents/content/research?ref=${this.branch}`);
            const files = await response.json();
            if (!Array.isArray(files)) throw new Error("Could not find research folder on GitHub.");

            container.innerHTML = '';
            let allAreas = [];
            for (const file of files) {
                if (!file.name.endsWith('.md')) continue;
                const raw = await this.fetchFile(file.download_url);
                const { data, content } = this.parseFrontmatter(raw);
                allAreas.push({ ...data, body: content, projectsList: data.projects || [], toolsList: data.tools || [] });
            }

            allAreas.sort((a, b) => (a.order || '00').localeCompare(b.order || '00'));
            allAreas.forEach(area => {
                const div = document.createElement('div');
                div.className = 'area-card reveal';
                div.innerHTML = `
            <div class="area-icon-wrap">
                <span class="area-icon-char" lang="bn" aria-hidden="true">${area.char}</span>
                <span class="area-num">${area.order}</span>
            </div>
            <div>
                <div class="area-tag">${area.tag}</div>
                <h2 class="area-title">${area.title}</h2>
                <div class="area-desc">${area.body}</div>
                <div class="area-details">
                    <div>
                        <h4>Current Projects</h4>
                        <ul>${area.projectsList.map(p => `<li>${p}</li>`).join('')}</ul>
                    </div>
                    <div>
                        <h4>Tools & Datasets</h4>
                        <ul>${area.toolsList.map(t => `<li>${t}</li>`).join('')}</ul>
                    </div>
                </div>
                <a href="${area.link}" class="area-link">View ${area.title} publications →</a>
            </div>
        `;
                container.appendChild(div);
            });
        } catch (err) { console.error("CMS Error:", err); }
    },

    async loadHome() {
        console.log("CMS: Loading Homepage...");
        this.loadHomePubs();
        this.loadHomeTeam();
    },

    async loadHomePubs() {
        const pubContainer = document.querySelector('.pub-list');
        if (!pubContainer) return;

        try {
            const response = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/contents/content/publications?ref=${this.branch}`);
            const files = await response.json();
            if (Array.isArray(files)) {
                pubContainer.innerHTML = '';
                let pubs = [];
                for (const file of files.slice(0, 5)) {
                    if (!file.name.endsWith('.md')) continue;
                    const raw = await this.fetchFile(file.download_url);
                    const { data } = this.parseFrontmatter(raw);
                    pubs.push(data);
                }
                pubs.sort((a, b) => (b.year || 0) - (a.year || 0));
                pubs.forEach(pub => {
                    const article = document.createElement('article');
                    article.className = 'pub-item reveal';
                    article.innerHTML = `<div class="pub-year">${pub.year}</div><div><div class="pub-title">${pub.title}</div><div class="pub-authors">${pub.authors}</div></div><div><span class="pub-badge">${pub.badge || ''}</span></div>`;
                    pubContainer.appendChild(article);
                });
            }
        } catch (err) { console.error("Home Pubs Error:", err); }
    },

    async loadHomeTeam() {
        const teamGrid = document.querySelector('.team-grid');
        if (!teamGrid) return;

        try {
            const response = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/contents/content/team?ref=${this.branch}`);
            const files = await response.json();
            if (Array.isArray(files)) {
                teamGrid.innerHTML = '';
                for (const file of files.slice(0, 8)) {
                    if (!file.name.endsWith('.md')) continue;
                    const raw = await this.fetchFile(file.download_url);
                    const { data } = this.parseFrontmatter(raw);
                    const div = document.createElement('div');
                    div.className = 'team-card reveal';
                    div.innerHTML = `<div class="team-avatar"><div class="team-avatar-initials" lang="bn">${data.initials}</div></div><div class="team-name">${data.title}</div><div class="team-role">${data.role}</div><div class="team-inst">${data.institution}</div>`;
                    teamGrid.appendChild(div);
                }
            }
        } catch (err) { console.error("Home Team Error:", err); }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    if (path === '/' || path.endsWith('index.html') || path === '') CMS.loadHome();
    if (path.includes('/publications/')) CMS.loadPublications();
    if (path.includes('/team/')) CMS.loadTeam();
    if (path.includes('/blog/')) CMS.loadBlog();
    if (path.includes('/research/')) CMS.loadResearch();
});
