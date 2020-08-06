import React from 'react'
import { Checkbox, CheckboxGroup, Row, Col, FormGroup, RadioGroup, Radio, Input, InputGroup, Icon } from 'rsuite';

const styles = {
    radioGroupLabel: {
        padding: '8px 2px 8px 10px',
        display: 'inline-block',
        verticalAlign: 'middle'
    },
    inputForExtraKeyword:
    {
        width: 300,
        marginBottom: 10
    }
};

const SearchEngineKeyword = (props) => {
    const {
        handleKeywordCheckAll,
        handleKeywordChange,
        handleKeywordSearchModeChange,
        handleAddKeyword,
        keywordCheckAll,
        keywordValue,
        keywordIndeterminate,
        keywordSearchMode,
        allKeyword,
    } = props

    let listOfKeyword =
        (
            <div>
                {
                    allKeyword.map((n, i) => (
                        <Checkbox key={'keyword_' + i} value={n}>{n}</Checkbox>
                    ))
                }
            </div>

        );

    let keywordInput = ''

    return (
        <Row className="field keyword">
            <Col xs={3} className="name" >
                <span>Keyword:</span>
            </Col>

            <Col xs={21} className="input" >

                <FormGroup controlId="add_input_form">

                    <RadioGroup name="subscriptionRadioList" inline
                        defaultValue={props.keywordIsSpecified}
                        onChange={value => {
                            props.handleKeywordIsSpecifiedChange(value)
                        }}>
                        <Radio value={true}>Specified</Radio>
                        <Radio value={false}>Not specified</Radio>
                    </RadioGroup>

                    {props.keywordIsSpecified
                        ?
                        <div>

                            <div style={{ 'display': 'flex' }}>

                                <RadioGroup
                                    name="keywordSearchMode"
                                    inline appearance="picker"
                                    value={keywordSearchMode}
                                    onChange={value => {
                                        handleKeywordSearchModeChange('keywordSearchMode', value);
                                    }}
                                >
                                    <Radio value="OR" >OR</Radio>
                                    <Radio value="AND">AND</Radio>
                                </RadioGroup>

                                <Checkbox
                                    checked={keywordCheckAll}
                                    onChange={handleKeywordCheckAll}
                                    indeterminate={keywordIndeterminate}
                                    id="checkbox_keyword_ALL"
                                    label="ALL"
                                    value="ALL">ALL</Checkbox>
                            </div>

                            <div className="keyword-checkbox-group">

                                <CheckboxGroup
                                    inline
                                    name="checkboxList"
                                    value={keywordValue}
                                    onChange={handleKeywordChange}
                                >
                                    <div></div>

                                    {listOfKeyword}

                                </CheckboxGroup>

                            </div>

                            <InputGroup
                                style={styles.inputForExtraKeyword}
                            >
                                <Input
                                    placeholder='to add a keyword ...'
                                    onChange={
                                        (v, e) => {
                                            keywordInput = v
                                        }
                                    }
                                />
                                <InputGroup.Button
                                    onClick={
                                        () => {
                                            handleAddKeyword(keywordInput)
                                            keywordInput = ""
                                        }
                                    }>
                                    <Icon icon="plus-square" />
                                </InputGroup.Button>

                            </InputGroup>
                        </div>
                        : null}

                </FormGroup>


            </Col>
        </Row>
    )
}

export default SearchEngineKeyword