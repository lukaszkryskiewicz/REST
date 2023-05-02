import { Alert, Container, Progress } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getWorkshops, getRequest, loadWorkshopsRequest } from '../../../redux/workshopsRedux';

const Prices = () => {

  const dispatch = useDispatch();
  const workshops = useSelector(getWorkshops)
  const request = useSelector(getRequest);

  useEffect(() => {
    dispatch(loadWorkshopsRequest())
  }, [dispatch]);


  if (request.pending) return <Progress animated color="primary" value={50} />;
  else if (request.error) return <Alert color="warning">{request.error}</Alert>;
  else if (!request.success || !workshops.length) return <Alert color="info">No concerts</Alert>;
  else if (request.success) return (

    <Container>
      <h1>Prices</h1>
      <p>Prices may differ according the day of the festival. Remember that ticket includes not only the star performance, but also 10+ workshops. We gathered several genre teachers to help you increase your vocal skills, as well as self confidence.</p>

      <Alert color="info">
        Attention! <strong>Children under 4 can go freely with you without any other fee!</strong>
      </Alert>

      {workshops.map(workshop => (
        <div key={workshop.name}>
          <h2>Day {workshop.concertId.day}</h2>
          <p>Price: {workshop.concertId.price}$</p>
          <p>Workshops: {workshop.name}</p>
        </div>
      ))}
    </Container>
  )
};

export default Prices;