import React from "react";
import "@/styles/dashboardStyles/projectStyles/productBacklog/ContainerAsWantFor.css";

export default function ContainerAsWantFor({ como, quiero, para, onComoChange, onQuieroChange, onParaChange }) {
  return (
    <div className="containerDescription">
      <div className="customInput">
        <label htmlFor="customPlaceholderInput1" className="placeholderLabel">Como...</label>
        <input
          type="text"
          id="customPlaceholderInput1"
          className="customPlaceholderInput"
          placeholder="Escribe aquí"
          maxLength="200"
          value={como}
          onChange={(e) => onComoChange(e.target.value)}
        />
      </div>
      <div className="customInput">
        <label htmlFor="customPlaceholderInput2" className="placeholderLabel">Quiero...</label>
        <input
          type="text"
          id="customPlaceholderInput2"
          className="customPlaceholderInput"
          placeholder="Escribe aquí"
          maxLength="200"
          value={quiero}
          onChange={(e) => onQuieroChange(e.target.value)}
        />
      </div>
      <div className="customInput">
        <label htmlFor="customPlaceholderInput3" className="placeholderLabel">Para...</label>
        <textarea
          rows="3"
          id="customPlaceholderInput3"
          className="customPlaceholderInput"
          placeholder="Escribe aquí"
          maxLength="400"
          value={para}
          onChange={(e) => onParaChange(e.target.value)}
        />
      </div>
    </div>
  );
}
