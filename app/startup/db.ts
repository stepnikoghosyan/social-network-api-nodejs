import mongoose from 'mongoose';
import config from '../config/config';

export default function() {
    const options = {
        useNewUrlParser: true,
        useFindAndModify: false
    };

    console.log('DB string:', config.get('dbConStr'));

    mongoose.connect(config.get('dbConStr').toString(), options)
        .then(() => console.log('Connected to db...'))
        .catch((err) => console.log('Could not connect to db:', err));
}
