import React from 'react';
import axios from 'axios';
import Badge from 'react-bootstrap/Badge';
import {useParams} from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel';

function Detail() {
  const [business, setBusiness] = React.useState({'photos': []});
  const [reviews, setReviews] = React.useState();
  const [carouselItem, setCarouselItem] = React.useState("");
  const [isOpenNow, setIsOpenNow] = React.useState(<Badge bg="danger">Close</Badge>);

  let {id} = useParams();

  React.useEffect(() => {
    callApi();
    callApiReview();
  },[]);

  const callApi = () => {
    axios.get('https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/'+id, {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer Ubf1-f0uqsJUnssqPMGo-tiFeZTT85oFmKfznlPmjDtX8s83jYMoAb-ApuD63wgq6LDZNsUXG6gurZIVYaj2jzxJmmLdCdXbDqIHU_b6KiCEVi8v-YB0OSsW6MWaY3Yx',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Method': 'GET',
        'Access-Control-Allow-Header': 'Content-Type, Authorization',
        "x-requested-with": "xmlhttprequest",
      }
    }).then((response) => {
      setBusiness(response.data);
    });
  }

  const callApiReview = () => {
    axios.get('https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/'+id+"/reviews", {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer Ubf1-f0uqsJUnssqPMGo-tiFeZTT85oFmKfznlPmjDtX8s83jYMoAb-ApuD63wgq6LDZNsUXG6gurZIVYaj2jzxJmmLdCdXbDqIHU_b6KiCEVi8v-YB0OSsW6MWaY3Yx',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Method': 'GET',
        'Access-Control-Allow-Header': 'Content-Type, Authorization',
        "x-requested-with": "xmlhttprequest",
      }
    }).then((response) => {
      setReviews(response.data.reviews);
    });
  }

  React.useEffect(() => {
    if(business.photos.length > 0){
      let tempCarousel = (<Carousel>
        {
          business.photos.map((item) => {
            return <Carousel.Item>
              <img
                className="d-block w-100"
                src={item}
                alt="First slide"
              />
            </Carousel.Item>
          })
        }
      </Carousel>)

      setCarouselItem(tempCarousel);

      if(business.hours[0].is_open_now)
        setIsOpenNow(<Badge bg="success">Open</Badge>);
      else
        setIsOpenNow(<Badge bg="danger">Close</Badge>)
    }
  },[business]);

  return (
    <div className="row justify-content-center">
      <div class="col-4">
        { carouselItem }
      </div>
      <div class="col-5">
        <table id="table-detail">
          <tbody>
            <tr>
              <td>Name:</td>
              <td>{business.name}</td>
            </tr>
            <tr>
              <td>Address:</td>
              <td>
                {
                  business.location &&
                  business.location.display_address.map((item, index) => {
                    if(index == 0)
                      return item
                    else
                      return ", " + item
                  })
                }
                <br></br>
                See On Gmaps <a target="_blank" href={"https://maps.google.com/?q="+(business.coordinates && business.coordinates.latitude)+","+(business.coordinates && business.coordinates.longitude)}>Click Here</a>
              </td>
            </tr>
            <tr>
              <td>Phone:</td>
              <td>
                <a href={"tel:"+(business.phone)}> { business.display_phone } </a>
              </td>
            </tr>
            <tr>
              <td>Categories:</td>
              <td>{
                business.categories &&
                business.categories.map((item, index) => {
                  if(index == 0)
                    return item.title
                  else
                    return ", " + item.title
                })
              }</td>
            </tr>
            <tr>
              <td>Transaction Type:</td>
              <td>
                {
                  business.transactions &&
                  business.transactions.map((item, index) => {
                    if(index == 0)
                      return item
                    else
                      return ", " + item
                  })
                }
              </td>
            </tr>
            <tr>
              <td>Open Now: </td>
              <td>
                { isOpenNow }
              </td>
            </tr>
            <tr>
              <td>Rating: </td>
              <td>
                <Badge bg="info">{ business.rating }</Badge>
              </td>
            </tr>
            <tr>
              <td>Price: </td>
              <td>
                <Badge bg="info">{ business.price }</Badge>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="col-9 mt-5">
        <h1>Reviews</h1>
        {
          reviews &&
          reviews.map((item, index) => {
            return <div className='review-wrap'>
                <div className='review-header d-flex justify-content-between align-items-center'>
                  <div className='review-user-info'>
                    <img src={item.user.image_url} />
                    <span className='review-name'><b>{item.user.name}</b></span>
                  </div>
                  <div className='review-info'>
                    <Badge bg="info">Rating {item.rating}</Badge>
                  </div>
                </div>
                <div className='review-body'>
                  <p>{item.text}</p>
                </div>
              </div>
          })
        }
      </div>
    </div>
  );
}

export default Detail;
