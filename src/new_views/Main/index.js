import React, {
  useCallback,
  useEffect,
  useState
} from 'react';
import MuiVirtualizedTable from "./MuiVirtualizedTable";
import isEqual from "lodash/isEqual";
import {
  Box,
  Container,
  makeStyles,
  AppBar,
  Tab,
  Tabs,
  Paper,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import { toggleShowColumns } from 'src/slices/main';
import Page from 'src/components/Page';
import Header from './Header';
import BottomBar from './BottomBar';
import Results from './Results';
import EnhancedTable from './EnhancedTable';
import { changeTitle, addTableData } from 'src/slices/tabs';
import { DateEnv } from '@fullcalendar/core';
const orders = [
  {
    ticker: 'CBAT',
    name: 'CBAK Energy Technology Inc.',
    price: 6.15,
    change_pd: 54.91,
    change_1m: 7.15,
    volume_d: 92887702,
    volume: 11201279,
    price_bd: -1,
    volume_bd: 0,
    alerts: 16,
    type: 1
  },
  {
    ticker: 'APWC',
    name: 'Asia Pacific Wire & Cable Corporation',
    price: 1.95,
    change_pd: 47.72,
    change_1m: 5.19,
    volume_d: 29236597,
    volume: 3133703,
    price_bd: 5,
    volume_bd: 10,
    alerts: 9,
    type: 1
    
  },
  {
    ticker: 'NHLD',
    name: 'National Holdings Corporation',
    price: 2.72,
    change_pd: 2.72,
    change_1m: 2.39,
    volume_d: 1604525,
    volume: 11201279,
    price_bd: 40,
    volume_bd: 9,
    alerts: 9,
    type: 1
  },
  {
    ticker: 'SOLO',
    name: 'Electrameccanica Vehicles Corp',
    price: 6.29,
    change_pd: 30.22,
    change_1m: 9.22,
    volume_d: 1705365,
    volume: 294902,
    price_bd: 47,
    volume_bd: 1,
    alerts: 9,
    type: 1
  },
  {
    ticker: 'CBAT',
    name: 'CBAK Energy Technology Inc.',
    price: 6.15,
    change_pd: 54.91,
    change_1m: 7.15,
    volume_d: 92887702,
    volume: 11201279,
    price_bd: -1,
    volume_bd: 0,
    alerts: 16,
    type: 1
  },
  {
    ticker: 'APWC',
    name: 'Asia Pacific Wire & Cable Corporation',
    price: 1.95,
    change_pd: 47.72,
    change_1m: 5.19,
    volume_d: 29236597,
    volume: 3133703,
    price_bd: 5,
    volume_bd: 10,
    alerts: 9,
    type: 1
    
  },
  {
    ticker: 'NHLD',
    name: 'National Holdings Corporation',
    price: 2.72,
    change_pd: 2.72,
    change_1m: 2.39,
    volume_d: 1604525,
    volume: 11201279,
    price_bd: 40,
    volume_bd: 9,
    alerts: 9,
    type: 1
  },
  {
    ticker: 'SOLO',
    name: 'Electrameccanica Vehicles Corp',
    price: 6.29,
    change_pd: 30.22,
    change_1m: 9.22,
    volume_d: 1705365,
    volume: 294902,
    price_bd: 47,
    volume_bd: 1,
    alerts: 9,
    type: 1
  },
  {
    ticker: 'CBAT',
    name: 'CBAK Energy Technology Inc.',
    price: 6.15,
    change_pd: 54.91,
    change_1m: 7.15,
    volume_d: 92887702,
    volume: 11201279,
    price_bd: -1,
    volume_bd: 0,
    alerts: 16,
    type: 1
  },
  {
    ticker: 'APWC',
    name: 'Asia Pacific Wire & Cable Corporation',
    price: 1.95,
    change_pd: 47.72,
    change_1m: 5.19,
    volume_d: 29236597,
    volume: 3133703,
    price_bd: 5,
    volume_bd: 10,
    alerts: 9,
    type: 0
    
  },
  {
    ticker: 'NHLD',
    name: 'National Holdings Corporation',
    price: 2.72,
    change_pd: 2.72,
    change_1m: 2.39,
    volume_d: 1604525,
    volume: 11201279,
    price_bd: 40,
    volume_bd: 9,
    alerts: 9,
    type: 0
  },
  {
    ticker: 'SOLO',
    name: 'Electrameccanica Vehicles Corp',
    price: 6.29,
    change_pd: 30.22,
    change_1m: 9.22,
    volume_d: 1705365,
    volume: 294902,
    price_bd: 47,
    volume_bd: 1,
    alerts: 9,
    type: 0
  },
  {
    ticker: 'APWC',
    name: 'Asia Pacific Wire & Cable Corporation',
    price: 1.95,
    change_pd: 47.72,
    change_1m: 5.19,
    volume_d: 29236597,
    volume: 3133703,
    price_bd: 5,
    volume_bd: 10,
    alerts: 9,
    type: 0
    
  },
  {
    ticker: 'NHLD',
    name: 'National Holdings Corporation',
    price: 2.72,
    change_pd: 2.72,
    change_1m: 2.39,
    volume_d: 1604525,
    volume: 11201279,
    price_bd: 40,
    volume_bd: 9,
    alerts: 9,
    type: 0
  },
  {
    ticker: 'SOLO',
    name: 'Electrameccanica Vehicles Corp',
    price: 6.29,
    change_pd: 30.22,
    change_1m: 9.22,
    volume_d: 1705365,
    volume: 294902,
    price_bd: 47,
    volume_bd: 1,
    alerts: 9,
    type: 0
  },
  {
    ticker: 'APWC',
    name: 'Asia Pacific Wire & Cable Corporation',
    price: 1.95,
    change_pd: 47.72,
    change_1m: 5.19,
    volume_d: 29236597,
    volume: 3133703,
    price_bd: 5,
    volume_bd: 10,
    alerts: 9,
    type: 0
    
  },
  {
    ticker: 'NHLD',
    name: 'National Holdings Corporation',
    price: 2.72,
    change_pd: 2.72,
    change_1m: 2.39,
    volume_d: 1604525,
    volume: 11201279,
    price_bd: 40,
    volume_bd: 9,
    alerts: 9,
    type: 0
  },
  {
    ticker: 'SOLO',
    name: 'Electrameccanica Vehicles Corp',
    price: 6.29,
    change_pd: 30.22,
    change_1m: 9.22,
    volume_d: 1705365,
    volume: 294902,
    price_bd: 47,
    volume_bd: 1,
    alerts: 9,
    type: 0
  },
  {
    ticker: 'APWC',
    name: 'Asia Pacific Wire & Cable Corporation',
    price: 1.95,
    change_pd: 47.72,
    change_1m: 5.19,
    volume_d: 29236597,
    volume: 3133703,
    price_bd: 5,
    volume_bd: 10,
    alerts: 9,
    type: 0
    
  },
  {
    ticker: 'NHLD',
    name: 'National Holdings Corporation',
    price: 2.72,
    change_pd: 2.72,
    change_1m: 2.39,
    volume_d: 1604525,
    volume: 11201279,
    price_bd: 40,
    volume_bd: 9,
    alerts: 9,
    type: 0
  },
  {
    ticker: 'SOLO',
    name: 'Electrameccanica Vehicles Corp',
    price: 6.29,
    change_pd: 30.22,
    change_1m: 9.22,
    volume_d: 1705365,
    volume: 294902,
    price_bd: 47,
    volume_bd: 1,
    alerts: 9,
    type: 0
  },
  {
    ticker: 'APWC',
    name: 'Asia Pacific Wire & Cable Corporation',
    price: 1.95,
    change_pd: 47.72,
    change_1m: 5.19,
    volume_d: 29236597,
    volume: 3133703,
    price_bd: 5,
    volume_bd: 10,
    alerts: 9,
    type: 0
    
  },
  {
    ticker: 'NHLD',
    name: 'National Holdings Corporation',
    price: 2.72,
    change_pd: 2.72,
    change_1m: 2.39,
    volume_d: 1604525,
    volume: 11201279,
    price_bd: 40,
    volume_bd: 9,
    alerts: 9,
    type: 0
  },
  {
    ticker: 'SOLO',
    name: 'Electrameccanica Vehicles Corp',
    price: 6.29,
    change_pd: 30.22,
    change_1m: 9.22,
    volume_d: 1705365,
    volume: 294902,
    price_bd: 47,
    volume_bd: 1,
    alerts: 9,
    type: 0
  },
  {
    ticker: 'APWC',
    name: 'Asia Pacific Wire & Cable Corporation',
    price: 1.95,
    change_pd: 47.72,
    change_1m: 5.19,
    volume_d: 29236597,
    volume: 3133703,
    price_bd: 5,
    volume_bd: 10,
    alerts: 9,
    type: 0
    
  },
  {
    ticker: 'NHLD',
    name: 'National Holdings Corporation',
    price: 2.72,
    change_pd: 2.72,
    change_1m: 2.39,
    volume_d: 1604525,
    volume: 11201279,
    price_bd: 40,
    volume_bd: 9,
    alerts: 9,
    type: 0
  },
  {
    ticker: 'SOLO',
    name: 'Electrameccanica Vehicles Corp',
    price: 6.29,
    change_pd: 30.22,
    change_1m: 9.22,
    volume_d: 1705365,
    volume: 294902,
    price_bd: 47,
    volume_bd: 1,
    alerts: 9,
    type: 0
  },
  {
    ticker: 'APWC',
    name: 'Asia Pacific Wire & Cable Corporation',
    price: 1.95,
    change_pd: 47.72,
    change_1m: 5.19,
    volume_d: 29236597,
    volume: 3133703,
    price_bd: 5,
    volume_bd: 10,
    alerts: 9,
    type: 0
    
  },
  {
    ticker: 'NHLD',
    name: 'National Holdings Corporation',
    price: 2.72,
    change_pd: 2.72,
    change_1m: 2.39,
    volume_d: 1604525,
    volume: 11201279,
    price_bd: 40,
    volume_bd: 9,
    alerts: 9,
    type: 0
  },
  {
    ticker: 'SOLO',
    name: 'Electrameccanica Vehicles Corp',
    price: 6.29,
    change_pd: 30.22,
    change_1m: 9.22,
    volume_d: 1705365,
    volume: 294902,
    price_bd: 47,
    volume_bd: 1,
    alerts: 9,
    type: 0
  },
  {
    ticker: 'APWC',
    name: 'Asia Pacific Wire & Cable Corporation',
    price: 1.95,
    change_pd: 47.72,
    change_1m: 5.19,
    volume_d: 29236597,
    volume: 3133703,
    price_bd: 5,
    volume_bd: 10,
    alerts: 9,
    type: 0
    
  },
  {
    ticker: 'NHLD',
    name: 'National Holdings Corporation',
    price: 2.72,
    change_pd: 2.72,
    change_1m: 2.39,
    volume_d: 1604525,
    volume: 11201279,
    price_bd: 40,
    volume_bd: 9,
    alerts: 9,
    type: 0
  },
  {
    ticker: 'SOLO',
    name: 'Electrameccanica Vehicles Corp',
    price: 6.29,
    change_pd: 30.22,
    change_1m: 9.22,
    volume_d: 1705365,
    volume: 294902,
    price_bd: 47,
    volume_bd: 1,
    alerts: 9,
    type: 0
  },
  {
    ticker: 'APWC',
    name: 'Asia Pacific Wire & Cable Corporation',
    price: 1.95,
    change_pd: 47.72,
    change_1m: 5.19,
    volume_d: 29236597,
    volume: 3133703,
    price_bd: 5,
    volume_bd: 10,
    alerts: 9,
    type: 0
    
  },
  {
    ticker: 'NHLD',
    name: 'National Holdings Corporation',
    price: 2.72,
    change_pd: 2.72,
    change_1m: 2.39,
    volume_d: 1604525,
    volume: 11201279,
    price_bd: 40,
    volume_bd: 9,
    alerts: 9,
    type: 0
  },
  {
    ticker: 'SOLO',
    name: 'Electrameccanica Vehicles Corp',
    price: 6.29,
    change_pd: 30.22,
    change_1m: 9.22,
    volume_d: 1705365,
    volume: 294902,
    price_bd: 47,
    volume_bd: 1,
    alerts: 9,
    type: 0
  },
  {
    ticker: 'APWC',
    name: 'Asia Pacific Wire & Cable Corporation',
    price: 1.95,
    change_pd: 47.72,
    change_1m: 5.19,
    volume_d: 29236597,
    volume: 3133703,
    price_bd: 5,
    volume_bd: 10,
    alerts: 9,
    type: 0
    
  },
  {
    ticker: 'NHLD',
    name: 'National Holdings Corporation',
    price: 2.72,
    change_pd: 2.72,
    change_1m: 2.39,
    volume_d: 1604525,
    volume: 11201279,
    price_bd: 40,
    volume_bd: 9,
    alerts: 9,
    type: 0
  },
  {
    ticker: 'SOLO',
    name: 'Electrameccanica Vehicles Corp',
    price: 6.29,
    change_pd: 30.22,
    change_1m: 9.22,
    volume_d: 1705365,
    volume: 294902,
    price_bd: 47,
    volume_bd: 1,
    alerts: 9,
    type: 0
  },
];
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark_inner,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(3)
  },
  topBar: {
    backgroundColor: theme.palette.background.dark_inner,
    boxShadow: "none",
    padding: "10px 0"
  },
  bottomBar: {
    backgroundColor: theme.palette.background.dark_inner,
    top: 'auto',
    bottom: 0,
    boxShadow: "none",
    padding: "10px 0"
  },
  tabs: {
    marginBottom: 20
  }
}));

