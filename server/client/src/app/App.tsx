import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Footer from "./components/footer/Footer";
import Home from "./home/Home";
import Scg from "./scg/Scg";
import Wiki from "./wiki/Wiki";
import "./app.scss";
import Header from "./components/header/Header";

// Client HOC to store any state we want to persist across pages
export default class App extends Component
{
    // Cache stuff here to save it when visiting other pages.
    // Then pass as props to the page components

    render()
    {
        return (
        <div className="App">
            <div id="page-wrapper">
                <BrowserRouter>
                    <Switch>
                        { /* Router to render component based on visited url */ }
                        <Route exact path='/' component={Home} />
                        <Route path='/wiki' component={Wiki} />
                        <Route path='/scg' component={Scg} />
                    </Switch>
                </BrowserRouter>
            </div>
            <Footer/>
        </div>
        )
    }
}