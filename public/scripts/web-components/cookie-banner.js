class CookieBanner extends HTMLElement {
  connectedCallback() {
    const hasClosedCookieBanner = !!localStorage.getItem('allCookiesAccepted');

    if (!hasClosedCookieBanner && !navigator.doNotTrack) {
      this.classList.add('show');
    }

    const onlyNecessaryButton = document.getElementById('cookieBannerOnlyNecessaryButton');
    const acceptAllButton = document.getElementById('cookieBannerAcceptAllButton');

    onlyNecessaryButton?.addEventListener('click', () => this.acceptOnlyNecessaryCookies());
    acceptAllButton?.addEventListener('click', () => this.acceptAllCookies());
  }

  acceptOnlyNecessaryCookies() {
    localStorage.setItem('allCookiesAccepted', 'false');
    this.classList.remove('show');
  }

  acceptAllCookies() {
    localStorage.setItem('allCookiesAccepted', 'true');
    this.classList.remove('show');
  }
}

customElements.define('cookie-banner', CookieBanner);
