import ImageKit from '@imagekit/nodejs';

const imagekit = new ImageKit({  
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || 'My Private key'
});

export default imagekit;