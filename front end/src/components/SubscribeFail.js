import React from 'react'
import { withRouter } from 'react-router-dom'
import { Icon } from 'rsuite'

// this component is not used
const SubscribeFail = (props) => {
    let goBack = () => {
        props.history.goBack();
    }

    return (
        <div>
            
            
            <div style={{ textAlign: "centre" }}>
                <Icon icon='close-circle' style={{ color: 'red', marginRight: '10px' }} />
                You did not provide or provided a wrong email address:
            </div>

            <h4>
                {props.location.state.email}
            </h4>
            <div style={{marginTop:'20px'}}>
                <button style={{borderRadius:'5%', background:'grey', color:'white'}} onClick={goBack}>Go Back</button>
            </div>

        </div>
    )
}

export default withRouter(SubscribeFail)