import { HttpInterceptorFn } from '@angular/common/http';
import {keycloak} from '../keycloak';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const url = new URL(req.url);

  if (url.pathname.startsWith('/api/public')) {
    return next(req);
  }

  const accessToken = keycloak.token;

  if (!accessToken) {
    throw new Error('Unauthorized');
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  return next(authReq);
};
