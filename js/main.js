document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');

  function closeMenu() {
    navLinks.classList.remove('open');
    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
  }

  if (hamburger && navLinks) {
    // ensure the button has proper aria attributes
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-controls', 'main-nav');
    navLinks.id = 'main-nav';

    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // close when a link is selected
    navLinks.addEventListener('click', (event) => {
      if (event.target.tagName === 'A') {
        closeMenu();
      }
    });

    // close if user clicks outside the nav on small screens
    document.addEventListener('click', (event) => {
      // faster check using closest
      if (!event.target.closest('.nav-links, #hamburger')) {
        closeMenu();
      }
    });

    // reset menu state on resize (so you don't end up with open menu when switching to desktop)
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



  // contact form handler removed since no action is performed
  // const contactForm = document.getElementById('contact-form');
  // if (contactForm) {
  //   contactForm.addEventListener('submit', function(event) {
  //     event.preventDefault();
  //     const formData = new FormData(contactForm);
  //     const name = formData.get('name');
  //     const email = formData.get('email');
  //     const message = formData.get('message');
  //   });
  // }


  // GitHub repo grid population
  const repoList = document.getElementById('repo-list');
  if (repoList) {
    async function loadRepos() {
      try {
        const resp = await fetch('https://api.github.com/users/imemix/repos?sort=updated');
        if (!resp.ok) throw new Error('GitHub API error');
        const data = await resp.json();

        repoList.innerHTML = '';
        const frag = document.createDocumentFragment();

        data.forEach(repo => {
          const item = document.createElement('div');
          item.className = 'project-item';

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

        const remainder = data.length % 3;
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