import React from 'react';
import {useSelector} from 'react-redux';
import DocumentTemplate from '../../components/DocumentTemplate';

const VP809Screen = ({navigation}) => {
  const data = useSelector(
    state => state.document.documentSlice?.VP809Data?.data,
  );
  const groupOption = useSelector(
    state => state.document.documentSlice?.VP809Data?.category,
  );

  return (
    <DocumentTemplate
      screenName={'Văn phòng 809'}
      navigation={navigation}
      data={data}
      groupOption={groupOption}
    />
  );
};

export default VP809Screen;
