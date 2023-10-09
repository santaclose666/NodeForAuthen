import React, {useLayoutEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import DocumentTemplate from '../../components/DocumentTemplate';
import {getDocument} from '../../redux/apiRequest';

const ForestPrice = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const data = useSelector(
    state => state.document.documentSlice?.data.dinhgiarung?.data,
  );
  const groupOption = useSelector(
    state => state.document.documentSlice?.data.dinhgiarung?.category,
  );
  const yearOption = useSelector(
    state => state.document.documentSlice?.data.dinhgiarung?.year,
  );
  const unitOption = useSelector(
    state => state.document.documentSlice?.data.dinhgiarung?.unit,
  );
  const hieuLuc = useSelector(
    state => state.document.documentSlice?.data.dinhgiarung?.hieuluc,
  );

  const fetchDocument = async () => {
    const name = 'dinhgiarung';
    await getDocument(dispatch, name);

    setLoading(false);
  };

  useLayoutEffect(() => {
    fetchDocument();
  }, []);

  return (
    <DocumentTemplate
      loading={loading}
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
