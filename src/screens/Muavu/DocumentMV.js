import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import DocumentTemplate from '../../components/DocumentTemplate';


const DocumentMV = ({navigation}) => {
  const [pickFileIndex, setpickFileIndex] = useState(null);
  const [input, setInput] = useState('');
  const data = useSelector(state => state.documentMv.documentMvSlice?.data);
  const [document, setDocument] = useState(data);

  return (
    <DocumentTemplate
      screenName={'Tài liệu Mùa vụ'}
      navigation={navigation}
      pickFileIndex={pickFileIndex}
      setpickFileIndex={setpickFileIndex}
      input={input}
      setInput={setInput}
      data={data}
      document={document}
      setDocument={setDocument}
    />
  );
};

export default DocumentMV;
