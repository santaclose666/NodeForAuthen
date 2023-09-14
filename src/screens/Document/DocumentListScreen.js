import React, {useState} from 'react';
import DocumentTemplate from '../../components/DocumentTemplate';
import {useSelector} from 'react-redux';

const DocumentListScreen = ({navigation}) => {
  const [pickFileIndex, setpickFileIndex] = useState(null);
  const [pickOptionIndex, setPickOptionIndex] = useState({
    item: 'Tất cả',
    index: 0,
  });
  const [input, setInput] = useState('');
  const data = useSelector(
    state => state.document.documentSlice?.dvmtrData?.data,
  );
  const groupOption = useSelector(
    state => state.document.documentSlice?.dvmtrData?.category,
  );
  const [document, setDocument] = useState(data);

  return (
    <DocumentTemplate
      screenName={'Dịch vụ môi trường rừng'}
      navigation={navigation}
      pickFileIndex={pickFileIndex}
      setpickFileIndex={setpickFileIndex}
      pickOptionIndex={pickOptionIndex}
      setPickOptionIndex={setPickOptionIndex}
      input={input}
      setInput={setInput}
      data={data}
      groupOption={groupOption}
      document={document}
      setDocument={setDocument}
    />
  );
};

export default DocumentListScreen;
