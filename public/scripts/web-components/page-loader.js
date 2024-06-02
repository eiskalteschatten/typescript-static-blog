class PageLoader extends HTMLElement {
  pageLoaderTimeout = null;

  constructor() {
    super();

    document.addEventListener('navigationStart', () => {
      this.pageLoaderTimeout = setTimeout(() => {
        this.classList.remove('hidden');
        this.classList.add('loading');
        clearTimeout(this.pageLoaderTimeout);
      }, 200);
    });

    document.addEventListener('navigationEnd', () => {
      if (this.pageLoaderTimeout) {
        clearTimeout(this.pageLoaderTimeout);
      }

      this.classList.add('hidden');
      this.classList.remove('loading');
    });
  }

  connectedCallback() {
    this.showContent();
  }

  showContent() {
    this.innerHTML = '<div class="bar"></div>';
  }
}

customElements.define('page-loader', PageLoader);
