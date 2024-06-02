function setContents(html, title, mainNavId) {
  const main = document.getElementById('main');

  if (main) {
    main.innerHTML = html;
  }

  document.title = title || 'Hybrid Frameworkless SPA Concept';

  if (mainNavId) {
    const activeLinks = document.querySelectorAll('a.js-main-nav-button');

    if (activeLinks && activeLinks.length > 0) {
      activeLinks.forEach(activeLink => activeLink.classList.remove('selected'));
    }

    const newActiveLinks = document.querySelectorAll(`a[data-nav-id="${mainNavId}"]`);

    if (newActiveLinks && newActiveLinks.length > 0) {
      newActiveLinks?.forEach(newActiveLink => newActiveLink.classList.add('selected'));
    }
  }

  setLinks();
}

async function clickLink(link) {
  const pageLoader = document.getElementById('pageLoader');
  let pageLoaderTimeout;

  if (pageLoader) {
    pageLoaderTimeout = setTimeout(() => {
      pageLoader.classList.remove('hidden');
      pageLoader.classList.add('loading');
      clearTimeout(pageLoaderTimeout);
    }, 200);
  }

  try {
    const response = await fetch(`${link.href}?_partial`);

    if (response.status === 200) {
      const partialContents = await response.json();

      setContents(partialContents.html, partialContents.title, partialContents.mainNavId);

      window.history.pushState({
        html: partialContents.html,
        title: partialContents.title,
        href: link.href,
      }, '', link.href);
    }
    else {
      throw new Error('The response code was not 200!');
    }
  }
  catch (error) {
    console.error(error);
    document.location = link.href;
  }
  finally {
    if (pageLoader) {
      if (pageLoaderTimeout) {
        clearTimeout(pageLoaderTimeout);
      }

      pageLoader.classList.add('hidden');
      pageLoader.classList.remove('loading');
    }
  }
}

function setLinks() {
  const links = document.querySelectorAll('a[data-app-link="false"]');

  if (links && links.length > 0) {
    links.forEach(link => {
      link.addEventListener('click', async (e) => {
        e.preventDefault();
        await clickLink(link);
      });

      link.setAttribute('data-app-link', 'true');
    });
  }
}

const originalHtml = document.getElementById('main')?.innerHTML ?? 'An error occurred. Please reload the page.';
const originalTitle = document.title;

(function() {
  setLinks();

  addEventListener('popstate', (e) => {
    if (e.state?.html) {
      setContents(e.state.html, e.state.title);
    }
    else if (e.state?.href) {
      document.location = e.state.href;
    }
    else {
      setContents(originalHtml, originalTitle);
    }
  });
})();
