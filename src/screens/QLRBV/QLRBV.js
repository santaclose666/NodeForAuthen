import React, {useLayoutEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import DocumentTemplate from '../../components/DocumentTemplate';
import {getDocument} from '../../redux/apiRequest';

const QLRBVScreen = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const data = useSelector(
    state => state.document.documentSlice?.data.qlrbv?.data,
  );
  const groupOption = useSelector(
    state => state.document.documentSlice?.data.qlrbv?.category,
  );
  const yearOption = useSelector(
    state => state.document.documentSlice?.data.qlrbv?.year,
  );
  const unitOption = useSelector(
    state => state.document.documentSlice?.data.qlrbv?.unit,
  );
  const hieuLuc = useSelector(
    state => state.document.documentSlice?.data.qlrbv?.hieuluc,
  );

  const fetchDocument = async () => {
    const name = 'qlrbv';
    await getDocument(dispatch, name);

    setLoading(false);
  };

  useLayoutEffect(() => {
    fetchDocument();
  }, []);

  return (
    <DocumentTemplate
      loading={loading}
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
