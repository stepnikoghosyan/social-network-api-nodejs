import assert from 'assert';

export default function(joi: any) {
  assert(joi && joi.isJoi, 'you must pass Joi as argument');

  return joi.string().regex(/^[0-9a-fA-F]{24}$/);
}
