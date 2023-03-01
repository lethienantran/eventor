import {View, Text, Pressable, ImageBackground, FlatList} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {RFPercentage} from 'react-native-responsive-fontsize';
import React, {useState, useContext, useEffect} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import eventsBanner from '../../../assets/images/eventsBanner.png';
import {DBContext} from '../../../App';
import Logo from '../../components/Logo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';

const HomeScreen = () => {
  //variables initialization
  //using db in screen/components
  const db = useContext(DBContext);

  //call useNavigation to be able to navigate around
  const navigation = useNavigation();

  //data and setData useState for setting data
  const [data, setData] = useState([]);

  //totalEvents, setTotalEvents useState for display TotalNumberOfEvents to screen
  const [totalEvent, setTotalEvent] = useState();

  //quote and set quote useState for calendar
  const [quote, setQuote] = useState('');
  //theDayOfWeek and setTheDayOfWeek for calendar
  const [theDayOfWeek, setTheDayOfWeek] = useState('');

  //quotes for calendar to be display everyday
  const quoteArray = [
    '"Happy Holy Day! \n God bless you."',
    '"May your \n Monday \n be productive."',
    '"Tuesday is \n my favorite \n day of the week."',
    '"Time to enjoy \n worry-free \n Wednesday!"',
    '"Tomorrow \n is Friyay!"',
    '"Thank God! \n It is weekend."',
    '"Saturday is a day \n for relaxation \n  and family"',
  ];

  // Get the current date
  const today = new Date();
  // Get the day of the week (0-6, where 0 is Sunday and 6 is Saturday)
  const dayOfWeek = today.getDay();
  //Get the day of the month (1-31)
  const dayOfMonth = today.getDate();

  //function declaration:
  //use when add button is pressed, use to navigate to AddEventScreen screen
  const addButtonPressed = () => {
    navigation.navigate('AddEventScreen');
  };

  //use when see all button is pressed, use to navigate to FilteredEventScreen screen
  const seeAllButtonPressed = () => {
    navigation.navigate('FilteredEventScreen');
  };

  //use when an event item is pressed to store selectedEventID into asyncstorage
  const onEventPressed = async selectedEventID => {
    // navigation.navigate('EventDetailScreen');
    AsyncStorage.setItem('selectedEventID', selectedEventID.toString())
      .then(() => {
        console.log('SelectedEventID: ' + selectedEventID.toString());
        navigation.navigate('EventDetailScreen');
      })
      .catch(error => {
        console.error(
          'Error',
          'Could not save SelectedEventID to AsyncStorage!',
        );
        console.error(error);
      });
  };

  //checkDay to display on Screen
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

  //run query, checkDay
  useEffect(() => {
    checkDay();
    db.transaction(tx => {
      //TODO: CHANGE THIS TO UPCOMING INPROGRESS EVENT QUERY ORDER BY eventStartTime
      //for populating in progress event
      tx.executeSql(
        'SELECT * FROM events WHERE  eventProgress < 100',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
          setData(temp);
        },
      );
      //for display totalEvent
      tx.executeSql(
        'SELECT COUNT(*) as count FROM events',
        [],
        (tx, results) => {
          const count = results.rows.item(0).count;
          setTotalEvent(count);
        },
      );
    });
  });

  //listItemView for FlatList (item/cards) show on screen
  const listItemView = item => {
    //format dateTime
    const eventStartTime = moment(new Date(item.eventStartTime)).format(
      'MM/DD/YYYY HH:mm',
    );
    const eventEndTime = moment(new Date(item.eventEndTime)).format(
      'MM/DD/YYYY HH:mm',
    );
    return (
      <TouchableOpacity
        key={item.eventID}
        style={styles.feedItem}
        activeOpacity={0.7}
        onPress={() => onEventPressed(item.eventID)}>
        <ImageBackground
          source={item.eventImage !== null ? {uri: `data:image/jpeg;base64,${item.eventImage}`} : (require('../../../assets/images/eventsBanner.png'))}
          resizeMode="cover"
          style={{flex: 1}}
          imageStyle={styles.itemImage}
          blurRadius={5}>
          <View style={styles.dateTimeContainer}>
            <Text style={styles.dateTimeText}>
              {eventStartTime} - {eventEndTime}
            </Text>
          </View>
          <View style={styles.titleItemContainer}>
            <Text style={styles.titleItemText}>{item.eventName}</Text>
          </View>
          <View style={styles.progressionItemContainer}>
            <Text style={styles.progressionItemText}>Progress:</Text>
            <Text style={styles.displayProgressionItemText}>
              {item.eventProgress}%
            </Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.root}>
      {/* Logo of The page */}
      <Logo />
      {/* content of the Page */}
      <View style={styles.content}>
        {/* first half content of page - calendar, see all button, total events display */}
        <View style={styles.detailContainer}>
          {/* calendar */}
          <View style={styles.calendarContainer}>
            <View style={styles.dayContainer}>
              <Text style={styles.dayText}>{theDayOfWeek}</Text>
              <Text style={styles.dateText}>{dayOfMonth}</Text>
            </View>
            <View style={styles.quoteContainer}>
              <Text style={styles.quoteText}>{quote}</Text>
            </View>
          </View>
          {/* see all and total Events display */}
          <View style={styles.statsContainer}>
            <Pressable
              onPress={seeAllButtonPressed}
              style={styles.seeAllContainer}>
              <View style={styles.seeAllTextContainer}>
                <Text style={styles.seeAllText}>See All</Text>
              </View>
              <View style={styles.seeAllIconContainer}>
                <FontAwesome5
                  name="arrow-right"
                  style={styles.rightArrowIcon}
                  color={'white'}
                />
              </View>
            </Pressable>

            <View style={styles.totalEventContainer}>
              <Text style={styles.totalText}>Total</Text>
              <Text style={styles.eventText}>Events:</Text>
              <Text style={styles.numberTotalText}>{totalEvent}</Text>
            </View>
          </View>
        </View>
        {/* In Progress Title */}
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
        {/* Display events from database*/}
        <View style={styles.feedContainer}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => listItemView(item)}
          />
        </View>
      </View>
      {/* Add event button navigate to add event page*/}
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
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
  content: {
    width: '99%',
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
    // backgroundColor:'green',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  quoteText: {
    marginBottom: '7@ms',
    marginRight: '10@ms',
    textAlign: 'right',
    textAlignVertical: 'bottom',
    // alignSelf: 'flex-end',
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
  inProgressTitleContainer: {
    width: '100%',
    height: '10%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inProgressTextContainer: {
    width: '86%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  inProgressText: {
    fontSize: RFPercentage(3.75),
    marginTop: '6@vs',
    marginLeft: '20@ms',
    color: 'black',
    fontFamily: 'OpenSans-SemiBold',
  },
  inProgressIconContainer: {
    width: '14%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  inProgressIcon: {
    fontSize: RFPercentage(3.75),
    marginTop: '8@vs',
    marginLeft: '19@ms',
  },
  feedContainer: {
    width: '100%',
    height: '40%',
  },
  feedItem: {
    alignSelf: 'center',
    marginVertical: '15@vs',
    width: '86%',
    height: '95@vs',
    backgroundColor: '#777B7E',
    borderRadius: '25@ms',
  },
  itemImage: {
    borderRadius: '25@ms',
    opacity: 0.4,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    width: '100%',
    height: '22%',
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
    height: '42%',
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
