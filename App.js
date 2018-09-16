/**
 * Sample react native app to add and list items to Firebase Database
 * for WFP assignement
 *
 * @format
 * @flow
 */

import React from 'react';
import {Platform, StyleSheet, ScrollView, Text, View, StatusBar,TextInput,TouchableHighlight,FlatList} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import ActionButton from 'react-native-action-button';
import Modal from "react-native-modal";

const firebase = require("firebase");

var config = {
  apiKey: "AIzaSyAdBPDwu5Pk26OQFkQf87Z_UcHFIzAlSBI",
  authDomain: "fir-dbreact.firebaseapp.com",
  databaseURL: "https://fir-dbreact.firebaseio.com",
  projectId: "fir-dbreact",
  storageBucket: "fir-dbreact.appspot.com",
  messagingSenderId: "689494069983"
};

firebase.initializeApp(config);

export default class App extends React.Component {

  constructor(props){  
    super(props);
    this.state = {isModalVisible: false,first_name:"",other_names:"",profession:"",profList:[]};
  }

  _toggleModal = () =>this.setState({ isModalVisible: !this.state.isModalVisible });

  _saveToFireBase = () =>{
      firebase.database().ref('Professionals/').push({
        first_name: this.state.first_name,
        other_name:this.state.other_names,
        profession:this.state.profession
      }).then((data)=>{
        //success callback       
         this._toggleModal();
         this._getListFromFireBase();
      }).catch((error)=>{
        //error callback
        console.log('error ' , error)
      });
  }

  _getListFromFireBase = () =>{
      firebase.database().ref('Professionals/').once('value', (snapshot) => {  
      if(snapshot.val()){         
         this.mapArrayObjectToList(snapshot.val());     
      }
    });
  }

  mapArrayObjectToList = (arrayObj) =>{    
    var result = Object.keys( arrayObj ).map( p => Object.assign( arrayObj[p], {arrayObj:p}));    
    this.setState({profList: result}); 
  }

  componentDidMount() { 
    this._getListFromFireBase();
  }

  render() {

    return (

      <View style={styles.container}> 
       <StatusBar backgroundColor="#047582" barStyle="light-content"/>
         
         <View style={styles.customHeader}>
            <Text style={styles.headeTxt}>List of Professionals</Text>
         </View>

         <ScrollView style={styles.scrollContainer}>        
         <FlatList
              data={this.state.profList}
              style={{backgroundColor:"#fff"}}
              keyExtractor={(item, index) => index}
              renderItem={({item, index}) => 
              <View styles = {styles.listItem}>
                <Text style={styles.name}>{item.first_name} {item.other_name}</Text>
                <Text style={styles.position}>{item.profession}</Text>
             </View>
             }
          />            
         </ScrollView>

         <ActionButton
             buttonColor="rgba(231,76,60,1)"
             onPress={this._toggleModal}
          />

          <Modal isVisible={this.state.isModalVisible}>
            <View style={{width:"100%", backgroundColor:"#FFF" }}>
              <Text style={styles.modalHeaderTxt}>Enter new professional</Text>

               <TextInput style={styles.input}  onChangeText={(first_name) => this.setState({first_name})} placeholder="First Name"/>
               <TextInput style={styles.input}  onChangeText={(other_names) => this.setState({other_names})} placeholder="Other Names"/>
               <TextInput style={styles.input}  onChangeText={(profession) => this.setState({profession})} placeholder="Profession"/>

              <View style={styles.buttonWrapper}>
                <TouchableHighlight onPress={this._saveToFireBase}>
                  <Text style={styles.saveBtn}>Save Details</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>
          
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ccc'
  },
  customHeader:{
    height: 38 + getStatusBarHeight(),
    backgroundColor:"#36919B",
    justifyContent:"center",
    paddingHorizontal:10
  },
  listItem:{
    backgroundColor:"#FFF",
    marginBottom:1
  },
  name: {
    marginTop:10,
    fontSize: 17,
    paddingHorizontal:10,
    color:"#000"
  },
  position: {
    paddingHorizontal:10,
    marginBottom: 10,
  },
  headeTxt:{
    color:"#FFF",
    padding:10,
    fontSize:20
  },
  scrollContainer:{
    margin:20
  },
  input:{
    borderColor: "#36919B",
    borderWidth: 1,
    marginHorizontal:10,
    marginVertical:5,
    paddingHorizontal:10
  },
  modalHeaderTxt:{ 
    paddingVertical:15,
    justifyContent:"center",
    fontSize:18,
    backgroundColor:"#36919B",
    color:"#FFF",
    paddingHorizontal:20,
    marginBottom:10
  },
  saveBtn:{
    textAlign:"center",
    backgroundColor:"#047582",
    marginTop:10,
    color:"#fff",
    width:150,
    alignSelf:"center",
    padding:15,
    marginBottom:10
  },
});
