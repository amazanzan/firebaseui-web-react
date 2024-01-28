import * as firebaseui from '../firebaseui-i18n/esm__en';
import * as React from 'react';

export interface Props {
  lang: string;
  uiConfig: firebaseui.auth.Config;
  uiCallback?(ui: firebaseui.auth.AuthUI): void;
  firebaseAuth: any; // As firebaseui-web
  className?: string;
}

export class StyledFirebaseAuth extends React.Component<Props> {}
export class FirebaseAuth extends React.Component<Props> {}
