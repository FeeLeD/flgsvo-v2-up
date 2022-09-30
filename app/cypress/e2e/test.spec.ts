/// <reference types="Cypress" />

context("Home page", () => {
  it("Сan visit", () => {
    cy.visit("/");
  });

  it("Has news title", () => {
    cy.get("#news-title");
  });
});
