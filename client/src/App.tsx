import React, {Component} from 'react';
import './App.css';
import CardExampleCard from './Components/Characters';
import {Grid, Pagination, Dimmer, Loader} from "semantic-ui-react"
import 'semantic-ui-css/semantic.min.css';

const style = {
  pagination: {
    marginTop: '30px',
  },
}

interface IProps {
}

interface IState {
  apiResponse?: any;
  page: string;
  totalPages: number;
  loading: boolean;
}

class App extends Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = { 
      apiResponse: [],
      page: "1",
      totalPages: 0,
      loading: false
    };
}

  callAPI(activePage: string) {
    this.setState({loading: true})
    fetch("http://localhost:9000/marvel?page="+ activePage, { method: "POST"})
    .then(res => res.json())
    .then(commits =>
       this.setState({apiResponse : commits.characters, totalPages: commits.totalPages, loading: false}
        )); 
    
}

  componentDidMount() {
    this.callAPI(this.state.page);
}

handlePageChange = (e: any, pageInfo: any) => {
  console.log(pageInfo.activePage)
  this.setState({page: pageInfo.activePage})
  this.callAPI(pageInfo.activePage)
}



  render() {
    if(this.state.loading) {
      return(
        <Dimmer active inverted>
          <Loader/>
        </Dimmer>
      );
    }
    else {
      return (
        <div className="App">
          <Grid columns={4} className="Gridou">
            {this.state.apiResponse.map((item: any) => (
              <Grid.Column key={item.name}>
                <CardExampleCard name={item.name} pictureUrl={item.pictureUrl}></CardExampleCard>
              </Grid.Column>
            ))}
          </Grid>
          <div style={{marginTop: "30px"}}>
        <Pagination activePage={this.state.page} totalPages={this.state.totalPages} onPageChange={this.handlePageChange} />
        </div>
      </div>
    );
    }
  }
}

export default App;
