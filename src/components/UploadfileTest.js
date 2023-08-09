import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';

const UploadFileTest = () => {
  useEffect(() => {
    RNFS.readDir(RNFS.DocumentDirectoryPath).then(item => {
      console.log(item);
    });
  }, []);

  const saveFileToStorage = async (fileName, fileUri) => {
    console.log(fileUri);
    try {
      const fileContent = await RNFS.readFile(fileUri, 'base64');
      const newPath = RNFS.DocumentDirectoryPath + `/${fileName}`;
      await RNFS.writeFile(newPath, fileContent, 'base64');
      console.log('File saved successfully');
    } catch (error) {
      console.error(error);
    }
  };

  const PickExcel = async () => {
    try {
      const res = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.allFiles],
      });

      console.log(res);

      saveFileToStorage(res[0].name, res[0].uri);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <TouchableOpacity onPress={PickExcel} style={{backgroundColor: 'blue'}}>
        <Text>Add file</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UploadFileTest;
