import {unlink} from 'fs';
import {USER_IMAGES_URL} from '../constants/userImagesUrl';

const defaultPaths = [
  USER_IMAGES_URL.defaultProfilePicture
];

export default function(path: string): Promise<NodeJS.ErrnoException | null> {
  console.log(`Delete image ${path}`);
  return new Promise((resolve) => {
    if (!path || defaultPaths.includes(path)) {
      resolve(null);
      return;
    }

    unlink(path, (err) => {
     if (err) {
       console.log(err);
     }
     if (err && err.code !== 'ENOENT') {
       return resolve(err);
     }

     resolve(null);
    });
  });
}
