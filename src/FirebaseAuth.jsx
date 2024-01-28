import React from 'react';

// Global ID for the element.
const ELEMENT_ID = 'firebaseui_container';

// Promise that resolves unless the FirebaseUI instance is currently being deleted.
let firebaseUiDeletion = Promise.resolve();

/**
 * React Component wrapper for the FirebaseUI Auth widget.
 */
export default class FirebaseAuth extends React.Component {
  /**
   * Constructor  Firebase Auth UI component
   *
   * @param {Object} props - Additional object properties.
   * @constructor
   */
  constructor(props) {
    super(props);

    this.lang = props.lang;
    this.uiConfig = props.uiConfig;
    this.firebaseAuth = props.firebaseAuth;
    this.className = props.className;
    this.uiCallback = props.uiCallback;
    this.unregisterAuthObserver = () => {};
  }

  /**
   * @inheritDoc
   */
  async componentDidMount() {
    // Import the css only on the client.
    require('firebaseui/dist/firebaseui.css');

    // Firebase UI only works on the Client. So we're loading the package in `componentDidMount`
    // So that this works when doing server-side rendering.
    this.lang ||= 'en';
    if (this.lang === 'pt') this.lang = 'pt_br';
    const firebaseui = await import(`../firebaseui-i18n/esm__${this.lang}`);

    // Wait in case the firebase UI instance is being deleted.
    // This can happen if you unmount/remount the element quickly.
    await firebaseUiDeletion;
    // Get or Create a firebaseUI instance.
    this.firebaseUiWidget = firebaseui.auth.AuthUI.getInstance()
      || new firebaseui.auth.AuthUI(this.firebaseAuth);
    if (this.uiConfig.signInFlow === 'popup') {
      this.firebaseUiWidget.reset();
    }
    // We track the auth state to reset firebaseUi if the user signs out.
    this.userSignedIn = false;
    this.unregisterAuthObserver = this.firebaseAuth.onAuthStateChanged((user) => {
      if (!user && this.userSignedIn) {
        this.firebaseUiWidget.reset();
      }
      this.userSignedIn = !!user;
    });
    // Trigger the callback if any was set.
    if (this.uiCallback) {
      this.uiCallback(this.firebaseUiWidget);
    }
    // Render the firebaseUi Widget.
    this.firebaseUiWidget.start('#' + ELEMENT_ID, this.uiConfig);
  }

  /**
   * @inheritDoc
   */
  componentWillUnmount() {
    firebaseUiDeletion = firebaseUiDeletion.then(() => {
      this.unregisterAuthObserver();
      return this.firebaseUiWidget.delete();
    });
    return firebaseUiDeletion;
  }

  /**
   * @inheritDoc
   */
  render() {
    return (
      <div className={this.className} id={ELEMENT_ID}/>
    );
  }
}
