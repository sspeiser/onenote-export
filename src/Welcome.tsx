import React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
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
                <h4>You are logged in as {props.user.displayName}!</h4>
                <p>Choose the notes link in the navigation bar at the top of the page to get started with exporting.</p>
                <RouterNavLink to="./notes" className="nav-link" exact>Or just click here to get started</RouterNavLink>

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
                <p>This app is free and respecting your privacy in the following ways</p>
                <ul>
                    <li>Free of charge: no payment is required, no matter how much data you want to export</li>
                    <li>No data collection: no data is collected about you, your login data or your notes - in fact your notes are processed only in your browser and never touch any of our servers. We don't have tracking software in this page.</li>
                    <li>No advertisments: well ... no advertisments</li>
                    <li>Open Source: source code is available, please refer to link in navigation bar at the top of the page</li>
                    <li>No warranty and support: this app only requests read rights and so is not able to change your OneNote data, however there are no warranties and support is provided at GitHub on a best effort base</li>
                </ul>
                <p>Your support in the form of donations is very much appreciated</p>
                <ul>
                    <li><a href="https://paypal.me/mkaythx" target="_blank" rel="noreferrer">PayPal</a></li>
                    <li>BitCoin: 19ekwnds6jd9YwWtZ3H5W6iC96jFape5At<br /> <img src="bitcoin.png" width="100" alt="" /></li>
                </ul>
                <WelcomeContent
                    isAuthenticated={this.props.isAuthenticated}
                    user={this.props.user}
                    authButtonMethod={this.props.authButtonMethod} />
            </Jumbotron>
        );
    }
}