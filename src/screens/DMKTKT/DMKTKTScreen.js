import React, {useLayoutEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import DocumentTemplate from '../../components/DocumentTemplate';
import {getDocument} from '../../redux/apiRequest';

const DMKTKTScreen = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const data = useSelector(
    state => state.document.documentSlice?.data.dinhmuc_ktkt?.data,
  );
  const groupOption = useSelector(
    state => state.document.documentSlice?.data.dinhmuc_ktkt?.category,
  );
  const yearOption = useSelector(
    state => state.document.documentSlice?.data.dinhmuc_ktkt?.year,
  );
  const unitOption = useSelector(
    state => state.document.documentSlice?.data.dinhmuc_ktkt?.unit,
  );
  const hieuLuc = useSelector(
    state => state.document.documentSlice?.data.dinhmuc_ktkt?.hieuluc,
  );

  const fetchDocument = async () => {
    const name = 'dinhmuc_ktkt';
    await getDocument(dispatch, name);

    setLoading(false);
  };

  useLayoutEffect(() => {
    fetchDocument();
  }, []);

  return (
    <DocumentTemplate
      loading={loading}
      screenName={'Định mức Kinh tế Kĩ thuật'}
      navigation={navigation}
      data={data}
      groupOption={groupOption}
      yearOption={yearOption}
      unitOption={unitOption}
      hieuLuc={hieuLuc}
    />
  );
};

export default DMKTKTScreen;
