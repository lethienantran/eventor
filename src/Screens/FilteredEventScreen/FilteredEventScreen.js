import {View, Text, Pressable, FlatList, ImageBackground} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {ScaledSheet} from 'react-native-size-matters';
import Logo from '../../components/Logo';
import ViewModeButton from '../../components/ViewModeButton';
import {RFPercentage} from 'react-native-responsive-fontsize';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useIsFocused} from '@react-navigation/native';
import SQLite from 'react-native-sqlite-storage';
import moment from 'moment';
import Feather from 'react-native-vector-icons/Feather';
import Loading from '../../components/Loading';
const FilteredEventScreen = ({route}) => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(true);
  const [filterCase, setFilterCase] = useState(route.params.filterCases);

  const onAllPressed = () => {
    setFilterCase('All');
  };
  const onPastPressed = () => {
    setFilterCase('Past');
  };
  const onCompletePressed = () => {
    setFilterCase('Complete');
  };
  const onInProgressPressed = () => {
    setFilterCase('In-Progress');
  };

  const onBackPressed = () => {
    navigation.goBack();
  };

  const addButtonPressed = () => {
    navigation.navigate('AddEventScreen');
  };
  //use when an event item is pressed to store selectedEventID into asyncstorage
  const onEventPressed = selectedEventID => {
    console.log('HomeScreen: Go to eventID - ' + selectedEventID);
    navigation.navigate('EventDetailScreen', {eventID: selectedEventID});
  };

  const filterEvents = data.filter(events => {
    if (filterCase === 'All') {
      return true;
    } else if (filterCase === 'Complete') {
      return events.eventProgress === 100;
    } else if (filterCase === 'In-Progress') {
      return events.eventProgress != 100;
    } else {
      const now = new Date();
      events.eventEndTime = new Date(events.eventEndTime);
      return events.eventEndTime < now;
    }
  });
  //run query
  useEffect(() => {
    if (isFocused) {
      setIsLoading(true);
      const db = SQLite.openDatabase(
        {
          name: 'eventorDB.db',
          createFromLocation: 1,
        },
        () => {
          console.log('FilteredEventScreen: Database opened successfully');
          db.transaction(tx => {
            //for populating all event
            tx.executeSql(
              `SELECT * FROM events ORDER BY eventEndTime DESC`,
              [],
              (tx, results) => {
                var temp = [];
                for (let i = 0; i < results.rows.length; ++i) {
                  temp.push(results.rows.item(i));
                }
                setData(temp);
                setIsLoading(false);
                db.close();
              },
            );
          });
        },
        error => {
          console.log(error);
        },
      );
    }
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
    return (
      <TouchableOpacity
        key={item.eventID}
        style={styles.feedItem}
        activeOpacity={0.7}
        onPress={() => onEventPressed(item.eventID)}>
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

  const display = () => {
    if (!isLoading) {
      return (
        <>
          <View style={styles.container}>
            <Logo hasBack={true} onPress={onBackPressed} />
            <View style={styles.contentContainer}>
              <View style={styles.viewModeContainer}>
                <ViewModeButton
                  mode="All"
                  viewMode={filterCase}
                  title="All"
                  type="EvenSpace"
                  onPress={onAllPressed}
                />
                <ViewModeButton
                  mode="Past"
                  viewMode={filterCase}
                  title="Past"
                  type="EvenSpace"
                  onPress={onPastPressed}
                />
              </View>
              <View style={styles.viewModeContainer}>
                <ViewModeButton
                  mode="Complete"
                  viewMode={filterCase}
                  title="Complete"
                  type="EvenSpace"
                  onPress={onCompletePressed}
                />
                <ViewModeButton
                  mode="In-Progress"
                  viewMode={filterCase}
                  title="In-Progress"
                  type="EvenSpace"
                  onPress={onInProgressPressed}
                />
              </View>
              <View style={styles.viewTitleContainer}>
                <Text style={styles.viewTitleText}>{filterCase} Events</Text>
              </View>
              <View style={styles.feedContainer}>
                {data.length != 0 ? (
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={filterEvents}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item}) => listItemView(item)}
                  />
                ) : (
                  <View style={styles.noEventOutsideContainer}>
                    <View style={styles.noEventContainer}>
                      <Feather
                        name="check-circle"
                        style={styles.checkCircleIcon}
                      />
                      <Text style={styles.noEventText}>
                        You don't have any events yet!
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </View>
          <View style={styles.addButtonIcon}>
            <Pressable onPress={addButtonPressed}>
              <MaterialCommunityIcons
                name="plus-circle"
                color={'#FF3008'}
                size={100}
              />
            </Pressable>
          </View>
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
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#FFF',
  },
  container: {
    flexDirection: 'column',
    width: '85%',
    height: '100%',
  },
  contentContainer: {
    flexDirection: 'column',
    width: '100%',
    height: '91%',
  },
  viewModeContainer: {
    width: '100%',
    height: '11%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewTitleContainer: {
    width: '100%',
    height: '7%',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  viewTitleText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: RFPercentage(3.8),
    color: 'black',
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
  feedContainer: {
    width: '100%',
    height: '60%',
  },
  feedItem: {
    alignSelf: 'center',
    marginVertical: '15@vs',
    width: '100%',
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
  noEventOutsideContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noEventContainer: {
    width: '85%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircleIcon: {
    fontSize: RFPercentage(8),
    color: '#21B608',
    alignSelf: 'center',
    marginBottom: '4@vs',
  },
  noEventText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: RFPercentage(2.5),
    color: '#ABABAB',
  },
});

export default FilteredEventScreen;
