import React, {useState} from 'react';
import {DocumentData} from '../../contants/Variable';
import DocumentTemplate from '../../components/DocumentTemplate';

const DocumentListScreen = ({navigation}) => {
  const [pickFileIndex, setpickFileIndex] = useState(null);
  const [pickOptionIndex, setPickOptionIndex] = useState(0);
  const [input, setInput] = useState('');
  const groupOption = [
    'Tất cả',
    'Luật',
    'Nghị định',
    'Quyết định',
    'Thông tư',
    'Sổ tay',
  ];
  const [document, setDocument] = useState(DocumentData);

  return (
    <DocumentTemplate
      screenName={'Văn bản PFES'}
      navigation={navigation}
      pickFileIndex={pickFileIndex}
      setpickFileIndex={setpickFileIndex}
      pickOptionIndex={pickOptionIndex}
      setPickOptionIndex={setPickOptionIndex}
      input={input}
      setInput={setInput}
      data={DocumentData}
      groupOption={groupOption}
      document={document}
      setDocument={setDocument}
    />
  );
};

export default DocumentListScreen;
