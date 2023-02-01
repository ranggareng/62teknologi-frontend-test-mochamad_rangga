import React from 'react';
import { useParams } from 'react-router-dom';

function WithRouter(WrappedComponent){
  const params = useParams();

  return (
    <WrappedComponent
      params={params}
    />
  );
};

export default WithRouter;