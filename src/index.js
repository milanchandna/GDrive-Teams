import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { List, Image } from '@fluentui/react-northstar'
import { Button, Flex } from '@fluentui/react-northstar'
import { Provider, teamsTheme } from '@fluentui/react-northstar'
//import MicrosoftTeams from '@microsoft/teams-js'
//import {PrimaryButton, TeamsComponentContext, ThemeStyle } from 'msteams-ui-components-react'
//import getContext from 'msteams-ui-styles-core'

class GApi extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isSignedIn : false,
            files : [],
            //theme: ThemeStyle.Light,
            fontSize: 16
        }

        this.handleClientLoad = this.handleClientLoad.bind(this);
        this.initClient = this.initClient.bind(this);
        this.handleAuthClick = this.handleAuthClick.bind(this);
        this.handleSignoutClick = this.handleSignoutClick.bind(this);
        this.updateSigninStatus = this.updateSigninStatus.bind(this)
        this.fetchFiles = this.fetchFiles.bind(this)
        //this.listFiles = this.listFiles.bind(this)
    }

    componentDidMount() {
        const script = document.createElement("script");
        script.onload = this.handleClientLoad;
        script.src = "https://apis.google.com/js/api.js";
        script.async = true;
        document.body.appendChild(script);

        // If you are deploying your site as a MS Teams static or configurable tab, you should add ?theme={theme} to
        // your tabs URL in the manifest. That way you will get the current theme on start up (calling getContext on
        // the MS Teams SDK has a delay and may cause the default theme to flash before the real one is returned).
        //this.updateTheme(this.getQueryVariable('theme'));
        // this.setState({
        //     fontSize: this.pageFontSize(),
        // });
    
        // If you are not using the MS Teams web SDK, you can remove this entire if block, otherwise if you want theme
        // changes in the MS Teams client to propogate to the page, you should leave this here.
        // if (this.inTeams()) {
        //     microsoftTeams.initialize();
        //     microsoftTeams.registerOnThemeChangeHandler(this.updateTheme);
        // }
    }

    handleClientLoad() {
        gapi.load('client:auth2', this.initClient);
        this.setState({
            api: gapi,
            isSignedIn: false,
            files: []
        });
    }

    updateSigninStatus() {
        if (this.state.isSignedIn) {
            document.getElementById('signinbutton').style.display = 'none';
            document.getElementById('signoutbutton').style.display = 'block';
            this.fetchFiles();
        } else {
            document.getElementById('signinbutton').style.display = 'block';
            document.getElementById('signoutbutton').style.display = 'none';
        }
    }

    fetchFiles() {
        this.state.api.client.drive.files.list({
            'pageSize': 100,
            'fields': "nextPageToken, files(id, name, webViewLink, parents, webContentLink)"
        }).then((response) => {
            this.setState({
                files : response.result.files
            });
        });
    }

    initClient() {
        gapi.client.init({
            apiKey: 'xxx', // Fill Google app API key here
            clientId: 'xxx.apps.googleusercontent.com', // Fill Google Clientid here
            discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
            scope: 'https://www.googleapis.com/auth/drive.metadata.readonly'
        }).then(() => {
            // Listen for sign-in state changes.
            //gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
            var signedin = gapi.auth2.getAuthInstance().isSignedIn.get();
            // Handle the initial sign-in state.
            this.setState({
                isSignedIn : signedin
            });
            this.updateSigninStatus();
        }, function(error) {
            //appendPre(JSON.stringify(error, null, 2));
        });
    }

    handleAuthClick() {
        this.state.api.auth2.getAuthInstance().signIn();
    }

    handleSignoutClick() {
        this.state.api.auth2.getAuthInstance().signOut();
    }

    render() {
        return(
            <div>
                <Button id="signinbutton" onClick={this.handleAuthClick} display="block">Sign In</Button>
                <Button id="signoutbutton" onClick={this.handleSignoutClick} display="block">Sign Out</Button>
                <List>
                {
                    this.state.files.map(
                        (file) =>
                        <a href={file.webContentLink}>
                        <List.Item
                            content = 
                            {file.name}
                            selectable
                            key={file.id}
                        />
                        </a>
                    )
                }
                </List>
            </div>
        )
    }
}

{/* <List selectable defaultSelectedIndex={0} key={file.id} content={file.name} ></List> */}
// /**
//  *  Called when the signed in status changes, to update the UI
//  *  appropriately. After a sign-in, the API is called.
// */
// function updateSigninStatus(isSignedIn) {
//     if (isSignedIn) {
//         authorizeButton.style.display = 'none';
//         signoutButton.style.display = 'block';
//         listFiles();
//     } else {
//         authorizeButton.style.display = 'block';
//         signoutButton.style.display = 'none';
//     }
// }

// /**
//  *  Sign in the user upon button click.
//  */
// function handleAuthClick(event) {
//     gapi.auth2.getAuthInstance().signIn();
// }

// /**
//  *  Sign out the user upon button click.
//  */
// function handleSignoutClick(event) {
//     gapi.auth2.getAuthInstance().signOut();
// }

// function listFiles() {
//     gapi.client.drive.files.list({
//         'pageSize': 1000,
//         'fields': "nextPageToken, files(id, name, webViewLink, parents, webContentLink)"
//         }).then(function(response) {
//         appendPre('Files:');
//         var files = response.result.files;
        
//     });
// }

export default GApi;

const root = document.getElementById('root');
root ? ReactDOM.render(<GApi />, root) : false;