import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Touchable,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import Images from '../../contants/Images';
import Fonts from '../../contants/Fonts';
import Colors from '../../contants/Colors';
import Dimension from '../../contants/Dimension';
import Header from '../../components/Header';

const DetailWorkShedule = ({ navigation, route }) => {

    const [eachWork, setWorkData] = useState(
        {
            type: 'Lịch công tác',
            location: 'Hà Tĩnh',
            fromDay: '08/08/2022',
            toDay: '10/08/2022',
            clue: 'Lê Sỹ Doanh',
            ingrediment: 'Mr Doanh, Khang, Huân',
            programName: '2023 - Đánh giá hiệu quả của việc sử dụng tiền DVMTR cho công tác quản lý rừng bền vững của chủ rừng là tổ chức',
            content: 'Họp thống nhất báo cáo khởi động và khảo sát hiện trường',
            note: 'Họp thống nhất báo cáo khởi động và khảo sát hiện trường',
            status: 'Pending'
        })

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Chi tiết công tác" navigation={navigation} />
            <ScrollView style={{ flex: 1, marginTop: Dimension.setHeight(2) }}>
                <View
                    style={styles.containerEachLine}>
                    <View style={{
                        flexDirection: 'row',
                        backgroundColor: '#FEF4EB',
                        borderRadius: 5,
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 5,
                        marginBottom: 10,
                        width: '30%',
                        alignSelf: 'flex-end'
                    }}>
                        <Image source={eachWork.status === 'Pending' ? Images.pending : Images.approve}
                            style={{
                                height: 16,
                                width: 16,
                                marginRight: Dimension.setWidth(1),
                                tintColor: eachWork.status === 'Pending' ? '#F7A96D' : Colors.DEFAULT_GREEN,
                            }} />
                        <Text style={{
                            color: eachWork.status === 'Pending' ? '#F7A96D' : Colors.DEFAULT_GREEN
                        }}>{eachWork.status}</Text>
                    </View>

                    <View style={{ marginVertical: 5, }}>
                        <View style={{ flexDirection: 'row', alignItems:'center' }}>
                            <Image source={Images.location1}
                                style={styles.image} />
                            <Text style={styles.title}>Địa điểm:</Text>
                            <Text style={{
                                color: '#747476',
                                fontSize: 15,
                                fontFamily: Fonts.SF_MEDIUM,
                                marginLeft: 10,
                            }}>{eachWork.location}</Text>
                        </View>

                    </View>

                    <View style={{ marginVertical: 5, }}>
                        <View style={{ flexDirection: 'row',alignItems:'center' }}>
                            <Image source={Images.schedule}
                                style={styles.image} />
                            <Text style={styles.title}>Thời gian:</Text>
                            <Text style={{
                                color: '#747476',
                                fontSize: 15,
                                fontFamily: Fonts.SF_MEDIUM,
                                marginLeft: 10,
                            }}>{eachWork.fromDay} - {eachWork.toDay}</Text>
                        </View>
                        
                    </View>

                    <View style={{ marginVertical: 5, }}>
                        <View style={{ flexDirection: 'row', }}>
                            <Image source={Images.program}
                                style={styles.image} />
                            <Text style={styles.title}>Chương trình:</Text>
                        </View>
                        <Text style={styles.content}>{eachWork.programName}</Text>
                    </View>

                    <View style={{ marginVertical: 5, }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={Images.content}
                                style={styles.image} />
                            <Text style={styles.title}>Nội dung:</Text>
                        </View>
                        <Text style={styles.content}>{eachWork.content}</Text>
                    </View>

                    <View style={{ marginVertical: 5, }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={Images.clue}
                                style={styles.image} />
                            <Text style={styles.title}>Đầu mối:</Text>
                        </View>
                        <Text style={styles.content}>{eachWork.clue}</Text>
                    </View>

                    <View style={{ marginVertical: 5, }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={Images.include}
                                style={styles.image} />
                            <Text style={styles.title}>Thành phần:</Text>
                        </View>
                        <Text style={styles.content}>{eachWork.ingrediment}</Text>
                    </View>

                    <View style={{ marginVertical: 5, }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={Images.note}
                                style={styles.image} />
                            <Text style={styles.title}>Ghi chú:</Text>
                        </View>
                        <Text style={styles.content}>{eachWork.note}</Text>
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#b6c987',
    },
    containerEachLine: {
        marginBottom: Dimension.setHeight(2),
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e6e6e6',
        borderRadius: 12,
        paddingVertical: Dimension.setHeight(3),
        paddingHorizontal: Dimension.setWidth(3),
        marginHorizontal: Dimension.setWidth(3),
    },
    title: {
        fontSize: 16,
        fontFamily: Fonts.SF_SEMIBOLD,
    },
    content: {
        color: '#747476',
        fontSize: 15,
        fontFamily: Fonts.SF_MEDIUM,
        marginLeft: 30,
    },

    value: {
        flex: 1,
        fontSize: 15,
        fontWeight: 'bold',
        marginLeft: 5,
    },
    image: {
        height: 25,
        width: 25,
        marginRight: 5
    }
});

export default DetailWorkShedule;
