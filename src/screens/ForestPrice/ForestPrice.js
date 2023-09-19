import React from 'react';
import {useSelector} from 'react-redux';
import DocumentTemplate from '../../components/DocumentTemplate';

const ForestPrice = ({navigation}) => {
  const data = useSelector(
    state => state.document.documentSlice?.forestData?.data,
  );
  const groupOption = useSelector(
    state => state.document.documentSlice?.forestData?.category,
  );

  return (
    <DocumentTemplate
      screenName={'Khung giá rừng'}
      navigation={navigation}
      data={data}
      groupOption={groupOption}
    />
  );
};

export default ForestPrice;
