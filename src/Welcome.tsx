import React from 'react';
import {
    Button,
    Jumbotron
} from 'reactstrap';

interface WelcomeProps {
    isAuthenticated: boolean;
    authButtonMethod: any;
    user: any;
}

interface WelcomeState {
    isOpen: boolean;
}

function WelcomeContent(props: WelcomeProps) {
    // If authenticated, greet the user
    if (props.isAuthenticated) {
        return (
            <div>
                <h4>Welcome {props.user.displayName}!</h4>
                <p>Choose the notes link in the navigation bar at the top of the page to get started with exporting.</p>
            </div>
        );
    }

    // Not authenticated, present a sign in button
    return <Button color="primary" onClick={props.authButtonMethod}>Before you can export your notes you have to sign into your Microsoft account</Button>;
}

export default class Welcome extends React.Component<WelcomeProps, WelcomeState> {
    render() {
        return (
            <Jumbotron>
                <h1>OneNote Export</h1>
                <p className="lead">
                    This app exports your OneNote notes from Microsoft 365 as a zip file containing your notes in html or markdown format and any embedded images and files.
          </p>
                <p>This app is free in the following sense</p>
                <ul>
                    <li>Free of charge: no payment is required, no matter how much data you want to export</li>
                    <li>Free of analytics: no data is collected about you, your login data or your notes - in fact your notes are processed only in your browser and never touch any of our servers</li>
                    <li>Free of advertisments ... well: no advertisments</li>
                    <li>Free to be reviewed: source code is available, please refer to link in navigation bar at the top of the page</li>
                    <li>Free of warranty and support: this app only requests read rights and so is not able to change your OneNote data, however there are no warranties and support is provided at GitHub on a best effort base</li>
                </ul>
                <p>However your support in the form of donations is very much appreciated</p>
                <ul>
                    <li>PayPal</li>
                    <li></li>
                    <li>BitCoin</li>
                </ul>
                <WelcomeContent
                    isAuthenticated={this.props.isAuthenticated}
                    user={this.props.user}
                    authButtonMethod={this.props.authButtonMethod} />
            </Jumbotron>
        );
    }
}