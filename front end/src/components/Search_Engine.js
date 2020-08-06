import React, { Component } from 'react'
// import { Row, Col} from 'react-materialize';
import 'rsuite/dist/styles/rsuite-dark.css'
import SearchEngineSource from './Search_Engine_Source'
import SearchEngineDate from './Search_Engine_Date'
import SearchEngineKeyword from './Search_Engine_Keyword'

class SearchEngine extends Component {

    state = {
    }

    constructor(props) {
        super(props);

        // Initial state
        this.state = {
            sourceCheckAll: false,
            sourceIndeterminate: true,
            sourceValue: props.sourceValue, //default
            sourceAllOptions: props.sourceAllOptions,

            dateSpecified: props.dateSpecified, //default
            dateValue: props.dateValue, //default

            keywordIsSpecified: props.keywordIsSpecified, //default
            keywordCheckAll: false,
            keywordIndeterminate: true,
            keywordValue: props.keywordValue, //default
            keywordSearchMode: 'OR',
            keywordAllOptions: props.keywordAllOptions
        };
        this.handleSourceCheckAll = this.handleSourceCheckAll.bind(this);
        this.handleSourceChange = this.handleSourceChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleKeywordCheckAll = this.handleKeywordCheckAll.bind(this);
        this.handleKeywordChange = this.handleKeywordChange.bind(this);
        this.handleKeywordSearchModeChange = this.handleKeywordSearchModeChange.bind(this);
        this.handleAddKeyword = this.handleAddKeyword.bind(this);
        this.handleKeywordIsSpecifiedChange = this.handleKeywordIsSpecifiedChange.bind(this);

    }

    componentDidMount() {

    }

    handleSourceCheckAll(value, checked) {
        const nextValue = checked ? this.state.sourceAllOptions : [];

        this.setState({
            sourceValue: nextValue,
            sourceIndeterminate: false,
            sourceCheckAll: checked
        });

        this.props.updateSourceValue(nextValue);
    }

    handleSourceChange(value) {
        this.setState({
            sourceValue: value,
            sourceIndeterminate: value.length > 0 && value.length < this.state.sourceAllOptions.length,
            sourceCheckAll: value.length == this.state.sourceAllOptions.length
        });

        this.props.updateSourceValue(value);
    }

    handleDateChange(value) {
        if (value.length != 0) {
            this.setState({
                dateSpecified: true,
                dateValue: value
            });
            this.props.updateDateValue(value, true);
        } else {
            this.setState({
                dateSpecified: false,
                dateValue: '',
            });
            this.props.updateDateValue(value, false);
        }
    }

    handleKeywordCheckAll(value, checked) {
        const nextValue = checked ? this.state.keywordAllOptions : [];
        this.setState({
            keywordValue: nextValue,
            keywordIndeterminate: false,
            keywordCheckAll: checked
        });

        this.props.updateKeywordValue(nextValue);
    }

    handleKeywordChange(value) {
        this.setState({
            keywordValue: value,
            keywordIndeterminate: value.length > 0 && value.length < this.state.keywordAllOptions.length,
            keywordCheckAll: value.length == this.state.keywordAllOptions.length
        });

        this.props.updateKeywordValue(value);
    }

    handleKeywordSearchModeChange(name, value) {
        this.setState({
            [name]: value
        });

        this.props.updateKeywordMode(value);
    }

    handleAddKeyword(keyword) {
        if (!keyword == '') {

            keyword = keyword.toLowerCase()
            if (!this.state.keywordAllOptions.includes(keyword)) {
                this.setState(state => {
                    const keywordAllOptions = state.keywordAllOptions.concat(keyword);
                    return {
                        keywordAllOptions
                    };
                });
            }

        } else {

        }
    }

    handleKeywordIsSpecifiedChange(value) {
        this.setState({
            keywordIsSpecified: value
        });
        this.props.updateKeywordIsSpecified(value);
    }

    render() {

        let { } = this.props;
        const { } = this.state;


        return (
            <div className="search-engine">

                <div className="wrapper">

                    <SearchEngineDate
                        handleDateChange={this.handleDateChange}
                        dateSpecified={this.state.dateSpecified}
                        dateValue={this.state.dateValue}
                    />

                    <SearchEngineSource
                        handleSourceCheckAll={this.handleSourceCheckAll}
                        handleSourceChange={this.handleSourceChange}
                        sourceCheckAll={this.state.sourceCheckAll}
                        sourceIndeterminate={this.state.sourceIndeterminate}
                        sourceValue={this.state.sourceValue}
                        allSource={this.state.sourceAllOptions}
                    />

                    <SearchEngineKeyword
                        handleKeywordCheckAll={this.handleKeywordCheckAll}
                        handleKeywordChange={this.handleKeywordChange}
                        handleKeywordSearchModeChange={this.handleKeywordSearchModeChange}
                        handleAddKeyword={this.handleAddKeyword}
                        keywordCheckAll={this.state.keywordCheckAll}
                        keywordIndeterminate={this.state.keywordIndeterminate}
                        keywordValue={this.state.keywordValue}
                        keywordSearchMode={this.state.keywordSearchMode}
                        allKeyword={this.state.keywordAllOptions}

                        keywordIsSpecified={this.state.keywordIsSpecified}
                        handleKeywordIsSpecifiedChange={this.handleKeywordIsSpecifiedChange}
                    />


                </div>

            </div>
        )

    }
}

export default SearchEngine