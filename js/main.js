document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');

  function closeMenu() {
    navLinks.classList.remove('open');
    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
  }

  if (hamburger && navLinks) {

    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-controls', 'main-nav');
    navLinks.id = 'main-nav';

    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navLinks.addEventListener('click', (event) => {
      if (event.target.tagName === 'A') {
        closeMenu();
      }
    });


    document.addEventListener('click', (event) => {

      if (!event.target.closest('.nav-links, #hamburger')) {
        closeMenu();
      }
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth > 600) {
          closeMenu();
        }
      }, 150);
    });
  }

  const repoList = document.getElementById('repo-list');
  if (repoList) {
    async function loadRepos() {
      try {
        const resp = await fetch('https://api.github.com/users/imemix/repos?sort=updated');
        if (!resp.ok) throw new Error('GitHub API error');
        const data = await resp.json();

        repoList.innerHTML = '';
        const frag = document.createDocumentFragment();

        const repos = data.slice(0, 6);

        repos.forEach((repo, idx) => {
          const item = document.createElement('div');
          item.className = 'project-item';

          if (idx % 6 === 0) {
            item.classList.add('large');
          }

          const name = document.createElement('a');
          name.className = 'prop';
          name.href = repo.html_url;
          name.target = '_blank';
          name.rel = 'noopener noreferrer';
          name.textContent = repo.name;

          const desc = document.createElement('p');
          desc.className = 'prop repo-desc';
          desc.textContent = repo.description || 'No description';

          const meta = document.createElement('div');
          meta.className = 'prop repo-meta';
          meta.innerHTML =
            `<span title="Stars">⭐ ${repo.stargazers_count}</span>` +
            (repo.language ? ` <span title="Language">🗣️ ${repo.language}</span>` : '');

          const button = document.createElement('button');
          button.className = 'prop';
          button.textContent = 'Learn More';
          button.onclick = () => { window.open(repo.html_url, '_blank'); };

          item.appendChild(name);
          item.appendChild(desc);
          item.appendChild(meta);
          item.appendChild(button);
          frag.appendChild(item);
        });

        repoList.appendChild(frag);

        Array.from(repoList.children).forEach(el => el.classList.remove('fullwidth'));
        const remainder = repos.length % 3;
        if (remainder === 1) {
          const lastItem = repoList.lastElementChild;
          if (lastItem) lastItem.classList.add('fullwidth');
        }
      } catch (err) {
        console.error('Failed to load repos:', err);
        repoList.textContent = 'Unable to load repositories at this time.';
      }
    }

    loadRepos();
  }
});