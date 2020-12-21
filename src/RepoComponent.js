import React from "react";
import './App.css';

export const Repo = props => (
    <div className="Repository">
        <p>{props.name}</p>
        <a href={props.url} target="_blank" rel="noreferrer">{props.url}</a>
        <p />
        <i className="Description">{props.description}</i>
    </div>
)