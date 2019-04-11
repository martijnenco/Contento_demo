/** Module imports **/
import React, {Component} from 'react';
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Button from "@material-ui/core/Button";

class Suggestions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      suggestions: {
        items: null
      },
      openSuggestion: false
    };
  }

  componentDidMount() {
    const api = `/api/getSuggestions`;
    fetch(api, {method: 'post'})
      .then(response => response.json())
      .then(data => this.setState({suggestions: data}))
      .catch(e => console.log(e));
  }

  schedule(suggestion) {
    this.setState({openSuggestion: suggestion});
  }

  async dismiss(suggestion) {
    const api = `/api/dismissSuggestion/${suggestion.id}`;
    fetch(api, {method: 'post'})
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          const {suggestions} = this.state;
          const index = suggestions.items.indexOf(suggestion);
          suggestions.items.splice(index, 1);
          this.setState({suggestions})
        } else {
          alert("Sorry something went wrong...")
        }
      })
      .catch(e => console.log(e));
  }

  renderSuggestions() {
    const {suggestions: {items}} = this.state;

    return (
      <>
        {items && items.map(suggestion =>
          <ListItem key={suggestion.id}>
            <ListItemText
              className={'list-text'}
              primary={suggestion.title}
              secondary={suggestion.body}>
            </ListItemText>
            <ListItemSecondaryAction>
              <Button
                variant="contained"
                onClick={() => this.schedule(suggestion)}
              >
                Schedule
              </Button>
              <Button
                variant="contained"
                onClick={() => this.dismiss(suggestion)}
              >
                Dismiss
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        )}
      </>
    )
  }

  renderScheduleSuggestion() {
    const {openSuggestion} = this.state;

    return (
      <>
        <h2>{`Scheduling suggestion: ${openSuggestion.title}`}</h2>
        <p>Sorry, this page isn't ready yet</p>
        <Button
          variant="contained"
          onClick={() => this.setState({openSuggestion: false})}
        >
          Ok, back to the list
        </Button>
      </>
    )
  }

  render() {
    const {openSuggestion} = this.state;

    return (
      <>
        {openSuggestion === false && this.renderSuggestions()}
        {openSuggestion && this.renderScheduleSuggestion()}
      </>
    );
  }
}

export default Suggestions;