import './App.css';
import React from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import ReactPaginate from 'react-paginate';

function App() {
  const [businesses, setBusinesses] = React.useState([]);
  const [location, setLocation] = React.useState("US");
  const [keyword, setKeyword] = React.useState("");
  const [isOpen, setIsOpen] = React.useState("");
  const [price, setPrice] = React.useState([false, false, false, false]);
  const [sortBy, setSortBy] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalData, setTotalData] = React.useState(0);
  const [pageCount, setPageCount] = React.useState(0);
  const perPage = 12;
  const [pagination, setPagination] = React.useState("<ReactPaginate />");

  React.useEffect(() => {
    callApi();
  },[]);

  React.useEffect(() => {
    console.log('currentPage ', currentPage);
    callApi();
  },[currentPage]);

  React.useEffect(() => {
    setPagination(<ReactPaginate
      previousLabel="Previous"
      nextLabel="Next"
      pageClassName="page-item"
      pageLinkClassName="page-link"
      previousClassName="page-item"
      previousLinkClassName="page-link"
      nextClassName="page-item"
      nextLinkClassName="page-link"
      breakLabel="..."
      breakClassName="page-item"
      breakLinkClassName="page-link"
      containerClassName="pagination"
      activeClassName="active"
      onPageChange={changePage}
      pageRangeDisplayed={5}
      pageCount={pageCount}
      renderOnZeroPageCount={null}
    />);

    console.log("pageCount ", pageCount);
  },[pageCount]);

  const callApi = () => {
    let body = "?location=US";

    if(keyword != '')
      body +="&term="+keyword;
    
    if(isOpen != "")
      body +="&open_now="+isOpen
    
    price.forEach((value, index) => {
      if(value)
        body +="&price="+(index+1);
    });

    if(sortBy != "")
      body +="&sort_by="+sortBy

    console.log("currentPage ", currentPage);

    body +="&limit="+perPage;
    body +="&offset="+((currentPage-1)*perPage);

    axios.get('https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search'+body, {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer Ubf1-f0uqsJUnssqPMGo-tiFeZTT85oFmKfznlPmjDtX8s83jYMoAb-ApuD63wgq6LDZNsUXG6gurZIVYaj2jzxJmmLdCdXbDqIHU_b6KiCEVi8v-YB0OSsW6MWaY3Yx',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Method': 'GET',
        'Access-Control-Allow-Header': 'Content-Type, Authorization',
        "x-requested-with": "xmlhttprequest",
      }
    }).then((response) => {
      console.log(response.data.businesses);
      setBusinesses(response.data.businesses);
      setTotalData(response.data.total);

      let totalPage = Math.floor(response.data.total/perPage);
      let maxPage = Math.floor(1000/perPage)
      if(totalPage > maxPage){
        console.log("Lebih dari 1000 ", maxPage);
        setPageCount(maxPage);
      }else{
        console.log("Kurang dari 1000 ", totalPage);
        setPageCount(totalPage);
      }
    });
  }
  let businessContent = [];
  businesses.forEach((item, index) => {
    businessContent.push(
      <Card style={{ width: '18rem' }} className="my-3">
        <Card.Img variant="top" src={item.image_url} />
        <Card.Body>
          <Card.Title>{item.name}</Card.Title>
          <Card.Text className="col-12 d-inline-block text-truncate">
            {item.location.display_address}
          </Card.Text>
          <Card.Text className="d-flex justify-content-between">
            <div>Price: {item.price}</div>
            <div>Rating: {item.rating}</div>
          </Card.Text>
          <Button variant="primary">See Detail</Button>
        </Card.Body>
      </Card>
    );
  });

  const onSubmitHandler = () => {
    if(currentPage > 1)
      setCurrentPage("1");
    else
      callApi();
  }

  const onSelectPrice = (e) => {
    let tempPrice = price;
    tempPrice[e] = !tempPrice[e];
    console.log(tempPrice);
    setPrice(tempPrice);
  }

  const changePage = (page) => {
    setCurrentPage(page.selected+1);
  }

  return (
    <div className="App">
      <Form className="row">
        <div className='col-12 col-md-4'>
          <div className='form-group my-3'>
            <Form.Label>Search Location</Form.Label>
            <Form.Control type="text" disabled value={location}></Form.Control>
          </div>
          <Form.Group className='my-3'>
            <Form.Label>Open Now</Form.Label>
            <Form.Check type="checkbox" onChange={(e) => setIsOpen(!isOpen)} label="Open Now" />
          </Form.Group>
        </div>
        <div className='col-12 col-md-4'>
          <div className='form-group my-3'>
            <Form.Label>Search by Keyword</Form.Label>
            <Form.Control onChange={(e) => setKeyword(e.target.value)}></Form.Control>
          </div>
          <div className='form-group my-3'>
            <Form.Label>Price</Form.Label>
            <div className='d-flex justify-content-between'>
              <Form.Check type="checkbox" className="mr-1" onChange={() => onSelectPrice(0)} label="$"/>
              <Form.Check type="checkbox" className="mr-1" onChange={() => onSelectPrice(1)} label="$$"/>
              <Form.Check type="checkbox" className="mr-1" onChange={() => onSelectPrice(2)} label="$$$"/>
              <Form.Check type="checkbox" className="mr-1" onChange={() => onSelectPrice(3)} label="$$$$"/>
            </div>
          </div>
        </div>
        <div className='col-12 col-md-4'>
          <Form.Group className='my-3'>
            <Form.Label>Sort By</Form.Label>
            <Form.Select onChange={(e) => setSortBy(e.target.value)}>
              <option></option>
              <option value="best_match">Best Match</option>  
              <option value="rating">Rating</option>
              <option value="review_count">Review Count</option>
              <option value="distance">Distance</option>
            </Form.Select>
          </Form.Group>
        </div>
        <div className='col-12 mt-3 mb-5 text-center'>
          <Button type="button" style={{width:'300px'}} onClick={onSubmitHandler}>Submit</Button>
        </div>
      </Form>
      <div className="d-flex flex-wrap justify-content-around">
        {businessContent}
      </div>
      <div className="d-flex flex-wrap justify-content-around">
        {pagination}
      </div>
    </div>
  );
}

export default App;
