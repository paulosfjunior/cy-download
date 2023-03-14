describe('verify download functionality and clear funcionality', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('downloads small file', () => {
    cy.clearDownload();

    cy.get('[data-cy="small"]').click();

    cy.verifyDownload('small-file-10MB.zip');
  });

  it('downloads large file', () => {
    cy.clearDownload();

    cy.get('[data-cy="large"]').click();

    cy.verifyDownload('large-file-100MB.zip', { timeout: 55000, interval: 500 });
  });

  it('downloads with contains option', () => {
    cy.clearDownload();

    cy.get('[data-cy="large"]').click();

    cy.verifyDownload('large-file-100MB', { contains: true });
  });

  it('downloads file with extension and contains option', () => {
    cy.clearDownload();
    
    cy.get('[data-cy="large"]').click();

    cy.verifyDownload('large-file-100MB.zip', { contains: true });
  });
  
  it('downloads with not contains option', () => {
    cy.clearDownload();

    cy.get('[data-cy="large"]').click();

    cy.verifyDownload('small-file-100MB', { notContains: true });
  });

  it('downloads file with not extension and not contains option', () => {
    cy.clearDownload();
    
    cy.get('[data-cy="large"]').click();

    cy.verifyDownload('small-file-100MB.zip', { notContains: true });
  });
});
