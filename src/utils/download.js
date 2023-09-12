import RNFS from 'react-native-fs';
import ReactNativeBlobUtil from 'react-native-blob-util';

export const AndroidDownload = url => {
  const split_url = url.split('/');
  const filename = split_url[split_url.length - 1];
  const android = ReactNativeBlobUtil.android;
  ReactNativeBlobUtil.config({
    addAndroidDownloads: {
      useDownloadManager: true,
      notification: true,
      title: filename,
      path: RNFS.DownloadDirectoryPath + '/' + filename,
    },
  })
    .fetch('GET', url)
    .then(async res => {
      android.actionViewIntent(RNFS.DownloadDirectoryPath + '/' + filename);
    });
};

export const IOSDownload = async url => {
  const {config, fs} = ReactNativeBlobUtil;
  const cacheDir = fs.dirs.DownloadDir;

  const filename = url.split('/').pop();
  const pdfPath = `${cacheDir}/${filename}`;

  try {
    const configOptions = Platform.select({
      ios: {
        fileCache: true,
        path: pdfPath,
        appendExt: filename.split('.').pop(),
      },
      android: {
        fileCache: true,
        path: pdfPath,
        appendExt: filename.split('.').pop(),
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: pdfPath,
          description: 'File',
        },
      },
    });

    ReactNativeBlobUtil.config(configOptions)
      .fetch('GET', url)
      .then(res => {
        ReactNativeBlobUtil.ios.previewDocument(res.path());
      });
  } catch (error) {
    console.error(error);
    return null;
  }
};
