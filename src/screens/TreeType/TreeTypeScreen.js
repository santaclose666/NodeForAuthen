import React from 'react';
import {useSelector} from 'react-redux';
import DocumentTemplate from '../../components/DocumentTemplate';

const TreeTypeScreen = ({navigation}) => {
  const data = useSelector(
    state => state.document.documentSlice?.gionglnData?.data,
  );
  const groupOption = useSelector(
    state => state.document.documentSlice?.gionglnData?.category,
  );

  return (
    <DocumentTemplate
      screenName={'Giống Lâm nghiệp'}
      navigation={navigation}
      data={data}
      groupOption={groupOption}
    />
  );
};

export default TreeTypeScreen;
