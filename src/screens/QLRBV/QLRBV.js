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
  const yearOption = useSelector(
    state => state.document.documentSlice?.QLRBVData?.year,
  );
  const unitOption = useSelector(
    state => state.document.documentSlice?.QLRBVData?.unit,
  );
  const hieuLuc = useSelector(
    state => state.document.documentSlice?.QLRBVData?.hieuluc,
  );

  return (
    <DocumentTemplate
      screenName={'Quản lý rừng bền vững'}
      navigation={navigation}
      data={data}
      groupOption={groupOption}
      yearOption={yearOption}
      unitOption={unitOption}
      hieuLuc={hieuLuc}
    />
  );
};

export default QLRBVScreen;
