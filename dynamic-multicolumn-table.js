/**
 * dynamic-multicolumn-table.js
 * 
 * This script builds a table with a specified number of columns where a specified number of 
 * groups of items are added across the columns.
**/

var numColumns = 3;  //Set the number of columns to be shown in the table.
var numGroups = 11;  //Set the number of groups of items to create in the table.

//Build the table when the document is loaded.
$(document).ready(function() {
	buildTable();	
});
	
//This function builds the multicolumn table.	
function buildTable() {
		
	var groups = [];
	var previousGroup;
			
	//Get the items to be displayed.
	var items = getItems();
	
	//Determine the number of groups of items to be displayed per column.
	var numGroupsPerColumn = Math.ceil(numGroups / numColumns);
			
	$('#tableHeader').prop('colspan', numColumns);
		
	var displayColumns = [];
	for (var z = 0; z < numColumns; z++) {
		displayColumns.push([]);
	}
			
	//For each item, determine if it should be assigned to a new group
	//or an existing group.
	items.forEach(function(item, i) {
		if (item.GROUP !== previousGroup) {
			var group = {
				GROUP_NAME: item.GROUP,
				ITEMS: [item.DESC]
			}
			groups.push(group);
			previousGroup = item.GROUP;
		}
		else {
			var groupIndex = findGroup(groups, item.GROUP);
			groups[groupIndex].ITEMS.push(item.DESC);
		}
	});
			
	//Split the groups into the number of columns to be displayed.	
	for (var i = 0; i < groups.length; i++) {
		var colNumber = Math.floor(i / numGroupsPerColumn);
		console.log('col: ' + colNumber);
		displayColumns[colNumber].push(groups[i]);
	}
	
	//Build a dynamic JavaScript statement such that iterates over each column and moves a group of items to
	//the current column if the number of items in the next column over exceeds that of the current column.
	if (numColumns > 1) {
		var rebalancing = 'while ('
		for (var x = 0; x < numColumns - 1; x++) {
			rebalancing += 'getNumOfItemsInColumn(displayColumns[' + (x+1) + ']) > getNumOfItemsInColumn(displayColumns[' + x + '])';
			if (x < numColumns - 2) {
				rebalancing += ' || ';
			} 	
		}
		rebalancing += ') {';
		for (var x = 0; x < numColumns - 1; x++) {
			rebalancing += 'if (getNumOfItemsInColumn(displayColumns[' + (x+1) + ']) > getNumOfItemsInColumn(displayColumns[' + x + '])) {\n';
			rebalancing += 'var groupToMove = displayColumns[' + (x+1) + '].shift();\n';
			rebalancing += 'displayColumns[' + x + '].push(groupToMove);\n';
			rebalancing += '}\n';
		}
		
		rebalancing += '}';
		console.log(rebalancing);

		//Execute the script to rebalance the items in each column.  This ensures that for each set of two columns,
		//the left column has more items than the right column.
		eval(rebalancing);	
	}
			
	//Render the columns of items.
	for (var z = 0; z < displayColumns.length; z++) {
		var rowNumberNew = 0;
		for (var i = 0; i < displayColumns[z].length; i++) {
			rowNumberNew++;
			var currentRow = getRow(rowNumberNew);
			var currentColumn = getColumn(currentRow, z+1);
					
			currentColumn.css({'background-color':'#AEB6BF'});
			currentColumn.html('<b>' + displayColumns[z][i].GROUP_NAME + '</b>');
					
			for (var j = 0; j < displayColumns[z][i].ITEMS.length; j++) {
				rowNumberNew++;
				currentRow = getRow(rowNumberNew);
				currentColumn = getColumn(currentRow, z+1);
				currentColumn.html(displayColumns[z][i].ITEMS[j]);
			}				
		}
	}
}

//This function retrieves the items to be displayed in each group.
//NOTE: This function sets the number of items in a group based on the group index.	
function getItems() {
		
	var items = [];
	
	//Iterate over each group and build the items for that group.
	for (var i = 0; i < numGroups; i++) {
		var numItems = 1;
		
		if (i == 8 || i == 5) {
			numItems = 6;
		}
		else if (i == 9) {
			numItems = 8;
		}
		else if (i == 7) {
			numItems = 6;
		}
		else if (i == 10 || i == 11) {
			numItems = 10;
		}
		
		//Build an object for each item that specifies its group index and a description
		//of the item.
		for (var j = 0; j < numItems; j++) {
			var item = {
				GROUP: 'Group ' + i,
				DESC: 'Item ' + j
			}
			items.push(item);
		}
	}
	
	return items;
}

//This function determines the index of the group in the groups list based on the group name.
function findGroup(groups, groupName) {
		
	for (var i = 0; i < groups.length; i++) {
		if (groups[i].GROUP_NAME === groupName) {
			return i;
		}
	}
	return -1;
}
		
//This function determines the number of items that have been assigned to a column.
function getNumOfItemsInColumn(columnList) {
	
	var numOfItemsInColumn = 0;
	
	for (var i = 0; i < columnList.length; i++) {
		numOfItemsInColumn += columnList[i].ITEMS.length;
	}
	
	return numOfItemsInColumn;
}
	
//This function attempts to retrieve the row based on the row number.
function getRow(rowNumber) {
	
	//If the row with the given number does not exist, add it to the table.
	if ($('#row_' + rowNumber).length === 0) {
		$('#multiColumnRows').append('<tr id="row_' + rowNumber + '"/>');
		for (var i = 1; i <= numColumns; i++) {
			$('#row_' + rowNumber).append('<td id="row_' + rowNumber + '_column_' + i + '"/>');
			
		}
	}	
	
	return $('#row_' + rowNumber);
}	
	
//This function retrieves a column based on the row identifier and the column number.
function getColumn(row, columnNumber) {
	
	var rowId = row.attr('id');
	
	return $('#' + rowId + '_column_' + columnNumber);
}