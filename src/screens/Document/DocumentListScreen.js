import React, {useCallback} from 'react';
import DocumentTemplate from '../../components/DocumentTemplate';
import {useSelector} from 'react-redux';

const DocumentListScreen = ({navigation}) => {
  const data = useSelector(
    state => state.document.documentSlice?.dvmtrData?.data,
  );
  const groupOption = useSelector(
    state => state.document.documentSlice?.dvmtrData?.category,
  );

  return (
    <DocumentTemplate
      screenName={'Dịch vụ môi trường rừng'}
      navigation={navigation}
      data={data}
      groupOption={groupOption}
    />
  );
};

export default DocumentListScreen;
