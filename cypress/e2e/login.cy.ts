import LoginPage from '../pages/LoginPage';

describe('template spec', () => {
  let userData: {
    validUser: {
      email: string;
      password: string;
    };
    invalidUser: {
      email: string;
      password: string;
    };
  };

  before(() => {
    cy.fixture('users').then((data) => {
      userData = data;
      cy.log('userData:', userData);
      console.log('👊 ~ userData:', userData);
      // cy.pause();
    });
  });
  beforeEach(() => {
    LoginPage.visit();
  });

  it('登录失败测试', () => {
    LoginPage.fillLogin(userData.invalidUser.email, userData.invalidUser.password);
    // cy.url().should('include', '/home');
    cy.contains('登录失败').should('be.visible');
  });

  it('登录成功测试', () => {
    LoginPage.fillLogin(userData.invalidUser.email, userData.validUser.password);
    // cy.url().should('include', '/');
    cy.url().should('eq', Cypress.config().baseUrl + '/'); // 精确匹配
  });

  it('校验必填项提示', () => {
    LoginPage.loginButton.click();
    cy.contains('Please input your email!').should('be.visible');
    cy.contains('Please input your password!').should('be.visible');
  });
});
