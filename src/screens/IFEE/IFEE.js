import React, {useLayoutEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import DocumentTemplate from '../../components/DocumentTemplate';
import {getDocument, getIFEEDocument} from '../../redux/apiRequest';

const IFEE = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [groupOption, setGroupOption] = useState([]);
  const [yearOption, setYearOption] = useState([]);
  const [unitOption, setUnitOption] = useState(null);
  const [hieuLuc, setHieuLuc] = useState(null);

  const fetchDocument = async () => {
    const res = await getIFEEDocument();

    setData(res.data);
    setGroupOption(res.category);
    setYearOption(res.year);
    setLoading(false);
  };

  useLayoutEffect(() => {
    fetchDocument();
  }, []);

  return (
    <DocumentTemplate
      loading={loading}
      screenName={'Viện Sinh thái rừng và Môi trường'}
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

export default IFEE;
