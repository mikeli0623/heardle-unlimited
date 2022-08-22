import React, { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import { matchSorter } from "match-sorter";

// forwardRef again here!
// Dropdown needs access to the DOM of the Menu to measure it
const CustomMenu = React.forwardRef(
  ({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
    const [value, setValue] = useState("");

    return (
      <div
        ref={ref}
        style={style}
        className={className}
        aria-labelledby={labeledBy}
      >
        <Form.Control
          autoFocus
          className="mx-3 my-2 w-auto"
          placeholder="Type to filter..."
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
        <ul className="list-unstyled">
          {matchSorter(React.Children.toArray(children), value, {
            keys: ["props.children"],
          })}
        </ul>
      </div>
    );
  }
);

export default function FilteredDropdown({
  name,
  list,
  clear,
  activeItem,
  setActiveItem,
}) {
  return (
    <Dropdown>
      <Dropdown.Toggle>{name}</Dropdown.Toggle>
      <Dropdown.Menu as={CustomMenu} variant="dark">
        {list.map((item, index) => {
          return (
            <Dropdown.Item
              key={index}
              active={item === activeItem}
              onClick={(e) => {
                clear();
                setActiveItem(e.target.innerHTML);
              }}
            >
              {item}
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
}
