import React from 'react'
import SearchEngine from './Search_Engine'
import SubscribingForm from './SubscribingForm'
import SubscribeSucceed from './SubscribeSucceed'
import SubscribeFail from './SubscribeFail'

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

const SubscribingTabWrapper = (props) => {
    const { } = props

    return (

        <div>

            <Switch>

                <Route path="/subscribe/fail">
                    <SubscribeFail />
                </Route>

                <Route path="/subscribe/succeed">
                    <SubscribeSucceed />
                </Route>

                <Route path="/subscribe">
                    <SubscribingForm
                        sourceAllOptions={props.sourceAllOptions}
                        keywordAllOptions={props.keywordAllOptions}
                        keywordIsSpecified={props.keywordIsSpecified}
                        sourceIsSpecified={true}
                        sourceValue={props.sourceValue}
                        keywordValue={props.keywordValue}
                        

                        db={props.db}
                    />
                </Route>

            </Switch>

        </div>
    )
}

export default SubscribingTabWrapper