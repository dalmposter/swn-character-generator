import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import Wiki from "./pages/Wiki";



export default class App extends Component
{
    render()
    {
        return (
            // Router to render component based on visited url
            <BrowserRouter>
                <Switch>
                    <Route exact path='/' component={Home}/>
                    <Route path='/wiki' component={Wiki}/>
                </Switch>
            </BrowserRouter>
        )
    }
}