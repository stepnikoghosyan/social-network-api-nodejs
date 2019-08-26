import { Router, Request } from 'express';
import { Response } from 'express-serve-static-core';
import Joi from 'joi';
const router = Router();

// controllers
import { UsersController } from './users.controller';

// handlers
import errorHandler from '../../shared/errorHandler';
import { successHandler } from '../../shared/successHandler';

// models
import { ISearchUserQueryParams } from './user.model';

router.get('/', async (req: Request, res: Response) => {
    const user = await UsersController.getUserById(req.user._id);
    if (!user) {
        return errorHandler(res, {
            statusCode: 404,
            errorMessage: 'User with given id was not found.',
        });
    }

    return successHandler(res, user, 200);
});

router.get('/search', async (req: Request, res: Response) => {
    const values = req.query;
    const { error } = searchUserValidator(values);
    if (error) {
        return errorHandler(res, {
            statusCode: 400,
            errorMessage: error.details[0].message,
        });
    }

    const users = await UsersController.searchUsers(req.query);

    return successHandler(res, users, 200);
});

function searchUserValidator(value: ISearchUserQueryParams):
    Joi.ValidationResult<ISearchUserQueryParams> | { error: { details: Array<{ message: string }> } } {
    if (Object.keys(value).length === 0) {
        return {
            error: {
                details: [ { message: 'Invalid search query.' } ]
            }
        };
    }
    const schema = {
        firstName: Joi.string(),
        lastName: Joi.string(),
        username: Joi.string(),
        email: Joi.string()
    };

    return Joi.validate(value, schema);
}

export default router;
