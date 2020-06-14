import React, { useState } from "react";
import { Tabs, Tab, AppBar, TextField } from "@material-ui/core";
import IScrollTable from "./IScrollTable";
import CollapseList from "./CollapseList";
import TabPanel from "./TabPanel";
import Cards from "./Cards";

const App = () => {
  const [query, setQuery] = useState("");
  const [value, setValue] = React.useState(0);
  const a11yProps = (index) => {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSearch = (e) => {
    setQuery(e.target.value);
  };

  return (
    <>
      <AppBar position='fixed' color='default'>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor='primary'
          textColor='primary'
          variant='fullWidth'
          aria-label='full width tabs example'
          centered
        >
          <Tab label='Songs' {...a11yProps(0)} />
          <Tab label='Artists' {...a11yProps(1)} />
          <Tab label='Playlists' {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <TextField
          style={{ position: "relative", marginTop: 70 }}
          id='standard-basic'
          label='Search songs by artist name'
          value={query}
          fullWidth
          onChange={handleSearch}
        />

        <IScrollTable query={query} style={{ position: "relative" }} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Cards />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <CollapseList selectedTab={value} />
      </TabPanel>
    </>
  );
};

export default App;
