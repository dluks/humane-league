import React, { Component } from 'react';
import { connect } from 'react-redux';

// import './UpdateAction.css';

class UpdateAction extends Component {
  constructor() {
    super();
    this.state = {
      actionType: 'facebook',
      action: {},
      showForm: false,
      facebook: [],
      twitter: [],
      email: [],
      phone: []
    }
  }

  async componentDidMount() {
    const facebookFetch = await fetch('/api/v1/facebook_actions');
    const facebookActions = await facebookFetch.json();
    const facebook = facebookActions.results;

    const twitterFetch = await fetch('/api/v1/twitter_actions');
    const twitterActions = await twitterFetch.json();
    const twitter = twitterActions.results;

    const emailFetch = await fetch('/api/v1/email_actions');
    const emailActions = await emailFetch.json();
    const email = emailActions.results;

    const phoneFetch = await fetch('/api/v1/phone_actions');
    const phoneActions = await phoneFetch.json();
    const phone = phoneActions.results;

    await this.setState({ facebook, twitter, email, phone });
  };

  handleChange = () => {
    const actionType = this.updateActionTypes.value;
    
    this.setState({ actionType });
  }

  handleActionClick = (event) => {
    const actionId = event.target.dataset.id;
    const action = this.state[this.state.actionType].find(action => action.id == actionId);
    console.log(action)

    this.setState({ showForm: true, actionEnabled: action.enabled, action });
  }

  submitPatch = async () => {
    const oldAction = this.state.action;
    const type = this.state.actionType;

    const action = Object.assign({ ...oldAction }, { enabled: this.state.actionEnabled });

    const token = this.props.user.id_token;
    const actionPatch = await fetch(`/api/v1/${type}_actions/${action.id}?token=${token}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(action)
    });
    console.log(actionPatch);
    // const result = await actionPatch.json();
    // console.log(result);
  }

  render() {
    const actions = this.state[this.state.actionType].map((action, i) => {
      return (
        <li key={`li-${i}`} className='action'>
          <p data-id={action.id} onClick={this.handleActionClick}>{`ACTION ${i}: ${action.title}`}</p>
        </li>
      )
    });

    return (
      <div className='UpdateAction'>
        <h1>Enable and Disable <span>{this.state.actionType.toUpperCase()}</span> Actions</h1>
        <label htmlFor='action-types'>Select Action Type:
          <select onChange={this.handleChange} ref={(elem) => {this.updateActionTypes = elem}} name='action-types' id='action-types'>
            <option value='facebook'>Facebook</option>
            <option value='twitter'>Twitter</option>
            <option value='email'>Email</option>
            <option value='phone'>Phone</option>
          </select>
        </label>
        {
          this.state.showForm &&
          <div className='update-form'>   
            <span id='toggle'>
              <input onChange={() => this.setState({ actionEnabled: !this.state.actionEnabled })} checked={this.state.actionEnabled} ref={(elem) => {this.toggle = elem}} type='checkbox'/>
              <label 
                data-on='enabled' 
                data-off='disabled'>
              </label>
            </span>
            <button onClick={this.submitPatch} className='update-action'>Save Update</button>
          </div>
        }
        <div className='actions-container'>
          <ul className='actions'>
            {actions}
          </ul>
        </div>
      </div>
    )
  }
}

const mapStateToProps = store => ({
  user: store.User
});

export default connect(mapStateToProps, null)(UpdateAction);