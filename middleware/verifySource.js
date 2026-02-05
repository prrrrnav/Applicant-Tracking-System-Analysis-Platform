const verifySource= (req, res, next)=> {
  // const rapidApiKey = req.headers['x-rapidapi-proxy-secret'];
  const mySecret = req.headers['authorization'];

  // Replace with your actual secrets
  const MY_SECRET = process.env.MY_SECRET_KEY;
  // const RAPIDAPI_SECRET = process.env.RAPIDAPI_SECRET_KEY;

  // if (rapidApiKey === RAPIDAPI_SECRET || mySecret === `Bearer ${MY_SECRET}`) {
  //   return next();
  // }


  // for production auth 
  // if (mySecret === `Bearer ${MY_SECRET}`) {
  //   return next();
  // }

  // testing auth
  if (mySecret === `${MY_SECRET}`) {
    return next();
  }

  return res.status(403).json({ message: 'Access Denied: Unauthorized source' });
};
export default verifySource;