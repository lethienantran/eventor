import {View, Text, StyleSheet, Dimensions, Pressable, ImageBackground} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import Octicons from 'react-native-vector-icons/Octicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { ScaledSheet } from 'react-native-size-matters';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Logo from '../../components/Logo';

import eventsBanner from '../../../assets/images/eventsBanner.png';
const {height, width} = Dimensions.get('window');

const AddEventScreen = () => {

  const onBackPressed = () =>{

  };

  const onEditPressed = () =>{

  };

  const onAddTaskPressed = () =>{
    
  };

  //call useNavigation to be able to navigate around
  const navigation = useNavigation();
  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <Logo />
        <View style={styles.contentContainer}>
          <View style={styles.eventBannerContainer}>
            <ImageBackground
                  source={eventsBanner}
                  resizeMode="cover"
                  style={{flex: 1}}
                  imageStyle={styles.itemImage}>
            </ImageBackground>
          </View>
          <View style={styles.eventInfoContainer}>
            <View style={styles.eventInfoHeader}>
              <Text style={styles.eventName}>
                Brain Injury Art Show
              </Text>
              <Octicons name='pulse' style={styles.eventStatusIcon}/>
            </View>
            <View style={styles.eventLocationContainer}>
              <Feather name='map-pin' style={styles.mapPinIcon}/>
              <Text style={styles.eventLocationText}>
                Bellevue Arts Museum
              </Text>
            </View>
          </View>
          <View style={styles.viewModeContainer}>
              <Pressable style={styles.descriptionButton}>
                <Text style={styles.descriptionText}>Description</Text>
              </Pressable>
              <Pressable style={styles.remainingTasksButton}>
                <Text style={styles.remainingTasksText}>
                  Remaining Tasks
                </Text>
              </Pressable>
          </View>
          <View style={styles.taskList}>
            <View style={styles.taskContainer}>
              <View style={styles.taskInfoContainter}>
                <Octicons name='pulse' style={styles.taskStatusIcon}/>
                <Text style={styles.taskName}>Set up the paintings</Text>
              </View>
              <Pressable style={styles.taskEditButton}>
                <Feather name='edit-3' style={styles.editTaskIcon}/>
              </Pressable>
            </View>
            <View style={styles.taskContainer}>
              <View style={styles.taskInfoContainter}>
                <Octicons name='pulse' style={styles.taskStatusIcon}/>
                <Text style={styles.taskName}>Set up the paintings</Text>
              </View>
              <Pressable style={styles.taskEditButton}>
                <Feather name='edit-3' style={styles.editTaskIcon}/>
              </Pressable>
            </View>
            <View style={styles.taskContainer}>
              <View style={styles.taskInfoContainter}>
                <Octicons name='pulse' style={styles.taskStatusIcon}/>
                <Text style={styles.taskName}>Set up the paintings</Text>
              </View>
              <Pressable style={styles.taskEditButton}>
                <Feather name='edit-3' style={styles.editTaskIcon}/>
              </Pressable>
            </View>
          </View>
          <View style={styles.actionBar}>
            <View style={styles.progressionContainer}>
              <View style={styles.progressionHeader}>
                <Text style={styles.progressionText}>
                  Progression
                </Text>
                <MaterialCommunityIcons name='chart-timeline-variant' style={styles.graphIcon}/>
              </View>
              <Text style={styles.progressText}>66.6%</Text>
            </View>
            <Pressable onPress={onAddTaskPressed}>
              <MaterialCommunityIcons
                name="plus-circle"
                style={styles.addButtonIcon}
                color={'#FF3008'}
              />
            </Pressable>
          </View>

          {/* <View style={styles.aboutContainer}>
            <Text style={styles.headerText}>
              About the event
            </Text>
            <View style={styles.bodyContainer}>
              <Text style={styles.bodyText}>
              Every piece displayed in this exhibit was created with care by an artist who survived a life altering event.
               For them, their lives were not only changed in the moment but in the years to follow as a new normal would be established.
               Art is a form of expression that allows the participants to showcase their journey, either whole or the process, to spread awareness and help those outside of the community understand their life with a Brain Injury.
              </Text>
            </View>
          </View> */}
        </View>
      </View>
    </View>
  );
};

