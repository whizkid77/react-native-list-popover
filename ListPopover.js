/**
 * ListPopover - Popover rendered with a selectable list.
 */
"use strict";

import React, {
    PropTypes,
} from 'react';

import {
    ListView,
    StyleSheet,
    Text,
    Dimensions,
    TouchableOpacity,
    View
} from 'react-native';

var SCREEN_HEIGHT = Dimensions.get('window').height;
var SCREEN_WIDTH = Dimensions.get('window').width;
var noop = () => {};
var ds = new ListView.DataSource({rowHasChanged: (r1,r2)=>(r1!==r2)});


var ListPopover = React.createClass({
    propTypes: {
        list: PropTypes.array.isRequired,
        isVisible: PropTypes.bool,
        onClick: PropTypes.func,
        onClose: PropTypes.func,
        separatorStyle: PropTypes.object,
        containerStyle: PropTypes.object,
        popoverStyle: PropTypes.object,
        rowText: PropTypes.object,
        renderRow: PropTypes.func,
        style: PropTypes.object,
    },
    getDefaultProps: function() {
        return {
            list: [""],
            isVisible: false,
            onClick: noop,
            onClose: noop
        };
    },
    getInitialState: function() {
        return {
            dataSource: ds.cloneWithRows(this.props.list)
        };
    },
    componentWillReceiveProps: function(nextProps:any) {
        if (nextProps.list !== this.props.list) {
            this.setState({dataSource: ds.cloneWithRows(nextProps.list)});
        }
    },
    handleClick: function(data) {
        this.props.onClick(data);
        this.props.onClose();
    },
    renderRow: function(rowData) {
        var separatorStyle = this.props.separatorStyle || DefaultStyles.separator;
        var rowTextStyle = this.props.rowText || DefaultStyles.rowText;

        var separator = <View style={separatorStyle}/>;
        if (rowData === this.props.list[0]) {
            separator = null;
        }

        var row;
        if (this.props.renderRow) {
            row = this.props.renderRow(rowData);
        } else {
            row = <Text style={rowTextStyle}>{rowData}</Text>
        }

        return (
            <View>
            {separator}
            <TouchableOpacity onPress={() => this.handleClick(rowData)}>
            {row}
            </TouchableOpacity>
            </View>
        );
    },
    renderList: function() {
        var styles = this.props.style || DefaultStyles;
        var maxHeight = {};
        if (this.props.list.length > 12) {
            maxHeight = {height: SCREEN_HEIGHT * 3/4};
        }
        return (
            <ListView
            style={maxHeight}
            dataSource={this.state.dataSource}
            renderRow={(rowData) => this.renderRow(rowData)}
            />
        );
    },
    render: function() {
        var containerStyle = this.props.containerStyle || DefaultStyles.container;
        var popoverStyle = this.props.popoverStyle || DefaultStyles.popover;

        if (this.props.isVisible) {
            return (
                <TouchableOpacity onPress={this.props.onClose} style={containerStyle}>
                <View style={popoverStyle}>
                {this.renderList()}
                </View>
                </TouchableOpacity>
            );
        } else {
            return (<View/>);
        }
    }
});


var DefaultStyles = StyleSheet.create({
    container: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    popover: {
        width:Math.min(SCREEN_WIDTH-60,260),
        borderRadius: 3,
        backgroundColor: '#ffffff',
    },
    rowText: {
        padding: 10,
    },
    separator: {
        height: 0.5,
        backgroundColor: '#CCC',
    },
});

module.exports = ListPopover;
