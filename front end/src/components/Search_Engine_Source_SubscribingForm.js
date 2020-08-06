import React from 'react'
import { Checkbox, CheckboxGroup, Row, Col, FormGroup, RadioGroup, Radio } from 'rsuite';

const styles = {
    radioGroupLabel: {
        padding: '8px 2px 8px 10px',
        display: 'inline-block',
        verticalAlign: 'middle'
    }
};


const SearchEngineSourceSubscribingForm = (props) => {
    const { handleSourceCheckAll, handleSourceChange,
        sourceCheckAll, sourceValue, sourceIndeterminate, allSource } = props

    return (
        <Row className="field source">
            <Col xs={3} className="name" >
                <span>Source:</span>
            </Col>

            <Col xs={21} className="input" >
                <FormGroup>

                    <RadioGroup name="subscriptionRadioList" inline
                        defaultValue={props.sourceIsSpecified}
                        onChange={value => {
                            props.handleSourceIsSpecifiedChange(value)
                        }}>
                        <Radio value={true}>Specified</Radio>
                        <Radio value={false}>Not specified</Radio>
                    </RadioGroup>

                    {props.sourceIsSpecified ?
                        <div>
                            <Checkbox
                                checked={sourceCheckAll}
                                onChange={handleSourceCheckAll}
                                indeterminate={sourceIndeterminate}
                                id="checkbox_source_ALL"
                                label="ALL"
                                value="ALL">ALL</Checkbox>
                            <CheckboxGroup
                                inline
                                name="checkboxList"
                                value={sourceValue}
                                onChange={handleSourceChange}
                            >

                                {
                                    allSource.map((n, i) => (
                                        <Checkbox key={"source_" + i} value={n}>{n}</Checkbox>
                                    ))
                                }

                            </CheckboxGroup>
                        </div>
                        : null}


                </FormGroup>


            </Col>

        </Row>
    )
}

export default SearchEngineSourceSubscribingForm 