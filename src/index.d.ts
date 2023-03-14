// load type definitions that come with Cypress module
/// <reference types="cypress" />
declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to verify that file has been downloaded
     * @param fileName - string
     * @param options - { timeout: number, interval: number, contains: boolean, notContains: boolean, deleteFiles: boolean }
     * @example
     *  cy.verifyDownload('filename.zip')
     *  cy.verifyDownload('filename.zip', { timeout: 20000, interval: 500 });
     *  cy.verifyDownload('.zip', { contains: true });
     *  cy.verifyDownload('.zip', { notContains: true });
     */
    verifyDownload(
      fileName: string,
      options?: { timeout?: number; interval?: number; contains?: boolean, notContains?: boolean, deleteFiles?: boolean }
    ): Chainable<boolean>;

    /**
     * Custom command to clear download folder
     * @param options - { filename: string, contains: boolean, notContains: boolean }
     * @example
     *  cy.clearDownload();
     *  cy.clearDownload({ filename: '.pdf'});
     *  cy.clearDownload({ filename: 'filename.pdf', contains: false });
     *  cy.clearDownload({ filename: 'filename.pdf', notContains: true });
     */
    clearDownload(
      fileName: string,
      options?: { filename?: string; contains?: boolean, notContains?: boolean }
    ): Chainable<boolean>;
  }
}
