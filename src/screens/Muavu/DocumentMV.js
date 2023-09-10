import React, {useState, useLayoutEffect} from 'react';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import DocumentTemplate from '../../components/DocumentTemplate';
import {getAllDocumentMv} from '../../redux/apiRequest';

const DocumentMV = ({navigation}) => {
  const dispatch = useDispatch();
  const [pickFileIndex, setpickFileIndex] = useState(null);
  const [input, setInput] = useState('');
  const data = useSelector(state => state.documentMv.documentMvSlice?.data);
  const [document, setDocument] = useState(data);

  const fetchAllDocumentMv = async () => {
    try {
      await getAllDocumentMv(dispatch);
    } catch (error) {
      console.log(error);
    }
  };

  useLayoutEffect(() => {
    fetchAllDocumentMv();
  }, []);

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
