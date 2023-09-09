import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import DocumentTemplate from '../../components/DocumentTemplate';

const TreeTypeScreen = ({navigation}) => {
  const [pickFileIndex, setpickFileIndex] = useState(null);
  const [pickOptionIndex, setPickOptionIndex] = useState(0);
  const [input, setInput] = useState('');
  const data = useSelector(
    state => state.document.documentSlice?.gionglnData?.data,
  );
  const groupOption = useSelector(
    state => state.document.documentSlice?.gionglnData?.category,
  );
  const [document, setDocument] = useState(data);

  return (
    <DocumentTemplate
      screenName={'Giống Lâm nghiệp'}
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

export default TreeTypeScreen;
