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
  const yearOption = useSelector(
    state => state.document.documentSlice?.forestData?.year,
  );
  const unitOption = useSelector(
    state => state.document.documentSlice?.forestData?.unit,
  );
  const hieuLuc = useSelector(
    state => state.document.documentSlice?.forestData?.hieuluc,
  );

  return (
    <DocumentTemplate
      screenName={'Khung giá rừng'}
      navigation={navigation}
      data={data}
      groupOption={groupOption}
      yearOption={yearOption}
      unitOption={unitOption}
      hieuLuc={hieuLuc}
    />
  );
};

export default ForestPrice;
