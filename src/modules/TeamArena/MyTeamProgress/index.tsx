import { inject, observer } from 'mobx-react';
import { useNavigation } from '@react-navigation/native';
import {
   View,
   Text,
   Colors,
   ProgressBar,
   TouchableOpacity,
} from 'react-native-ui-lib';
import firebaseInstance from 'config/Firebase';
;
const MyTeamProgress = inject(
   'smashStore',
   'challengesStore',
   'teamsStore',
)(
   observer((props) => {
      const { navigate } = useNavigation();
      const {
         smashStore = {},
         teamsStore,
         team
      } = props;

      const {
      
        
         voteDocsHash,
         weeklyActivityHash,
         endOfCurrentWeekKey
      } = teamsStore;

      const weeklyActivity = weeklyActivityHash?.[`${team.id}_${endOfCurrentWeekKey}`] || {};
      const { score = 0, qty = 0 } = weeklyActivity;
      // const progress: number = Math.ceil(score / 30000);
      

      //////////////////////OLD CODE/////////////////////////////
      const { uid } = firebaseInstance.auth.currentUser;

      const { kFormatter, checkInfinity } = smashStore;

      const weekTarget = weeklyActivity?.target;

      const progress = checkInfinity(score / weekTarget) * 100 || 0;

      const targetView = props.smashStore.targetView;


  

   
      const todayView = targetView == 1;

   
      const color = todayView ? Colors.color40 : Colors.buttonLink;

   
      const goToSetWeeklyTarget = () => {

         const isAdmin = team?.uid == uid;

         if (isAdmin) {

            teamsStore.setShowSetWeeklyTargetModal(team);
         } else {
            teamsStore.manualTeamToVoteOn = team;
            // Alert.alert('Change Weekly Target', 'Swipe right to the Voting Tab to vote to change the weekly Target.');
         }

   
      };

   
const viewWeekStats = () => {

   smashStore.setQuickViewTeam({...team, teamWeek: true})

}
      return (
         <View>
             
          
         <View>
         <View
            paddingH-24
            marginH-16
            marginB-0
            paddingB-8
            style={{
               borderTopLeftRadius: 6,
               borderTopRightRadius: 6,
               shadowColor: '#ccc',
               shadowOffset: {
                  height: 1,
               },
               shadowOpacity: 0.52,
               shadowRadius: 12.22,
               elevation: 3,
            }}
            backgroundColor={Colors.white}>
            <View
               row
               style={{
                  marginHorizontal: 0,
                  backgroundColor: '#FFF',
               
                  marginBottom: 0,
                  paddingLeft: 0,
                  borderRadius: 7,
                  paddingTop: 0,
               }}>
               <View paddingL-0 flex paddingT-16>
                  <View row centerV spread>
                     <View flex row centerV >
                        {/* <AntDesign name={'star'} size={18} color={color} /> */}

                  <View row spread centerV flex>
                     <TouchableOpacity onPress={viewWeekStats} centerH> 
                     <Text R14>Score</Text>
                        {/* <Feather
                           name={'star'}
                           size={14}
                           color={Colors.secondaryContent}
                           style={{marginLeft: 4}}
                           
                        /> */}
                           <Text  B28 buttonLink>{score ? kFormatter(parseInt(score)) : 0}</Text>
                           </TouchableOpacity>
                           <View style={{height: 50, width: 1, backgroundColor: '#eee'}}/>
                           <View>
                           <Text R14>Progress</Text>
                         <Text center B28 style={{opacity: 0.5, elevation: 0.5}} secondaryContent>{parseInt(progress)}%</Text>
                          
                     </View>
                     <View style={{height: 50, width: 1, backgroundColor: '#eee'}}/>
                     <TouchableOpacity centerV centerH onPress={goToSetWeeklyTarget}>
                     <Text R14>Target</Text>
                     {/* <Feather
                           name={'target'}
                           size={14}
                           color={Colors.secondaryContent}
                           style={{marginLeft: 4}}
                           
                        /> */}
                           <Text marginL-4 B28 smashPink>{kFormatter(weeklyActivity?.target)}</Text>
                           
                           </TouchableOpacity>
                           {/* ({challenge?.unit || 'Points'}) */}
                           
                           </View>
                     </View>
                     {/* <TouchableOpacity row onPress={openLibraryActivities}>
                        <AntDesign
                           name={'checksquareo'}
                           size={14}
                           color={color}
                        />

                        <Text color6D marginL-4>
                           {activities?.length || 0} Activities
                        </Text>
                     </TouchableOpacity> */}
                    
                  </View>
                  
               </View>
            </View>
         
         </View>
         <View paddingH-16>
         <ProgressBar
                     progress={progress > 100 ? 100 : progress}
                     progressColor={color}
                     style={{ height: 4, marginTop: 0,marginBottom: 16, borderRadius: 0 }}
                  /></View>
                  </View>
         
      
         </View>
      );
   }),
);

export default MyTeamProgress;
