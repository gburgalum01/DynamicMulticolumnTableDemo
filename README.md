# Dynamic Multicolumn Table Demo

## Description

This demo shows how to use the jQuery library to build a multicolumn table where groups of items are balanced across the columns of the table 
such that the leftmost column has the most items and the number of items in subsequent columns is equal to or less than the number in the leftmost column.


## Setup
There are two configurable parameters in the *dynamic-multicolumn-table.js* file.

* **numColumns** - The number of columns to be displayed in the table.
* **numGroups** - The number of groups of items to be rendered in the table.

Note that the *getItems* function is currently written to populate a list of items labeled *Item 0...Item n* for a group where *n* is the total number of items randomly assigned to a group.

## How To Run

Open the *dynamic-multicolumn-table.html* file in any web browser to view the multicolumn table.
