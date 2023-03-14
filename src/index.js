const { join } = require('path');
const { unlinkSync, existsSync, readdirSync } = require('fs');
const { randomBytes } = require('crypto');

const addCustomCommand = () => {
  Cypress.Commands.add('verifyDownload', (fileName, options) => {
    Cypress.log({
      name: 'verifyDownload',
      message: `Waiting for the ${fileName} file to be exist`,
    });

    const defaultOptions = {
      timeout: 10000,
      interval: 200,
      contains: false,
      notContains: false,
      deleteFiles: false
    };

    let { timeout, interval, contains, notContains, deleteFiles } = { ...defaultOptions, ...options };

    const downloadsFolder = Cypress.config('downloadsFolder');
    const downloadFileName = join(downloadsFolder, fileName);

    if (interval <= 0 || interval > timeout) {
      throw new Error(
        `Interval:${interval} cannot be less than 1 and cannot be less than timeout: ${timeout}.`
      );
    }

    if (contains && notContains) {
      cy.log(
        `***WARNING!*** Contains and NotContains parameter informed, by default the function prioritizes Contains and disregards the NotContains parameter`
      );

      notContains = false;
    }

    let retries = Math.floor(timeout / interval);

    const checkFile = (result) => {
      if (result || notContains || deleteFiles) return result;

      if (retries < 1) {
        if (contains)
          cy.log(
            `***WARNING!*** Failed after ${timeout} time out. \nDue to couldn't find ${fileName} file in the ${downloadsFolder} folder`
          );

        return false;
      }

      cy.wait(interval, { log: false }).then(() => {
        retries--;
        return resolveValue();
      });
    };

    const resolveValue = () => {
      let result;

      if (contains || notContains || deleteFiles) {
        result = cy.task('findFiles', { path: downloadsFolder, fileName })
          .then((files) => {
            const getTempName = () => `${randomBytes(8)}-temp-file-name-${randomBytes(8)}`;
            let pathFile;

            if (files == null)
              throw new Error(
                `Base path [${downloadsFolder}] to verify download files does not exist.`
              );

            if (files.length > 0) {
              if (deleteFiles) {
                for (const file of files) {
                  cy.task('deleteFiles', join(downloadsFolder, file))
                }
              } else {

                if (files.length > 1)
                  cy.log(
                    `***WARNING!*** Found ${files.length} files for query '${fileName}', first [${files[0]}] will be used for validation. List of files: [${files}].`
                  );

                pathFile = files[0];
              }
            }

            return cy.task('isFileExist', { path: join(downloadsFolder, pathFile || getTempName()), notContains });
          });
      } else {
        result = cy.task('isFileExist', { path: downloadFileName });
      }

      return result.then(checkFile);
    };

    return resolveValue().then((res) => res);
  });

  Cypress.Commands.add('clearDownload', (options) => {
    Cypress.log({
      name: 'clearDownload',
      message: `Waiting for the clear download folder`,
    });

    const defaultOptions = {
      fileName: '',
      contains: true,
      notContains: false
    };

    let { fileName, contains, notContains } = { ...defaultOptions, ...options };

    const downloadsFolder = Cypress.config('downloadsFolder');
    const downloadFileName = join(downloadsFolder, fileName);

    if (contains && notContains) {
      cy.log(
        `***WARNING!*** Contains and NotContains parameter informed, by default the function prioritizes Contains and disregards the NotContains parameter`
      );

      notContains = false;
    }

    const resolveValue = () => {
      let result;

      if (contains || notContains) {
        result = cy.task('findFiles', { path: downloadsFolder, fileName })
          .then((files) => {
            const getTempName = () => `${randomBytes(8)}-temp-file-name-${randomBytes(8)}`;
            let pathFile;

            if (files == null)
              throw new Error(
                `Base path [${downloadsFolder}] to verify download files does not exist.`
              );

            if (files.length > 0) {
              for (const file of files) {
                cy.task('deleteFiles', join(downloadsFolder, file));
              }

              pathFile = files[0]
            }

            return cy.task('isFileExist', { path: join(downloadsFolder, pathFile || getTempName()), notContains });
          });
      } else {
        result = cy.task('isFileExist', { path: downloadFileName })
          .then((file) => {
            cy.task('deleteFiles', join(downloadsFolder, file));

            return cy.task('isFileExist', { path: downloadFileName });
          });
      }

      return result.then((res) => res);
    };

    return resolveValue().then((res) => res);
  });
};

const isFileExist = ({ path, notContains = false }) => !!(existsSync(path) ^ notContains);

const findFiles = ({ path, fileName }) => {
  if (!existsSync(path)) return null;

  return readdirSync(path).filter((file) => file.includes(fileName) && isDownloaded(file));
};

const deleteFiles = (path) => {
  try {
    unlinkSync(path);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const isDownloaded = (file) => !file.endsWith('.crdownload');

module.exports = {
  // TODO: deprecate these exports in the next major release
  isFileExist,
  findFiles,
  deleteFiles,
  addCustomCommand,
  downloadTasks: {
    isFileExist,
    findFiles,
    deleteFiles,
  },
};
