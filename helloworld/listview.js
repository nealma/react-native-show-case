/**
 * @author neal.ma
 * @email neal.ma.sh@gmail.com
 * @blog http://nealma.com
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    View,
    Image,
    TouchableOpacity,
    ListView,
    ActivityIndicator,
    RefreshControl,
    Platform,
    Text
} from 'react-native';

const API_URL = 'https://api.douban.com/v2/music/search?q=love';
import StaticContainer from 'react-static-container';

export default class List extends Component {

    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged : (s1, s2) => s1 !== s2
        });
        this.state = {
            dataSource: ds.cloneWithRows([{title: 'fuck'}]),
            loaded: false,
            refreshing: false
        };
        this._onFetch(false)
    }

    render() {
        if (!this.state.loaded) {
            return (
                <View style={styles.container}>
                    <View style={styles.loading}>
                        <ActivityIndicator
                            size='large'
                            color='#eabb33'/>
                    </View>
                </View>
            )
        }

        return (
            <ListView
                style={styles.container}
                dataSource={this.state.dataSource}
                renderRow={(rowData) => this._renderRowView(rowData, this._onPress)}
                onEndReached={this._handleLoadMore.bind(this)}
                initialListSize={10}
                pageSize={4}
                refreshControl={
                    <RefreshControl // 下拉刷新
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh.bind(this)}
                        title={'下拉刷新'}
                    />
                }
            />
        )
    }

    _musics = [];

    _onFetch(loadmore) {
        fetch(API_URL)
            .then(response => response.json())
            .then(musics => {
                if(loadmore){
                    _musics = _musics.concat(musics.musics);
                    this.setState({
                        dataSource:this.state.dataSource.cloneWithRows(_musics),
                        loaded:true
                    })
                }else{
                    _musics = musics.musics;
                    // console.log(musics)
                    this.setState({
                        dataSource:this.state.dataSource.cloneWithRows(_musics),
                        loaded:true
                    })
                }

            })
            .done();
    }

    _renderRowView(rowData, onPress) {
        return (
            <TouchableOpacity
                underlayColor='#000'
                onPress={(rowData) => onPress(rowData)}>
                <View style={styles.row}>
                    <View style={{flex: 1, backgroundColor: '#c8c7cc'}}/>
                    <View style={{flex: 20, backgroundColor: '#EFE',justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{
                            borderColor: '#d1d1d1',
                            borderWidth: 2,
                            borderRadius: 5 }}>{ rowData.attrs.pubdate }天</Text>
                    </View>
                    <View style={{flex: 100}}>
                        <Image source={{uri: rowData.image}} style={styles.bgImage}>
                            <Text style={{backgroundColor: 'transparent'}}>{rowData.title}</Text>
                        </Image>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    _onPress(rowData) {
        // 点击 item
        console.log(rowData + 'pressed');
    }

    _onRefresh() {
        // 刷新
        this._onFetch(false);
    }

    _handleLoadMore() {
        // 加载更多
        this._onFetch(true);
    }
    _renderHeader(object,onPress){
        // console.log('renderHeader');
        return(
            <StaticContainer>
                <View style={{ flex:1, flexDirection: 'row', justifyContent: 'space-between',
                    alignItems: 'center', height:50, backgroundColor:'red'}}>
                    <Text></Text>
                    <Text>孩记</Text>
                    <Icon name="camera" size={20} color="#4F8EF7" onPress={() => onPress(object)}/>
                </View>
            </StaticContainer>
        )
    }
    renderSectionHeader(sectionData, sectionID) {
        return (
            <View style={styles.section}>
                <Text style={styles.sectionText}>{sectionID}</Text>
            </View>
        )
    }
}

var styles = {
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    navBar: {
        height: 64,
        backgroundColor: '#CCC'
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 20,
        marginLeft: 10,
        marginRight: 10,
        height: 200,
        backgroundColor: '#FFF'

    },
    loading: {
        flex: 1,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center'
    },
    bgImage: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        resizeMode: 'stretch',
    }
};