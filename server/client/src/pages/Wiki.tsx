import React, { Component } from 'react';
import { WikiProps, WikiState } from './Wiki.types';

class Wiki extends Component<WikiProps, WikiState>
{
  // Initialize the state
  constructor(props) {
    super(props);
    this.state = {
      list: []
    }
  }

  // Fetch the list on first mount
  componentDidMount() {
    this.getList();
  }

  // Retrieves the list of items from the Express app
  getList = () => {
    fetch('/api/skills')
    .then(res => res.json())
    .then(list => this.setState({ list }))
  }

  render() {
    const { list } = this.state;

    return (
      <div className="App">
        <h1>List of Skills</h1>
        {/* Check to see if any items are found*/}
        {list.length ? (
          <div>
            {/* Render the list of items */}
            {list.map((item) => {
              return(
                <div>
                  {JSON.stringify(item)}
                </div>
              );
            })}
          </div>
        ) : (
          <div>
            <h2>No Skills Found In Database</h2>
          </div>
        )
      }
      </div>
    );
  }
}

export default Wiki;
