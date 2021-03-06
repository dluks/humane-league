export const signInUser = async (token, name, email) => {
  try {
    const validateResponse = await fetch(
      `/api/v1/authenticate?token=${token}&name=${name}&email=${email}`
    );
    const validate = await validateResponse.json();
  
    return validate;
  } catch (error) {
    return error;
  }
};

export const getTwitterActions = async () => {
  try {
    const twitterFetch = await fetch('/api/v1/twitter_actions');
    const twitterActions = await twitterFetch.json();
    return twitterActions.results;
  } catch (error) {
    return error;
  }
};

export const getFacebookActions = async () => {
  try {
    const facebookFetch = await fetch('/api/v1/facebook_actions');
    const facebookActions = await facebookFetch.json();
    return facebookActions.results;
  } catch (error) {
    return error;
  }
};

export const getEmailActions = async () => {
  try {
    const emailFetch = await fetch('/api/v1/email_actions');
    const emailActions = await emailFetch.json();
    return emailActions.results;
  } catch (error) {
    return error;
  }
};

export const getPhoneActions = async () => {
  try {
    const phoneFetch = await fetch('/api/v1/phone_actions');
    const phoneActions = await phoneFetch.json();
    return phoneActions.results;
  } catch (error) {
    return error;
  }
};

export const getCompletedActions = async (id, token) => {
  try {
    const completedFetch = await fetch(`/api/v1/users/actions/${id}?token=${token}`);
    const completedActions = await completedFetch.json();
  
    return completedActions.actions;
  } catch (error) {
    return error;
  }
};

export const postAction = async (action, type, token) => {
  try {
    const actionPost = await fetch(`/api/v1/${type}_actions?token=${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(action)
    });
    const actionID = await actionPost.json();
    return actionID;
  } catch (error) {
    return error;
  }
};

export const postActionContent = async (type, actionID, token, content) => {
  try {
    const contentPost = await fetch(`/api/v1/${type}_contents?token=${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action_id: actionID.id, content })
    });
    const contentID = await contentPost.json();
  
    return contentID;
  } catch (error) {
    return error;
  }
};

export const patchAction = async (type, actionId, token, action) => {
  try {
    return await fetch(`/api/v1/${type}_actions/${actionId}?token=${token}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(action)
    });
  } catch (error) {
    return error;
  }
};

export const patchActionContent = async (type, contentId, token, content) => {
  try {
    return await fetch(`/api/v1/${type}_contents/${contentId}?token=${token}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content })
    });
  } catch (error) {
    return error;
  }
};

export const deleteActionContent = async (type, contentId, token) => {
  try {
    return await fetch(`/api/v1/${type}_contents/${contentId}?token=${token}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return error;
  }
};

export const getActionLog = async () => {
  try {
    const actionLogFetch = await fetch('/api/v1/actions');
    const actionLog = await actionLogFetch.json();
  
    return actionLog;
  } catch (error) {
    return error;
  }
};

export const patchPreferences = async (id, id_token, updates) => {
  try {
    return await fetch(`/api/v1/users/${id}?token=${id_token}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    });
  } catch (error) {
    return error;
  }
};