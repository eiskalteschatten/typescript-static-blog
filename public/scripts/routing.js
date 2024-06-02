const navStartEvent = new Event('navigationStart', { cancelable: true });
const navEndEvent = new Event('navigationEnd');

function setContents(html, title, mainNavId) {
  const main = document.getElementById('main');

  if (main) {
    main.innerHTML = html;
  }

  document.title = title || 'TypeScript Static Blog';

  const activeLinks = document.querySelectorAll('a.js-main-nav-button');

  if (activeLinks && activeLinks.length > 0) {
    activeLinks.forEach(activeLink => activeLink.classList.remove('selected'));
  }

  if (mainNavId) {
    const newActiveLinks = document.querySelectorAll(`a[data-nav-id="${mainNavId}"]`);

    if (newActiveLinks && newActiveLinks.length > 0) {
      newActiveLinks?.forEach(newActiveLink => newActiveLink.classList.add('selected'));
    }
  }

  setLinks();
}

async function clickLink(link) {
  try {
    if (!document.dispatchEvent(navStartEvent)) {
      return;
    }

    const fetchUrl = link.href.includes('?') ? `${link.href}&_partial` : `${link.href}?_partial`;
    const response = await fetch(fetchUrl);

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
    document.dispatchEvent(navEndEvent);
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
