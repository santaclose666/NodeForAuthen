import React, {useLayoutEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import DocumentTemplate from '../../components/DocumentTemplate';
import {getDocument} from '../../redux/apiRequest';

const TcvnScreen = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const data = useSelector(
    state => state.document.documentSlice?.data.tcvn?.data,
  );
  const groupOption = useSelector(
    state => state.document.documentSlice?.data.tcvn?.category,
  );
  const yearOption = useSelector(
    state => state.document.documentSlice?.data.tcvn?.year,
  );
  const unitOption = useSelector(
    state => state.document.documentSlice?.data.tcvn?.unit,
  );
  const hieuLuc = useSelector(
    state => state.document.documentSlice?.data.tcvn?.hieuluc,
  );

  const fetchDocument = async () => {
    const name = 'tcvn';
    await getDocument(dispatch, name);

    setLoading(false);
  };

  useLayoutEffect(() => {
    fetchDocument();
  }, []);

  return (
    <DocumentTemplate
      loading={loading}
      screenName={'Tiêu chuẩn Việt Nam'}
      navigation={navigation}
      data={data}
      groupOption={groupOption}
      yearOption={yearOption}
      unitOption={unitOption}
      hieuLuc={hieuLuc}
      resetFunction={fetchDocument}
    />
  );
};

export default TcvnScreen;
