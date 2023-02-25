import {View, Text, Pressable, ImageBackground, Image} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {RFPercentage} from 'react-native-responsive-fontsize';
import React, {useState, useEffect, useContext} from 'react';
import Logo from '../../components/Logo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import eventsBanner from '../../../assets/images/eventsBanner.png';
import {DBContext} from '../../../App';
const HomeScreen = () => {
  const db = useContext(DBContext);
  const [data, setData] = useState([]);
  const [quote, setQuote] = useState('');
  const [theDayOfWeek, setTheDayOfWeek] = useState('');

  const quoteArray = [
    '"Happy Holy Day! \n God bless you."',
    '"May your \n Monday \n be productive."',
    '"Tuesday is \n my favorite \n day of the week."',
    '"Time to enjoy \n worry-free \n Wednesday!"',
    '"Tomorrow \n is Friyay!"',
    '"Thank God! \n It is weekend."',
    '"Saturday is a day \n for relaxation \n  and family"',
  ];

  //call useNavigation to be able to navigate around
  const navigation = useNavigation();

  const addButtonPressed = () => {
    navigation.navigate('AddEventScreen');
  };

  // Get the current date
  const today = new Date();

  // Get the day of the week (0-6, where 0 is Sunday and 6 is Saturday)
  const dayOfWeek = today.getDay();
  //Get the day of the month (1-31)
  const dayOfMonth = today.getDate();
  const checkDay = () => {
    if (dayOfWeek === 0) {
      setQuote(quoteArray[0]);
      setTheDayOfWeek('SUNDAY');
    } else if (dayOfWeek === 1) {
      setQuote(quoteArray[1]);
      setTheDayOfWeek('MONDAY');
    } else if (dayOfWeek === 2) {
      setQuote(quoteArray[2]);
      setTheDayOfWeek('TUESDAY');
    } else if (dayOfWeek === 3) {
      setQuote(quoteArray[3]);
      setTheDayOfWeek('WEDNESDAY');
    } else if (dayOfWeek === 4) {
      setQuote(quoteArray[4]);
      setTheDayOfWeek('THURSDAY');
    } else if (dayOfWeek === 5) {
      setQuote(quoteArray[5]);
      setTheDayOfWeek('FRIDAY');
    } else if (dayOfWeek === 6) {
      setQuote(quoteArray[6]);
      setTheDayOfWeek('SATURDAY');
    }
  };

  useEffect(() => {
    checkDay();
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM events where events.eventStatus = ?',
        ['inprogress'],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
          setData(temp);
        },
      );
    });
  });

  return (
    <View style={styles.root}>
      <Logo />
      <View style={styles.content}>
        <View style={styles.detailContainer}>
          <View style={styles.calendarContainer}>
            <View style={styles.dayContainer}>
              <Text style={styles.dayText}>{theDayOfWeek}</Text>
              <Text style={styles.dateText}>{dayOfMonth}</Text>
            </View>
            <View style={styles.quoteContainer}>
              <Text style={styles.quoteText}>{quote}</Text>
            </View>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.seeAllContainer}>
              <View style={styles.seeAllTextContainer}>
                <Pressable>
                  <Text style={styles.seeAllText}>See All</Text>
                </Pressable>
              </View>
              <View style={styles.seeAllIconContainer}>
                <Pressable>
                  <FontAwesome5
                    name="arrow-right"
                    style={styles.rightArrowIcon}
                    color={'white'}
                  />
                </Pressable>
              </View>
            </View>
            <View style={styles.totalEventContainer}>
              <Text style={styles.totalText}>Total</Text>
              <Text style={styles.eventText}>Events:</Text>
              <Text style={styles.numberTotalText}>52</Text>
            </View>
          </View>
        </View>
        <View style={styles.secondHalfDetailContainer}>
          <View style={styles.inProgressTitleContainer}>
            <View style={styles.inProgressTextContainer}>
              <Text style={styles.inProgressText}> In-Progress Events </Text>
            </View>
            <View style={styles.inProgressIconContainer}>
              <Pressable>
                <FontAwesome
                  name="angle-right"
                  style={styles.inProgressIcon}
                  color={'black'}
                />
              </Pressable>
            </View>
          </View>
          <View style={styles.feedContainer}>
            <View style={styles.feedItem}>
              <ImageBackground
                source={eventsBanner}
                resizeMode="cover"
                style={{flex: 1}}
                imageStyle={styles.itemImage}
                blurRadius={5}>
                <View style={styles.dateTimeContainer}>
                  <Text style={styles.dateTimeText}>2/26/2023 8:00</Text>
                </View>
                <View style={styles.titleItemContainer}>
                  <Text style={styles.titleItemText}>
                    Brain Injury Art Show
                  </Text>
                </View>
                <View style={styles.progressionItemContainer}>
                  <Text style={styles.progressionItemText}>Progress:</Text>
                  <Text style={styles.displayProgressionItemText}>67%</Text>
                </View>
              </ImageBackground>
            </View>
            <View style={styles.feedItem}>
              <ImageBackground
                source={eventsBanner}
                resizeMode="cover"
                style={{flex: 1}}
                imageStyle={styles.itemImage}
                blurRadius={5}>
                <View style={styles.dateTimeContainer}>
                  <Text style={styles.dateTimeText}>2/26/2023 8:00</Text>
                </View>
                <View style={styles.titleItemContainer}>
                  <Text style={styles.titleItemText}>
                    Brain Injury Art Show
                  </Text>
                </View>
                <View style={styles.progressionItemContainer}>
                  <Text style={styles.progressionItemText}>Progress:</Text>
                  <Text style={styles.displayProgressionItemText}>67%</Text>
                </View>
              </ImageBackground>
            </View>
          </View>
        </View>
      </View>
      <Pressable onPress={addButtonPressed}>
        <MaterialCommunityIcons
          name="plus-circle"
          style={styles.addButtonIcon}
          color={'#FF3008'}
        />
      </Pressable>
    </View>
  );
};
const styles = ScaledSheet.create({
  root: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  content: {
    width: '100%',
    height: '91%',
  },
  addButtonIcon: {
    fontSize: RFPercentage(13.5),
    marginRight: '5@ms',
    position: 'absolute',
    backgroundColor: 'white',
    bottom: '7@vs',
    borderRadius: '70@ms',
    borderColor: 1,
    borderWidth: 1,
    right: '20@ms',
  },
  detailContainer: {
    width: '100%',
    height: '39%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  calendarContainer: {
    width: '45%',
    height: '100%',
    backgroundColor: 'white',
    marginLeft: '20@ms',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 20,
    flexDirection: 'column',
  },
  dayContainer: {
    width: '100%',
    height: '60%',
  },
  dayText: {
    fontSize: RFPercentage(2.5),
    fontFamily: 'Inter-SemiBold',
    color: '#FF3008',
    marginLeft: '12@ms',
    marginTop: '10@vs',
  },
  dateText: {
    fontSize: RFPercentage(5.5),
    fontFamily: 'Inter-Regular',
    color: 'black',
    marginLeft: '12@ms',
  },
  quoteContainer: {
    width: '100%',
    height: '40%',
  },
  quoteText: {
    marginTop: '20@vs',
    marginRight: '7@ms',
    textAlign: 'right',
    alignSelf: 'flex-end',
    fontFamily: 'Inter-Medium',
    fontStyle: 'italic',
    color: 'black',
    fontSize: RFPercentage(2.25),
  },
  statsContainer: {
    width: '40%',
    height: '100%',
    marginRight: '20@ms',
    flexDirection: 'column',
  },
  seeAllContainer: {
    width: '100%',
    height: '30%',
    backgroundColor: 'black',
    borderRadius: '20@ms',
    flexDirection: 'row',
  },
  seeAllTextContainer: {
    width: '75%',
    height: '100%',
    justifyContent: 'center',
  },
  seeAllText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: RFPercentage(2.75),
    color: 'white',
    marginLeft: '20@ms',
    marginBottom: '5@vs',
  },
  seeAllIconContainer: {
    width: '25%',
    height: '100%',
    justifyContent: 'center',
  },
  rightArrowIcon: {
    fontSize: RFPercentage(3),
    marginBottom: '2@vs',
    marginLeft: '4@ms',
  },
  totalEventContainer: {
    width: '100%',
    height: '70%',
    flexDirection: 'column',
  },
  totalText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: RFPercentage(5.75),
    marginTop: '10@vs',
    marginLeft: '6@ms',
    color: 'black',
  },
  eventText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: RFPercentage(5.75),
    marginLeft: '4@ms',
    color: 'black',
  },
  numberTotalText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: RFPercentage(6.9),
    marginLeft: '4@ms',
    color: '#FF3008',
  },
  secondHalfDetailContainer: {
    width: '100%',
    height: '61%',
  },
  inProgressTitleContainer: {
    width: '100%',
    height: '17%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inProgressTextContainer: {
    width: '86%',
    height: '100%',
  },
  inProgressText: {
    fontSize: RFPercentage(3.75),
    marginTop: '28@vs',
    marginLeft: '20@ms',
    color: 'black',
    fontFamily: 'OpenSans-SemiBold',
  },
  inProgressIconContainer: {
    width: '14%',
    height: '100%',
  },
  inProgressIcon: {
    fontSize: RFPercentage(3.75),
    marginTop: '32@vs',
    marginLeft: '19@ms',
  },
  feedContainer: {
    width: '100%',
    height: '65%',
    alignItems: 'center',
  },
  feedItem: {
    width: '86%',
    height: '43%',
    backgroundColor: 'grey',
    borderRadius: '25@ms',
    marginTop: '13@vs',
  },
  itemImage: {
    borderRadius: '25@ms',
    opacity: 0.4,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    width: '100%',
    height: '20%',
    justifyContent: 'flex-end',
  },
  dateTimeText: {
    marginRight: '20@ms',
    marginTop: '5@vs',
    color: 'white',
    fontFamily: 'Inter-Regular',
    fontSize: RFPercentage(2),
  },
  titleItemContainer: {
    width: '100%',
    height: '44 %',
    justifyContent: 'flex-end',
  },
  titleItemText: {
    marginLeft: '20@ms',
    fontFamily: 'Inter-SemiBold',
    color: 'white',
    fontSize: RFPercentage(2.2),
  },
  progressionItemContainer: {
    width: '100%',
    height: '56%',
    flexDirection: 'row',
  },
  progressionItemText: {
    marginLeft: '20@ms',
    fontFamily: 'Inter-Regular',
    color: 'white',
    fontSize: RFPercentage(1.8),
  },
  displayProgressionItemText: {
    marginLeft: '2@ms',
    fontFamily: 'Inter-Regular',
    color: 'white',
    fontSize: RFPercentage(1.8),
  },
});
export default HomeScreen;
