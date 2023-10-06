import React from 'react';
import DocumentTemplate from '../../components/DocumentTemplate';
import {useSelector} from 'react-redux';

const DocumentListScreen = ({navigation}) => {
  const data = useSelector(
    state => state.document.documentSlice?.dvmtrData?.data,
  );
  const groupOption = useSelector(
    state => state.document.documentSlice?.dvmtrData?.category,
  );
  const yearOption = useSelector(
    state => state.document.documentSlice?.dvmtrData?.year,
  );
  const unitOption = useSelector(
    state => state.document.documentSlice?.dvmtrData?.unit,
  );
  const hieuLuc = useSelector(
    state => state.document.documentSlice?.dvmtrData?.hieuluc,
  );

  return (
    <DocumentTemplate
      screenName={'Quỹ bảo vệ phát triển rừng'}
      navigation={navigation}
      data={data}
      groupOption={groupOption}
      yearOption={yearOption}
      unitOption={unitOption}
      hieuLuc={hieuLuc}
    />
  );
};

export default DocumentListScreen;
