import React, {useLayoutEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import DocumentTemplate from '../../components/DocumentTemplate';
import {getDocument} from '../../redux/apiRequest';

const CPFESScreen = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const data = useSelector(
    state => state.document.documentSlice?.data?.CPFES?.data,
  );
  const groupOption = useSelector(
    state => state.document.documentSlice?.data?.CPFES?.category,
  );
  const yearOption = useSelector(
    state => state.document.documentSlice?.data?.CPFES?.year,
  );
  const unitOption = useSelector(
    state => state.document.documentSlice?.data?.CPFES?.unit,
  );
  const hieuLuc = useSelector(
    state => state.document.documentSlice?.data?.CPFES?.hieuluc,
  );

  const fetchDocument = async () => {
    const name = 'CPFES';
    await getDocument(dispatch, name);

    setLoading(false);
  };

  useLayoutEffect(() => {
    fetchDocument();
  }, []);

  return (
    <DocumentTemplate
      loading={loading}
      screenName={'CPFES'}
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

export default CPFESScreen;
