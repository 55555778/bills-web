class LoginPage {
  // 1. 属性 (Elements)：页面上有哪些元素？
  // 这里用了 get 语法，相当于给 cy.get 起个名字
  get userEmailInput() {
    return cy.get('[data-testid="login-email"]');
  }

  get userPasswordInput() {
    return cy.get('[data-testid="login-password"]');
  }

  get loginButton() {
    return cy.get('[data-testid="login-submit"]');
  }

  // 2. 动作 (Actions)：在这个页面上能干啥？
  // 封装访问地址

  visit() {
    cy.visit('/');
  }
  // 封装登录逻辑

  fillLogin(name: string, password: string) {
    this.userEmailInput.type(name);
    this.userPasswordInput.type(password);
    this.loginButton.click();
  }
}
export default new LoginPage();
