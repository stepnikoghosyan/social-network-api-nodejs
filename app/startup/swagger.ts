import { Application } from 'express';
import { serve, setup } from 'swagger-ui-express';
import * as yaml from 'yamljs';

const openAPI = yaml.load(`${__dirname}/swaggerConfig.yaml`);

export default function(app: Application): void {
  app.use('/swagger', serve, setup(openAPI));
}
