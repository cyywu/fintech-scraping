import React from 'react'
import { DateRangePicker, Row, Col } from 'rsuite';

const SearchEngineDate = (props) => {
    const { handleDateChange, dateSpecified, dateValue } = props

    return (
        <Row className="field date" style={{marginTop:'20px'}}>
            <Col xs={3} className="name" >
                <span>Date:</span>
            </Col>

            <Col xs={21} className="input" >

                {dateSpecified && dateValue.length?
                    (
                        <DateRangePicker
                            value={dateValue}
                            appearance="default"
                            placeholder="to specify a period ..."
                            style={{ width: 280 }}
                            onChange={handleDateChange}
                        />
                    ) : (
                        <DateRangePicker

                            appearance="default"
                            placeholder="to specify a period ..."
                            style={{ width: 280 }}
                            onChange={handleDateChange}
                        />
                    )}
            </Col>
        </Row>
    )
}

export default SearchEngineDate



// constructor(props) {
//     super(props);
//     this.state = {
//         value: [new Date('2017-02-01'), new Date('2017-05-20')]
//     };
// }
// render() {
//     return (
//         <div className="field">
//             <DateRangePicker
//                 value={this.state.value}
//                 onChange={value => {
//                     this.setState({ value });
//                     console.log(value);
//                 }}
//             />
//         </div>
//     );
// }