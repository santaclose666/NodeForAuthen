import React from 'react';
import {useSelector} from 'react-redux';
import DocumentTemplate from '../../components/DocumentTemplate';

const QLRBVScreen = ({navigation}) => {
  const data = useSelector(
    state => state.document.documentSlice?.QLRBVData?.data,
  );
  const groupOption = useSelector(
    state => state.document.documentSlice?.QLRBVData?.category,
  );

  return (
    <DocumentTemplate
      screenName={'Quản lý rừng bền vững'}
      navigation={navigation}
      data={data}
      groupOption={groupOption}
    />
  );
};

export default QLRBVScreen;
