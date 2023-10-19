import RNFS from 'react-native-fs';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {ToastAlert} from '../components/Toast';
import {Linking} from 'react-native';

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
  const {dirs} = ReactNativeBlobUtil.fs;

  const filename = url.split('/').pop();
  const dirToSave = Platform.OS == 'ios' ? dirs.DocumentDir : dirs.DownloadDir;
  const configfb = {
    fileCache: true,
    useDownloadManager: true,
    notification: true,
    mediaScannable: true,
    title: filename,
    path: `${dirToSave}/${filename}`,
  };
  const configOptions = Platform.select({
    ios: {
      fileCache: configfb.fileCache,
      title: configfb.title,
      path: configfb.path,
      appendExt: 'pdf',
    },
    android: configfb,
  });

  ReactNativeBlobUtil.config(configOptions)
    .fetch('GET', url, {})
    .then(res => {
      if (Platform.OS === 'ios') {
        ReactNativeBlobUtil.fs.writeFile(configfb.path, res.data, 'base64');
        ReactNativeBlobUtil.ios.previewDocument(configfb.path);
      }
      console.log('The file saved to ', res);
    })
    .catch(e => {
      console.log('The file saved to ERROR', e.message);
    });
};

export const shareAndroid = async url => {
  try {
    const result = await Share.share({
      message: url,
    });

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
      } else {
      }
    } else if (result.action === Share.dismissedAction) {
    }
  } catch (error) {}
};

export const OpenURL = async link => {
  try {
    await Linking.openURL(link);
  } catch (error) {
    ToastAlert('Không thể mở đường dẫn!');
  }
};
