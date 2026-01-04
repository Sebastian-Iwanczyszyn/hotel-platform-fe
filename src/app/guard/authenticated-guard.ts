import { CanActivateFn } from '@angular/router';
import {keycloak} from '../keycloak';

export const authenticatedGuard: CanActivateFn = async () => {
  if (keycloak.authenticated) return true;

  await keycloak.login({
    redirectUri: window.location.origin + '/admin',
  });

  return false;
};
