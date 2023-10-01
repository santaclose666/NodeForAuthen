import React from 'react';
import {useSelector} from 'react-redux';
import DocumentTemplate from '../../components/DocumentTemplate';

const ForestPrice = ({navigation}) => {
  const data = useSelector(
    state => state.document.documentSlice?.kkrData?.data,
  );
  const groupOption = useSelector(
    state => state.document.documentSlice?.kkrData?.category,
  );
  const yearOption = useSelector(
    state => state.document.documentSlice?.kkrData?.year,
  );
  const unitOption = useSelector(
    state => state.document.documentSlice?.kkrData?.unit,
  );
  const hieuLuc = useSelector(
    state => state.document.documentSlice?.kkrData?.hieuluc,
  );

  return (
    <DocumentTemplate
      screenName={'Kiểm kê rừng'}
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
