import React from 'react';
import {useSelector} from 'react-redux';
import DocumentTemplate from '../../components/DocumentTemplate';

const TcvnScreen = ({navigation}) => {
  const data = useSelector(
    state => state.document.documentSlice?.tcvnData?.data,
  );
  const groupOption = useSelector(
    state => state.document.documentSlice?.tcvnData?.category,
  );
  const yearOption = useSelector(
    state => state.document.documentSlice?.tcvnData?.year,
  );
  const unitOption = useSelector(
    state => state.document.documentSlice?.tcvnData?.unit,
  );
  const hieuLuc = useSelector(
    state => state.document.documentSlice?.tcvnData?.hieuluc,
  );

  return (
    <DocumentTemplate
      screenName={'Tiêu chuẩn Việt Nam'}
      navigation={navigation}
      data={data}
      groupOption={groupOption}
      yearOption={yearOption}
      unitOption={unitOption}
      hieuLuc={hieuLuc}
    />
  );
};

export default TcvnScreen;
