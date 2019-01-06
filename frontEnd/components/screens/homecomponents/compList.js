import React, {PureComponent} from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList
} from 'react-native';
import {List, ListItem, SearchBar} from "react-native-elements";
import {Fonts} from "../../../utils/fonts";
import config from "../../../config";
import {store} from "../../../store";
import {connect} from "remx";


class PetList extends PureComponent {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            data: null
        };
    }
    componentDidMount() {
        this.fetchPets();
    }
    fetchPets() {
        fetch(`http://${config.FETCH_URL}/api/v1/pets/likedList`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Authorization': 'Bearer ' + this.props.JWT
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                this.setState({data: responseJson})
            })
            .catch((error) => {
                console.log('You have got an error: ' + error);
            });
    }
    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "86%",
                    backgroundColor: "#CED0CE",
                    marginLeft: "14%"
                }}
            />
        );
    };
    renderEmpty = () => {
        console.log('EMPTY LIST');
        return (
            <View style={styles.container}>
                <View style={styles.textIfEmpty}>
                    <Text style={styles.text}>Whoops! Seems like You haven't liked any pets.</Text>
                    <Text style={styles.text}>{'All your liked pets in the future will be listed here <3'}</Text>
                </View>
            </View>
        )
    };
    render() {
        return (
            <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
                <FlatList
                    data={this.state.data}
                    renderItem={({ item })=>(
                        <ListItem
                            roundAvatar
                            title={`${item.name}`}
                            subtitle={item.age}
                            avatar={{ uri: item.photo }}
                            containerStyle={{ borderBottomWidth: 0 }}
                            onPress={() => {this.props.navigation.navigate('PetProfile')}}
                        />
                    )}
                    keyExtractor={item => item.id}
                    ItemSeparatorComponent={this.renderSeparator}
                    ListEmptyComponent={this.renderEmpty}
                    /*scrollToIndex={('index')}
                    scrollToOffset={('animated')}*/ />
            </List>
        )
    }
}
function mapStateToProps(ownProps) {
    return {
        JWT: store.getJwt()
    };
}

export default connect(mapStateToProps)(PetList);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(255, 225, 255, 0)',
    },
    textIfEmpty: {
        flex: 1,
        height: 600,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 225, 255, 0)',
    },
    text: {
        backgroundColor: 'rgba(255, 225, 255, 0)',
        color: 'black',
        fontSize: 18,
        fontFamily: Fonts.FranklinGothic,
        alignSelf: 'center',
        textAlign: 'center'
    },
});
