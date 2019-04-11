/** Module imports **/
import React, {Component} from 'react';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

/** Content imports **/
import Suggestions from './containers/suggestionComponent';

/** Styling imports **/
import './App.css';

class App extends Component {
  render() {
    return (
      <List className={'app'} dense={false}>
        <ListItem>
          <ListItemText className={'head'}>
            <h1>Contento</h1>
          </ListItemText>
        </ListItem>
        <Suggestions/>
      </List>
    );
  }
}

export default App;
