import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import DocumentTemplate from '../../components/DocumentTemplate';

const DMKTKTScreen = ({navigation}) => {
  const [pickFileIndex, setpickFileIndex] = useState(null);
  const [pickOptionIndex, setPickOptionIndex] = useState(0);
  const [input, setInput] = useState('');
  const data = useSelector(
    state => state.document.documentSlice?.DMKTKTData?.data,
  );
  const groupOption = useSelector(
    state => state.document.documentSlice?.DMKTKTData?.category,
  );
  const [document, setDocument] = useState(data);

  return (
    <DocumentTemplate
      screenName={'Định mức Kinh tế Kĩ thuật'}
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

export default DMKTKTScreen;
