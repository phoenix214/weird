import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import Chip from "@material-ui/core/Chip";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Box from "@material-ui/core/Box";
import TablePaginationActions from "./TablePaginationActions";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";

import EnhancedTableToolbar from "./EnhancedTableToolbar";
import EnhancedTableHead from "./EnhancedTableHead";
import TablePagination from "@material-ui/core/TablePagination";

let counter = 0;
// a little function to help us with reordering the result
// From react-sortable-hoc sample code
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};
export const convertNumberFormat = (number) => {
  let str = '';
  let tempNumber = number;
  while (tempNumber > 1000) {
    let tmpStr = ((tempNumber % 1000) + 1000).toString();
    str = `,${tmpStr.slice(1, tmpStr.length)}${str}`;
    console.log('sales_volume1', str)
    tempNumber = parseInt(tempNumber / 1000);
  }
  if (tempNumber > 0) {
    str = tempNumber.toString() + str;
  }
  return str;
};

function createData(name, calories, fat, carbs, protein) {
  counter += 1;
  return { id: counter, name, calories, fat, carbs, protein };
}

const styles = theme => ({
  root: {
    // width: "100%",
    marginTop: theme.spacing.unit * 3
  },
  table: {
    minWidth: 1020
  },
  tableWrapper: {
    overflowX: "auto",
    '&::-webkit-scrollbar': {
      height: 4,
    },
    '&::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.scrollBar.main,
      borderRadius: 8
      // outline: '1px solid slategrey'
    }
  },
  row: {
    background: "#1D2331",
    borderRadius: 10
  },
  cell: {
    border: 'none'
  },
  activeChip: {
    backgroundColor: "#00B373",
    color: "#FFF",
    borderRadius: 7,
    padding: "0 12px",
    fontSize: 12
  },
  inactiveChip: {
    backgroundColor: "#FF4949",
    color: "#FFF",
    borderRadius: 7,
    padding: "0 12px",
    fontSize: 12
  },
  activeCell: {
    color: "#00B373",
  },
  inactiveCell: {
    color: "#FF4949",
  },
  selected: {
    background: "linear-gradient(90deg, rgba(110, 128, 248, 0.05) 0%, rgba(110, 128, 248, 0.6) 100%) !important"
  },
  topRow: {
    background: "linear-gradient(90deg, rgba(110, 128, 248, 0) 0%, rgba(110, 128, 248, 0.3) 100%)"
  }
});
const columnData = [
  {
    id: "ticker",
    numeric: false,
    disablePadding: true,
    label: "Ticker",
    weight: 1,
  },
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Name",
    weight: 1.5,
  },
  {
    id: "price",
    numeric: true,
    disablePadding: true,
    label: "Price",
    weight: 1,
  },
  {
    id: "change_pd",
    numeric: true,
    disablePadding: true,
    label: "Change %(PD)",
    weight: 1,
  },
  {
    id: "change_1m",
    numeric: true,
    disablePadding: true,
    label: "Change %(1m)",
    weight: 1,
  },
  {
    id: "volume_d",
    numeric: true,
    disablePadding: true,
    label: "Volume(D)",
    width: 150,
    weight: 1,
  },
  {
    id: "volume",
    numeric: true,
    disablePadding: true,
    label: "Volume",
    width: 150,
    weight: 1,
  },
  {
    id: "price_bd",
    numeric: true,
    disablePadding: true,
    label: "Price BD",
    weight: 1,
  },
  {
    id: "volume_bd",
    numeric: true,
    disablePadding: true,
    label: "Volume BD",
    weight: 0.75,
  },
  {
    id: "alerts",
    numeric: true,
    disablePadding: true,
    label: "Alerts",
    weight: 0.75,
  },
];
const getColumn = (deactivatedColumns, exactWidth) => {
  const activeColumns = columnData.filter(item => !deactivatedColumns[item.id]);
  let columns = [];
  let totalWeight = 0;
  activeColumns.forEach(col => { totalWeight += col.weight });
  let unitWeight = exactWidth / totalWeight;
  columns = activeColumns.map(col => ({
    ...col,
    width: col.weight * unitWeight
  }));
  console.log('size1', columns)
  return columns;
}
class EnhancedTable extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      order: "asc",
      orderBy: "calories",
      selected: [],
      data: props.stockData.sort((a, b) => (a.type < b.type ? -1 : 1)),
      // id must be lowercase
      // width must be integer (for pixels)
      // TODO: rename width -> widthInPixels?
      // TODO: make columnData a prop
      columnData: getColumn(props.deactivatedColumns, props.exactWidth),
      page: 0,
      rowsPerPage: 15
    };
  }
  componentWillReceiveProps(newProps) {
    console.log('action1', newProps)
    this.setState({
      columnData: getColumn(newProps.deactivatedColumns, newProps.exactWidth)
    })
  }
  onDragEnd = result => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const columnData = reorder(
      this.state.columnData,
      result.source.index,
      result.destination.index
    );

    this.setState({
      columnData
    });
  };
  // Demo code
  handleWidthChange = (columnId, width) => {
    this.setState(state => {
      const currentColumns = state.columnData;
      const currentColumnIndex = currentColumns.findIndex(column => {
        return column.id === columnId;
      });
      const columnToChange = currentColumns[currentColumnIndex];
      const changedColumn = { ...columnToChange, width };
      currentColumns.splice(currentColumnIndex, 1, changedColumn);
      // Return the unchanged columns concatenated with the new column
      const newState = {
        columnData: currentColumns
      };
      console.log(newState);
      return newState;
    });
  };

  handleArrayMove = (from, to, oldData) => {
    // guessing this gets replaced by arrayMove method
    const newData = [].concat(oldData);
    from >= to
      ? newData.splice(to, 0, newData.splice(from, 1)[0])
      : newData.splice(to - 1, 0, newData.splice(from, 1)[0]);

    return newData;
  };

  handleReorderColumn = (from, to) => {
    this.setState(state => {
      return {
        columnData: this.handleArrayMove(from, to, state.columnData),
        data: this.handleArrayMove(from, to, state.data)
      };
    });
  };

  // material-ui code
  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }

    const data =
      order === "desc"
        ? this.state.data.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
        : this.state.data.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

    this.setState({ data, order, orderBy });
  };

  // material-ui code
  handleSelectAllClick = (event, checked) => {
    if (checked) {
      this.setState({ selected: this.state.data.map(n => n.id) });
      return;
    }
    this.setState({ selected: [] });
  };

  // material-ui code
  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [id];

    // if (selectedIndex === -1) {
    //   newSelected = newSelected.concat(selected, id);
    // } else if (selectedIndex === 0) {
    //   newSelected = newSelected.concat(selected.slice(1));
    // } else if (selectedIndex === selected.length - 1) {
    //   newSelected = newSelected.concat(selected.slice(0, -1));
    // } else if (selectedIndex > 0) {
    //   newSelected = newSelected.concat(
    //     selected.slice(0, selectedIndex),
    //     selected.slice(selectedIndex + 1)
    //   );
    // }

    this.setState({ selected: newSelected });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {
    const { classes } = this.props;
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <>
        {/* TODO: Customize TablePagination per https://material-ui.com/demos/tables/#custom-table-pagination-action */}
        <div className={classes.tableWrapper}>
          <Table
            table-layout="fixed"
            className={classes.table}
            aria-labelledby="tableTitle"
          >
            {/* <TableHead>
              <TableRow>
                <TablePagination
                  component="div"
                  count={data.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  backIconButtonProps={{
                    "aria-label": "Previous Page"
                  }}
                  nextIconButtonProps={{
                    "aria-label": "Next Page"
                  }}
                  rowsPerPageOptions={[15, 25, 50]}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableHead> */}
            <EnhancedTableHead
              handleReorderColumnData={this.onDragEnd}
              handleResizeColumn={this.handleWidthChange}
              columnData={this.state.columnData}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {data
                .map((n, index) => {
                  const isSelected = this.isSelected(index);
                  return (
                    <TableRow
                      onClick={event => this.handleClick(event, index)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={index}
                    // selected={isSelected}
                    // classes={{ selected: classes.selected }}
                    >
                      <td>
                        {/* We need to nest the contenst of this row to parallel the
                        * use of Droppable in the header and ensure that headers and body line up.*/}
                        <Table style={{ display: "block" }}>
                          <TableBody>
                            <TableRow>
                              <Box classes={{ root: clsx(classes.row, index < 5 && classes.topRow, isSelected && classes.selected) }} mb={1}>
                                {this.state.columnData.map(column => {
                                  console.log(n.type)
                                  let highlighted = false;
                                  if (column.id === 'price' || column.id === 'change_pd' || column.id === 'change_1m') {
                                    highlighted = true;
                                  }
                                  let value = n[column.id];
                                  if (Number.isFinite(value)) {
                                    value = convertNumberFormat(value);
                                  }
                                  return (
                                    <TableCell
                                      key={column.id}
                                      padding="12px"
                                      width={`${column.width - 32}px` || "100px"}
                                      classes={{ root: classes.cell }}
                                    >
                                      <div
                                        width={`${column.width - 32}px` || "100px"}
                                        style={{
                                          width: `${column.width - 32}px` || "100px",
                                          // paddingRight: "40px",
                                          whiteSpace: "nowrap",
                                          overflow: "hidden",
                                          textOverflow: "ellipsis"
                                        }}
                                      >
                                        {column.id === 'ticker' ?
                                          <Chip classes={{ root: n['type'] == 1 ? classes.activeChip : classes.inactiveChip }} label={value} size="small" />
                                          :
                                          highlighted ?
                                            <Typography classes={{ root: n['type'] == 1 ? classes.activeCell : classes.inactiveCell }} variant="body2">{value}</Typography>
                                            :
                                            <Typography variant="body2">{value}</Typography>}
                                      </div>
                                    </TableCell>
                                  )
                                })}
                              </Box>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </td>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </>
    );
  }
}

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(EnhancedTable);
