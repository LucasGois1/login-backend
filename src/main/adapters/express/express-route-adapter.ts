import { Controller, HttpRequest } from '../../../presentation/protocols'
import { Request, Response } from 'express'
export const routeAdapter = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body
    }
    const httpReponse = await controller.handle(httpRequest)
    if (httpReponse.statusCode === 200) {
      res.status(httpReponse.statusCode).send(httpReponse.body)
    } else {
      res.status(httpReponse.statusCode).send({
        error: httpReponse.body.message
      })
    }
  }
}
