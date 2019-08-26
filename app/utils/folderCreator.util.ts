import { mkdir } from 'fs';

export default function(path: string, folderName?: string): Promise<any> {
  return new Promise((resolve) => {
    const newPath = folderName ? `${path}/${folderName}` : path;

    mkdir(newPath, (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          resolve(new Error(`Path ${path} does not exist.`));
          return;
        }
        if (err.code === 'EEXIST') {
          resolve(new Error(undefined));
          return;
        }

        console.log('ERROR in folder creator:', err);
        resolve(new Error(`Unable to create ${newPath} folder.`));
      }

      resolve(undefined);
    });
  });
}
