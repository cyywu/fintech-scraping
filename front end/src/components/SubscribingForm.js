import React, { Component } from 'react'
// import { Row, Col} from 'react-materialize';
import 'rsuite/dist/styles/rsuite-dark.css'
import SearchEngineSource from './Search_Engine_Source'
import SearchEngineDate from './Search_Engine_Date'
import SearchEngineKeyword from './Search_Engine_Keyword'
import SearchEngineSourceSubscribingForm from './Search_Engine_Source_SubscribingForm'
import { Schema, Checkbox, CheckboxGroup, Row, Col, Form, FormGroup, RadioGroup, Radio, Input, InputGroup, Icon, ButtonToolbar, Button } from 'rsuite';
import { withRouter, } from 'react-router-dom'


class SubscribingForm extends Component {

    state = {
    }

    constructor(props) {
        super(props);

        // Initial state
        this.state = {
            subscriptionOption: "Subscribe",
            emailInput: "",
            emailConfirmed: false,
            sourceCheckAll: false,
            sourceIndeterminate: true,
            sourceValue: props.sourceValue, //default
            sourceAllOptions: props.sourceAllOptions,
            sourceIsSpecified: props.sourceIsSpecified, //default

            keywordIsSpecified: props.keywordIsSpecified, //default
            keywordCheckAll: false,
            keywordIndeterminate: true,
            keywordValue: props.keywordValue, //default
            keywordSearchMode: 'OR',
            keywordAllOptions: props.keywordAllOptions,

            errMsg: "",
            subscriptionStatus: false
        };
        this.handleSourceCheckAll = this.handleSourceCheckAll.bind(this);
        this.handleSourceChange = this.handleSourceChange.bind(this);
        this.handleKeywordCheckAll = this.handleKeywordCheckAll.bind(this);
        this.handleKeywordChange = this.handleKeywordChange.bind(this);
        this.handleKeywordSearchModeChange = this.handleKeywordSearchModeChange.bind(this);
        this.handleAddKeyword = this.handleAddKeyword.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handleEditEmail = this.handleEditEmail.bind(this);
        this.handleKeywordIsSpecifiedChange = this.handleKeywordIsSpecifiedChange.bind(this);
        this.handleSourceIsSpecifiedChange = this.handleSourceIsSpecifiedChange.bind(this);
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


    }

    handleSourceChange(value) {
        this.setState({
            sourceValue: value,
            sourceIndeterminate: value.length > 0 && value.length < this.state.sourceAllOptions.length,
            sourceCheckAll: value.length == this.state.sourceAllOptions.length
        });

    }

    handleKeywordCheckAll(value, checked) {
        const nextValue = checked ? this.state.keywordAllOptions : [];
        this.setState({
            keywordValue: nextValue,
            keywordIndeterminate: false,
            keywordCheckAll: checked
        });

    }

    handleKeywordChange(value) {
        this.setState({
            keywordValue: value,
            keywordIndeterminate: value.length > 0 && value.length < this.state.keywordAllOptions.length,
            keywordCheckAll: value.length == this.state.keywordAllOptions.length
        });

    }

