import {Dimensions, StyleSheet, Text, View, TouchableOpacity} from "react-native";
import React, {Component} from 'react';
import {Fonts} from "../../../utils/fonts";
const { width, height } = Dimensions.get('window');
import { Icon } from 'react-native-elements'


class HeaderLayout extends Component {
    constructor (props) {
        super(props);
        this.state = {
            id: props.data._id,
            name: props.data.name,
            age: props.data.age
        };
        this.onPressEvent = this.onPressEvent.bind(this);
    }
    onPressEvent() {
        fetch(`http://192.168.10.1:3000/api/v1/pets/${this.state.id}/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Authorization': 'Bearer ' + this.props.JWT
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
            })
            .catch((error) => {
                console.log('You have got an error: ' + error);
            });
    }
    render() {
        return(
        <View style={styles.headerLayoutStyle}>
            <TouchableOpacity onPress={this.onPressEvent} style={styles.heart}>
                <Icon
                    name='favorite'
                    color='rgba(255, 71, 71, 0.9)'
                    size={60} />
            </TouchableOpacity>
            <Text style={styles.name}>{this.state.name}</Text>

            <Text style={styles.age}>Age: {this.state.age}</Text>
        </View>
    );}
}
export default HeaderLayout;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF'
    },
    headerLayoutStyle: {
        flex: 1,
        flexDirection: 'row',
        width,
        height: 90,
        backgroundColor: 'rgba(232, 232, 232, 0.9)',
        justifyContent: 'space-between',
        borderRadius:10,
    },
    name: {
        top:'6%',
        left: '20%',
        //alignItems: 'center',
        //paddingLeft: 10,
        color: 'black',
        fontSize: 30,
        fontFamily: Fonts.FranklinGothic,
    },
    age: {
        top:'6%',
        right: '20%',
        //alignItems: 'center',
        //paddingRight: 10,
        color: 'black',
        fontSize: 30,
        fontFamily: Fonts.FranklinGothic,
    },
    heart: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    }
});