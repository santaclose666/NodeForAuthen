import React, {useLayoutEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import DocumentTemplate from '../../components/DocumentTemplate';
import {getDocument} from '../../redux/apiRequest';

const ForestPrice = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const data = useSelector(
    state => state.document.documentSlice?.data.kkr?.data,
  );
  const groupOption = useSelector(
    state => state.document.documentSlice?.data.kkr?.category,
  );
  const yearOption = useSelector(
    state => state.document.documentSlice?.data.kkr?.year,
  );
  const unitOption = useSelector(
    state => state.document.documentSlice?.data.kkr?.unit,
  );
  const hieuLuc = useSelector(
    state => state.document.documentSlice?.data.kkr?.hieuluc,
  );

  const fetchDocument = async () => {
    const name = 'kkr';
    await getDocument(dispatch, name);

    setLoading(false);
  };

  useLayoutEffect(() => {
    fetchDocument();
  }, []);

  return (
    <DocumentTemplate
      loading={loading}
      screenName={'Kiểm kê rừng'}
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

export default ForestPrice;
