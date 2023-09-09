import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import DocumentTemplate from '../../components/DocumentTemplate';

const DocumentMV = ({navigation}) => {
  const [pickFileIndex, setpickFileIndex] = useState(null);
  const [pickOptionIndex, setPickOptionIndex] = useState(0);
  const [input, setInput] = useState('');
  const data = useSelector(
    state => state.document.documentSlice?.forestryData?.data,
  );
  const groupOption = useSelector(
    state => state.document.documentSlice?.forestryData?.category,
  );
  const [document, setDocument] = useState(data);

  return (
    <DocumentTemplate
      screenName={'Tài liệu Mùa vụ'}
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

export default DocumentMV;
