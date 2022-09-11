import { IncomingHttpHeaders } from 'http';
import { Request } from 'express'

export interface ISpot {
    taskContent?: string,
    isCompleted?: boolean,
    taskId?: string
}

export interface CustomHeaders {
    ownerId?: string
}

export interface IReqCustom<TBody, THeader> extends Request {
    body: TBody,
    headers: IncomingHttpHeaders & THeader
}