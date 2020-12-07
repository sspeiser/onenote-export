import React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import {
    Button,
    Collapse,
    Container,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';
import '@fortawesome/fontawesome-free/css/all.css';

interface NavBarProps {
    isAuthenticated: boolean;
    authButtonMethod: any;
    user: any;
}

interface NavBarState {
    isOpen: boolean;
}

function UserAvatar(props: any) {
    // If a user avatar is available, return an img tag with the pic
    if (props.user.avatar) {
        return <img
            src={props.user.avatar} alt="user"
            className="rounded-circle align-self-center mr-2"
            style={{ width: '32px' }}></img>;
    }

    // No avatar available, return a default icon
    return <i
        className="far fa-user-circle fa-lg rounded-circle align-self-center mr-2"
        style={{ width: '32px' }}></i>;
}

function AuthNavItem(props: NavBarProps) {
    // If authenticated, return a dropdown with the user's info and a
    // sign out button
    if (props.isAuthenticated) {
        return (
            <UncontrolledDropdown>
                <DropdownToggle nav caret>
                    <UserAvatar user={props.user} />
                </DropdownToggle>
                <DropdownMenu right>
                    <h5 className="dropdown-item-text mb-0">{props.user.displayName}</h5>
                    <p className="dropdown-item-text text-muted mb-0">{props.user.email}</p>
                    <DropdownItem divider />
                    <DropdownItem onClick={props.authButtonMethod}>Sign Out</DropdownItem>
                </DropdownMenu>
            </UncontrolledDropdown>
        );
    }

    // Not authenticated, return a sign in link
    return (
        <NavItem>
            <Button
                onClick={props.authButtonMethod}
                className="btn-link nav-link border-0"
                color="link">Sign In</Button>
        </NavItem>
    );
}

export default class NavBar extends React.Component<NavBarProps, NavBarState> {
    constructor(props: NavBarProps) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false
        };
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        // Only show notes nav item if logged in
        let notesLink = null;
        if (this.props.isAuthenticated) {
            notesLink = (
                <NavItem>
                    <RouterNavLink to="/notes" className="nav-link" exact>Notes</RouterNavLink>
                </NavItem>
            );
        }

        return (
            <div>
                <Navbar color="dark" dark expand="md" fixed="top">
                    <Container>
                        <NavbarBrand href="/">OneNote Export</NavbarBrand>
                        <NavbarToggler onClick={this.toggle} />
                        <Collapse isOpen={this.state.isOpen} navbar>
                            <Nav className="mr-auto" navbar>
                                <NavItem>
                                    <RouterNavLink to="/" className="nav-link" exact>Home</RouterNavLink>
                                </NavItem>
                                {notesLink}
                            </Nav>
                            <Nav className="justify-content-end" navbar>
                                <NavItem>
                                    {/* <RouterNavLink to="/" className="nav-link" exact>Donate</RouterNavLink> */}
                                    <NavLink href="https://paypal.me/mkaythx" target="_blank">
                                        <i className="fas fa-external-link-alt mr-1"></i>
                    Donate
                  </NavLink>

                                </NavItem>
                                <NavItem>
                                    <NavLink href="https://github.com/sspeiser/onenote-export" target="_blank">
                                        <i className="fas fa-external-link-alt mr-1"></i>
                    Support and Source Code
                  </NavLink>
                                </NavItem>
                                <AuthNavItem
                                    isAuthenticated={this.props.isAuthenticated}
                                    authButtonMethod={this.props.authButtonMethod}
                                    user={this.props.user} />
                            </Nav>
                        </Collapse>
                    </Container>
                </Navbar>
            </div >
        );
    }
}