    handleKeywordSearchModeChange(name, value) {
        this.setState({
            [name]: value
        });
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

    handleSubscriptionRadioChange(value) {
        this.setState({
            subscriptionOption: value,
        });
    }

    handleFormSubmit() {
        if (this.state.emailInput != "") {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            var formatCheck = re.test(String(this.state.emailInput).toLowerCase());

            if (formatCheck) {
                var subscriptionRef = this.props.db.collection('subscriptions').doc(this.state.emailInput);
                var set = subscriptionRef.set({
                    email: this.state.emailInput,
                    option: this.state.subscriptionOption,
                    keywordSearchMode: this.state.keywordSearchMode,
                    keywordList: this.state.keywordValue,
                    keywordIsSpecified: this.state.keywordIsSpecified,
                    sourceIsSpecified: this.state.sourceIsSpecified,
                    sourceList: this.state.sourceValue,
                }).then(() => {
                    this.props.history.push('/subscribe/succeed',
                        {
                            email: this.state.emailInput,
                            option: this.state.subscriptionOption,
                            keywordSearchMode: this.state.keywordSearchMode,
                            keywordList: this.state.keywordValue,
                            keywordIsSpecified: this.state.keywordIsSpecified,
                            sourceIsSpecified: this.state.sourceIsSpecified,
                            sourceList: this.state.sourceValue
                        });
                })
            } else {
                this.props.history.push('/subscribe/fail', { email: this.state.emailInput });
            }
        } else {
            this.props.history.push('/subscribe/fail', { email: this.state.emailInput });
        }

    }

    handleNext() {
        if (this.state.emailInput != "") {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            var formatCheck = re.test(String(this.state.emailInput).toLowerCase());
            var subscriptionStatus = false

            if (formatCheck) {

                this.props.db.collection('subscriptions').doc(this.state.emailInput).get().then(function (doc) {

                    if (doc.exists) {
                        if (doc.data()['option'] == 'Subscribe') {
                            // opted in before
                            console.log('already subscribed')
                            subscriptionStatus = true
                        }
                    }
                }).catch(function (error) {
                    console.log("Error getting document:", error);
                }).then(() => {
                    this.setState({
                        errMsg: "",
                        subscriptionStatus: subscriptionStatus,
                        emailConfirmed: true
                    })
                })

            } else {
                // wrong email format
                this.setState({
                    errMsg: "Please provide a correct email address."
                })
            }
        } else {
            // didnt provide email
            this.setState({
                errMsg: "Please provide your email address."
            })
        }
    }

    handleEditEmail() {
        this.setState({
            emailConfirmed: false,
            emailInput: ""
        })
    }

    handleKeywordIsSpecifiedChange(value) {
        this.setState({
            keywordIsSpecified: value
        });
    }

    handleSourceIsSpecifiedChange(value) {
        this.setState({
            sourceIsSpecified: value
        });
    }


    render() {

        let { } = this.props;
        const { } = this.state;

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


        return (
            <div className="search-engine">

                <div className="wrapper">

                    {this.state.errMsg != ""
                        ? <h4 style={{ textAlign: 'left', marginLeft: '50px', color: 'red' }}>{this.state.errMsg}</h4>
                        : null}

                    <Form>

                        {/* for email input */}
                        <Row className="field" style={{ marginTop: '15px' }}>
                            <Col xs={3} className="name" >
                                <span>Email:</span>
                            </Col>

                            <Col xs={21} className="input">

                                {
                                    !this.state.emailConfirmed
                                        ?
                                        <InputGroup
                                            style={{ display: 'inline-flex', ...styles.inputForExtraKeyword }}
                                        >


                                            <Input
                                                placeholder='email address'
                                                onChange={
                                                    (v, e) => {
                                                        this.setState({
                                                            emailInput: v,
                                                        });
                                                    }
                                                }
                                            />

                                        </InputGroup>
                                        : null
                                }
                                {
                                    this.state.emailConfirmed
                                        ?
                                        <span style={{ fontWeight: '600', fontSize: '16px', textDecoration: 'underline' }}>{this.state.emailInput}</span>
                                        : null
                                }


                                {/* next button */}
                                {
                                    !this.state.emailConfirmed
                                        ?
                                        <Button appearance="primary" onClick={this.handleNext}>Next</Button>
                                        : null
                                }

                                {/* edit button */}
                                {
                                    this.state.emailConfirmed
                                        ?
                                        <Button appearance="primary" onClick={this.handleEditEmail}>edit</Button>
                                        : null
                                }

                            </Col>
                        </Row>

                        {/* Status */}
                        {
                            this.state.emailConfirmed ?
                                // subscription status
                                <Row className="field" style={{ marginTop: '15px' }}>
                                    <Col xs={3} className="name" >
                                        <span>Status:</span>
                                    </Col>

                                    <Col xs={21} className="input" style={{ display: 'flex', alignItems: 'center' }}>
                                        <div style={{ fontWeight: '600', fontSize: '16px' }}>
                                            {this.state.subscriptionStatus ? "Subscribed" : "Have not subscribed"}
                                        </div>
                                    </Col>
                                </Row>
                                : null
                        }

                        {/* subscription option */}
                        {
                            this.state.emailConfirmed
                                ?
                                <Row className="field">
                                    <Col xs={3} className="name" >
                                        <span>Action:</span>
                                    </Col>

                                    <Col xs={21} className="input" >

                                        <FormGroup controlId="subscriptionRadioList">
                                            <RadioGroup name="subscriptionRadioList" inline
                                                defaultValue={this.state.subscriptionOption}
                                                onChange={value => {
                                                    this.handleSubscriptionRadioChange(value);
                                                }}>
                                                <Radio value="Subscribe">Subscribe</Radio>
                                                <Radio value="Unsubscribe">Unsubscribe</Radio>
                                            </RadioGroup>
                                        </FormGroup>

                                    </Col>
                                </Row>
                                :
                                null
                        }

                        {/* Source list, borrow from search engine */}
                        {
                            this.state.emailConfirmed && this.state.subscriptionOption == 'Subscribe' ?
                                <SearchEngineSourceSubscribingForm
                                    handleSourceCheckAll={this.handleSourceCheckAll}
                                    handleSourceChange={this.handleSourceChange}
                                    sourceCheckAll={this.state.sourceCheckAll}
                                    sourceIndeterminate={this.state.sourceIndeterminate}
                                    sourceValue={this.state.sourceValue}
                                    allSource={this.state.sourceAllOptions}
                                    sourceIsSpecified={this.state.sourceIsSpecified}
                                    handleSourceIsSpecifiedChange={this.handleSourceIsSpecifiedChange}
                                /> : null
                        }

                        {/* Keyword list, borrow from search engine */}

                        {
                            this.state.emailConfirmed && this.state.subscriptionOption == 'Subscribe' ?
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
                                /> : null
                        }

                        {/* submit button */}
                        {
                            this.state.emailConfirmed
                                ?
                                <Row className="field">
                                    <Col xs={3} >
                                    </Col>

                                    <Col xs={21} className="input" >
                                        <Button appearance="primary" onClick={this.handleFormSubmit}>Update</Button>
                                    </Col>
                                </Row>
                                :
                                null
                        }

                    </Form>

                </div>

            </div>
        )

    }
}

export default withRouter(SubscribingForm);