import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Home extends Component
{
  render()
  {
    return (
      <div className="App">
        <h1>SWN Character Generator</h1>
        {/* Link to Wiki element via react router */}
        <Link to={'./wiki'}>
          <button>
              Wiki
          </button>
        </Link>
      </div>
    );
  }
}

export default Home;
