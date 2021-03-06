import React, {PureComponent} from 'react';
import {
    StyleSheet,
    ImageBackground,
    View,
    Tile,
    Image, Dimensions,
    ScrollView, Alert, ToastAndroid
} from 'react-native';
const { width, height } = Dimensions.get('window');
import {Fonts} from "../../../utils/fonts";
import {Header, Text} from "react-native-elements";
import { Button } from 'react-native-elements';
//import Icon from 'react-native-vector-icons/FontAwesome';
import { Icon } from 'react-native-elements'
import deviceStorage from "../../services/deviceStorage";
import config from "../../../config";
import {store} from "../../../store";
import {connect} from "remx";
import SceneView from "react-navigation/src/views/SceneView";

class PetProfile extends PureComponent {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            pet: props.navigation.getParam('item'),
        };
        this.submitReservation = this.submitReservation.bind(this);
    }
    // onPressEvent() {
    //     //const change = () => {this.submitReservation};
    //     Alert.alert(
    //         'Do you really want to make reservation?',
    //         'Pet will be reserved for you for one week. After one week your reservation will be declined and the pet wil be made available to reserve for others.',
    //         [
    //             {text: 'Cancel', onPress: () => {}, style: 'cancel'},
    //             {text: 'OK', onPress: () => {this.submitReservation()}},
    //         ],
    //         { cancelable: true }
    //     );
    // }
    submitReservation() {
        fetch(`http://${config.FETCH_URL}/api/v1/pets/${this.state.pet._id}/${this.state.pet.canReserve && !this.state.pet.reservedByUser ? 'reserve' : 'unreserve' }`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Authorization': 'Bearer ' + this.props.JWT
            },
        })
            .then((response) => response.json())
            .then(() => {
                if (this.state.pet.canReserve === true && this.state.pet.reservedByUser === false) {
                    this.setState(prevState => ({
                        pet: {
                            ...prevState.pet,
                            canReserve: !this.state.pet.canReserve,
                            reservedByUser: !this.state.pet.reservedByUser
                        }
                    }));
                    ToastAndroid.showWithGravity(
                        'The pet has been reserved for you!',
                        ToastAndroid.SHORT,
                        ToastAndroid.TOP,
                    );
                }
                 else if (this.state.pet.canReserve === false && this.state.pet.reservedByUser === true) {
                    this.setState(prevState => ({
                        pet: {
                            ...prevState.pet,
                            canReserve: !this.state.pet.canReserve,
                            reservedByUser: !this.state.pet.reservedByUser
                        }
                    }));
                    ToastAndroid.showWithGravity(
                        'Reservation has been cancelled!',
                        ToastAndroid.SHORT,
                        ToastAndroid.TOP,
                    );
                }
                store.setReservationMade(true);
            })
            .catch((error) => {
                console.log('You have got an error: ' + error);
            });
    }
    alreadyReserved() {
            ToastAndroid.showWithGravity(
                'The pet is already reserved!',
                ToastAndroid.SHORT,
                ToastAndroid.TOP,
            );
    }
    render() {
        return (
            <View style={styles.container}>
                <Header
                    containerStyle={{
                        backgroundColor: '#423131', height:20 }}
                    backgroundColor={'#fafbff'}
                    outerContainerStyles={{height: 58}}
                    leftComponent={ <Icon name="arrow-back" underlayColor={'rgba(255, 255, 255, 0)'} color={'black'} size={30} style={styles.icon}
                                          onPress={ () => this.props.navigation.goBack()} />}
                    centerComponent={{ text: 'Pet', style: { color: 'black',
                            fontSize:21, fontWeight: '500', letterSpacing:2, flexDirection: 'row',
                            alignItems: 'center', flex:0.8 } }}
                />
                <Image
                    source={{ uri: this.state.pet.photo }}
                    style={styles.image}
                />
                <View style={styles.title}>
                    <Text style={styles.name}>{this.state.pet.name}</Text>
                    <Text style={styles.age}>{this.state.pet.age}</Text>
                </View>
                <View
                    style={{
                        //top: 20,
                        height: 1,
                        width: "100%",
                        backgroundColor: "#CED0CE",
                    }}
                />
                {this.state.pet.canReserve && !this.state.pet.reservedByUser ?
                    <View style={styles.reservation}>
                        <Button
                            onPress={this.submitReservation}
                            title={this.state.pet.reservedByUser ? 'YOU RESERVED THIS PET' : 'MAKE RESERVATION'}
                            buttonStyle={this.state.pet.reservedByUser ? styles.buttonReservedByUser : styles.button}
                        />
                    </View> :
                    !this.state.pet.canReserve && this.state.pet.reservedByUser ?
                        <View style={styles.reservation}>
                            <Button
                                onPress={this.submitReservation}
                                title={this.state.pet.reservedByUser ? 'YOU RESERVED THIS PET' : 'MAKE RESERVATION'}
                                buttonStyle={this.state.pet.reservedByUser ? styles.buttonReservedByUser : styles.button}
                            />
                        </View> :
                        <View style={styles.reservation}>
                            <Button
                                onPress={this.alreadyReserved}
                                title={'PET HAS BEEN ALREADY RESERVED'}
                                buttonStyle={styles.buttonReservedByOther}
                            />
                        </View>}
                <View
                    style={{
                        //top: 20,
                        height: 1,
                        width: "100%",
                        backgroundColor: "#CED0CE",
                    }}
                />
                <ScrollView>
                    <View style={styles.subtitle}>
                        <Text style={styles.description}>{this.state.pet.description}</Text>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

function mapStateToProps(ownProps) {
    return {
        JWT: store.getJwt()
    };
}

export default connect(mapStateToProps)(PetProfile);

const styles = StyleSheet.create({
    containerScrollView: {
        flex: 1,
        backgroundColor: '#eae9eb',
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    image: {
        backgroundColor: '#0032ff',
        width: width,
        height: 200
    },
    title: {
        height: 70,
        top: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    name: {
        left: 10,
        color: 'black',
        fontSize: 40,
        fontFamily: Fonts.FranklinGothic,
    },
    age: {
        right: 10,
        color: 'black',
        fontSize: 40,
        fontFamily: Fonts.FranklinGothic,
        //alignSelf: 'flex-end'
    },
    subtitle: {
        left: 10,
        marginBottom: 30
    },
    description: {
        color: 'black',
        fontSize: 20,
        fontFamily: Fonts.FranklinGothic,
    },
    reservation: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        top: 20,
        marginBottom: 70
    },
    button: {
        bottom: 10,
        borderRadius: 50,
        backgroundColor: '#d02337',
        height: 50,
        fontFamily: Fonts.FranklinGothic,
    },
    buttonReservedByUser: {
        bottom: 10,
        borderRadius: 50,
        backgroundColor: '#d15c69',
        height: 50,
        fontFamily: Fonts.FranklinGothic,
    },
    buttonReservedByOther: {
        bottom: 10,
        borderRadius: 50,
        backgroundColor: '#d08898',
        height: 50,
        fontFamily: Fonts.FranklinGothic,
    }
});
