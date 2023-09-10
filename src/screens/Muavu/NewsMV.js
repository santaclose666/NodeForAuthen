import React, {useState, useLayoutEffect} from 'react';
import NewsTemplate from '../../components/NewsTemplate';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import {getAllNewsMV} from '../../redux/apiRequest';

const NewsMV = ({navigation}) => {
  const dispatch = useDispatch();
  const newsArr = useSelector(state => state.newsMv.newMvSlice?.data);
  const fetchAllNewsMv = async () => {
    try {
      await getAllNewsMV(dispatch);
    } catch (error) {
      console.log(error);
    }
  };

  useLayoutEffect(() => {
    fetchAllNewsMv();
  }, []);

  return (
    <NewsTemplate
      screenName={'Tin tức Mùa vụ'}
      navigation={navigation}
      newsArr={newsArr}
    />
  );
};

export default NewsMV;
