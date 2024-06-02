class MobileMenuButton extends HTMLElement {
  mobileMenuId = 'mobileMenu';
  mobileMenuOpenClass = 'open';
  buttonAnimationClass = 'animate';

  constructor() {
    super();

    document.addEventListener('navigationStart', () => {
      const mobileMenu = document.getElementById(this.mobileMenuId);

      if (mobileMenu?.classList.contains(this.mobileMenuOpenClass)) {
        this.closeMenu(mobileMenu);
      }
    });
  }

  connectedCallback() {
    this.showContent();
    this.onclick = this.toggleMenuIsOpen;
  }

  showContent() {
    this.innerHTML = !document.getElementById(this.mobileMenuId)?.classList.contains(this.mobileMenuOpenClass)
      ? '<span class="material-icons">menu</span>'
      : '<span class="material-icons">close</span>';
  }

  toggleMenuIsOpen() {
    const mobileMenu = document.getElementById(this.mobileMenuId);

    if (mobileMenu?.classList.contains(this.mobileMenuOpenClass)) {
      this.closeMenu(mobileMenu);
    }
    else if (mobileMenu) {
      this.openMenu(mobileMenu);
    }
  }

  closeMenu(mobileMenu) {
    this.classList.add(this.buttonAnimationClass);
    mobileMenu.classList.remove(this.mobileMenuOpenClass);
    document.body.classList.remove('mobile-menu-open');
    this.showContent();
    this.animateButtonClose();
  }

  openMenu(mobileMenu) {
    this.classList.add(this.buttonAnimationClass);
    mobileMenu.classList.add(this.mobileMenuOpenClass);
    document.body.classList.add('mobile-menu-open');
    this.showContent();
    this.animateButtonClose();
  }

  animateButtonClose() {
    setTimeout(() => this.classList.remove(this.buttonAnimationClass), 500);
  }
}

customElements.define('mobile-menu-button', MobileMenuButton);
