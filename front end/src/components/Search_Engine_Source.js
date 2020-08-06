import React from 'react'
import { Checkbox, CheckboxGroup, Row, Col } from 'rsuite';

const SearchEngineSource = (props) => {
    const { handleSourceCheckAll, handleSourceChange,
        sourceCheckAll, sourceValue, sourceIndeterminate, allSource } = props

    return (
        <Row className="field source">
            <Col xs={3} className="name" >
                <span>Source:</span>
            </Col>

            <Col xs={21} className="input" >
                
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

            </Col>

        </Row>
    )
}

export default SearchEngineSource 