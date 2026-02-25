/**
 * Bāk Institute — CMS Bridge
 * This script fetches content from the /content folder and populates the pages.
 */

const CMS = {
    // Configuration
    repoOwner: 'bakinstitute',
    repoName: 'bakinstitute.github.io',
    branch: 'main',

    /**
     * Parse Markdown Frontmatter
     * @param {string} text 
     */
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

            if (value === '' || value === '[]') return;

            // Basic string/list cleaning
            if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);

            // Handle simple hyphenated lists
            if (value === '') {
                // might be a list below it, not handled in this simple parser
            }

            data[key] = value;
        });

        return { data, content };
    },

    /**
     * Fetch a single file content
     */
    async fetchFile(path) {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`Could not fetch ${path}`);
        return await response.text();
    },

    /**
     * Load Publications
     */
    async loadPublications() {
        const container = document.getElementById('pub-list');
        if (!container) return;

        const apiUrl = `https://api.github.com/repos/${this.repoOwner}/${this.repoName}/contents/content/publications?ref=${this.branch}`;

        try {
            const response = await fetch(apiUrl);
            const files = await response.json();
            if (!Array.isArray(files)) return;

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
                article.dataset.category = pub.category || 'nlp';
                article.dataset.search = `${pub.title} ${pub.authors} ${pub.year} ${pub.badge}`.toLowerCase();

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
            <div>
                <span class="pub-badge">${pub.badge || ''}</span>
                <div class="member-tags" style="margin-top:0.5rem;">
                    <span class="tag">${(pub.category || 'NLP').toUpperCase()}</span>
                </div>
            </div>
        `;
                container.appendChild(article);
            });

            if (window.applyFilters) window.applyFilters();

            document.querySelectorAll('.pub-toggle').forEach(btn => {
                btn.onclick = () => {
                    const item = btn.closest('.pub-item');
                    const open = item.classList.toggle('expanded');
                    btn.textContent = open ? 'Hide abstract ↑' : 'Show abstract ↓';
                };
            });
        } catch (err) { console.error("CMS Error:", err); }
    },

    /**
     * Load Team
     */
    async loadTeam() {
        const leaderGrid = document.querySelector('.leader-grid');
        const staffGrid = document.querySelector('.member-grid');
        const advisoryList = document.querySelector('.advisory-list'); // Need to add this class to HTML

        if (!leaderGrid && !staffGrid) return;

        const apiUrl = `https://api.github.com/repos/${this.repoOwner}/${this.repoName}/contents/content/team?ref=${this.branch}`;

        try {
            const response = await fetch(apiUrl);
            const files = await response.json();
            if (!Array.isArray(files)) return;

            if (leaderGrid) leaderGrid.innerHTML = '';
            if (staffGrid) staffGrid.innerHTML = '';

            for (const file of files) {
                if (!file.name.endsWith('.md')) continue;
                const raw = await this.fetchFile(file.download_url);
                const { data, content } = this.parseFrontmatter(raw);

                const member = { ...data, bio: content };

                if (member.section === 'leadership' && leaderGrid) {
                    const div = document.createElement('div');
                    div.className = 'leader-card reveal';
                    div.innerHTML = `
                <div class="leader-avatar" aria-hidden="true">
                    <div class="team-avatar-initials" lang="bn">${member.initials}</div>
                </div>
                <div>
                    <div class="member-name">${member.title}</div>
                    <div class="member-role">${member.role}</div>
                    <div class="member-inst">${member.institution}</div>
                    <p class="member-bio">${member.bio}</p>
                    <div class="member-links">
                        ${member.email ? `<a href="mailto:${member.email}" class="member-link">Email</a>` : ''}
                        ${member.link ? `<a href="${member.link}" class="member-link">Profile</a>` : ''}
                    </div>
                </div>
            `;
                    leaderGrid.appendChild(div);
                } else if (member.section === 'staff' && staffGrid) {
                    const div = document.createElement('div');
                    div.className = 'member-card reveal';
                    div.innerHTML = `
                <div class="member-avatar-sm" aria-hidden="true">
                    <div class="team-avatar-initials" lang="bn">${member.initials}</div>
                </div>
                <div class="member-name">${member.title}</div>
                <div class="member-role">${member.role}</div>
                <div class="member-inst">${member.institution}</div>
                <p class="member-bio">${member.bio}</p>
                <div class="member-links">
                    ${member.email ? `<a href="mailto:${member.email}" class="member-link">Email</a>` : ''}
                    ${member.link ? `<a href="${member.link}" class="member-link">Profile</a>` : ''}
                </div>
            `;
                    staffGrid.appendChild(div);
                }
            }
        } catch (err) { console.error("CMS Error:", err); }
    },

    /**
     * Load Blog
     */
    async loadBlog() {
        const grid = document.getElementById('blog-grid');
        if (!grid) return;

        const apiUrl = `https://api.github.com/repos/${this.repoOwner}/${this.repoName}/contents/content/blog?ref=${this.branch}`;

        try {
            const response = await fetch(apiUrl);
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

            // Sort by date desc
            allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

            allPosts.forEach(post => {
                const article = document.createElement('article');
                article.className = 'blog-card reveal';
                article.dataset.category = post.category ? post.category.toLowerCase().split(' ')[0] : 'news';

                article.innerHTML = `
            <div class="blog-card-img" style="background-image: url('${post.image}'); background-size: cover; background-position: center;">
                ${!post.image ? `<span aria-hidden="true" lang="bn">ব</span>` : ''}
            </div>
            <div class="blog-card-body">
                <div class="blog-category">${post.category || 'News'}</div>
                <h3 class="blog-card-title">${post.title}</h3>
                <p class="blog-card-excerpt">${post.excerpt || post.content.substring(0, 150) + '...'}</p>
                <div class="blog-meta" style="margin-top:auto;">
                    <span>${new Date(post.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                </div>
                <a href="#" class="blog-read-more" style="margin-top:0.75rem;">Read →</a>
            </div>
        `;
                grid.appendChild(article);
            });

            if (window.applyBlogFilters) window.applyBlogFilters();
        } catch (err) { console.error("CMS Error:", err); }
    }
};

// Initialize based on page
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    if (path.includes('/publications/')) {
        CMS.loadPublications();
    } else if (path.includes('/team/')) {
        CMS.loadTeam();
    } else if (path.includes('/blog/')) {
        CMS.loadBlog();
    }
});