const styles = ScaledSheet.create({
  root:{
    flex:1,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    width:'100%',
    height:'100%',
    backgroundColor:'#FFF',
  },
  container:{
    flexDirection:'column',
    width:'85%',
    height:'100%',

  },
  contentContainer:{
    flexDirection:'column',
    width:'100%',
    height:'91%',

  },
  eventBannerContainer:{
    width:'100%',
    height:'19%',
    borderRadius: '25@ms',
    backgroundColor:'#EEEEEE',
  },
  itemImage: {
    borderRadius: '25@ms',
  },
  eventInfoContainer:{
    flexDirection:'column',
    justifyContent:'flex-start',
    paddingVertical:'18@vs',
    width:'100%',
    height:'16%',
  },
  eventInfoHeader:{
    flexDirection:'row',
    width:'100%',
    height:'50%',
    justifyContent:'space-between',
    alignItems:'center',
    marginVertical:'1%',

  },
  eventName:{
    fontSize:RFPercentage(3.3),
    fontFamily:'OpenSans-SemiBold',
    color:'black',
  },
  eventStatusIcon:{    
    fontSize:RFPercentage(4.25),
    color:'black',
  },
  eventLocationContainer:{
    flexDirection:'row',
    width:'100%',
    height:'50%',
    justifyContent:'flex-start',
    alignItems:'center',

  },
  mapPinIcon:{
    fontSize:RFPercentage(3.5),
    color:'#AFAFAF',
  },
  eventLocationText:{
    fontSize:RFPercentage(2.25),
    fontFamily:'Inter-SemiBold',
    color:'#AFAFAF',
    marginLeft:'2%',
  },
  viewModeContainer:{
    width:'100%',
    height:'10%',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',

  },
  descriptionButton:{
    width:'42%',
    height:'78%',
    borderRadius:'20@ms',
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#FF3008',
  },
  descriptionText:{
    fontFamily:'Inter-SemiBold',
    fontSize:RFPercentage(2.25),
    color:'white',
  },
  remainingTasksButton:{
    width:'52%',
    height:'78%',
    borderRadius:'20@ms',
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#FFF',
    borderWidth:'2@ms',
    borderColor:'black',
  },
  remainingTasksText:{
    fontFamily:'Inter-SemiBold',
    fontSize:RFPercentage(2.25),
    color:'black',
  },
  aboutContainer:{
    flexDirection:'column',
    justifyContent:'flex-start',
    width:'100%',
    height:'50%',

  },
  headerText:{
    marginVertical:'4%',
    fontFamily:'OpenSans-SemiBold',
    color:'black',
    fontSize:RFPercentage(2.9),
  },
  bodyContainer:{
    width:'100%',
    height:'83.7%',

  },
  bodyText:{
    fontFamily:'Inter-Regular',
    color:'#ABABAB',
    fontSize:RFPercentage(2.20),
  },
  taskList:{
    paddingVertical:'2.5%',
    width:'100%',
    height:'38%',
    flexDirection:'column',
  },
  taskContainer:{
    marginVertical:'2.5%',
    width:'100%',
    height:'26%',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    backgroundColor:'#FFF',
    paddingHorizontal:'6%',
    borderWidth:'2@ms',
    borderColor:'black',
    borderRadius:'20@ms',
  },
  taskInfoContainter:{
    flexDirection:'row',
    width:'88%',
    height:'100%',
    alignItems:'center',

  },
  taskStatusIcon:{
    fontSize:RFPercentage(2.5),
    color:'black',
  },
  taskName:{
    marginLeft:'4%',
    fontSize:RFPercentage(2.25),
    fontFamily:'Inter-Regular',
    color:'black',
  },
  taskEditButton:{
    flexDirection:'row',
    justifyContent:'flex-end',
    alignItems:'center',
    width:'10%',
    height:'100%',

  },
  editTaskIcon:{
    fontSize:RFPercentage(2.5),
    color:'black',
  },
  actionBar:{
    width:'100%',
    height:'15%',
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'space-between',

  },
  addButtonIcon:{
    fontSize: RFPercentage(13.5),
    backgroundColor: 'white',
    borderRadius: '70@ms',
    borderColor: 1,
  },
  progressionContainer:{
    width:'70%',
    height:'80%',
    paddingVertical:'2%',
    paddingHorizontal:'4%',
    borderRadius: '10@ms',
    flexDirection:'column',
    justifyContent:'space-between',
    backgroundColor:'#EEEEEE',
  },
  progressionHeader:{
    width:'100%',
    height:'30%',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',

  },
  progressionText:{
    fontFamily:'Inter-Medium',
    color:'black',
    fontSize:RFPercentage(2),
  },
  graphIcon:{
    fontSize:RFPercentage(3),
    color:'black',
  },
  progressText:{
    fontFamily:'Inter-Medium',
    color:'black',
    fontSize:RFPercentage(4),
  },

});
export default AddEventScreen;
