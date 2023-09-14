import React from 'react';
import {useSelector} from 'react-redux';
import DocumentTemplate from '../../components/DocumentTemplate';

const ForestPrice = ({navigation}) => {
  const data = useSelector(
    state => state.document.documentSlice?.kkrData?.data,
  );

  console.log(data);
  const groupOption = useSelector(
    state => state.document.documentSlice?.kkrData?.category,
  );

  return (
    <DocumentTemplate
      screenName={'Kiểm kê rừng'}
      navigation={navigation}
      data={data}
      groupOption={groupOption}
    />
  );
};

export default ForestPrice;
