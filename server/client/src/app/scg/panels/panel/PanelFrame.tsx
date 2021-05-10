import React from "react";
import { Message } from "rsuite";

interface PanelFrameProps {
    descriptionLong?: string;
    descriptionShort?: string;
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
                        {this.props.descriptionShort &&
                            <Message
                                type="info"
                                description={this.props.descriptionShort}
                            />
                        }
                        { this.props.descriptionLong &&
                            <Message
                                style={{backgroundColor: "whitesmoke"}}
                                description={this.props.descriptionLong}
                            />
                        }
                    </div>
                </div>
            </div>
        );
    }
}