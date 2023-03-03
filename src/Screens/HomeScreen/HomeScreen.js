import {View, Text, Pressable, ImageBackground, FlatList} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {RFPercentage} from 'react-native-responsive-fontsize';
import React, {useState, useEffect} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import Logo from '../../components/Logo';
import {TouchableOpacity} from 'react-native-gesture-handler';
import SQLite from 'react-native-sqlite-storage';
import {useIsFocused} from '@react-navigation/native';
import Loading from '../../components/Loading';
import Feather from 'react-native-vector-icons/Feather';
const HomeScreen = () => {
  //isLoading and setIsLoading useState for loading screen if database is still loading
  const [isLoading, setIsLoading] = useState(true);

  //for checking if user is currently at this screen
  const isFocused = useIsFocused();

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

  // Get the current date
  const today = new Date();

  // Get the day of the week (0-6, where 0 is Sunday and 6 is Saturday)
  const dayOfWeek = today.getDay();

  //Get the day of the month (1-31)
  const dayOfMonth = today.getDate();

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

  //use when add button is pressed, use to navigate to AddEventScreen screen
  const addButtonPressed = () => {
    navigation.navigate('AddEventScreen');
  };

  //use when see all button is pressed, use to navigate to FilteredEventScreen screen
  const seeAllButtonPressed = () => {
    navigation.navigate('FilteredEventScreen', {filterCase: 'All'});
  };

  //use when an event item is pressed to store selectedEventID into asyncstorage
  const onEventPressed = selectedEventID => {
    console.log('HomeScreen: Go to eventID - ' + selectedEventID);
    navigation.navigate('EventDetailScreen', {eventID: selectedEventID});
  };

  //checkDay to display on Screen
  const setDayAndQuoteForCalendar = () => {
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
  const onInProgressPressed = () => {
    navigation.navigate('FilteredEventScreen', {filterCase: 'In-Progress'});
  };
  //run query, checkDay
  useEffect(() => {
    //set day and quote for calendar when app loads up
    setDayAndQuoteForCalendar();
    //if screen is focus, open db - use Loading Component, closeDB - not use Loading Component
    if (isFocused) {
      //set isLoading to true first, because we want to use the Loading Components while db is open and load up data
      setIsLoading(true);
      //open sqlite database
      const db = SQLite.openDatabase(
        {
          name: 'eventorDB.db',
          createFromLocation: 1,
        },
        () => {
          console.log('HomeScreen: Database opened successfully');
          //open the transaction
          db.transaction(tx => {
            //get all current in progress event and order by the most recent upcoming event
            tx.executeSql(
              //query
              `SELECT * FROM events WHERE eventProgress < 100 AND eventEndTime >= strftime('%Y-%m-%d %H-%M','now') ORDER BY eventStartTime ASC`,
              //nothing to pass in the arguments
              [],
              //if successfully get data then set data = that results by using a temp array
              (tx, results) => {
                //intiallize temporary array so that we can set it to data array
                var temp = [];
                //loop all of the results row and push it into temp array
                for (let i = 0; i < results.rows.length; ++i) {
                  temp.push(results.rows.item(i));
                }
                //setData (set data array) to temp
                setData(temp);
              },
              //if not successfully get data, then print out error
              error => {
                console.log(
                  'Error in HomeScreen while get all current in-progress event and order by the most recent upcoming event, error: ' +
                    error,
                );
              },
            );
            //get total events that users have
            tx.executeSql(
              //query
              'SELECT COUNT(*) as count FROM events',
              //nothing to pass in the argument
              [],
              /*if successfully get total events that users have then set a count variable to setTotalEvent 
              so that totalEvent can have value of total event user currently have*/
              (tx, results) => {
                //count variable which is equal to the total rows of results from the query
                const count = results.rows.item(0).count;
                //setTotalEvent equal to count
                setTotalEvent(count);
                //after finish all of the database population, we set isLoading back to false, so that it can display HomeScreen to users
                setIsLoading(false);
                //print to notice that database is close
                console.log('HomeScreen: Database closed.');
                //close database, we have to put it after all, because once db is close, all of the other code inside db transaction is stopped.
                db.close();
              },
              /*if not successfully get total events that user have then there should be an error in the query or database
              so we print out the data */
              error => {
                console.log(
                  "Error in HomeScreen while get total events that user has, query 'SELECT COUNT(*)', error: " +
                    error,
                );
              },
            );
          });
        },
        //if there is error when open database (such as no database) then print the error
        error => {
          console.log(error);
        },
      );
    }
    /*
      isFocused: we want to render everytime isFocused is changed, so that all data should be up to date
    */
  }, [isFocused]);

  //listItemView for FlatList (item/cards) show on screen
  const listItemView = item => {
    //format dateTime
    const eventStartTime = moment(new Date(item.eventStartTime)).format(
      'MM/DD/YYYY HH:mm',
    );
    const eventEndTime = moment(new Date(item.eventEndTime)).format(
      'MM/DD/YYYY HH:mm',
    );
    //render/return View
    return (
      //In order to do opacity change on touch/press
      <TouchableOpacity
        key={item.eventID}
        style={styles.feedItem}
        activeOpacity={0.7}
        onPress={() => onEventPressed(item.eventID)}>
        {/* Image Background for each item of flatList, if eventImage != null then we use eventImage in database, else we use broken image*/}
        <ImageBackground
          source={
            item.eventImage !== null
              ? {uri: `data:image/jpeg;base64,${item.eventImage}`}
              : require('../../../assets/images/eventsBanner.png')
          }
          resizeMode="cover"
          style={{flex: 1}}
          imageStyle={styles.itemImage}
          blurRadius={5}>
          {/* container for dateTime inside the imageBackground/the itemContainer of the item in flatlist, iykyk haha*/}
          <View style={styles.dateTimeContainer}>
            {/* Text is set to be starTime - endTime*/}
            <Text style={styles.dateTimeText}>
              {eventStartTime} - {eventEndTime}
            </Text>
          </View>
          {/* name of the event inside of the imageBackground/the itemContainer of the item in flatlist, iykyk haha*/}
          <View style={styles.titleItemContainer}>
            {/* Text is set to be the name of the event which we take from that item data*/}
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

  const display = () => {
    if (!isLoading) {
      return (
        <>
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
                    onPress={onInProgressPressed}
                  />
                </Pressable>
              </View>
            </View>
            {/* Display events from database*/}
            <View style={styles.feedContainer}>
              {data.length !== 0 ? (
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={data}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item}) => listItemView(item)}
                />
              ) : (
                <>
                  <Feather name="check-circle" style={styles.checkCircleIcon} />
                  <Text style={styles.noInProgressEventText}>
                    Looks like you are up to date!
                  </Text>
                </>
              )}
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
        </>
      );
    } else {
      return <Loading />;
    }
  };
  return <View style={styles.root}>{display()}</View>;
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
    flexDirection: 'column',
    justifyContent: 'center',
  },
  feedItem: {
    alignSelf: 'center',
    marginVertical: '15@vs',
    width: '86%',
    height: '95@vs',
    backgroundColor: '#777B7E',
    borderRadius: '25@ms',
  },
  checkCircleIcon: {
    fontSize: RFPercentage(10),
    color: '#21B608',
    alignSelf: 'center',
  },
  noInProgressEventText: {
    fontFamily: 'Inter-Regular',
    fontSize: RFPercentage(2.25),
    color: '#ABABAB',
    marginVertical: '2%',
    alignSelf: 'center',
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
