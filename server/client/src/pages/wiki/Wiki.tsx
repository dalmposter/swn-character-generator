import React, { Component } from 'react';
import { WikiProps, WikiState } from './Wiki.types';
import "./wiki.scss";

class Wiki extends Component<WikiProps, WikiState>
{
  // Initialize the state
  constructor(props) {
    super(props);
    this.state = {
      selectedCategory: "backgrounds",
      skills: [],
      backgrounds: [],
      weapons: [],
    }
  }

  // Fetch the skills on first mount
  componentDidMount() {
    this.getSkills();
    this.getBackgrounds();
    this.getWeapons();
  }

  // Retrieves the skills of items from the Express app
  getSkills = () => {
    fetch('/api/skills')
    .then(res => res.json())
    .then(skills => this.setState({ skills }));
  }

  getBackgrounds = () => {
    fetch('/api/backgrounds')
    .then(res => res.json())
    .then(backgrounds => this.setState({ backgrounds }));
  }

  getWeapons = () => {
    fetch('/api/weapons')
    .then(res => res.json())
    .then(weapons => this.setState({ weapons }));
  }

  makeCatOptions = (): React.ReactNode => ["backgrounds", "skills", "weapons"].map(
    (category: string) => <option value={category}>{category}</option>);

  render() {
    const list = this.state[this.state.selectedCategory];

    return (
      <div className="Wiki">
        <h1>SWN Object Database</h1>
        <select name="categories" id="categories"
          onChange={(e: React.ChangeEvent) => this.setState(
            { selectedCategory: e.target["value"] })
          }
        >
          { this.makeCatOptions() }
        </select>
        {/* Check to see if any items are found*/}
        {list.length ? (
          <div>
            <table style={{ width: "100%" }}>
              <tr>
                { Object.keys(list[0]).map(value => <th>{value}</th>) }
              </tr>
            {/* Render the skills of items */}
            {list.map((item) => {
              return(
                <tr key={item.id}>
                  { Object.values(item).map(value => <td>{value}</td>)}
                </tr>
              );
            })}
            </table>
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
