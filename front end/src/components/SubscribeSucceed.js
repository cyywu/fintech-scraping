import React from 'react'
import { withRouter } from 'react-router-dom'
import { Icon } from 'rsuite'
import { Row, Col, Form } from 'rsuite';

const SubscribeSuccessed = (props) => {
    return (
        <div>

            <Form>
                <div style={{ textAlign: "left", marginLeft: '60px' }}>
                    <Icon icon='check-circle' style={{ color: 'green', marginRight: '10px' }} />
                    Subscription details listed below
                </div>

                <Row className="field" style={{ marginTop: '15px' }}>
                    <Col xs={3} className="name" >
                        <span>Email:</span>
                    </Col>

                    <Col xs={21} className="input" style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontWeight: '600', fontSize: '16px' }}>
                            {props.location.state.email}
                        </span>
                    </Col>
                </Row>

                <Row className="field" style={{ marginTop: '15px' }}>
                    <Col xs={3} className="name" >
                        <span>Status:</span>
                    </Col>

                    <Col xs={21} className="input" style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontWeight: '600', fontSize: '16px' }}>
                            {props.location.state.option}
                        </span>
                    </Col>
                </Row>


                {
                    props.location.state.option == "Subscribe"
                        ? (
                            <div>
                                <Row className="field" style={{ marginTop: '15px' }}>
                                    <Col xs={3} className="name" >
                                        <span>Source:</span>
                                    </Col>

                                    <Col xs={21} className="input" style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{ fontWeight: '600', fontSize: '16px', textAlign: 'left' }}>
                                            {props.location.state.sourceIsSpecified
                                                ? props.location.state.sourceList.join(", ")
                                                : "Not Specified"}
                                        </span>
                                    </Col>
                                </Row>

                                <Row className="field" style={{ marginTop: '15px' }}>
                                    <Col xs={3} className="name" >
                                        <span>Keyword:</span>
                                    </Col>

                                    <Col xs={21} className="input" style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{ fontWeight: '600', fontSize: '16px', textAlign: 'left' }}>
                                            {props.location.state.keywordIsSpecified
                                                ? props.location.state.keywordList.join(", ")
                                                : "Not Specified"}
                                        </span>
                                    </Col>
                                </Row>

                                {
                                    props.location.state.keywordIsSpecified
                                        ?
                                        <Row className="field" style={{ marginTop: '15px' }}>
                                            <Col xs={3} className="name" >
                                                <span>Search Mode:</span>
                                            </Col>

                                            <Col xs={21} className="input" style={{ display: 'flex', alignItems: 'center' }}>
                                                <span style={{ fontWeight: '600', fontSize: '16px' }}>
                                                    {props.location.state.keywordSearchMode}
                                                </span>
                                            </Col>
                                        </Row>
                                        : null
                                }

                                <Row className="field" style={{ marginTop: '15px' }}>
                                    <Col xs={1} className="name" >
                                              
                                    </Col>
                                    
                                    <Col xs={23} className="input" style={{ display: 'flex', alignItems: 'center' }}>
                                        <div>
                                            <h5 style={{textAlign:'left'}}>
                                                - Contents of this web app will be updated everyday at 08:00 HKT
                                            </h5>

                                            <h5 style={{textAlign:'left'}}>
                                                - You will receive an email listing out news that match your subscription options at 09:15 HKT ( if there are any )
                                            </h5>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        )
                        : null
                }

                <div style={{ marginTop: '20px' }}>
                    <button
                        style={{ borderRadius: '5%', background: 'grey', color: 'white' }}
                        onClick={
                            () => {
                                props.history.push('/')
                            }
                        }>
                        Back to home
                    </button>
                </div>

            </Form>





        </div>
    )
}

export default withRouter(SubscribeSuccessed)