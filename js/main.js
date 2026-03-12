document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    // close menu when a link is clicked (helpful on mobile)
    navLinks.addEventListener('click', (event) => {
      if (event.target.tagName === 'A') {
        navLinks.classList.remove('open');
      }
    });
  }


  // contact form behavior (if present)
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    // ...existing code...
  }

  // GitHub repo grid population
  const repoList = document.getElementById('repo-list');
  if (repoList) {
    fetch('https://api.github.com/users/imemix/repos?sort=updated')
      .then(resp => {
        if (!resp.ok) throw new Error('GitHub API error');
        return resp.json();
      })
      .then(data => {
        repoList.innerHTML = '';
        data.forEach(repo => {
          const item = document.createElement('div');
          item.className = 'project-item';

          // Repo name (link)
          const name = document.createElement('a');
          name.className = 'prop';
          name.href = repo.html_url;
          name.target = '_blank';
          name.rel = 'noopener noreferrer';
          name.textContent = repo.name;

          // Repo description
          const desc = document.createElement('p');
          desc.className = 'prop';
          desc.style.fontSize = '1rem';
          desc.style.margin = '0.5rem 0';
          desc.textContent = repo.description || 'No description';

          // Repo meta (stars, language)
          const meta = document.createElement('div');
          meta.className = 'prop';
          meta.style.flexDirection = 'row';
          meta.style.justifyContent = 'center';
          meta.style.gap = '1rem';
          meta.style.fontSize = '0.95rem';
          meta.innerHTML =
            `<span title="Stars">⭐ ${repo.stargazers_count}</span>` +
            (repo.language ? ` <span title="Language">🗣️ ${repo.language}</span>` : '');

          // Learn More button
          const button = document.createElement('button');
          button.className = 'prop';
          button.textContent = 'Learn More';
          button.onclick = () => { window.open(repo.html_url, '_blank'); };

          item.appendChild(name);
          item.appendChild(desc);
          item.appendChild(meta);
          item.appendChild(button);
          repoList.appendChild(item);
        });
      })
      .catch(err => {
        console.error('Failed to load repos:', err);
        repoList.textContent = 'Unable to load repositories at this time.';
      });
  }
});