const getTableWidth = (width, leftExpanded, rightExpanded) => {
  let exactWidth = width - 52;
  if (leftExpanded) {
    exactWidth -= 160;
  }
  else {
    exactWidth -= 70;
  }
  if (rightExpanded) {
    exactWidth -= 308;
  }
  else {
    exactWidth -= 0;
  }
  return exactWidth;
}
const MainView = () => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const { showColumns, deactivatedColumns, leftExpanded, rightExpanded } = useSelector((state) => state.main);
  const { tabs } = useSelector((state) => state.tabs);
  
  const [sortOrder, setSortOrder] = useState(true);
  const [frequency, setFrequency] = useState(1)
  const [tab, setTab] = useState(undefined);
  const [previousTabs, setPreviousTabs] = useState(tabs);
  const [ticker, setTicker] = useState('');
  const [pageCount, setPageCount] = useState(50000);
  const [data, setData] = useState([])
  
  const [date, setDate] = useState(formatDate());

  const dispatch = useDispatch();
  const toggleShowColumnsAction = () => {
    dispatch(toggleShowColumns());
  }

  const selectedTab = tabs.find(tab => tab.selected === true);

  const handleChangeType = (e, value) => {
    setTab(value);

    const selectedTabId = tabs.find(tab => tab.selected === true).id;
    const title = value === 0 ? "Breakouts" : "Trade History";

    dispatch(changeTitle(selectedTabId, title));
    // dispatch(addTableData(selectedTabId, orders));
  }

  function formatDate() {
    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();

    return yyyy + '-' + mm + '-' + dd;
  }

  function setPickerDate(pickerDate) {
    setDate(pickerDate);
    console.log('pickerdate---', pickerDate);
  }

  function formatTime(time) {
    var date = new Date(time / 1000000);
    
    return date.toLocaleString();
  }

  function useWindowSize() {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState({
      width: undefined,
      height: undefined,
    });

    useEffect(() => {
      // Handler to call on window resize
      function handleResize() {
        // Set window width/height to state
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }

      // Add event listener
      window.addEventListener("resize", handleResize);

      // Call handler right away so state gets updated with initial window size
      handleResize();

      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty array ensures that effect is only run on mount

    return windowSize;
  }

  useEffect(() => {
    if (!isEqual(previousTabs, tabs) && previousTabs.length < tabs.length) {
      setTab(undefined);
      setPreviousTabs(tabs)
    }
  })
  function rowGetter ({ index }) {
    return data[index];
  }

  function fetchData(timestamp, ticker) {
    let url = `https://api.polygon.io/v2/ticks/stocks/trades/${ticker}/${date}?reverse=${sortOrder}&limit=${pageCount}&apiKey=_UpRltI1VsZ6HFsA8vTJBFFj4JMBSztw`;
    
    if(timestamp) {
      url += `&timestampLimit=${timestamp}`;
    }

    axios.get(url)
      .then(result => {
        const { data: { results }} = result;
        setData(results);
      })
      .catch(e => {
        console.log('ERROR', e);
      })
  }

  function onSearch(ticker) {
    setTicker(ticker)
    fetchData(0, ticker);
  }

  const size = useWindowSize();
  const exactWidth = getTableWidth(size.width, leftExpanded, rightExpanded);

  return (
    <Page
      className={classes.root}
      title="Main"
      style={{ height: '100%' }}
    >
      <Container maxWidth={false} style={{ height: '100%' }}>
        {tab === undefined &&
          <Tabs className={classes.tabs} textColor="primary" value={tab} onChange={handleChangeType}>
            <Tab label="Breakouts" />
            <Tab label="Trade history" />
          </Tabs>
        }

        {tab !== undefined && <>
          <AppBar position="sticky" color="inherit" className={classes.topBar}>
            <Header sortOrder={sortOrder} setSortOrder={setSortOrder} toggleShowColumns={toggleShowColumnsAction} showColumns={showColumns} setFrequency={setFrequency} frequency={frequency} date={date} setDate={(date) => setPickerDate(date)} onSearch={onSearch} />
          </AppBar>
          <Box mt={1} style={{ height: '100%'}}>
            {/* <Results orders={orders} /> */}
            {exactWidth &&
              // <EnhancedTable stockData={orders} exactWidth={exactWidth} deactivatedColumns={deactivatedColumns} />
              <Paper style={{ height: '100%', width: '100%' }}>
                <MuiVirtualizedTable
                rowCount={data.length}
                rowGetter={rowGetter}
                columns={[
                  {
                    numeric: true,
                    label: "Time",
                    width: 150,
                    sortable: true,
                    cellContentRenderer: (params) => formatTime(params.rowData['t']),
                  },
                  {
                    dataKey: "s",
                    numeric: true,
                    label: "Size",
                    width: 150,
                  },
                  {
                    dataKey: "p",
                    numeric: true,
                    label: "Price",
                    width: 150,
                  },
                  {
                    numeric: true,
                    label: "Trade Value",
                    cellContentRenderer: (params) => Number((params.rowData['s'] * params.rowData['p']).toFixed(1)),
                    width: 150,
                  },
                  {
                    dataKey: "x",
                    numeric: true,
                    label: "Exchange",
                    width: 150,
                  },
                  {
                    dataKey: "c",
                    numeric: true,
                    label: "Type",
                    width: 150,
                  },
                  {
                    dataKey: "q",
                    numeric: true,
                    label: "Sequence",
                    width: 150,
                  }]
                }
              />
              </Paper>
            }
          </Box>
          <AppBar position="sticky" color="inherit" className={classes.bottomBar}>
            <BottomBar setFrequency={setFrequency} frequency={frequency} />
          </AppBar>
        </>}
      </Container>
    </Page>
  );
};

export default MainView;
