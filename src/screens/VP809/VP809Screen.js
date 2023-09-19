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
  const yearOption = useSelector(
    state => state.document.documentSlice?.VP809Data?.year,
  );
  const unitOption = useSelector(
    state => state.document.documentSlice?.VP809Data?.unit,
  );
  const hieuLuc = useSelector(
    state => state.document.documentSlice?.VP809Data?.hieuluc,
  );

  return (
    <DocumentTemplate
      screenName={'Văn phòng 809'}
      navigation={navigation}
      data={data}
      groupOption={groupOption}
      yearOption={yearOption}
      unitOption={unitOption}
      hieuLuc={hieuLuc}
    />
  );
};

export default VP809Screen;
