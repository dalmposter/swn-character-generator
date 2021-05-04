import React from "react";

interface PanelFrameProps {
    descriptionLong: string;
    descriptionShort: string;
    title: string;
    className: string;
}

export default class PanelFrame extends React.Component<PanelFrameProps, {}>
{
    render()
    {
        return (
            <div className={`${this.props.className} Panel`}>
                <h1 style={{paddingBottom: "16px"}}>{this.props.title}</h1>
                <div className="flexbox">
                    <div className="panel-content">
                        {this.props.children}
                    </div>
                    <div className="panel-header">
                        <p>{this.props.descriptionLong}</p>
                        <p>{this.props.descriptionShort}</p>
                    </div>
                </div>
            </div>
        );
    }
}