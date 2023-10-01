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
  const yearOption = useSelector(
    state => state.document.documentSlice?.gionglnData?.year,
  );
  const unitOption = useSelector(
    state => state.document.documentSlice?.gionglnData?.unit,
  );
  const hieuLuc = useSelector(
    state => state.document.documentSlice?.gionglnData?.hieuluc,
  );

  return (
    <DocumentTemplate
      screenName={'Giống Lâm nghiệp'}
      navigation={navigation}
      data={data}
      groupOption={groupOption}
      yearOption={yearOption}
      unitOption={unitOption}
      hieuLuc={hieuLuc}
    />
  );
};

export default TreeTypeScreen;
