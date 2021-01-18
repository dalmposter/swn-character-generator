import React, { Component } from 'react';
import { WikiProps, WikiState } from './Wiki.types';
import "./wiki.scss";
import { Background } from '../../types/Object.types';

class Wiki extends Component<WikiProps, WikiState>
{
	// Initialize the state
	constructor(props: WikiProps) {
		super(props);
		this.state = {
			selectedCategory: "backgrounds",
			skills: [],
			backgrounds: [],
			weapons: [],
			"psychic-powers": [],
			armours: [],
			cyberwares: [],
			equipments: [],
			foci: [],
			stims: [],
			classes: [],
			"class-descriptions": [],
			"equipment-packages": [],
		}
	}

  	// Fetch the backgrounds on first mount
	componentDidMount() {
		this.getBackgrounds();
	}

  	getBackgrounds = () => {
		fetch('/api/backgrounds')
		.then(res => res.json())
		// Convert map from API to array of backgrounds
		.then(backgroundMap => Object.values(backgroundMap))
		.then((backgrounds: Background[]) => this.setState({ backgrounds }));
  	}

	onCategoryChange = (e: React.ChangeEvent) => {
		var newValue = e.target["value"];
		this.setState({ selectedCategory: newValue });
		console.log("Category updated");
		if(this.state[newValue] && this.state[newValue].length > 0) return;

		fetch(`/api/${newValue}`)
		.then(res => res.json())
		// Convert map from API to array of objects
		.then(objectMap => Object.values(objectMap))
		.then(objects => {
			let newState = {};
			newState[newValue] = objects;
			console.log("Fetching new items, new state: ", newState);
			this.setState(newState);
		})
	}

  makeCatOptions = (): React.ReactNode =>
		  [	"backgrounds", "skills", "weapons", "psychic-powers",
			"armours", "cyberwares", "equipments", "foci", "stims",
			"classes", "class-descriptions", "equipment-packages" ].map(
    (category: string) => <option key={category} value={category}>{category}</option>);

  render() {
    const list: any[] = this.state[this.state.selectedCategory];

    return (
      <div className="Wiki">
        <h1>SWN Object Database</h1>
        <select name="categories" id="categories"
          onChange={ this.onCategoryChange }
        >
          { this.makeCatOptions() }
        </select>
        { /* Check to see if any items are found*/ }
        {list.length ? (
          <div>
            <table style={{ width: "100%" }}>
				<thead>
					<tr>
						{ Object.keys(list[0]).map(value => <th key={`header-${value}`}>{value}</th>) }
					</tr>
				</thead>
            	{/* Render the skills of items */}
				<tbody>
				{list.map((item) => {
				return(
					<tr key={item.id}>
					{ Object.values(item).map((value: any, index: number) =>
						<td key={`${item.id}-${index}`}>{value != null ? typeof value === 'object' ? JSON.stringify(value) : value.toString() : "-"}</td>) }
					</tr>
				);
				})}
				</tbody>
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
